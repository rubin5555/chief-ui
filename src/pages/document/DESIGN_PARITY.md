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

## Checking parity

Run both trees and compare the same region side by side:

- prototype — `C:/Users/Chief/YoniSRE/chief-ui.worktrees/main`, `pnpm dev`
- this page — `pnpm dev`, then `/document/d1`

Then toggle the OS theme. Every element must have a sensible dark value: if
something stays stubbornly light, a token was wired into `:root` only and not
into the other two blocks of `theme.css` (`prefers-color-scheme: dark` and
`[data-theme="dark"]`).
