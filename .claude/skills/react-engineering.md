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
- **No Monolith Pages — Logic Lives Where It's Used:** A page/route component's job is data-fetching, tab/route switching, and layout — not owning every feature's state and handlers. If a piece of state (a modal's open/close flag, a "new/edit/duplicate" flow, a toggle) only matters to one child section, that state and its handlers belong **inside that child**, not lifted to the page just because the page happens to be the common ancestor. Pass the child only the raw data/entities it needs (e.g. `templates`, `departmentOptions`) — never a pre-built `onNew`/`onEdit` callback that just forwards into page-level state the child could have owned itself.
  - **Smell to catch:** a page component with a wall of `handleXNew`/`handleXEdit`/`handleXDuplicate` handlers and a matching wall of `{xModal.mode && <XModal ... />}` blocks, one trio per child section. That's the state and the render for section X living in the page instead of in `XSection`/`XPanel` — see `.claude/skills/modal-placement.md` for the modal-specific case of this rule, and the `TemplatesPanel`/`SignaturesPanel`/`ListsPanel` vs. `ProfilePage` split in `src/pages/profile/` for the corrected shape.
  - **Test:** if you deleted the child component's file, every handler and every piece of state it needed should disappear with it. If a chunk of the page's state has no reason to exist once that one child is gone, it was misplaced.
- **One Component Per File — Never Group Multiple Field/Subcomponents Into One File.** Even when several small `memo()`-wrapped components are tightly related (e.g. a form's individual field components) and each is tiny (10-30 lines), do not define them all inside one file like `XFormFields.tsx`. Each gets its own `ComponentName/ComponentName.tsx` + `index.ts` directory per the standard topology (`.claude/skills/system-assembly.md`), even if it has no exclusive styles of its own (shared styles stay in the parent's `.styles.ts`, imported by each field directory). The parent file (e.g. `XFormFields.tsx`) becomes a thin composition-only component that imports and arranges the extracted fields — it owns no field markup itself.
  - **Why this matters beyond line count:** a grouped-fields file makes it look like there's one component to review/test/reuse when there are actually N — each field should be independently importable, testable, and diffable without touching its siblings.
  - **Precedent:** `src/modals/EnvironmentRequestModal/components/EnvironmentRequestFormFields/` was originally one 267-line file defining 8 field components inline; split into `BodyTypeField/`, `NameField/`, `LogoField/`, `CreatorsField/`, `ApproversField/`, `DistributorsField/`, `PhoneFields/`, `TemplatesAndDepartmentsFields/` — each its own directory — with `EnvironmentRequestFormFields.tsx` reduced to a 65-line composition shell. Mirrors the existing sibling `ApproversByRankField/`.
- **Shrink Prop Lists — Pass Hook Objects Whole, Pre-Curry at the Point Where IDs Are Already Known.** A component that just forwards most of its props to children (an intermediate "body"/"section" layer) is a sign the props were exploded too early. Two concrete techniques, both aimed at the same thing — a prop only exists where it's actually consumed, not threaded through a layer that doesn't use it:
  - **Bundle a hook's return value into one prop instead of destructuring it into N props at the call site.** If a parent calls `useAppendices()`/`useFieldBank()`/`usePermissionsTarget()`-style hooks and then explodes the result into individual callback props for an intermediate component that just forwards them unchanged to grandchildren, pass the whole hook-return object as one prop instead (typed `ReturnType<typeof useAppendices>`, etc.) and let the intermediate component destructure only the fields it directly consumes. If a cohesive piece of local `useState` (e.g. an emphasis-text toggle) is also being exploded this way, promote it to its own hook first (see `useEmphasis.ts` next to `useAppendices.ts`) so it can be bundled the same way as everything else.
  - **When a list item component receives curried handlers `(parentId, childId) => (e) => void` just to re-curry them itself with props it already has (`parentId`), push that currying up to the loop that already knows `parentId` at render time**, so the child receives an already-bound `(e) => void` (or, for a nested loop one level down, a handler pre-bound down to just the innermost id). This usually also lets you drop the now-redundant id prop entirely.
  - **Precedent:** `TemplateModal.tsx` → `TemplateModalBody.tsx` had 25 props, almost all pure passthrough to `SubjectTree`/`AppendixList`/`DocumentPreview`/`FieldBank`; collapsed to 9 by passing `permissions`/`appendicesState`/`fieldBank`/`emphasis` as whole hook-result objects (new `useEmphasis.ts` hook extracted to make the last one bundleable) and keeping only the props `TemplateModalBody` truly owns (the tracking callbacks, per the "child stays dumb" rule in `.claude/skills/analytics-component.md`). Separately, `SubjectTree.tsx` → `SectionRow.tsx` dropped the `subjectId` prop and simplified 7 handler prop types from double/triple-curried factories to plain callbacks by having `SubjectTree` pre-bind `subject.id` (and, for section-level handlers, `section.id` too) at its own `.map()` call site instead of passing raw curry factories for `SectionRow` to re-curry.
  - **Don't over-apply this to generic `ui/` primitives.** A primitive like `Modal` or `FileUploadField` genuinely needs many independent configuration props — that's a wide but flat API surface, not passthrough drilling. Only collapse props that are (a) sourced from one cohesive hook/state object and (b) forwarded through a component that doesn't meaningfully branch on most of them individually.
  - **Same technique applies to plain local state, not just extracted hooks.** `DateTimePicker.tsx` → `CalendarPanel.tsx` had 18 props built from ad-hoc `useState` calls (no shared hook involved) — grouped by concern into `calendarNav`/`timeInputs`/`actions` objects built right before the JSX call, dropping to 5 props without extracting new hook files (the state wasn't reused anywhere else, so a hook would've been ceremony with no second consumer).
  - **When 3+ sibling components repeat the same "destructure a shared hook, then manually rename fields to match a shared shell's prop names" dance, bundle at the call site instead of fixing it once per sibling.** `ListsPanel`/`SignaturesPanel`/`TemplatesPanel` each called `useFilterableList()` and then spread 6 of its fields into individually-renamed `TabPanelShell` props (`search={search}`, `onSearchChange={handleSearchChange}`, …) — the exact same 6-prop shape, duplicated three times. `TabPanelShell` now takes one `filterable={{ search, onSearchChange, filterOptions, filter, onFilterChange, onClearFilter }}` prop (16 props → 11), and each panel builds that one object inline instead of every panel repeating the same renames.

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
