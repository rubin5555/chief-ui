# Skill: Tokenized Interface Styling (styled-components v6)

## Declarative Style Encapsulation & Dark Mode Setup

- **Zero Classes & Inline Structuring:** Eliminate standard class usage and explicit `style={{}}` tags entirely. Isolate all presentation attributes inside companion `.styles.ts` files using styled-components.
- **Dynamic Property Passing:** Use transient attributes (prefixed with `$`) for conditional props passed into styled structures to safely block DOM leakage.
- **Semantic Token Architecture:** Never write raw color literals (e.g., `#fff`, `#000`) or index static values directly. Always consume properties from the imported dynamic `colors` palette so tokens resolve seamlessly when toggling between light and dark modes.
``` tsx
import { colors } from '@/styles/theme';

export const StatusIndicator = styled.span<{ $isUrgent: boolean }>`
    background: ${props => props.$isUrgent ? colors.accent : colors.surface};
    color: ${colors.primary};
    border: 1px solid ${colors.border};
`;
 ```

- **Available tokens:** `colors.primary` / `primaryLight` / `accent` / `surface` / `muted` / `border` / `danger` / `dangerLight`, plus `gray[50..900]`, `shadows.{sm,md,lg,xl,xxl}`, `radii.{lg,xl,2xl,3xl,full}`, `transitions.{fast,normal,slow}` — all from `src/styles/theme.ts`. Use `colors.danger`/`colors.dangerLight` for destructive/error states (e.g. delete actions, validation errors) instead of a one-off red literal.

## How Dark Mode Actually Works

- **Mechanism:** `colors` and `gray` in `src/styles/theme.ts` are not literal hex strings — every value is a `var(--token-name)` reference. The real hex values live in `src/styles/theme.css` as CSS custom properties on `:root`, with a `@media (prefers-color-scheme: dark)` block (scoped by `:root:not([data-theme='light'])`) and explicit `:root[data-theme='dark']` / `:root[data-theme='light']` overrides for a future manual toggle. `src/index.tsx` imports `./styles/theme.css` once at the app entrypoint. This is why styled-components can consume `colors.primary` like a plain string — it resolves to the current CSS custom property value at paint time, with no `ThemeProvider` and no React re-render needed when the OS theme changes.
- **Consequence:** because this is CSS-variable-backed, dark mode today follows the OS `prefers-color-scheme` automatically with zero extra code in any component. Toggling to a manual light/dark switch later only requires setting `data-theme="dark"`/`"light"` on `<html>` — no component changes.
- **Do not reintroduce raw hex** anywhere a styled-component could instead take `colors`/`gray` — that's exactly the regression this mechanism replaced (raw hex literals silently bypass both the OS-driven and future manual dark mode).

## Tokenized Design Alignment

- **Direct Token Consumption:** Import fixed style values (`colors`, `shadows`, `radii`, `gray`) explicitly from `src/styles/theme.ts`. Do not wrap components in a context-based `ThemeProvider`.
- **Style Factorization:** Do not replicate CSS rule blocks across uniquely named styled-components. Collapse redundant definitions into single flexible base styles controlled with transient properties mapping back to the theme palette.
