# Skill: State & Network Orchestration

## Current Reality: Adapter Scaffolded, No Resolvers Yet

`@apollo/client` (pinned to the v3 line — `^3.14.1`, with `graphql@^16` since v3 doesn't support `graphql@17`) is installed and wired: `src/api/client.ts` exports `apolloClient` (an `ApolloClient` pointed at `/graphql`, `InMemoryCache`), and `src/index.tsx` wraps the app root in `<ApolloProvider client={apolloClient}>`. There is still no backend — `apolloClient` is not yet invoked by anything.

Each resource file in `src/api/` (see `profile.ts` for the reference shape) defines its GraphQL documents plus type-safe `fetch*`/`update*` functions, but **the function bodies are stubs that resolve with a hardcoded fallback const instead of calling `apolloClient.query`/`.mutate`** — marked with a `ponytail:` comment naming the swap. Most features still keep their mock data in the owning `.constants.ts` and haven't been migrated to `src/api/` — do that migration deliberately, per-resource, not as a drive-by.

**Do not wire a `src/api/*.ts` stub's `fetch*` into `useQuery`/`useMutation` until a real resolver exists for it** — swapping the call without a backend just trades a working hardcoded value for a network error.

## Network Abstraction (the target shape once resolvers exist)

- **GraphQL Document Operations:** Define all operations using GraphQL SDL strings compiled via `gql` inside `src/api/`, named by resource (`profile.ts`, `documents.ts`, ...). Never write raw REST `fetch` or HTTP commands inside component files.
- **Apollo Client Cache Management:** Once a resource's resolver exists, its `fetch*`/`update*` stub is replaced by `apolloClient.query`/`.mutate` (or the component switches to `useQuery`/`useLazyQuery`/`useMutation` directly). Prevent duplication of data status states (loading, error, networkStatus) inside local React state. Manage cache sync updates locally using target mutations with explicit array `update` functions.

## Client State Scope Management (applies today)

- **Static Global Context Allocation:** Restrict React Context (`src/context/`) to stable, app-wide values like authentication tokens or visual themes. Never store high-frequency visual updates inside global context.
- **Local State Allocation:** Restrict component communication variables to localized React state passing via prop drilling.
- **URL-backed state:** Anything that changes what's rendered (tabs, filters, search text) belongs in router search params, not `useState` — see `.claude/skills/router-state-splitting.md`.
