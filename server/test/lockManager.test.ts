import assert from 'node:assert/strict';
import { test } from 'node:test';
import { LockManager } from '../src/rooms/LockManager.js';

test('acquire grants an unlocked field', () => {
  const lm = new LockManager();
  const result = lm.acquire('f1', 'alice');
  assert.equal(result.granted, true);
  assert.equal(lm.getHolder('f1'), 'alice');
});

test('acquire denies a field locked by someone else', () => {
  const lm = new LockManager();
  lm.acquire('f1', 'alice');
  const result = lm.acquire('f1', 'bob');
  assert.equal(result.granted, false);
  if (!result.granted) assert.equal(result.holderId, 'alice');
});

test('the same holder can re-acquire idempotently', () => {
  const lm = new LockManager();
  lm.acquire('f1', 'alice');
  const result = lm.acquire('f1', 'alice');
  assert.equal(result.granted, true);
});

test('release frees the lock for others', () => {
  const lm = new LockManager();
  lm.acquire('f1', 'alice');
  assert.equal(lm.release('f1', 'alice'), true);
  assert.equal(lm.acquire('f1', 'bob').granted, true);
});

test('release by a non-holder is a no-op and does not free the lock', () => {
  const lm = new LockManager();
  lm.acquire('f1', 'alice');
  assert.equal(lm.release('f1', 'bob'), false);
  assert.equal(lm.acquire('f1', 'bob').granted, false);
});

test('release of an unlocked field is a no-op', () => {
  const lm = new LockManager();
  assert.equal(lm.release('nonexistent', 'alice'), false);
});

test('heartbeat keeps a lock alive past the timeout window', () => {
  let clock = 0;
  const lm = new LockManager({ heartbeatTimeoutMs: 1000, now: () => clock });
  lm.acquire('f1', 'alice');
  clock += 900;
  assert.equal(lm.heartbeat('f1', 'alice'), true);
  clock += 900; // 1800ms since acquire, but only 900ms since the heartbeat
  assert.equal(lm.acquire('f1', 'bob').granted, false);
});

test('heartbeat from a non-holder is a no-op', () => {
  const lm = new LockManager();
  lm.acquire('f1', 'alice');
  assert.equal(lm.heartbeat('f1', 'bob'), false);
});

test('a stale lock with no heartbeat expires and can be reacquired', () => {
  let clock = 0;
  const lm = new LockManager({ heartbeatTimeoutMs: 1000, now: () => clock });
  lm.acquire('f1', 'alice');
  clock += 1500;
  const result = lm.acquire('f1', 'bob');
  assert.equal(result.granted, true);
});

test('getHolder returns null and clears state for an expired lock', () => {
  let clock = 0;
  const lm = new LockManager({ heartbeatTimeoutMs: 1000, now: () => clock });
  lm.acquire('f1', 'alice');
  clock += 1500;
  assert.equal(lm.getHolder('f1'), null);
});

test('releaseAllHeldBy frees every lock a client held and leaves others untouched', () => {
  const lm = new LockManager();
  lm.acquire('f1', 'alice');
  lm.acquire('f2', 'alice');
  lm.acquire('f3', 'bob');
  const released = lm.releaseAllHeldBy('alice').sort();
  assert.deepEqual(released, ['f1', 'f2']);
  assert.equal(lm.getHolder('f1'), null);
  assert.equal(lm.getHolder('f2'), null);
  assert.equal(lm.getHolder('f3'), 'bob');
});

test('sweepExpired reports and removes stale locks, leaving fresh ones alone', () => {
  let clock = 0;
  const lm = new LockManager({ heartbeatTimeoutMs: 1000, now: () => clock });
  lm.acquire('f1', 'alice');
  clock += 1500;
  lm.acquire('f2', 'bob'); // fresh, acquired at the current clock value

  const expired = lm.sweepExpired();
  assert.deepEqual(expired, [{ fieldId: 'f1', holderId: 'alice' }]);
  assert.equal(lm.getHolder('f1'), null);
  assert.equal(lm.getHolder('f2'), 'bob');
});
