# Skill: React 19 Production Engineering

## Functional Syntax Enforcement

- **Arrow Function Declaration:** Define all React functional components, hooks, utility helpers, and internal event handlers strictly using `const` arrow function expressions. Traditional `function` syntax is prohibited unless `this` binding is programmatically required.
- **Semicolons Required:** Terminate statements with semicolons in `.tsx` and `.ts` files. (This corrects an earlier version of this rule that said the opposite — the actual codebase has used semicolons throughout since the project's early commits, and `biome.json`'s `javascript.formatter.semicolons: "always"` now enforces this via `pnpm lint`/`pnpm format`. Don't reintroduce a no-semicolon style.)

Example component definition:

```tsx
export const DocumentCard = ({ $id }: DocumentCardProps) => { ... };
const handleDownload = () => { ... };
```

## Forbidden React APIs

- **No `cloneElement`:** Never use `React.cloneElement` to inject props onto children. It hides prop injection, is not type-safe, and couples the component to the shape of its children. Instead, have the component own its trigger button directly — import the styled button and place it in the component's JSX with `ref` and `onClick` wired up. The parent never needs to supply or wrap the trigger.

```tsx
// ❌ cloneElement — hidden prop injection, not type-safe
{cloneElement(children, { ref: panel.btnRef, onClick: onToggle })}

// ✅ component owns its trigger — explicit, no indirection
<AddPersonBtn ref={panel.btnRef} onClick={onToggle} type="button">
  <Plus size={14} />
  הוספה ידנית
</AddPersonBtn>
```

## JSX Optimization (Zero Inline Allocations)

- **Handler Extraction:** Isolate all interactive actions from JSX properties. Define named `const` handlers directly above the component return block.
- **Curried Event Management:** Map dynamic collection lists using curried function factories instead of inline closures.

Example factory definition:

```tsx
const handleDocumentSelect = (id: string) => () => onSelect(id);
// Usage: onClick={handleDocumentSelect(doc.id)}
```

- **Static Config Decoupling:** Move static arrays, tabs, and select configurations out of component files entirely and place them inside `.constants.ts`.

## Component Architectural Layering

- **Presentational (Dumb) Components:** Build components primarily to receive props and return clean JSX. Restrict local state to ephemeral UI flags (`isOpen`, `isHovered`). Enforce zero side effects and zero direct data access.
- **Container (Smart) Components:** Isolate data orchestration (Apollo Client hooks) to container components (`[Feature]Container.tsx`) or top-level page routes. Keep container JSX strictly semantic and highly condensed.
- **Concern Separation:** Fragment components into sub-components the moment they exceed one clear visual purpose or transcend ~100 lines of code.

## Input-Driven Action Debouncing

- **Mandatory Debounce:** Any action triggered by user input (search, filter, form field change, resize, scroll) **must** be debounced before firing side effects, API calls, or expensive computations. Direct `onChange` → effect chains without debouncing are prohibited.
- **Hook:** Use a `useDebounce` hook (e.g., `usehooks-ts` or a local `hooks/useDebounce.ts`) to produce a debounced value, then derive effects from that value — not from the raw input state.
- **Delay convention:** Default debounce delay is **300ms** for search/filter inputs; use **150ms** for lightweight UI-only reactions (e.g., character counters).

Example:

```tsx
const [query, setQuery] = useState('')
const debouncedQuery = useDebounce(query, 300)

useEffect(() => {
  if (debouncedQuery) fetchResults(debouncedQuery)
}, [debouncedQuery])
```

## Form Components

- **Native `<form>` element:** Any component that collects input and has a submit action must render a `<form>` with `onSubmit`. Never use a plain `<div>` wrapper with a button `onClick` for forms.
- **Submit handler:** Define a named `const onSubmit = (e: FormEvent) => { e.preventDefault(); ... }` handler — never inline in JSX.
- **Submit button:** The action button must be `type="submit"` on the `<form>`, not `type="button"` with an `onClick`. This enables Enter-key submission and native browser accessibility.
- **Close button:** Any close/cancel button inside the form must be `type="button"` to prevent accidental form submission.

Example:

```tsx
const onSubmit = (e: FormEvent) => {
  e.preventDefault()
  if (!value.trim()) return
  onSave(value)
}

return (
  <form onSubmit={onSubmit}>
    <input value={value} onChange={onValueChange} />
    <button type="button" onClick={onClose}>ביטול</button>
    <button type="submit" disabled={!value.trim()}>שמור</button>
  </form>
)
```

## Reuse Before Rebuild

- **Search before writing a search input:** Before hand-rolling an input+icon (or any other) markup block, check whether the surrounding module already has a component for it. If two or more sibling files (tabs, panels, steps) render the same styled-component trio by hand, extract it into a light, single-purpose component instead of copy-pasting the JSX a third time.
- **Scope the component to where it's reused:** A markup block repeated across sibling tabs inside one modal belongs in that modal's `components/` folder — it does not need to go in `src/components/ui/` unless it's generic enough for other features to use. Don't invent a new abstraction layer just to make something "reusable"; extract at the smallest scope that kills the duplication.
- **Never shadow a `ui/` component's name:** If `src/components/ui/<Name>/` already exists, a differently-shaped, feature-local component must not reuse that name (e.g. a local `SearchBar` next to the global `ui/SearchBar`). Pick a name that describes its specific purpose (`PersonSearchField`, `ModalSearchInput`) so an import never has to be disambiguated by path alone.

## Pure State & Lifecycle Isolation

- **Syncing Without Side Effects:** Enforce an explicit ban on `useEffect` for state derivation, data fetching, or secondary state mutation cascades. Rely entirely on the React Compiler to automatically optimize and memoize inline derived computations.
- **Strict Effect Scoping:** Limit `useEffect` use cases to explicit DOM measurements, element focusing, browser event listeners (always returning cleanups), and tracking pixel fires on mounting.
