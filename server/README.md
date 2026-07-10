# collab-server

Real-time collaboration server for TinyMCE section-level locking. See the plan
at `C:/Users/Chief/.claude/plans/vast-juggling-hummingbird.md` for the full
design and the swap boundary toward a future Yjs CRDT upgrade.

Plain folder, own toolchain — deliberately not a pnpm workspace member and not
wired into the frontend's CI. Standard TypeScript (not the frontend's pinned
`tsgo` prerelease, which only exists for the Rspack/tsgo integration).

**Persistence is an in-memory mock for this pass** (`src/store/memoryStore.ts`)
— no Postgres, no Docker. It implements the same `CollabStore` shape the plan's
real tables would eventually back, so swapping in a real database later means
implementing that interface, not touching `RoomManager` or anything that calls
it.

## Run it

```
pnpm install
pnpm dev          # starts on :4310, WS path /collab
```

```
pnpm type-check
pnpm test         # unit tests — LockManager + RoomManager, no real socket needed
pnpm smoke        # live end-to-end check against a running `pnpm dev` server
```

## Auth

`src/auth.ts` is a placeholder — it accepts whatever token value is passed as
the user id, with no real verification. Replace it once your real system's
auth token shape (JWT vs. session lookup) is confirmed; see the plan's §2.
Locally, this lets you simulate distinct users via `?token=alice` /
`?token=bob` on the WS connection, which is what `scripts/smoke.mjs` and any
future multi-tab Playwright spec should do too.

## Architecture in one paragraph

`RoomManager` (`src/rooms/RoomManager.ts`) is the core: it maps sockets to
users, users to the fields they've joined, and delegates lock accounting to
`LockManager` (`src/rooms/LockManager.ts`), a dependency-free class holding
only in-memory lock records with an injectable clock — that's what makes the
heartbeat-timeout logic unit-testable without real sleeps. `RoomManager` itself
depends only on the minimal `RoomSocket` interface (`send`/`readyState`), not
the `ws` package, so it's testable with plain fake objects too — the real `ws`
transport only shows up in `wsServer.ts`.
