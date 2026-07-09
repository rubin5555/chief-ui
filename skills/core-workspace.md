# Skill: Core Workspace Competencies

## CLI Tooling & Environment Execution

- **Dependency Installation:** Run `pnpm install` when dependencies change.
- **Local Development:** Spin up the dev server at `http://localhost:3000` via `pnpm dev`.
- **Compilation & Type-Safety:** Test production builds via `pnpm build` (Rspack 2.0) and force static type validation via `pnpm type-check` (`tsgo`). `pnpm build` must run at least once before `pnpm type-check` in a fresh checkout — it generates the gitignored `src/routeTree.gen.ts` that the route tree's types depend on.
- **Lint & Format:** Run `pnpm lint` (Biome) and `pnpm format` / `pnpm format:check` before committing. The project uses **Biome**, not ESLint/Prettier — Biome ships its own TypeScript parser and never touches the `typescript` npm package, which matters here (see the `typescript` note below). CI runs both, plus `pnpm build` and `pnpm type-check`, on every push/PR (`.github/workflows/ci.yml`).
- **End-to-End Testing:** Execute headless browser testing using `pnpm test` or interactive mode with `pnpm test:ui`.

## TypeScript Version

`typescript` is pinned to an exact prerelease (`7.0.1-rc`, not a floating `"rc"` tag) because this project deliberately runs the native `tsgo` compiler port via `ts-checker-rspack-plugin`'s `tsgo: true` option — this is intentional, not a stale pin to fix. Do not "fix" this by downgrading to a stable TypeScript 5.x unless you're deliberately reverting the tsgo adoption; that would break the build's type-checking plugin. Do keep it an exact version (never a floating dist-tag like `"rc"` or `"latest"`) so installs stay reproducible.

Consequence: `typescript` 7.0.1-rc only exports its new native-preview surface (`./unstable/*`) — it has no classic CommonJS API. Any tool that does `require('typescript')` for the classic Program/compiler API (this includes `@typescript-eslint`/`typescript-eslint` in full) cannot run against it, which is why this project uses Biome instead of ESLint for linting.

## Path & Environment Resolution

- **Alias Resolution:** Resolve the `@/` prefix to `./src` globally.
- **Directionality Processing:** Render all layouts using right-to-left mechanics (`dir="rtl"`). Assume Flex layouts read right-to-left (first child is visually rightmost). Force explicit `dir="rtl"` on all portal elements and modals.
