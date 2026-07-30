# `parity/` — ported out of `Edit.tsx`, deliberately not in the live page

Five things from main's `Edit.tsx` that the migrated document page does not use.
They are here rather than deleted because "we didn't port that" and "we ported it
and chose not to ship it" are different statements, and only the second one can be
reviewed.

A sixth used to be: **`DocToolbar/` has left this folder.** It is now
`src/components/ui/ContentEditor/components/EditorRibbon/`, and it is the toolbar
the live page renders. What changed was not the drawing — that is still main's,
button for button — but what sits underneath it: every control runs a TinyMCE
command, and which buttons are lit is read back off the caret. The reason it was
parked ("45 pieces of state, of which none reaches the document") is the reason it
no longer is.

Everything here is built to the same rules as the rest of the feature — styled
components, tokens instead of literal colours, one component per file, `.testids.ts`
and `index.ts` per directory — and type-checks and lints with everything else.

**Nothing outside `src/routes/document.parity.tsx` imports from this folder.** The
guard is one command:

```bash
rg "from '.*parity" src --glob '!src/routes/document.parity.tsx'
```

It must print nothing. `autoCodeSplitting` does the rest: the route is its own
chunk, so the live page carries none of this.

Look at it at **`/document/parity`**. It is not linked from anywhere — type the
address.

---

## What is here, and why it isn't live

### `SectionTableView/` — a table inside a section
**main:** `Edit.tsx:901-1120`, with the properties dialog at `785-898` and the
toolbar helpers at `762-772`

**Why it isn't live:** tables belong to the editor. A section's body is one
`ContentEditor`, and a separate table widget beside it would mean two things
claiming to be the section's content.

**What changed in the port:** main lifts the active cell to the page and passes the
view **seven** mutation callbacks; nothing outside the table reads either, so the
cell lives in the component and the six grid edits are pure functions in
`sectionTableView.utils.ts` applied through one `onChange`. Deleting the last row
or column is now refused rather than leaving a grid with nothing to type into. The
properties dialog and the delete confirmation are built on `ui/Modal`, which brings
the focus trap, Escape and overlay click that main's hand-rolled fixed cards never
had. The merge/split/wrap buttons stay inert, as they are in main.

### `ViduyKabalahModal/` — "וידוא קבלה — חמ״ל"
**main:** `Edit.tsx:2546-2622`

**Why it isn't live:** **nothing in main can open it.** Its
`setShowViduyKabalah(true)` has no call site anywhere in the 5331 lines. The live
page's `AcceptenceVerification`, reached from the sidebar once a document has been
distributed, covers the same ground and is reachable.

### `DocumentHistory/` — undo/redo stacks and save-version
**main:** `Edit.tsx:3208` (the store), `3337-3391` (the five handlers)

**Why it isn't live:** same reason, one level deeper — main has the whole feature
and **no UI for it at all**. `handleUndo`, `handleRedo`, `getHistoryState` and
`confirmSaveVersion` have no call sites; `saveVersionConfirm` is state nothing
renders. Content history in the live page belongs to the editor.

**What changed in the port:** the store is a hook (`useContentHistory`) rather than
four variables inside a 2195-line component, so it can be used without inheriting a
monolith. `undo`/`redo` **return** the content to restore instead of calling a
setter from inside a `setState` updater, which is a side effect in a function React
may run twice. The three buttons and the save-version dialog are **invented** —
there is no design of main's to match, because main never drew one.

### `OutlineSectionItem/` — the self-recursive outline row
**main:** `Edit.tsx:2020-2070`

**Why it isn't live:** the live tree is three explicit components —
`OutlineSubjectRow`, `OutlineSectionRow`, `OutlineSubSectionRow` — because the three
levels genuinely differ. Only the first accepts a drop from another subject, only
the last is lettered `א/ב/ג`, and each offers a different menu. Recursion buys
uniformity the data doesn't have.

**What changed in the port:** focus lands via a ref callback rather than a
`useEffect` watching `isEditing`.

### `usePageBreaks.ts` — reflow around A4 page boundaries
**main:** `Edit.tsx:3599-3647`

**Why it isn't live:** the page-break lines a reader actually sees are a pure-CSS
repeating gradient on the paper, shipped in `PaperCanvas`. This hook does something
else — it *moves* blocks that straddle a boundary down to the next page — and that
is a layout preference nobody has asked for yet.

**What changed in the port:** main runs it **once on mount** with `[]` deps, so it
is stale the moment anyone types, and it builds and destroys a measuring probe on
every pass. Here a `ResizeObserver` re-runs it as content grows, the 297mm probe is
measured once per session, and both passes share one animation frame. Its header
comment declares it the only sanctioned direct-DOM writer in the codebase — promote
it into `PaperCanvas/` only if the reflow itself is wanted.

Making it live costs something main never had to pay: **it can feed itself.** The
observer must watch the boxes and not the paper, because the paper's height is an
output of the reflow; and it must react to their *heights* only, because pushing
content past the bottom of a scrolling container makes a scrollbar appear, which
narrows every box, which the observer would otherwise read as a change worth
reflowing for. Both guards are in the hook, and the e2e spec is what caught their
absence — the page pegged a core and every click on the route timed out.

---

## One rule this folder bends, on purpose

**No `.analytics.ts`.** Nothing here reports events. Per
`.claude/skills/analytics-component.md` analytics measure what users do in the
product, and none of this is in the product. If any of it is ever promoted, its
analytics come with the promotion.
