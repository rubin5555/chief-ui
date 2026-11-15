import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as Y from 'yjs';
import { RoomManager } from '../src/rooms/RoomManager.js';
import { SOCKET_OPEN } from '../src/rooms/RoomSocket.js';
import { store } from '../src/store/memoryStore.js';
import type { CollabMessage } from '../src/types.js';


class FakeSocket {
  readonly readyState = SOCKET_OPEN;
  readonly received: CollabMessage[] = [];

  send(data: string): void {
    this.received.push(JSON.parse(data) as CollabMessage);
  }
}

test('lockless simultaneous editing with Yjs and debounced SQLite autosave', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });

  const rooms = new RoomManager({ contentDebounceMs: 200 });
  const aliceSock = new FakeSocket();
  const bobSock = new FakeSocket();

  rooms.registerClient(aliceSock, 'alice');
  rooms.registerClient(bobSock, 'bob');

  // Both join the same section
  rooms.handleMessage(aliceSock, { type: 'join', fieldId: 'sec-lockless' });
  rooms.handleMessage(bobSock, { type: 'join', fieldId: 'sec-lockless' });

  // Alice and Bob have local YDocs
  const aliceDoc = new Y.Doc();
  const bobDoc = new Y.Doc();

  // Alice inserts text locally without acquiring any lock
  aliceDoc.getText('content').insert(0, '<p>Hello from Alice</p>');
  const aliceUpdate = Y.encodeStateAsUpdate(aliceDoc);

  // Alice sends yjs:update to server
  rooms.handleMessage(aliceSock, {
    type: 'yjs:update',
    fieldId: 'sec-lockless',
    update: Array.from(aliceUpdate),
  });

  // Bob receives Alice's update via WebSocket broadcast
  const bobReceivedYjs = bobSock.received.find(
    (m): m is Extract<CollabMessage, { type: 'yjs:update' }> => m.type === 'yjs:update',
  );
  assert.ok(bobReceivedYjs, 'Bob should receive yjs:update broadcast');
  Y.applyUpdate(bobDoc, new Uint8Array(bobReceivedYjs.update));

  assert.equal(bobDoc.getText('content').toString(), '<p>Hello from Alice</p>');

  // Bob simultaneously edits without acquiring any lock
  bobDoc.getText('content').insert(19, ' and Bob');
  const bobUpdate = Y.encodeStateAsUpdate(bobDoc);



  rooms.handleMessage(bobSock, {
    type: 'yjs:update',
    fieldId: 'sec-lockless',
    update: Array.from(bobUpdate),
  });

  // Alice receives Bob's update
  const aliceReceivedYjs = aliceSock.received
    .filter((m): m is Extract<CollabMessage, { type: 'yjs:update' }> => m.type === 'yjs:update')
    .pop();
  assert.ok(aliceReceivedYjs, "Alice should receive Bob's update");
  Y.applyUpdate(aliceDoc, new Uint8Array(aliceReceivedYjs.update));

  // Both converged to identical state
  assert.equal(aliceDoc.getText('content').toString(), '<p>Hello from Alice and Bob</p>');
  assert.equal(bobDoc.getText('content').toString(), '<p>Hello from Alice and Bob</p>');

  // Server YDoc also matches
  const serverDoc = rooms.getYDoc('sec-lockless');
  assert.equal(serverDoc.getText('content').toString(), '<p>Hello from Alice and Bob</p>');

  // Fast forward debounce timer to trigger SQLite autosave
  t.mock.timers.tick(250);

  // Verify database persisted the autosaved content
  const persisted = store.getField('sec-lockless');
  assert.ok(persisted, 'Field should be saved in database');
  assert.equal(persisted.content, '<p>Hello from Alice and Bob</p>');
});
