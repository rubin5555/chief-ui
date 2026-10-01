# Analytics coverage: `src/pages/document/`

Twenty components report events. Fourteen deliberately don't. This file records
which, and why, so the gap is a decision rather than an oversight —
`.claude/skills/analytics-component.md` excludes two whole classes of component,
and most of the fourteen fall into them.

## What is reported

| Component | Category |
| --- | --- |
| `DocumentPage` | `'עמוד מסמך'` |
| `DocumentSidebar` | `'סרגל צד מסמך'` |
| `DocumentOutlineTree` | `'עץ סעיפי מסמך'` |
| `FilterPanel` | `'סינון סעיפים'` |
| `SectionBlock` | `'סטטוס סעיף'` |
| `SectionMenu` | `'תפריט סעיף'` |
| `SectionChat` | `'צ׳אט סעיף'` |
| `AttachmentPicker` | `'קבצים מצורפים'` |
| `SignaturesSection` | `'חתימות מסמך'` |
| `ApprovalWorkflow` | `'תהליך אישור מסמך'` |
| `ApprovalDetailsModal` | `'הגדרת סבב אישורים'` |
| `ApprovalRotation` | `'סבב אישורים'` |
| `AcceptenceVerification` | `'אישור קבלה'` |
| `DistributeDoc` | `'הפצת מסמך'` |
| `ClassifiedViewersModal` | `'צופים ממודרים'` |
| `ComparisonBar` | `'השוואת גרסאות'` |
| `EditDocDetailsModal` | `'פרטי מסמך'` |
| `DocPermissionsModal` | `'הרשאות מסמך'` |
| `ImportDocModal` | `'ייבוא סעיפים'` |
| `RestoreModal` | `'שחזור סעיפים'` |

## What deliberately isn't, and why

**Dumb children that take callbacks** — the skill's own exclusion. Whoever passes
the callback reports the event, so tracking here would double-count:
`NodeActionRow`, `NodeTitleField`, `SectionStatusLabel`, `SourceSystemsModal`.

**Composition shells with no actions of their own**: `PaperCanvas`,
`SubjectBlock`, `SubSectionBlock`, `ActiveFilterChips`. Each renders what a parent
gives it and reads the URL; none of them is a thing a user does.

**`DocumentActionsSlot`** renders no chrome. `DocActionToolbar` and `FilterPanel`
each track their own clicks, and a second layer here would report every one twice.

**`DocumentCanvas`** had the import/restore actions the plan assigned it, and they
moved to `DocumentSidebar` with the buttons that trigger them — where they are
tracked. What is left here is one boolean for the emphasis card, reported by the
sidebar's `+` menu.

**`DocumentMetadataPill`** is inert, as main's is: document details are edited from
the navbar's toolbar. There is no interaction to report.

**`EditableSectionBody`** commits content on a 300ms debounce. An event per commit
would be a keystroke-rate firehose measuring typing speed rather than intent;
what is worth knowing about a section — its status, its notes, its attachments —
is reported by the components that own those.

**`EmphasisBlock`** and **`SourceSystemsNotice`** each have one action worth a line
(`copy`, and opening the source list). Both are cheap to add and neither is
load-bearing; left out for now rather than padding the table.

## Two rules these all follow

No event carries content. A comment's text, a filename, a rejection reason, a
classified section's viewers — all of them are about a specific document and a
named person, so what gets sent is a count or a flag. See
`SectionChat.analytics.ts` and `ClassifiedViewersModal.analytics.ts`, where that
choice is the comment.

No `.analytics.ts` is exported from an `index.ts`. Analytics is a component's own
business, not part of its public surface.
