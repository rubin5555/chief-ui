import assert from 'node:assert/strict';
import { test } from 'node:test';
import { RoomManager } from '../src/rooms/RoomManager.js';
import { type RoomSocket, SOCKET_OPEN } from '../src/rooms/RoomSocket.js';
import type { CollabMessage } from '../src/types.js';

class FakeSocket implements RoomSocket {
  readyState = SOCKET_OPEN;
  received: CollabMessage[] = [];
  send(data: string): void {
    this.received.push(JSON.parse(data) as CollabMessage);
  }
}

test('acquiring a free lock broadcasts lock:granted to the whole room', () => {
  const rooms = new RoomManager();
  const alice = new FakeSocket();
  const bob = new FakeSocket();
  rooms.registerClient(alice, 'alice');
  rooms.registerClient(bob, 'bob');
  rooms.handleMessage(alice, { type: 'join', fieldId: 'f1' });
  rooms.handleMessage(bob, { type: 'join', fieldId: 'f1' });

  rooms.handleMessage(alice, { type: 'lock:acquire', fieldId: 'f1' });

  assert.deepEqual(alice.received.at(-1), { type: 'lock:granted', fieldId: 'f1', holderId: 'alice' });
  assert.deepEqual(bob.received.at(-1), { type: 'lock:granted', fieldId: 'f1', holderId: 'alice' });
});

test('acquiring a held lock sends lock:denied only to the requester', () => {
  const rooms = new RoomManager();
  const alice = new FakeSocket();
  const bob = new FakeSocket();
  rooms.registerClient(alice, 'alice');
  rooms.registerClient(bob, 'bob');
  rooms.handleMessage(alice, { type: 'join', fieldId: 'f1' });
  rooms.handleMessage(bob, { type: 'join', fieldId: 'f1' });
  rooms.handleMessage(alice, { type: 'lock:acquire', fieldId: 'f1' });
  bob.received = [];

  rooms.handleMessage(bob, { type: 'lock:acquire', fieldId: 'f1' });

  assert.deepEqual(bob.received, [{ type: 'lock:denied', fieldId: 'f1', holderId: 'alice' }]);
});

test('a client joining an already-locked field is told the current holder', () => {
  const rooms = new RoomManager();
  const alice = new FakeSocket();
  const bob = new FakeSocket();
  rooms.registerClient(alice, 'alice');
  rooms.handleMessage(alice, { type: 'join', fieldId: 'f1' });
  rooms.handleMessage(alice, { type: 'lock:acquire', fieldId: 'f1' });

  rooms.registerClient(bob, 'bob');
  rooms.handleMessage(bob, { type: 'join', fieldId: 'f1' });

  assert.deepEqual(bob.received, [{ type: 'lock:granted', fieldId: 'f1', holderId: 'alice' }]);
});

test('releasing a lock broadcasts lock:released to the room', () => {
  const rooms = new RoomManager();
  const alice = new FakeSocket();
  const bob = new FakeSocket();
  rooms.registerClient(alice, 'alice');
  rooms.registerClient(bob, 'bob');
  rooms.handleMessage(alice, { type: 'join', fieldId: 'f1' });
  rooms.handleMessage(bob, { type: 'join', fieldId: 'f1' });
  rooms.handleMessage(alice, { type: 'lock:acquire', fieldId: 'f1' });

  rooms.handleMessage(alice, { type: 'lock:release', fieldId: 'f1' });

  assert.deepEqual(bob.received.at(-1), { type: 'lock:released', fieldId: 'f1', holderId: 'alice' });
});

test('disconnecting releases every lock the client held', () => {
  const rooms = new RoomManager();
  const alice = new FakeSocket();
  const bob = new FakeSocket();
  rooms.registerClient(alice, 'alice');
  rooms.registerClient(bob, 'bob');
  rooms.handleMessage(alice, { type: 'join', fieldId: 'f1' });
  rooms.handleMessage(bob, { type: 'join', fieldId: 'f1' });
  rooms.handleMessage(alice, { type: 'lock:acquire', fieldId: 'f1' });

  rooms.removeClient(alice);

  assert.deepEqual(bob.received.at(-1), { type: 'lock:released', fieldId: 'f1', holderId: 'alice' });
});

test('content pushed with no active lock holder is dropped, never scheduled', () => {
  const rooms = new RoomManager({ contentDebounceMs: 10 });
  const alice = new FakeSocket();
  const bob = new FakeSocket();
  rooms.registerClient(alice, 'alice');
  rooms.registerClient(bob, 'bob');
  rooms.handleMessage(alice, { type: 'join', fieldId: 'f1' });
  rooms.handleMessage(bob, { type: 'join', fieldId: 'f1' });

  rooms.handleMessage(bob, { type: 'content', fieldId: 'f1', html: '<p>should be ignored</p>' });

  assert.deepEqual(alice.received, []);
});

test('content pushed by a non-holder is dropped even while someone else holds the lock', () => {
  const rooms = new RoomManager({ contentDebounceMs: 10 });
  const alice = new FakeSocket();
  const bob = new FakeSocket();
  rooms.registerClient(alice, 'alice');
  rooms.registerClient(bob, 'bob');
  rooms.handleMessage(alice, { type: 'join', fieldId: 'f1' });
  rooms.handleMessage(bob, { type: 'join', fieldId: 'f1' });
  rooms.handleMessage(alice, { type: 'lock:acquire', fieldId: 'f1' });

  rooms.handleMessage(bob, { type: 'content', fieldId: 'f1', html: '<p>not mine to send</p>' });

  assert.equal(
    bob.received.filter((m) => m.type === 'content').length,
    0,
  );
});

test("debounced content push broadcasts the holder's latest content to everyone else after the window, excluding the sender", (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const rooms = new RoomManager({ contentDebounceMs: 50 });
  const alice = new FakeSocket();
  const bob = new FakeSocket();
  rooms.registerClient(alice, 'alice');
  rooms.registerClient(bob, 'bob');
  rooms.handleMessage(alice, { type: 'join', fieldId: 'f1' });
  rooms.handleMessage(bob, { type: 'join', fieldId: 'f1' });
  rooms.handleMessage(alice, { type: 'lock:acquire', fieldId: 'f1' });
  bob.received = [];

  rooms.handleMessage(alice, { type: 'content', fieldId: 'f1', html: '<p>v1</p>' });
  rooms.handleMessage(alice, { type: 'content', fieldId: 'f1', html: '<p>v2</p>' }); // supersedes v1 before the timer fires
  assert.deepEqual(bob.received, []); // nothing yet — still debouncing

  t.mock.timers.tick(50);

  assert.deepEqual(bob.received, [{ type: 'content', fieldId: 'f1', html: '<p>v2</p>' }]);
  assert.deepEqual(
    alice.received.filter((m) => m.type === 'content'),
    [],
  ); // the sender never receives its own broadcast
});

test('cursor messages relay to everyone else in the room, excluding the sender', () => {
  const rooms = new RoomManager();
  const alice = new FakeSocket();
  const bob = new FakeSocket();
  rooms.registerClient(alice, 'alice');
  rooms.registerClient(bob, 'bob');
  rooms.handleMessage(alice, { type: 'join', fieldId: 'f1' });
  rooms.handleMessage(bob, { type: 'join', fieldId: 'f1' });

  const cursor: CollabMessage = {
    type: 'cursor',
    fieldId: 'f1',
    path: { startPath: [0], startOffset: 3, endPath: [0], endOffset: 3 },
  };
  rooms.handleMessage(alice, cursor);

  assert.deepEqual(bob.received, [cursor]);
  assert.deepEqual(alice.received, []);
});

test('leaving a field stops further broadcasts to that socket', () => {
  const rooms = new RoomManager();
  const alice = new FakeSocket();
  const bob = new FakeSocket();
  rooms.registerClient(alice, 'alice');
  rooms.registerClient(bob, 'bob');
  rooms.handleMessage(alice, { type: 'join', fieldId: 'f1' });
  rooms.handleMessage(bob, { type: 'join', fieldId: 'f1' });
  rooms.handleMessage(bob, { type: 'leave', fieldId: 'f1' });
  bob.received = [];

  rooms.handleMessage(alice, { type: 'lock:acquire', fieldId: 'f1' });

  assert.deepEqual(bob.received, []);
});
