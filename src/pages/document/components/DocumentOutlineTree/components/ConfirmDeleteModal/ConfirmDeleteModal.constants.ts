import type { OutlineDeleteTarget } from '../../DocumentOutlineTree.types';

type Level = OutlineDeleteTarget['level'];

/** What the question calls the node — main's `pendingDelete.label` (Edit.tsx:3948). */
export const DELETE_LABEL: Record<Level, string> = {
  subject: 'נושא זה',
  section: 'סעיף זה',
  subSection: 'תת סעיף זה',
};

/**
 * The consequence spelled out, for the two levels that have children to lose.
 * A sub-section has none, so main shows no second line for it (5130) — and an
 * absent key here renders nothing rather than an empty paragraph.
 */
export const DELETE_WARNING: Partial<Record<Level, string>> = {
  subject: 'מחיקת הנושא תמחק את כל הסעיפים תחתיו',
  section: 'מחיקת הסעיף תמחק את כל תתי הסעיפים תחתיו',
};
