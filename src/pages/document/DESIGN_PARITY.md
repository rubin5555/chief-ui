# Design parity: `main`'s `Edit.tsx` → `src/pages/document/`

This page must be **visually identical** to the design prototype on the `main`
branch (`src/app/pages/Edit.tsx`, 5331 lines). That file styles everything with
Tailwind classes and inline `style={{}}` literals; this one uses
styled-components and theme tokens, because `.claude/skills/styling-tokens.md`
bans raw hex anywhere a styled-component could take a token instead.

Those two facts collide: **a token whose value merely *resembles* main's hex
changes the design.** This file records how each colour was resolved, so a
reviewer can check a mapping without re-reading `Edit.tsx`.

## Rule

> Reuse an existing token **only** when its light-mode value is byte-identical
> to main's literal. Otherwise add a new token with main's exact value.
> Never round a colour to a nearby token.

`Edit.tsx` uses **68 distinct hex values**. 15 matched an existing token exactly;
the rest became new `--doc-*` custom properties (`src/styles/theme.css`, exposed
as `docColors`/`docStatusColors` in `src/styles/theme.ts`).

## Exact matches — reuse the base token

| main's hex | Uses | Token |
| --- | --- | --- |
| `#1B3A6B` | 156 | `colors.primary` |
| `#e5e7eb` | 37 | `gray[200]` |
| `#374151` | 37 | `gray[700]` |
| `#9ca3af` | 25 | `gray[400]` |
| `#6b7280` | 15 | `gray[500]` |
| `#d1d5db` | 12 | `gray[300]` |
| `#ffffff` | 7 | `colors.surface` |
| `#f9fafb` | 6 | `gray[50]` |
| `#EEF4FF` | 5 | `colors.primaryLight` |
| `#f3f4f6` / `#F3F4F6` | 5 | `gray[100]` |
| `#d97706` | 4 | `colors.warning` |
| `#fffbeb` | 2 | `colors.warningLight` |
| `#111827` | 2 | `gray[900]` |
| `#1f2937` | 1 | `gray[800]` |
| `#E5E5E5` | 1 | `colors.border` |

## New tokens — no base token matched

Named for their **role**, not their colour, so the dark-mode value can differ in
kind rather than just in lightness.

| main's hex | Uses | Token | Role in `Edit.tsx` |
| --- | --- | --- | --- |
| `#16a34a` | 10 | `docStatusColors.approved` | approved status: outline dots, filter chip, approval timeline, distribute-complete bar, `הופץ` import dot. **`colors.accent` is `#2d9b8a` — a teal, not this green.** |
| `#dc2626` | 7 | `docStatusColors.fix` | needs-fix status + `חובה לשנות שם` validation + HML badge. **`colors.danger` is `#c4342b`.** |
| `#94a3b8` | 3 | `docStatusColors.idle` | `טיוטה פנימית` / `טיוטה`, and the import-status dot fallback |
| `#f59e0b` | 2 | `docStatusColors.preparing` | `בהכנה` document status |
| `#3b82f6` | 2 | `docStatusColors.inApproval` | `בסבב אישורים` document status |
| `#10b981` | 1 | `docStatusColors.awaitingDistribution` | `ממתין להפצה` document status |
| `#0284c7` | 1 | `docStatusColors.importPreparing` | `בהכנה` dot in the import-doc list |
| `#EBEBEB` | 3 | `docColors.neutralBar` | metadata pill, import-table header row, status tooltip |
| `#92400E` / `#92400e` | 4 | `docColors.amberInk` | source-systems notice text + `דגשים לכתיבה` title |
| `#b45309` | 1 | `docColors.amberIcon` | the emphasis block's `Lightbulb` |
| `#fcd34d` | 1 | `docColors.amberBorder` | the emphasis card's border |
| `#DBEAFE` | 1 | `docColors.compareBg` | comparison bar background |
| `#93C5FD` / `#93c5fd` | 6 | `docColors.compareBorder` | comparison bar pill borders + dividers |
| `#cbd5e1` | 2 | `docColors.pageBreakLine` | the dashed A4 page-break rule |
| `#f1f5f9` | 8 | `docColors.hairline` | content-box borders + toolbar group dividers |
| `#f8fafc` / `#F8FAFC` | 3 | `docColors.surfaceSubtle` | chat panel + preview backgrounds |
| `#f8fafc` | — | `docColors.inkInverse` | tooltip *text*, sitting on `docColors.ink`. Same light value as `surfaceSubtle`, **opposite dark behaviour** — a panel background darkens, text on a dark chip lightens. This is why the tokens are role-named. |
| `#1e293b` | 5 | `docColors.ink` | section-title ink + the tooltip's own background |
| `#c4c9d4` | 2 | `docColors.placeholderInk` | placeholder text on untitled sections |
| `#152e54` | 4 | `docColors.primaryHover` | hover state for `colors.primary` buttons/links |
| `#c7d7f5` | 1 | `docColors.primaryLightBorder` | signature button border on a `primaryLight` fill |
| `#fbbf24` | 2 | `docColors.searchHit` | the in-document search `outline` |
| `#9B1C1C` | 3 | `docColors.warningStrong` | `נדרש לחתום על מסמך זה` text + the required-signature textarea border |
| `#1a1a1a` | 4 | `docColors.stampInk` | handwritten-signature SVG strokes |
| `#93afd4` | 1 | `docColors.chatOwnAccent` | own-message chat bubble accent |
| `#e2e8f0` | 1 | `docColors.chatArrowBorder` | chat bubble arrow border |
| `#fafafa` | 1 | `docColors.letterheadBg` | the in-paper letterhead block |
| `#f5f5f5` | 1 | `docColors.rowDivider` | import-table row separator |
| `#eff6ff` | 1 | `docColors.cellActiveBg` | active table cell (`parity/` only) |
| `bg-amber-400` = `#fbbf24` | 1 | `docColors.progressAmber` | the sidebar's "in preparation" progress fill. Same light value as `searchHit`, separate token — a filled bar and a text outline needn't stay the same amber in dark mode. |
| `hover:bg-white/70` | 2 | `docColors.translucentHover` | hover fill on the sidebar's bordered buttons. Translucent because what shows through is the page gradient. |
| `hover:bg-gray-200/70` | 3 | `docColors.iconHover` | hover behind the outline tree's small round icon buttons — `gray[200]` at 70%, which lands lighter than `gray[100]`. |
| `hover:bg-amber-100` = `#fef3c7` | 4 | `docColors.amberHover` | the same icon-button hover, for buttons sitting on the amber emphasis card where a grey wash would read as a hole in the tint. |
| `#F6F9FC → #F9F3ED`, 7 stops | 1 | `docColors.canvasGradient` | the page's `linear-gradient(135deg, …)` behind the paper, as one property |

## Deliberately **not** tokens: the two colour palettes

`TEXT_COLORS` (`Edit.tsx:749-753`) and `HIGHLIGHT_COLORS` (`755-759`) are
twelve-swatch grids the user *picks from* — `#000000`, `#f97316`, `#7c3aed`,
`#db2777`, `#fde047`, `#86efac`, `#fdba74`, `#f9a8d4`, `#c4b5fd`, `#6ee7b7`,
`#fca5a5`, `#fef08a`, `#bfdbfe`, and so on.

These stay **literal hex** in a `.constants.ts`, and they are the one place in
this feature where that is correct:

- They are **content, not chrome.** Someone who picks red text wants red text.
  Routing them through a theme token would silently recolour a user's choice
  when the OS switches to dark mode — the opposite of what a colour picker means.
- `styling-tokens.md` bans raw literals "anywhere a styled-component could
  instead take `colors`/`gray`". A palette array consumed as *data* is not a
  styled-component, so it is already compliant.

Both palettes belong to `DocToolbar`, which lives in `parity/` rather than the
live page (see `parity/README.md`).

## Geometry

Colours are only half of parity. `document.measurements.ts` holds the layout
facts — `210mm` paper, `297mm` page height, `230mm` chrome bars, the `256px`
sidebar that doubles as those bars' offset, the paper shadow, the zoom bounds.
That file is deliberately separate from `theme.ts`: these values are
theme-independent, so they must not sit next to things dark mode overrides.

## Two palettes that look like one

main keeps **two** status colour maps and they disagree. Confusing them is easy
and visible, so they are separate constants in `document.constants.ts`:

| status | section (`SECTION_STATUS_COLOR`, Edit.tsx:1708) | document (`DOC_STATUS_COLOR`, Edit.tsx:1699) |
| --- | --- | --- |
| working | `editing` → `#1B3A6B` navy | `בהכנה` → `#f59e0b` amber |
| in review | `pending` → `#d97706` amber | `בסבב אישורים` → `#3b82f6` bright blue |
| none/idle | `idle` → `#9ca3af` grey | `טיוטה פנימית` → `#94a3b8` slate |

A document status outside `STATUS_FLOW` (`מבצעית` and the other terminal states)
falls through to grey — `DOC_STATUS_FALLBACK_COLOR`, main's `?? '#6b7280'`.

There is a **third**, coarser mapping: the per-section status *label* in a
heading row (Edit.tsx:4452) collapses everything that isn't `approved`/`fix` to
amber `#d97706`, `idle` included — so a section can show a grey dot in the
sidebar and an amber `ממתין לאישור` in the paper. That one is local to
`SectionStatusLabel`, deliberately not shared.

## Structure, not just colour

Phase 2 rebuilt the page skeleton to main's. The pieces that are easy to
"tidy up" and must not be:

- **The chrome bars' `padding-inline-end: 256px`** (`BarRow`). The bars span the
  viewport but the paper is pushed left by the sidebar; without the offset every
  bar sits ~128px off-centre. Looks like a hack, is load-bearing.
- **`zoom`, not `transform: scale`**, on the paper. `zoom` reflows, so the scroll
  container's height tracks the scaled sheet.
- **Section numbering is continuous across topics** (`1.`, `2.`, `3.`…), not
  `1.1`/`1.2` — main's `secCounter`. Sub-sections use Hebrew letters (`א.`).
- **In-paper titles are `<input>`s, not headings.** Clicking a title retitles the
  node. Only the *section* level shrink-wraps its hover highlight to the text
  (main's ghost-span trick); subject and sub-section titles fill the row.
- **The metadata pill is inert** — no edit pencil. Document details are edited
  from the navbar's document-actions toolbar.
- **The document's action icons live in the navbar's *leading* group**, right
  after the reality-mode pill — not in a centre slot. main's navbar is a plain
  `justify-between` with two groups and no middle one at all
  (`TopNavbar.tsx:1216`), so centring the toolbar would put it somewhere main
  never puts it. `NavToolbarSlotContext` portals it into the leading group.
- **`חתימות` is a topic drawn by its own component.** main special-cases it on
  the title (`Edit.tsx:4303`) and so does this: the topic holds signature blocks
  rather than sections, and its heading row carries `התבניות שלי` and
  `הוספת חתימה נוספת` where other topics carry nothing. Renaming the topic turns
  it back into an ordinary one — main's behaviour too, since the title is all
  either has to go on.
- **Text signatures above, approver stamps below** (main's commit `a88946f`), and
  the red required-border goes on the textarea with no box around the section
  (`c39c266`).
- **Only *section* rows carry a status dot in the outline.** Topic rows have a
  chevron and a title; sub-section rows have a Hebrew letter and a title. main
  puts the dot on the middle level alone (`Edit.tsx:3990`), and hides it entirely
  once the document has been distributed.
- **The sidebar has no text buttons.** Importing and restoring are reached from
  the two round navy buttons at the foot of the column (`Edit.tsx:4082`) — the
  `+` opens a four-item menu, one of which is the importer.
- **The status flow is a stepper, not a jump.** The seed document is `טיוטה`,
  which isn't a step in `STATUS_FLOW` at all, so its one button reads
  `העבר לטיוטה פנימית` and there is nothing to go back to. Reaching the approval
  round takes three presses. main behaves the same way, by way of `indexOf`
  returning `-1`.
- **The in-document search draws an outline, not a highlight.** A matching topic
  gets `2px solid` amber at a 4px offset, a matching section the same at 2px —
  `outline`, so a hit never reflows the page under it. main styles exactly this
  (`Edit.tsx:4218`), but its own `docSearchQuery` is declared and never set, so
  the outline has never appeared there. What reaches it here is the navbar's
  search field, by way of `?q=`.
- **Attachments are chips, not pills.** main lists them one per line under the
  content box as small navy text links (`Edit.tsx:4586`); every one of them opens
  the same dialog rather than acting on its own file.
- **The paperclip turns navy once a node has files.** It doubles as the
  indicator that something is attached, which is why it isn't always grey.
- **The letterhead's two seeded fields are main's literal values** —
  `2026(06)221047` and `123456789098`. They look like data and are not: main
  hardcodes them in `useState`, and so does this.
- **The filter panel commits on `סנן`**, not on each tick. main stages the
  selection locally and only writes it when you press the button
  (`Edit.tsx:2518`) — so four boxes re-render the document once, and `נקה` clears
  the staging area rather than the applied filter.

## Known deltas

Things that are *not* pixel-faithful, all deliberate, all cheap to change if
you'd rather they weren't:

- **The sidebar's progress bars show real numbers.** main hardcodes `0/3 סעיפים
  בהכנה` and `2/5 סעיפים אושרו` — two fractions that don't even share a
  denominator — so the bars here count the document's own sections instead. The
  bars look identical; the numbers differ from main's, and the second fill lands
  at the same 40% by coincidence.
- **The `+` menu opens 2px lower than main's.** main hand-computes
  `bottom: innerHeight - rect.top + 8`; `useFloatingPanel` flips the panel upward
  on its own with a 6px gap, and brings the viewport clamp with it.
- **The emphasis card has no chat button.** main draws one there with no
  `onClick` behind it (`Edit.tsx:4187`); the card isn't a section, so there is no
  thread for it to open. Its attach button is live.
- **The distribute toast counts real recipients.** main says
  `הופץ לכ- 156 משתמשים` from a hardcoded 156; this counts the people actually
  picked in the share dialog. It has no close button until it finishes — there is
  nothing to do with a half-distributed document, and dismissing the only sign
  that it is happening would leave nothing to come back to.
- **A comparison is a version, not a flag.** main keeps `comparisonMode` and
  `comparisonVersionLabel` as separate state; the route carries only
  `compareVersion`, because two params for one fact can disagree —
  `compare=true` with no version, or the reverse. Picking a version opens the bar;
  clearing it closes it.
- **The version picker is reached from the bar's own button.** main opens it from a
  navbar control this page doesn't have, so the button that stood in for the bar
  now opens the picker instead of toggling a comparison against nothing.
- **The approval-mode review step saves what you edit.** main shows the document's
  details on the way into a round, warns that "these changes apply to this version
  only", and then discards them — `onContinue` never writes (`Edit.tsx:4920`).
  Here the edit is saved, which is what makes that warning true.
- **Footnotes are added from the section menu.** main dispatches a global
  `insert-footnote` event from its Word-style ribbon, which lives in `parity/`
  and isn't wired to anything. The rendered footnotes are main's exactly; only
  the way you ask for one differs.
- **A leaf topic has no content box.** main gives a topic with no sections a body
  of its own (`Edit.tsx:4302`), which the tree model here can't hold — `Subject`
  has no `content` field, and adding one touches the hook `TemplateModal` shares.
  Visible on `נספחים`, which renders as a heading alone. `חתימות` is unaffected:
  it is drawn by `SignaturesSection`, which holds its own content.
- **The per-node refresh button opens the source list.** main's has no `onClick`
  at all; there is nothing connected to refresh from, in main or here, so it
  shows which system the node's content came from instead of pretending to
  re-fetch it.

- **`NavStart`'s gap is 12px; main's is 16px.** It sits between "Chief" and the
  reality-mode pill on every page, and it predates this migration. Widening it
  also shifts the document toolbar 4px and invalidates
  `e2e/components/layout/TopNavbar.spec.ts`'s screenshot baseline, so it's left
  alone rather than churned as a side effect of a document-page phase.
- **A section's permissions open the document dialog, not an editor of their own.**
  מאשרי הסעיף and עורכי הסעיף on a section's 3-dots menu open `DocPermissionsModal`
  on the matching permission with that section preselected — main's `permTrigger`
  (`TopNavbar.tsx:1093`). An earlier phase kept an inline per-section picker
  instead, on the reasoning that per-section permissions are per-section data;
  that was wrong in one way that matters: these two permissions are *granted* per
  section but *held* document-wide, so an inline editor could only ever show the
  slice of them belonging to one section, and there was no way to see who held a
  permission across the document. The inline view and the tree's per-node
  `permissions` writes are gone with it.
- **A comment thread quotes its real author.** main's quote card is labelled
  `את/ה` or a hardcoded `שרי` (`Edit.tsx:453`); the comment carries an
  `authorName`, so the card says who was actually quoted. The bubble is otherwise
  main's: pinned to the page's left margin, tail pointing at the section, hidden
  while its section is scrolled out of view. It is the one popover on this page
  that is not on `useFloatingPanel` — it stays open through clicks in the paper,
  because marking a passage to quote *is* a click in the paper.
- **The restore dialog previews real content.** It is main's two-column browser
  (`Edit.tsx:171`) — deleted sections down a 260px list, their text beside it,
  the confirm button under the list naming what it will do. main's preview reads
  from a `DELETED_SECTIONS` fixture; this reads the section snapshot the delete
  actually took, so what you see is what comes back. Sub-sections are listed but
  not separately selectable: they were deleted with their section and return with
  it, where main lets you tick a child on its own with nothing behind it.
- **No in-app link to a document.** main opens one from its catalog page, which
  dev doesn't have; inventing a navbar link would put an element on *every* page
  that main has nowhere. The brand is a real link home, and the document is
  reached at `/document/d1`.
- **The Excel import source has a second half main doesn't.** main's chip and its
  example spreadsheet are reproduced exactly (`TopNavbar.tsx:471`, `761`), but
  main's `onChange` is empty: a file is chosen and nothing happens at all. Here
  the sheet is read **in the browser** (`src/utils/parseXlsx` — an .xlsx is a ZIP
  of XML, and `DecompressionStream` means that needs no dependency; a parser
  package would have cost a few hundred KB on a bundle already over its limit).
  Only the numbers leave, to `SearchUsers` (`src/api/users.ts`) — the file
  itself goes nowhere. `NetworkTab`'s search box asks the same operation, so the
  directory is no longer fetched whole and sifted in the browser.
  The example is then replaced by two lists: the people the numbers resolved to,
  all ticked, and the cells that resolved to nobody with the reason why, over an
  `הוסף לרשימה` bar that adds the first list on a word from the user. `.xls` is
  off the accept list — the old binary format can't be read this way, and main
  accepts it while reading neither. Two smaller differences: the caption reads
  `לדוגמא:` rather than main's `:לדוגמא`, which puts the colon at the logical
  start of an RTL string and so renders it on the wrong side of the word; and the
  shared search row is hidden while this tab is open, since a file you haven't
  handed over has nothing to search — main keeps a search box mounted here that
  searches nothing.

And one addition with no counterpart in main: the sidebar's **אישור קבלה (חמ״ל)**
button, shown only once a document has been distributed. main has a modal for
this (`ViduyKabalahModal`, 2546) that nothing ever opens — `setShowViduyKabalah(true)`
has no call site — so there is no button of main's to match, and none of main's
is displaced: on a distributed document main leaves this part of the sidebar
empty.

## Still to build

Tracked here so a reviewer isn't left guessing what is deliberate and what is
missing:

- **A diff engine.** `ComparisonBar` is main's bar, and picking a version is real,
  but nothing computes what actually differs between two versions — so its
  counter reads `0/0` and its difference navigation is disabled. main hardcodes
  `comparisonTotal = 3` (`Edit.tsx:3512`); `DIFFERENCE_COUNT` in `ComparisonBar`
  is the one line that changes when there is something real to count.
- **`EditDocDetailsModal`'s dropped fields** — the Amazon entity selector, doc
  type, folder, exit date and four toggle rows (`Edit.tsx:2145-2420`). Deliberately
  waiting on a real backend shape rather than being held in state that goes
  nowhere; what is there is the five fields `DocumentHeader` models.
- **Document-permission persistence.** `DocPermissionsModal` has main's five levels
  and its wording, and its members are local state — there is no
  document-permissions shape on the API to write them to. Same reason as above.
- **A real `SearchUsers` resolver.** The people picker's network search and the
  Excel import both ask `src/api/users.ts` rather than filtering a copy of the
  directory in the browser, but it is still answered by a stub over the mock
  pool. This is the one item here that is plumbing rather than a design decision:
  the call sites don't change when a resolver appears.

Everything else main has is either live or in **`parity/`** — the Word-style
ribbon, the table view, the acceptance dialog nothing in main can open, the
undo/redo stacks nothing in main renders, the recursive outline row and the
page-break reflow. All six are ported, all six render at `/document/parity`, and
`src/pages/document/parity/README.md` says of each why it isn't live and what
replaced it.

## Checking parity

Run both trees and compare the same region side by side:

- prototype — `C:/Users/Chief/YoniSRE/chief-ui.worktrees/main`, `pnpm dev`
- this page — `pnpm dev`, then `/document/d1`
- the parked components — the same `pnpm dev`, then `/document/parity`. Compare
  the ribbon, the colour picker, the table's floating toolbar and its properties
  dialog against main's; the other three have no on-screen counterpart in main to
  compare against, and the parity README says why.

Then toggle the OS theme. Every element must have a sensible dark value: if
something stays stubbornly light, a token was wired into `:root` only and not
into the other two blocks of `theme.css` (`prefers-color-scheme: dark` and
`[data-theme="dark"]`).
