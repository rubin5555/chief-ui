import assert from 'node:assert/strict';
import { test } from 'node:test';
import { LockManager } from '../src/rooms/LockManager.js';
import { RoomManager } from '../src/rooms/RoomManager.js';
import { type RoomSocket, SOCKET_OPEN } from '../src/rooms/RoomSocket.js';
import { store } from '../src/store/memoryStore.js';
import type { CollabMessage } from '../src/types.js';

// `store` is a module-level singleton shared across every test in this file
// (Node's test runner keeps one file in one process) — every test below uses
// its own field id specifically so no test's content/snapshot state can leak
// into another's message assertions.

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
  rooms.handleMessage(alice, { type: 'join', fieldId: 'f-acquire' });
  rooms.handleMessage(bob, { type: 'join', fieldId: 'f-acquire' });

  rooms.handleMessage(alice, { type: 'lock:acquire', fieldId: 'f-acquire' });

  assert.deepEqual(alice.received.at(-1), {
    type: 'lock:granted',
    fieldId: 'f-acquire',
    holderId: 'alice',
  });
  assert.deepEqual(bob.received.at(-1), { type: 'lock:granted', fieldId: 'f-acquire', holderId: 'alice' });
});

test('acquiring a held lock sends lock:denied only to the requester', () => {
  const rooms = new RoomManager();
  const alice = new FakeSocket();
  const bob = new FakeSocket();
  rooms.registerClient(alice, 'alice');
  rooms.registerClient(bob, 'bob');
  rooms.handleMessage(alice, { type: 'join', fieldId: 'f-deny' });
  rooms.handleMessage(bob, { type: 'join', fieldId: 'f-deny' });
  rooms.handleMessage(alice, { type: 'lock:acquire', fieldId: 'f-deny' });
  bob.received = [];

  rooms.handleMessage(bob, { type: 'lock:acquire', fieldId: 'f-deny' });

  assert.deepEqual(bob.received, [
    { type: 'lock:denied', fieldId: 'f-deny', holderId: 'alice', reason: 'held' },
  ]);
});

test('a field with no editors restriction can be locked by anyone (unrestricted default)', () => {
  const rooms = new RoomManager();
  const alice = new FakeSocket();
  rooms.registerClient(alice, 'alice');
  rooms.handleMessage(alice, { type: 'join', fieldId: 'f-open' });

  rooms.handleMessage(alice, { type: 'lock:acquire', fieldId: 'f-open' });

  assert.deepEqual(alice.received.at(-1), { type: 'lock:granted', fieldId: 'f-open', holderId: 'alice' });
});

test('a field restricted to specific editors denies a non-editor with reason: unauthorized', () => {
  const rooms = new RoomManager();
  store.upsertField({
    id: 'f-restricted',
    documentId: 'doc-1',
    parentFieldId: null,
    kind: 'section',
    title: 'Restricted',
    content: '',
    permissions: { approvers: [], editors: ['alice'] },
    createdAt: 0,
    updatedAt: 0,
  });
  const bob = new FakeSocket();
  rooms.registerClient(bob, 'bob');
  rooms.handleMessage(bob, { type: 'join', fieldId: 'f-restricted' });

  rooms.handleMessage(bob, { type: 'lock:acquire', fieldId: 'f-restricted' });

  assert.deepEqual(bob.received.at(-1), {
    type: 'lock:denied',
    fieldId: 'f-restricted',
    holderId: '',
    reason: 'unauthorized',
  });
});

test('a field restricted to specific editors grants a listed editor', () => {
  const rooms = new RoomManager();
  store.upsertField({
    id: 'f-restricted-2',
    documentId: 'doc-1',
    parentFieldId: null,
    kind: 'section',
    title: 'Restricted',
    content: '',
    permissions: { approvers: [], editors: ['alice'] },
    createdAt: 0,
    updatedAt: 0,
  });
  const alice = new FakeSocket();
  rooms.registerClient(alice, 'alice');
  rooms.handleMessage(alice, { type: 'join', fieldId: 'f-restricted-2' });

  rooms.handleMessage(alice, { type: 'lock:acquire', fieldId: 'f-restricted-2' });

  assert.deepEqual(alice.received.at(-1), {
    type: 'lock:granted',
    fieldId: 'f-restricted-2',
    holderId: 'alice',
  });
});

test('an unauthorized acquire attempt never actually takes the lock', () => {
  const rooms = new RoomManager();
  store.upsertField({
    id: 'f-restricted-3',
    documentId: 'doc-1',
    parentFieldId: null,
    kind: 'section',
    title: 'Restricted',
    content: '',
    permissions: { approvers: [], editors: ['alice'] },
    createdAt: 0,
    updatedAt: 0,
  });
  const alice = new FakeSocket();
  const bob = new FakeSocket();
  rooms.registerClient(alice, 'alice');
  rooms.registerClient(bob, 'bob');
  rooms.handleMessage(alice, { type: 'join', fieldId: 'f-restricted-3' });
  rooms.handleMessage(bob, { type: 'join', fieldId: 'f-restricted-3' });

  rooms.handleMessage(bob, { type: 'lock:acquire', fieldId: 'f-restricted-3' }); // denied, unauthorized
  rooms.handleMessage(alice, { type: 'lock:acquire', fieldId: 'f-restricted-3' }); // should still succeed

  assert.deepEqual(alice.received.at(-1), {
    type: 'lock:granted',
    fieldId: 'f-restricted-3',
    holderId: 'alice',
  });
});

test('a client joining an already-locked field is told the current holder', () => {
  const rooms = new RoomManager();
  const alice = new FakeSocket();
  const bob = new FakeSocket();
  rooms.registerClient(alice, 'alice');
  rooms.handleMessage(alice, { type: 'join', fieldId: 'f-join-lock' });
  rooms.handleMessage(alice, { type: 'lock:acquire', fieldId: 'f-join-lock' });

  rooms.registerClient(bob, 'bob');
  rooms.handleMessage(bob, { type: 'join', fieldId: 'f-join-lock' });

  assert.deepEqual(bob.received, [{ type: 'lock:granted', fieldId: 'f-join-lock', holderId: 'alice' }]);
});

test('a client joining a field with existing content is sent that content first', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const rooms = new RoomManager({ contentDebounceMs: 10 });
  const alice = new FakeSocket();
  rooms.registerClient(alice, 'alice');
  rooms.handleMessage(alice, { type: 'join', fieldId: 'f-join-content' });
  rooms.handleMessage(alice, { type: 'lock:acquire', fieldId: 'f-join-content' });
  rooms.handleMessage(alice, { type: 'content', fieldId: 'f-join-content', html: '<p>seeded</p>' });
  t.mock.timers.tick(10);
  rooms.handleMessage(alice, { type: 'lock:release', fieldId: 'f-join-content' });

  const bob = new FakeSocket();
  rooms.registerClient(bob, 'bob');
  rooms.handleMessage(bob, { type: 'join', fieldId: 'f-join-content' });

  assert.deepEqual(bob.received, [{ type: 'content', fieldId: 'f-join-content', html: '<p>seeded</p>' }]);
});

test('a client joining a never-edited field gets no content message', () => {
  const rooms = new RoomManager();
  const alice = new FakeSocket();
  rooms.registerClient(alice, 'alice');
  rooms.handleMessage(alice, { type: 'join', fieldId: 'f-join-empty' });

  assert.deepEqual(alice.received, []);
});

test('releasing a lock broadcasts lock:released to the room', () => {
  const rooms = new RoomManager();
  const alice = new FakeSocket();
  const bob = new FakeSocket();
  rooms.registerClient(alice, 'alice');
  rooms.registerClient(bob, 'bob');
  rooms.handleMessage(alice, { type: 'join', fieldId: 'f-release' });
  rooms.handleMessage(bob, { type: 'join', fieldId: 'f-release' });
  rooms.handleMessage(alice, { type: 'lock:acquire', fieldId: 'f-release' });

  rooms.handleMessage(alice, { type: 'lock:release', fieldId: 'f-release' });

  assert.deepEqual(bob.received.at(-1), { type: 'lock:released', fieldId: 'f-release', holderId: 'alice' });
});

test('disconnecting releases every lock the client held', () => {
  const rooms = new RoomManager();
  const alice = new FakeSocket();
  const bob = new FakeSocket();
  rooms.registerClient(alice, 'alice');
  rooms.registerClient(bob, 'bob');
  rooms.handleMessage(alice, { type: 'join', fieldId: 'f-disconnect' });
  rooms.handleMessage(bob, { type: 'join', fieldId: 'f-disconnect' });
  rooms.handleMessage(alice, { type: 'lock:acquire', fieldId: 'f-disconnect' });

  rooms.removeClient(alice);

  assert.deepEqual(bob.received.at(-1), {
    type: 'lock:released',
    fieldId: 'f-disconnect',
    holderId: 'alice',
  });
});

test('content pushed with no active lock holder is dropped, never scheduled', () => {
  const rooms = new RoomManager({ contentDebounceMs: 10 });
  const alice = new FakeSocket();
  const bob = new FakeSocket();
  rooms.registerClient(alice, 'alice');
  rooms.registerClient(bob, 'bob');
  rooms.handleMessage(alice, { type: 'join', fieldId: 'f-no-lock' });
  rooms.handleMessage(bob, { type: 'join', fieldId: 'f-no-lock' });

  rooms.handleMessage(bob, { type: 'content', fieldId: 'f-no-lock', html: '<p>should be ignored</p>' });

  assert.deepEqual(alice.received, []);
});

test('content pushed by a non-holder is dropped even while someone else holds the lock', () => {
  const rooms = new RoomManager({ contentDebounceMs: 10 });
  const alice = new FakeSocket();
  const bob = new FakeSocket();
  rooms.registerClient(alice, 'alice');
  rooms.registerClient(bob, 'bob');
  rooms.handleMessage(alice, { type: 'join', fieldId: 'f-wrong-holder' });
  rooms.handleMessage(bob, { type: 'join', fieldId: 'f-wrong-holder' });
  rooms.handleMessage(alice, { type: 'lock:acquire', fieldId: 'f-wrong-holder' });

  rooms.handleMessage(bob, { type: 'content', fieldId: 'f-wrong-holder', html: '<p>not mine to send</p>' });

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
  rooms.handleMessage(alice, { type: 'join', fieldId: 'f-debounce' });
  rooms.handleMessage(bob, { type: 'join', fieldId: 'f-debounce' });
  rooms.handleMessage(alice, { type: 'lock:acquire', fieldId: 'f-debounce' });
  bob.received = [];

  rooms.handleMessage(alice, { type: 'content', fieldId: 'f-debounce', html: '<p>v1</p>' });
  rooms.handleMessage(alice, { type: 'content', fieldId: 'f-debounce', html: '<p>v2</p>' }); // supersedes v1 before the timer fires
  assert.deepEqual(bob.received, []); // nothing yet — still debouncing

  t.mock.timers.tick(50);

  assert.deepEqual(bob.received, [{ type: 'content', fieldId: 'f-debounce', html: '<p>v2</p>' }]);
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
  rooms.handleMessage(alice, { type: 'join', fieldId: 'f-cursor' });
  rooms.handleMessage(bob, { type: 'join', fieldId: 'f-cursor' });

  const cursor: CollabMessage = {
    type: 'cursor',
    fieldId: 'f-cursor',
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
  rooms.handleMessage(alice, { type: 'join', fieldId: 'f-leave' });
  rooms.handleMessage(bob, { type: 'join', fieldId: 'f-leave' });
  rooms.handleMessage(bob, { type: 'leave', fieldId: 'f-leave' });
  bob.received = [];

  rooms.handleMessage(alice, { type: 'lock:acquire', fieldId: 'f-leave' });

  assert.deepEqual(bob.received, []);
});

test('releasing a lock after real edits writes one version snapshot and one edit audit entry', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const rooms = new RoomManager({ contentDebounceMs: 10 });
  const alice = new FakeSocket();
  rooms.registerClient(alice, 'alice');
  rooms.handleMessage(alice, { type: 'join', fieldId: 'f-snapshot' });
  rooms.handleMessage(alice, { type: 'lock:acquire', fieldId: 'f-snapshot' });
  rooms.handleMessage(alice, { type: 'content', fieldId: 'f-snapshot', html: '<p>edited</p>' });
  t.mock.timers.tick(10);

  rooms.handleMessage(alice, { type: 'lock:release', fieldId: 'f-snapshot' });

  const versions = rooms.listVersions('f-snapshot');
  assert.equal(versions.length, 1);
  assert.equal(versions[0].content, '<p>edited</p>');
  assert.equal(versions[0].createdBy, 'alice');

  const audit = rooms.listAuditLog('f-snapshot');
  const editEntries = audit.filter((entry) => entry.action === 'edit');
  assert.equal(editEntries.length, 1);
  assert.equal(editEntries[0].diffRef, versions[0].id);

  const lockEntries = audit.filter((entry) => entry.action === 'lock_acquire' || entry.action === 'lock_release');
  assert.equal(lockEntries.length, 2);
});

test('releasing a lock with no edits made writes no snapshot and no edit audit entry', () => {
  const rooms = new RoomManager();
  const alice = new FakeSocket();
  rooms.registerClient(alice, 'alice');
  rooms.handleMessage(alice, { type: 'join', fieldId: 'f-no-op' });
  rooms.handleMessage(alice, { type: 'lock:acquire', fieldId: 'f-no-op' });

  rooms.handleMessage(alice, { type: 'lock:release', fieldId: 'f-no-op' });

  assert.deepEqual(rooms.listVersions('f-no-op'), []);
  assert.equal(rooms.listAuditLog('f-no-op').filter((entry) => entry.action === 'edit').length, 0);
});

test('a heartbeat-timeout expiry with unsaved edits still snapshots and logs them', (t) => {
  // Faking 'Date' too means LockManager's default `now: () => Date.now()`
  // advances in lockstep with tick() below — no separate manual clock needed.
  t.mock.timers.enable({ apis: ['setTimeout', 'setInterval', 'Date'] });
  const rooms = new RoomManager({
    contentDebounceMs: 5,
    lockManager: new LockManager({ heartbeatTimeoutMs: 100 }),
  });
  const alice = new FakeSocket();
  rooms.registerClient(alice, 'alice');
  rooms.handleMessage(alice, { type: 'join', fieldId: 'f-timeout' });
  rooms.handleMessage(alice, { type: 'lock:acquire', fieldId: 'f-timeout' });
  rooms.handleMessage(alice, { type: 'content', fieldId: 'f-timeout', html: '<p>abandoned</p>' });
  t.mock.timers.tick(5); // let the debounced content push land

  rooms.startExpirySweep(50);
  t.mock.timers.tick(500); // well past both the 100ms lock timeout and a 50ms sweep tick

  const versions = rooms.listVersions('f-timeout');
  assert.equal(versions.length, 1);
  assert.equal(versions[0].content, '<p>abandoned</p>');
  rooms.stopExpirySweep();
});

test('restoreVersion copies old content forward as a new snapshot without deleting history', () => {
  const rooms = new RoomManager();
  store.upsertField({
    id: 'f-restore',
    documentId: 'doc-1',
    parentFieldId: null,
    kind: 'section',
    title: 'Test',
    content: '<p>current</p>',
    permissions: { approvers: [], editors: [] },
    createdAt: 0,
    updatedAt: 0,
  });
  store.addVersionSnapshot({
    id: 'snap-old',
    fieldId: 'f-restore',
    content: '<p>old content</p>',
    createdBy: 'alice',
    createdAt: 0,
    label: null,
  });

  const newSnapshotId = rooms.restoreVersion('f-restore', 'snap-old', 'bob');

  assert.notEqual(newSnapshotId, null);
  assert.equal(store.getField('f-restore')?.content, '<p>old content</p>');
  const versions = rooms.listVersions('f-restore');
  assert.equal(versions.length, 2); // the original manually-seeded one is still there
  assert.equal(versions.at(-1)?.content, '<p>old content</p>');
  assert.equal(versions.at(-1)?.createdBy, 'bob');
  const restoreEntries = rooms.listAuditLog('f-restore').filter((entry) => entry.action === 'restore');
  assert.equal(restoreEntries.length, 1);
});

test('restoreVersion with an unknown snapshot id is a no-op and returns null', () => {
  const rooms = new RoomManager();
  const result = rooms.restoreVersion('f-restore-missing', 'nope', 'bob');
  assert.equal(result, null);
});

test('restoring a field with active room members broadcasts the restored content live', () => {
  const rooms = new RoomManager();
  const alice = new FakeSocket();
  rooms.registerClient(alice, 'alice');
  rooms.handleMessage(alice, { type: 'join', fieldId: 'f-restore-live' });
  store.addVersionSnapshot({
    id: 'snap-live-old',
    fieldId: 'f-restore-live',
    content: '<p>from before</p>',
    createdBy: 'alice',
    createdAt: 0,
    label: null,
  });
  alice.received = [];

  rooms.restoreVersion('f-restore-live', 'snap-live-old', 'bob');

  assert.deepEqual(alice.received, [
    { type: 'content', fieldId: 'f-restore-live', html: '<p>from before</p>' },
  ]);
});
