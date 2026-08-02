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

- **No God Styles Files — Styles Live With Their Component, Not Their Parent.** A parent modal/component's `.styles.ts` must only contain that component's own styled-components. If a child under `components/<Child>/` imports from the parent's `.styles.ts`, that's a colocation violation — move the styles into `<Child>.styles.ts` inside the child's own directory, matching the same file topology every component gets.
  - **Genuinely shared styles (used by 2+ sibling components)** get their own `<Parent>.shared.styles.ts` file at the directory level those siblings share — e.g. `src/modals/MailingListModal/tabs/tabs.shared.styles.ts`, or `src/modals/TemplateModal/components/TemplateModal.shared.styles.ts` for row/tree primitives (`TitleInput`, `DragHandle`, `SmallIconBtn`, etc.) reused across `AppendixList`/`SubjectTree`/`SectionRow`/`TemplateModalBody`. Don't default everything into the shared file — only what's actually reused; single-consumer styles stay local to that consumer.
  - **Pick the shared-file's directory to match the consumers' actual common ancestor, not the first shared file you find.** If a style is reused only within one subtree (e.g. two components both under `components/`), the shared file belongs at that subtree's root (`components/components.shared.styles.ts`). If it's reused across sibling subtrees (e.g. one consumer under `components/` and others under `tabs/`), it belongs one level higher, at the directory both subtrees share (e.g. `MailingListModal.shared.styles.ts` next to `MailingListModal.tsx`) — don't stuff it into whichever sibling's shared file happens to already exist. Example: `MembersPanel.styles.ts`'s `ColHeader` was reused by 5 files under `tabs/` *and* by `MembersPanel.tsx` itself under `components/MembersPanel/`, so it moved to `MailingListModal.shared.styles.ts` (the common ancestor), while `ExpandedBlock` — reused only by `MembersPanel.tsx` and `ExpandedMemberBlock.styles.ts`, both under `components/` — moved to the narrower `components/components.shared.styles.ts`.
  - **Smell to catch:** a `<Parent>.styles.ts` growing past ~150 lines while multiple `components/<X>/<X>.tsx` files import from it instead of their own `.styles.ts`. That parent file has become a dumping ground instead of the parent's own concern.
  - **Inverted smell to catch:** a component's `.styles.ts` where *every* export is also imported by 2+ files outside that component's own directory (as opposed to a mix of exclusive + shared). That's not "a component's styles that happen to be reused" — it's a shared file that got mistakenly named and placed after whichever consumer was written first. Move the whole file to the correct shared location (see above) and delete the original; don't leave a same-named file behind that just re-exports it.
  - **Test:** if you deleted a child component's directory, no styled-components it needs should still be sitting in the parent's file — they should have moved with it.

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
- **`src/pages/profile/components/tabs/useFilterableList.ts`** + **`TabPanelShell/`** — shared search/filter/subTab state (backed by the `/profile` route's search params, see `.claude/skills/router-state-splitting.md`) and panel shell for tabbed list panels (used by ListsPanel/SignaturesPanel/TemplatesPanel; feature-scoped, not in global `src/hooks/` since it's specific to profile tab panels).
- **`src/components/ui/PanelLoading/`** — standard `Suspense` fallback for lazy-loaded tab panels.
- **`src/components/layout/TopNavbar/TopNavPanel.styles.ts`** — shared dropdown-panel styled-components (`PanelBody`/`PanelOption`/`PanelOptionLabel`) for TopNavbar's menu popovers (SupportMenu, TrainingMenu, etc.).
- **`src/modals/MailingListModal/tabs/tabs.shared.styles.ts`**'s `ExpandChevron` — shared expand/collapse chevron for tab row lists, takes a `$isExpanded` transient prop instead of inline `style={{}}`.
- **`src/modals/MailingListModal/MailingListModal.shared.styles.ts`**'s `ColHeader` — shared `GridTable` header cell, reused across both `tabs/*` and `components/MembersPanel` (hence living at the `MailingListModal/` root, not inside `tabs.shared.styles.ts`).
- **`src/modals/MailingListModal/MailingListModal.shared.styles.ts`**'s `Popover*`/`Picked*` exports — shared floating-popover-panel chrome (header, form fields, save button, picked-member list) reused by `ManualAddPanel`, `HamalAddMemberPanel`, and `HamalCreateGroupPanel`. Previously lived in `components/ManualAddPanel/ManualAddPanel.styles.ts` even though every export was consumed by the other two `tabs/`-level panels too — a shared file misnamed after one of its consumers, which is the same god-file smell as an oversized parent file, just inverted. `ManualAddPanel/` has no `.styles.ts` of its own now since it has zero exclusive styles.
- **`src/modals/MailingListModal/components/components.shared.styles.ts`**'s `ExpandedBlock` — shared expanded-row background, reused by `MembersPanel` and `ExpandedMemberBlock`.
- **`src/components/ui/DateTimePicker/components/CalendarPanel/CalendarPanel.styles.ts`** — the calendar-dropdown styles (`Dropdown`, `DayBtn`, `TimeInput`, etc.) live here, not in `DateTimePicker.styles.ts`, since only `CalendarPanel.tsx` consumes them; `DateTimePicker.styles.ts` keeps only its own trigger-button styles.
- **`GridTable`/`SubTable`** (`src/components/ui/GridTable/`, `src/components/ui/SubTable/`) are virtualized via `@tanstack/react-virtual` and take a data-driven API — `items`, `getRowKey`, `renderRow`, `estimateRowHeight` — not raw `children`. Don't pass rows as JSX children directly; if a new consumer needs a table, follow this render-prop pattern so rows stay windowed.
