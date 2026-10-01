# Skill: Declaring Tables With `ColumnDef`

Use this skill whenever you render, extend, or review a `GridTable` or `SubTable`. Both tables are driven by **one array of column definitions**. You never write a grid-template string, a header row, or a cell list by hand.

---

## The Rule

A table is declared once, as `ColumnDef<T>[]`. The table derives everything else from it:

| Derived | From |
| --- | --- |
| `grid-template-columns` | each column's `width`, joined |
| the header row | each column's `header` + `align` |
| every body cell | each column's `cell(item, index)` |

**Never** pass a grid string, a `headers` array, or a `renderRow` to a table. Those props do not exist. If you find yourself wanting one, you are fighting the factory — re-read this file.

### Why it works this way

These used to be three parallel arrays that had to line up by position. They drifted: a column added to the grid string but not to the header list silently shifted every label one track to the left, and nothing — not the type-checker, not the linter, not a test — caught it. One array cannot disagree with itself.

---

## `ColumnDef<T>`

```ts
export interface ColumnDef<T> {
  key: string;                                  // identifies the column, not its position
  width: string;                                // a CSS grid track: '28px', '1fr', 'minmax(80px, 1fr)'
  header?: ReactNode;                           // omit for spacer columns
  align?: 'right' | 'center';                   // header, and text-only cells
  cell?: (item: T, index: number) => ReactNode; // omit to leave the column empty
}
```

### `key`

Names the column — `'idNumber'`, `'actions'`, `'select'`. Not an index, and not reused within one table. Spacer columns need one too.

### `width`

The grid track for this column. This is the **only** place a column's width is written.

### `header`

Omit it for gutters — checkbox columns, action buttons, the empty slot a sub-table leaves under its parent's chevron. A spacer column is still a column: it must appear in the array or every later column slides one track to the left.

### `align`

Applies to the header always, and to a cell **only when that cell returns a bare string or number**. A cell returning an element is placed in the grid untouched — it brings its own styling.

Default is `'center'`. In this RTL codebase the first text column is almost always `align: 'right'`.

### `cell`

Returns what goes in that column for one row.

- Return a **string or number** for plain text — the table wraps it in an aligned, ellipsis-truncating cell for you.
- Return an **element** when the cell needs its own styling, a test id, or a handler. It is rendered as-is.
- Return `null` to leave this row's cell empty while other rows fill it.
- Omit `cell` entirely for a permanent spacer.

---

## Row-level state: `row`

Cells cover content. Anything about the **row** — selection, click, expansion — goes through the optional `row` prop, which returns a `RowConfig`:

```ts
export interface RowConfig {
  isSelected?: boolean;
  isAdded?: boolean;
  onClick?: () => void;
  expansion?: ReactNode;   // rendered beneath the row when open
}
```

```tsx
const rowConfig = (group: MirageGroup): RowConfig => ({
  isSelected: selected.set.has(group.id),
  isAdded: addedGroupIds.has(group.id),
  onClick: handleRowClick(group.id, addedGroupIds.has(group.id)),
  expansion: expanded === group.id ? <ExpandedMemberBlock members={group.members} /> : null,
});
```

`SubTable` has no `row` prop — sub-rows are not selectable, clickable, or expandable.

---

## Where the column list lives

| Situation | Placement |
| --- | --- |
| Columns need no component state | `const COLUMNS: ColumnDef<T>[]` at **module scope** |
| Columns close over state or handlers | build them **inside the component** |
| The array runs past ~40 lines | move it to a sibling **`<Feature>.columns.tsx`** exporting a `xColumns(deps)` factory |

Building the array inline on every render is fine — the React Compiler memoizes it. Do **not** reach for `useMemo`.

A `.columns.tsx` file takes its dependencies as one typed `deps` object and returns the array. It may also export a small component for the row's expansion content (e.g. `DocDistribution`), since that belongs to the same table.

```tsx
interface DocColumnsDeps {
  selectedIds: Set<string>;
  expandedId: string | null;
  onToggleExpand: (id: string) => (event: MouseEvent) => void;
}

export const docColumns = ({ selectedIds, expandedId, onToggleExpand }: DocColumnsDeps): ColumnDef<DocItem>[] => [ ... ];
```

---

## One Grid, Two Row Shapes

When some rows look different — a group row vs. a person row — **branch inside each `cell`**, not by writing two row components.

```tsx
{
  key: 'idNumber',
  width: '80px',
  header: 'ת.ז.',
  cell: (member) => (member.isGroup ? null : <CellText $tabular>{member.idNumber}</CellText>),
}
```

Two row components have to be kept the same width by hand, and drift the moment a column is added. See `MembersPanel.columns.tsx`.

---

## Nested Sub-Tables Must Repeat The Parent's Tracks

A `SubTable` inside a row's `expansion` lines up with the table above it **only if it declares the same tracks**. If the parent has nine columns and the sub-table fills five, it still declares nine — the last four as spacers.

```tsx
const DISTRIBUTION_COLUMNS: ColumnDef<PersonMember>[] = [
  { key: 'spacer', width: '28px' },
  { key: 'name', width: '1fr', header: 'שם מלא', align: 'right', cell: (p) => <SubNameCell>{p.name}</SubNameCell> },
  { key: 'idNumber', width: '64px', header: 'תעודת זהות', cell: (p) => <SubCell $tabular>{p.idNumber}</SubCell> },
  { key: 'gap', width: '58px' },
  { key: 'organization', width: '58px', header: 'ארגון', cell: (p) => <SubCell>{p.environment}</SubCell> },
  { key: 'pad-date', width: '80px' },
  { key: 'pad-updated', width: '80px' },
  { key: 'pad-ref', width: '58px' },
  { key: 'pad-actions', width: '24px' },
];
```

Those trailing spacers are load-bearing. Drop them and the grid narrows and the alignment goes. See `DocTab.columns.tsx`.

---

## Full Example

```tsx
import type { ColumnDef } from '@/components/ui/GridTable';
import { SubTable } from '@/components/ui/SubTable';

const COLUMNS: ColumnDef<PersonMember>[] = [
  { key: 'spacer', width: '28px' },
  {
    key: 'name',
    width: '1fr',
    header: 'שם מלא',
    align: 'right',
    cell: (member) => <MemberNameCell>{member.name}</MemberNameCell>,
  },
  {
    key: 'idNumber',
    width: '64px',
    header: 'תעודת זהות',
    cell: (member) => <MemberCell $tabular>{member.idNumber}</MemberCell>,
  },
  { key: 'organization', width: '80px', header: 'ארגון', cell: (member) => member.environment },
];

const rowKey = (member: PersonMember, index: number) => member.idNumber || index;

export const ExpandedMemberBlock = ({ members }: { members: PersonMember[] }) => (
  <MemberExpandedBlock>
    <SubTable columns={COLUMNS} items={members} getRowKey={rowKey} />
  </MemberExpandedBlock>
);
```

Note the last column: `cell` returns a bare string, so the table wraps and centres it. The others return styled elements and are left alone.

---

## Table Props

```ts
// GridTable
columns: ColumnDef<T>[]
items: T[]
getRowKey: (item: T, index: number) => string | number
row?: (item: T, index: number) => RowConfig
density?: 'compact' | 'comfortable'   // default 'compact'
estimateRowHeight?: number            // defaults to the density's
emptyState?: ReactNode

// SubTable — no `row`, no `emptyState`
columns, items, getRowKey
estimateRowHeight?: number   // default 32
maxHeight?: number           // default 240
```

`getRowKey` stays explicit — it feeds the virtualiser, and only the call site knows whether identity is `id`, `idNumber`, or a fallback to the index.

## Density

Two scales, and only two. `compact` is the people-picker's: 10px header, tight rows, square corners, `gray[200]` bar. `comfortable` is the catalog's and the import-document modal's: 12px header on `tableColors.headerBar`, 12px/16px rows, rounded hover, inset from the card edge.

Every metric lives in `GridTable.constants.ts`'s `DENSITY` map. A table picks one and gets all of them — **do not override individual metrics at a call site**, and do not add a third density to accommodate one screen. If a new table wants a scale neither of these gives, that is a design question, not a prop.

The two are not interchangeable looks: `comfortable` exists because main draws the catalog table (`Catalog.tsx:1980-2090`) and the import table (`Edit.tsx:1908-1940`) identically, and they must stay identical.

**A cell needs a `font-size` only to differ from the row's.** `rowFontSize` (14px in both densities) is set on the row, so a cell that says nothing lands there. Reach for a size only for a column that is deliberately quieter — the 12px meta columns, the 11px sub-table cells — never to restate 14px. Before `rowFontSize` existed the rows inherited the document's 16px, so a table looked right only where every column happened to remember; `ClassifiedViewersModal`'s name column is the one that forgot, and it rendered names half again as large as the search box above them.

---

## 🚫 Guardrails

- **Never hand-write a grid-template string for a table.** Widths live on columns. A `const X_GRID = '28px 1fr …'` next to a table is the old shape — delete it.
- **Never skip a spacer column** to "save a line". Positions are the contract.
- **Never wrap `columns` in `useMemo`.** The compiler handles it.
- **Never add a `renderRow` escape hatch.** Every table in this codebase, including the branching ones, is expressible as columns. If a new one seems not to be, that is worth a conversation before an escape hatch.
- **Don't put a `.analytics.ts` next to a `.columns.tsx`.** Columns are presentation; tracking belongs to the feature component that owns the table.
