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

## Version history & audit log

Every lock release (explicit, disconnect, or heartbeat-timeout expiry) checks
whether the field's content actually changed during that holder's session; if
so, it writes one `version_snapshot` and one `edit` audit entry pointing at it
(`RoomManager.finalizeEditSession`). A no-op session — lock taken and released
with no edits — writes neither, which is what keeps this a per-*session*
checkpoint instead of degenerating into a snapshot per keystroke. Restoring
(`RoomManager.restoreVersion`) inserts a new snapshot copying the target
content forward and fast-forwards the field's live content — it never deletes
or rewrites history, so the restore itself stays visible in both the snapshot
list and the audit log.

These three (`listVersions`, `listAuditLog`, `restoreVersion`) are exposed as
plain methods on `RoomManager`, not WS messages — version history and restore
are document-management/CRUD concerns, not real-time collab traffic, so
they're meant to back a future GraphQL resolver (plan §2) rather than travel
over `/collab`. That's also why `scripts/smoke.mjs` doesn't exercise them —
it's scoped to the WS protocol surface; the unit tests in
`test/roomManager.test.ts` are what cover this instead.

## Authorization

`lock:acquire` checks the target field's `permissions.editors` (plan §3 —
already present in the shared `NodePermissions` type, previously unenforced).
A field with no record yet, or an empty `editors` list, is unrestricted —
refusing everyone by default would make every field permanently uneditable in
this mock, since nothing here populates `editors` except a test or a future
real document-creation flow. A non-empty list restricts acquiring to exactly
those user ids; a denial for this reason sends `lock:denied` with
`reason: 'unauthorized'`, distinct from `reason: 'held'` (someone else
currently has it — retrying later might work) so a client can tell the two
apart. Same caveat as version history above: seeding a field's `editors` is a
CRUD-layer concern with no WS message to drive it, so `scripts/smoke.mjs`
only exercises the unrestricted default path — the restricted path is unit
tested instead.
