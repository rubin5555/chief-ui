# Design parity: `main`'s `Catalog.tsx` → `src/pages/catalog/`

Same contract as the document page's [`DESIGN_PARITY.md`](../document/DESIGN_PARITY.md), and
the same reason for it: `main`'s `src/app/pages/Catalog.tsx` (2,395 lines) and
`src/app/components/RightSidebar.tsx` (597 lines) style everything with Tailwind
classes and inline `style={{}}` literals; this page uses styled-components and
theme tokens, because `.claude/skills/styling-tokens.md` bans raw hex anywhere a
styled-component could take a token.

## Rule

> Reuse an existing token when its light-mode value is byte-identical to main's
> literal **and the role matches**. Add a new token when the value is new, or
> when the value collides with a token whose dark-mode behaviour should differ.
> Never round a colour to a nearby token.

`Catalog.tsx` uses **44 distinct hex values**. 26 matched an existing token
exactly. The remaining 18 became new `--cat-*` custom properties, plus four
role-splits where an existing token's light value collided but its dark
behaviour shouldn't be shared.

## Exact matches — reuse the base token

| main's hex | Token | Where |
| --- | --- | --- |
| `#1B3A6B` | `colors.primary` | selected tiles, receipt links, primary buttons |
| `#EEF4FF` | `colors.primaryLight` | re-share pill, selected sidebar row |
| `#ffffff` | `colors.surface` | the table card, every modal |
| `#d97706` | `colors.warning` | `נצורה` pill ink |
| `#f9fafb` | `gray[50]` | row hover |
| `#f3f4f6` | `gray[100]` | `טיוטה פנימית` pill background |
| `#e5e7eb` | `gray[200]` | divider rules |
| `#d1d5db` | `gray[300]` | disabled controls |
| `#9ca3af` | `gray[400]` | inactive tab labels, `מס׳ סימוכין` |
| `#6b7280` | `gray[500]` | table header ink, meta cells |
| `#374151` | `gray[700]` | form labels |
| `#1f2937` | `gray[800]` | document-name cells |
| `#111827` | `gray[900]` | active tab label and its underline |
| `#EBEBEB` | `tableColors.headerBar` | table header strip |
| `#f5f5f5` | `tableColors.rowDivider` | row separator |
| `#16a34a` | `docStatusColors.approved` | `מבצעית` pill ink |
| `#dc2626` | `docStatusColors.fix` | `נדחתה` pill ink, urgent expiry countdown |
| `#0284c7` | `docStatusColors.importPreparing` | `בהכנה` pill ink |

## New tokens — no base token matched

| main's hex | Token | Role |
| --- | --- | --- |
| `#c4c8ce` | `catColors.outlineBorder` | outline button on a transparent fill |
| `#c7d9ff` | `catColors.primarySoftBorder` | border on a `primaryLight` pill |
| `#f0f4ff` | `catColors.selectedTileBg` | selected tile in the hierarchy picker |
| `#fca5a5` | `catColors.invalidBorder` | duplicate-name validation border |
| `#ef4444` | `catColors.dangerSoft` | trash countdown, delete menu items, clear-all hover — Tailwind's red-500, softer than `colors.danger` (#c4342b) |
| `#fef2f2` | `catColors.dangerSoftBg` | hover fill behind those |
| `#f0f4f8` | `catColors.childRowBg` | expanded child-document block |
| `rgba(255,255,255,.6)` / `.7` | `catColors.hoverVeil` / `hoverVeilStrong` | sidebar row hovers — translucent because what shows through is the page gradient |
| `rgba(239,246,255,.5)` | `catColors.dashedHoverBg` | the new-folder dashed button's hover |
| the 6-stop ramp | `catColors.canvasGradient` | the page background. One stop shorter than the document's, which holds flat from 85%. |
| `#e0f2fe` | `--cat-status-preparing-bg` | `בהכנה` |
| `#f3e8ff` / `#7c3aed` | `--cat-status-in-approval-bg` / `-ink` | `בסבב אישורים` |
| `#fee2e2` | `--cat-status-rejected-bg` | `נדחתה` |
| `#fce7f3` / `#db2777` | `--cat-status-superseded-bg` / `-ink` | `נדרסה` |
| `#fefce8` / `#ca8a04` | `--cat-status-awaiting-bg` / `-ink` | `ממתין להפצה` |
| `#dcfce7` | `--cat-status-active-bg` | `מבצעית` |
| `#f0fdf4` / `#15803d` | `--cat-status-finished-bg` / `-ink` | `הסתיימה` |
| `#64748b` | `--cat-status-cancelled-ink` | `התבטלה` |

## Role splits — value collides, dark behaviour shouldn't

Four literals are byte-identical to a token that already exists, but reusing it
would tie two unrelated things together the first time either is retuned.

| main's hex | Collides with | New token | Why they part |
| --- | --- | --- | --- |
| `#fef3c7` | `docColors.amberHover` | `--cat-status-frozen-bg` | A status pill and a hover state have no reason to darken together. |
| `#f1f5f9` | `docColors.hairline` | `--cat-status-cancelled-bg` | `hairline` is a border; this is a fill. |
| `#cbd5e1` | `docColors.pageBreakLine` | `catColors.childRowAccent` | The dashed A4 rule and a child-block accent bar are unrelated. |
| `#e2e8f0` | `docColors.chatArrowBorder` | `catColors.childRowDivider` | Same. |

## Status pills

The ten pills are one family (`catStatusColors` in `src/styles/theme.ts`), keyed
by the Hebrew status the API returns, each a `{ bg, ink }` pair. Four inks reuse
a `docStatusColors` token because a document status is genuinely the same role in
both places; every background, and the other six inks, are the catalog's own. A
status the API returns that isn't in the map falls back to `gray[500]` ink on no
fill — same as main's `STATUS_STYLE[status]?.color ?? '#6b7280'`.

## Deliberate divergences

Recorded here rather than fixed silently. Each was a decision, not an oversight.

| main | here | why |
| --- | --- | --- |
| Catalog header `px-8 text-sm`, import header `px-6 text-xs` | both `12px 24px` at 12px | The two tables are one component now (`GridTable` at `density="comfortable"`). They were the same table drawn twice with two paddings; one of the two had to win. |
| `וידוא קבלה` and `נוספו משתמשים` read from hard-coded arrays indexed by the row's position in the mock list | `receiptStatus` / `hasNewViewers` fields on the document | In main the values follow the row slot, so filtering or sorting reassigns them to different documents. |
| Modal chrome hand-rolled as `fixed inset-0 z-[99999]` | `ui/Modal` | Brings the focus trap, Escape-to-close and overlay click that main's cards never had. |
| Tabs, search, filters and page in `useState` | route search params | Per `.claude/skills/router-state-splitting.md` — the view becomes bookmarkable and survives refresh. |
| `CatalogDocModal` for drafts, `EditDocDetailsModal` for the other shelves | `EditDocDetailsModal` everywhere | Same fields; the shared one already carries all four modes and has the focus trap. |
| Filter chip bordered `#c7d9ff` | `ui/FilterChip`'s computed tint | The app has one filter chip. A second one differing by a border tint is not worth the duplication. |
| Distribution tab narrows its column gap to `0.6rem` | 16px on every shelf | `GridTable`'s density owns the gap, and a per-call override is exactly the escape hatch `.claude/skills/table-columns.md` rules out. |
| Two `useEffect`s reset the page and clear filters | neither exists | The page is clamped to the last page on the way out, and a shelf change writes the reset into the URL. |
| Filter funnel, new-document dropdown and row menu positioned `absolute`/`fixed` in the flow, hairline `border-gray-100` | portalled `ui/FloatingPanel`, hairline `colors.border` | The catalog body hides its overflow, so an in-flow panel is cut off at the page's bottom edge — and main's row menu flips on a `bottom > 55vh` guess that ignores how tall the menu actually is. All three now measure themselves and fit to the viewport. The hairline is the app's one semantic border token; the two shades differ by `#e5e5e5` vs `#f3f4f6`. |

## Status of the port

Every screen and dialog main draws is ported. The route and its search-param
schema, the department/folder sidebar with folder CRUD, the four shelves,
search, the filter funnel and its chip row, the distribution sub-tabs, the
pager, expandable child documents, the row menu with its three inline-progress
actions, the new-document flow, and the recycle bin.

Row actions resolve through `documentCatalog.rowActions.ts` to: doc details
(four modes), permissions, the approval round, delete, cancel + its progress
toast, version history, read receipts, share, and the document hierarchy.
`שייך לתיקייה` returns `null` — it is drawn in three of main's menus and opens
nothing there either.

### The new-document form is `EditDocDetailsModal`

main's `NewDocModal` (`Catalog.tsx:1440-1634`) and the document navbar's
doc-details dialog are the same form. Eleven of its fourteen fields were
already there, on TanStack Form and `ui/Modal`; rather than port a second copy,
`EditDocDetailsModal` gained a `new` mode:

- The five facts across the top — classification, template, organisation, order
  number, update number — become editable (`DocIdentityFields`) instead of
  read-only (`DocFactsGrid`). Nothing has been decided about a document that
  doesn't exist yet.
- A classification tag appears beside the level, for the two levels that carry
  one, and clears when the level changes.
- Display name and summary appear, because they are collected once at creation
  and never shown again. They are optional on `DocumentHeader` for that reason —
  the document page neither sets nor reads them.

`שכפול מסמך קיים` opens `DuplicateSearchModal` over the distributed and archive
shelves, then seeds the same form with five fields from what was picked. The
reference number and the dates deliberately don't carry across: a copy is a new
document.

## Residual coupling

Four modals moved to `src/modals/` because the catalog opens them too. Six
imports still point back at the document page — five types (`DocumentHeader`,
`PdfAccess`, `Subject`) and one status set (`LIMITED_EDIT_STATUSES`). Lifting
those out of `src/pages/document/` is a 32-file change and belongs to its own
commit. None of them couple at runtime: types are erased, and
`LIMITED_EDIT_STATUSES` is a `Set` of strings.

The one coupling that did bite was `DocPermissionsModal` reading its document
from `getRouteApi('/document/$id').useParams()`. `/catalog` never matches that
route, so opening the dialog from a row menu rendered nothing. The document is
a prop now: `DocPermissionsProvider` takes a `docId` for a page that holds one
document, and `openDocPermissions({ docId })` names it per row for a page that
holds many. No file under `src/modals/` reads the router any more — which is
what makes them shared rather than merely relocated.
