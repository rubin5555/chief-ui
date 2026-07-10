# Skill: State & Network Orchestration

## Current Reality: No Network Layer Yet

The app runs entirely on local mock data (`.constants.ts` catalogs) and local React state. There is no `src/api/` directory, and neither `@apollo/client` nor `graphql` is in `package.json`. **Do not install a GraphQL/Apollo stack to satisfy this skill** — the "Planned" section below is the architecture to follow *when a real backend integration lands*, not something to retrofit onto mock-data features now. Until then, keep mock catalogs in the owning feature's `.constants.ts`.

## Planned Network Abstraction (applies once a backend exists)

- **GraphQL Document Operations:** Define all operations using GraphQL SDL strings compiled via `gql` inside `src/api/` named by resource (`documents.ts`). Never write raw REST `fetch` or HTTP commands inside component files.
- **Apollo Client Cache Management:** Rely exclusively on Apollo Client's `@apollo/client` hooks (`useQuery`, `useLazyQuery`, and `useMutation`) for network lifecycles. Prevent duplication of data status states (loading, error, networkStatus) inside local React state. Manage cache sync updates locally using target mutations with explicit array `update` functions.

## Client State Scope Management (applies today)

- **Static Global Context Allocation:** Restrict React Context (`src/context/`) to stable, app-wide values like authentication tokens or visual themes. Never store high-frequency visual updates inside global context.
- **Local State Allocation:** Restrict component communication variables to localized React state passing via prop drilling.
- **URL-backed state:** Anything that changes what's rendered (tabs, filters, search text) belongs in router search params, not `useState` — see `.claude/skills/router-state-splitting.md`.
