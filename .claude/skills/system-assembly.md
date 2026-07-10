# Skill: System Assembly & Test Automation

## Domain Assembly & Structure Mapping

- **Modular Component Encapsulation:** Build new UI modules within isolated directories using exact architectural file mappings:
``` 
    ComponentName/
    ├── ComponentName.tsx          # View layout & Typed definitions
    ├── ComponentName.styles.ts    # Styled-components with responsive/theme tokens
    ├── ComponentName.testids.ts   # Automation locator definitions
    ├── ComponentName.constants.ts # Fixed options/configs (optional)
    └── index.ts                   # Export layer
 ```
- **Strict Structural Placement:** File resources based on consumption footprint:
  - `src/api/`: Raw GraphQL documents, query types, and mutations. No React elements allowed.
  - `src/components/ui/`: Dumb primitives devoid of any context domain knowledge.
  - `src/hooks/`: Generic reusable hooks that are consumed by 2+ independent features or pages. Each hook lives in its own named folder: `src/hooks/useHookName/useHookName.ts` + `index.ts`. Single-feature hooks must be co-located inside their feature directory.
  - `src/utils/`: Generic pure utility functions (formatters, validators, transformers, date helpers, etc.) consumed across 2+ independent features or pages. Each util lives in its own named folder: `src/utils/utilName/utilName.ts` + `index.ts`. Feature-specific helpers must be co-located inside their feature directory.

- **Global vs. Local Decision Rule:** If a hook or util is — or is likely to be — used in more than one unrelated feature, it belongs at the root (`src/hooks/` or `src/utils/`). If it only supports a single feature, co-locate it next to that feature. Never import upward from a feature-scoped file into a global location.

## Clean Token Naming Conventions

- **Global Constants & Keys:** Use `SCREAMING_SNAKE_CASE` (e.g., `GET_DOCUMENTS_QUERY`).
- **Interactive Triggers:** Use `camelCase` initialized with a `handle` prefix (e.g., `handleFilterChange`).
- **Booleans & Triggers:** Use `camelCase` initialized with semantic flags (e.g., `isLoading`, `hasActiveDocument`).

## Automation E2E Verification

- **Test Architecture Alignment:** Co-locate End-to-End automation tests under the root `e2e/` folder, matching the exact directory pathing of the target application file under `src/`.
- **Structured Test Spec Tracking:** Track target automation elements via explicit mappings exported within `ComponentName.testids.ts`. Utilize dynamic locator maps for complex dynamic lists.
- **Visual regression baselines are platform-specific and currently unbootstrapped:** `toHaveScreenshot()` snapshot files (`*.spec.ts-snapshots/`, gitignored) are suffixed by OS (`-win32`/`-linux`/`-darwin`) and none have ever been committed for any platform. CI (`.github/workflows/ci.yml`) currently runs lint/format/build/type-check only — **e2e is not in CI yet**. If/when Playwright is added to CI (`ubuntu-latest`), its first run of any screenshot test will report a diff until someone reviews the CI-generated images (via the `playwright-report` artifact) and commits a `-linux` baseline set deliberately. Don't try to bootstrap baselines by generating them on your own machine — they won't match CI's platform suffix.

## Known Shared Utilities (check before rebuilding)

Before hand-rolling something that might already exist, check these — each replaced 2+ duplicated implementations found during an audit pass:

- **`src/hooks/useClickOutside/`** — shared outside-click-to-close detection (previously copy-pasted in `SearchBar`/`Select`).
- **`src/pages/profile/components/tabs/useFilterableList.ts`** + **`TabPanelShell/`** — shared search/filter/subTab state (backed by the `/` route's search params, see `.claude/skills/router-state-splitting.md`) and panel shell for tabbed list panels (used by ListsPanel/SignaturesPanel/TemplatesPanel; feature-scoped, not in global `src/hooks/` since it's specific to profile tab panels).
- **`src/components/ui/PanelLoading/`** — standard `Suspense` fallback for lazy-loaded tab panels.
- **`src/components/layout/TopNavbar/TopNavPanel.styles.ts`** — shared dropdown-panel styled-components (`PanelBody`/`PanelOption`/`PanelOptionLabel`) for TopNavbar's menu popovers (SupportMenu, TrainingMenu, etc.).
- **`src/modals/MailingListModal/tabs/tabs.shared.styles.ts`**'s `ExpandChevron` — shared expand/collapse chevron for tab row lists, takes a `$isExpanded` transient prop instead of inline `style={{}}`.
- **`GridTable`/`SubTable`** (`src/components/ui/GridTable/`, `src/components/ui/SubTable/`) are virtualized via `@tanstack/react-virtual` and take a data-driven API — `items`, `getRowKey`, `renderRow`, `estimateRowHeight` — not raw `children`. Don't pass rows as JSX children directly; if a new consumer needs a table, follow this render-prop pattern so rows stay windowed.
