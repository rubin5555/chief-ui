# CLAUDE.md

This file provides system architecture maps and system rule references to Claude Code (`claude.ai/code`) when working inside this repository ("Chief - מערכת מסמכים").

## 🛠️ System Commands

```bash
pnpm install          # Manage repository dependencies
pnpm dev              # Spin up local development server (http://localhost:3000)
pnpm build            # Bundle production build via Rspack 2.0 (Babel translation)
pnpm type-check       # Force TypeScript static type validation (tsgo)
pnpm test             # Execute headless Playwright end-to-end testing
pnpm test:ui          # Run interactive Playwright workspace UI
```

---

## 🧠 System Capabilities & Skill Manifests

To minimize context window usage, all core engineering competencies, strict style policies, dark-mode architectural definitions, and development directives have been modularized into independent skill manifests.

**You must read, understand, and strictly follow the execution standards specified in these skill manifests before implementing or modifying any code:**

1. **Core Environment:** Refer to `.claude/skills/core-workspace.md` for CLI commands, module path aliasing (`@/`), and RTL layout rendering conditions.
2. **Component Architecture:** Refer to `.claude/skills/react-engineering.md` for strict React 19 functional guidelines, mandatory `const` arrow function declarations, zero inline handler policies, and layout concern fragmentation rules.
3. **Data Operations:** Refer to `.claude/skills/state-network.md` for native GraphQL operations and Apollo Client cache management mechanics (`useQuery`/`useMutation`).
4. **Interface Styling:** Refer to `.claude/skills/styling-tokens.md` for styled-components v6 guidelines, dynamic `$transient` property boundaries, and strict semantic theme token usage required for seamless dark-mode conversion.
5. **Assembly & Verification:** Refer to `.claude/skills/system-assembly.md` for boilerplate file topologies, target naming syntax constraints, and automated Playwright locator configurations.
6. **Analytics & Event Tracking:** Refer to `.claude/skills/analytics-component.md` for creating `.analytics.ts` hook files per component, Hebrew string conventions for category/action/label payloads, and barrel-file isolation rules.
7. **Router State & Code Splitting:** Refer to `.claude/skills/router-state-splitting.md` for backing filter/tab/search state with TanStack Router search params instead of local state, and lazy-loading tab panels/modals behind `Suspense` boundaries.
8. **Modal Placement:** Refer to `.claude/skills/modal-placement.md` for the page-level modal ownership rule, the `src/modals/<ModalName>/` directory contract, and open/close state placement.
9. **Tables:** Refer to `.claude/skills/table-columns.md` for the `ColumnDef<T>` contract driving every `GridTable`/`SubTable` — one column array derives the grid tracks, the header row, and each cell, so grid strings, `headers` arrays, and `renderRow` are never written by hand.
