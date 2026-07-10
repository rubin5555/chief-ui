// Live end-to-end smoke test against a running server (plan §7's "manual
// two-tab smoke test", scripted). Start the server first (`pnpm dev`), then
// run `pnpm smoke` in another terminal. Exercises the real WS transport and
// auth check, not just the in-process logic the unit tests cover.
import WebSocket from 'ws';

const connect = (token) =>
  new Promise((resolve, reject) => {
    const ws = new WebSocket(`ws://localhost:4310/collab?token=${token}`);
    const log = [];
    ws.on('message', (raw) => log.push(JSON.parse(raw.toString())));
    ws.on('open', () => resolve({ ws, log }));
    ws.on('error', reject);
  });

const send = (ws, msg) => ws.send(JSON.stringify(msg));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const assertDeep = (actual, expected, label) => {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) {
    console.error(`FAIL ${label}\n  expected: ${e}\n  actual:   ${a}`);
    process.exitCode = 1;
  } else {
    console.log(`ok   ${label}`);
  }
};

const main = async () => {
  await new Promise((resolve) => {
    const ws = new WebSocket('ws://localhost:4310/collab');
    ws.on('close', (code) => {
      assertDeep(code, 4001, 'connecting with no token is rejected (close code 4001)');
      resolve();
    });
  });

  const alice = await connect('alice');
  const bob = await connect('bob');

  send(alice.ws, { type: 'join', fieldId: 'f1' });
  send(bob.ws, { type: 'join', fieldId: 'f1' });
  await wait(100);

  send(alice.ws, { type: 'lock:acquire', fieldId: 'f1' });
  await wait(100);
  assertDeep(
    alice.log.at(-1),
    { type: 'lock:granted', fieldId: 'f1', holderId: 'alice' },
    'alice acquires the lock and is told so',
  );
  assertDeep(
    bob.log.at(-1),
    { type: 'lock:granted', fieldId: 'f1', holderId: 'alice' },
    "bob sees alice's badge",
  );

  send(bob.ws, { type: 'lock:acquire', fieldId: 'f1' });
  await wait(100);
  assertDeep(
    bob.log.at(-1),
    { type: 'lock:denied', fieldId: 'f1', holderId: 'alice' },
    'bob is denied the already-held lock',
  );

  bob.log.length = 0;
  send(alice.ws, { type: 'content', fieldId: 'f1', html: '<p>hello from alice</p>' });
  await wait(700); // debounce window (500ms) + margin
  assertDeep(
    bob.log.at(-1),
    { type: 'content', fieldId: 'f1', html: '<p>hello from alice</p>' },
    "bob receives alice's debounced content push",
  );

  bob.log.length = 0;
  send(alice.ws, { type: 'lock:release', fieldId: 'f1' });
  await wait(100);
  assertDeep(
    bob.log.at(-1),
    { type: 'lock:released', fieldId: 'f1', holderId: 'alice' },
    'bob is told the lock was released',
  );

  send(bob.ws, { type: 'lock:acquire', fieldId: 'f1' });
  await wait(100);
  assertDeep(
    bob.log.at(-1),
    { type: 'lock:granted', fieldId: 'f1', holderId: 'bob' },
    'bob can now acquire the freed lock',
  );

  alice.ws.close();
  bob.ws.close();
  process.exit(process.exitCode ?? 0);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
