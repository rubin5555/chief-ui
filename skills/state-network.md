# Skill: State & Network Orchestration

## Asynchronous Network Abstraction

- **GraphQL Document Operations:** Define all operations using GraphQL SDL strings compiled via `gql` inside `src/api/` named by resource (`documents.ts`). Never write raw REST `fetch` or HTTP commands inside component files.
- **Apollo Client Cache Management:** Rely exclusively on Apollo Client's `@apollo/client` hooks (`useQuery`, `useLazyQuery`, and `useMutation`) for network lifecycles. Prevent duplication of data status states (loading, error, networkStatus) inside local React state. Manage cache sync updates locally using target mutations with explicit array `update` functions.

## Client State Scope Management

- **Static Global Context Allocation:** Restrict React Context (`src/context/`) to stable, app-wide values like authentication tokens or visual themes. Never store high-frequency visual updates inside global context.
- **Local State Allocation:** Restrict component communication variables to localized React state passing via prop drilling.
