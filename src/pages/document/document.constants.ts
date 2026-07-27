import { colors, docStatusColors, gray } from '@/styles/theme';
import type { SectionStatus } from './types';

// Constants shared across the document feature's sibling subtrees
// (components/DocumentSidebar, components/SectionBlock, components/PaperCanvas,
// ...). This sits at the feature root for the same reason a `.shared.styles.ts`
// does — it is the consumers' actual common ancestor. Anything used by exactly
// one component belongs in that component's own `.constants.ts` instead; don't
// let this become a dumping ground.

/**
 * Hebrew letters for sub-section numbering (main's HE_ALPHA, Edit.tsx:1695).
 * A sub-section renders as `א׳`, `ב׳`, … rather than a third numeric level.
 */
export const HE_ALPHA = 'אבגדהוזחטיכלמנסעפצקרשת'.split('');

/**
 * Unicode superscript digits for footnote markers (main's SUPERSCRIPT_NUMS,
 * Edit.tsx:98). Indexed by footnote position, so twelve is the practical
 * ceiling — matching main, which also stops there.
 */
export const SUPERSCRIPT_NUMS = ['¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹', '¹⁰', '¹¹', '¹²'];

/**
 * The document's status progression (main's STATUS_FLOW, Edit.tsx:1697).
 * Order is meaningful: the sidebar's forward/back buttons step through this
 * array, so `מבצעית` is deliberately absent — it is a terminal state reached
 * by distributing, not the next step after `ממתין להפצה`.
 */
export const STATUS_FLOW = ['טיוטה פנימית', 'בהכנה', 'בסבב אישורים', 'ממתין להפצה'];

/** Statuses in which the document is still editable. */
export const EDITABLE_STATUSES = new Set(['טיוטה פנימית', 'טיוטה', 'בהכנה']);

/**
 * Statuses in which most of EditDocDetailsModal's fields become read-only
 * (main's isLimitedEdit, Edit.tsx:2225).
 */
export const LIMITED_EDIT_STATUSES = new Set(['מבצעית', 'נצורה', 'הסתיימה', 'התבטלה']);

/**
 * The section-status filter's options (main's FILTER_STATUSES, Edit.tsx:2463).
 *
 * Lives at the feature root rather than in `FilterPanel/` because it has two
 * consumers in sibling subtrees — the panel that sets the filter, and the chip
 * row inside PaperCanvas that shows what's active. Labels are main's, and
 * deliberately more specific than a bare status name (`ממתין לאישור`, not
 * `ממתין`). Colours come from SECTION_STATUS_COLOR below: main declares them
 * twice with identical values, which is a duplication worth not copying.
 */
export const FILTER_STATUSES: { id: SectionStatus; label: string }[] = [
  { id: 'editing', label: 'בעריכה' },
  { id: 'pending', label: 'ממתין לאישור' },
  { id: 'approved', label: 'מאושר' },
  { id: 'fix', label: 'לתיקון' },
  { id: 'idle', label: 'לא בעבודה' },
];

/**
 * Per-section status → dot/label/chip colour (main's SECTION_STATUS_COLOR,
 * Edit.tsx:1708).
 *
 * Note this is NOT the document-status palette below — main keeps them separate
 * and they disagree on two entries (a section `editing` is navy, a document
 * `בסבב אישורים` is a bright blue). Only `approved`/`fix` needed new tokens;
 * the other three already had byte-exact matches.
 */
export const SECTION_STATUS_COLOR: Record<SectionStatus, string> = {
  editing: colors.primary,
  pending: colors.warning,
  approved: docStatusColors.approved,
  fix: docStatusColors.fix,
  idle: gray[400],
};

/** Document status → sidebar dot colour (main's STATUS_COLOR, Edit.tsx:1699). */
export const DOC_STATUS_COLOR: Record<string, string> = {
  'טיוטה פנימית': docStatusColors.idle,
  בהכנה: docStatusColors.preparing,
  'בסבב אישורים': docStatusColors.inApproval,
  'ממתין להפצה': docStatusColors.awaitingDistribution,
};

/**
 * Dot colour for a status outside STATUS_FLOW — `מבצעית` and the other terminal
 * states, which main leaves out of its map and lets fall through to grey
 * (Edit.tsx:3145's `?? '#6b7280'`).
 */
export const DOC_STATUS_FALLBACK_COLOR = gray[500];
