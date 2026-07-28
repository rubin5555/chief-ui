/**
 * `approval` is the review step on the way into an approval round (main's
 * `isApproval`, Edit.tsx:2431): the same fields, but its footer continues the flow
 * instead of saving and closing.
 */
export type EditDocDetailsMode = 'edit' | 'duplicate' | 'issue-update' | 'issue-new' | 'approval';

export const MODAL_TITLES: Record<EditDocDetailsMode, string> = {
  edit: 'עריכת פרטי מסמך',
  duplicate: 'שכפול מסמך',
  'issue-update': 'הנפקת עדכון',
  'issue-new': 'הנפקת מסמך חדש',
  approval: 'העברה לסבב אישורים',
};

export const SUBMIT_LABELS: Record<EditDocDetailsMode, string> = {
  edit: 'שמור שינויים',
  duplicate: 'שכפל',
  'issue-update': 'הנפק עדכון',
  'issue-new': 'הנפק מסמך',
  approval: 'המשך',
};

// Re-exported from types.ts, the single source of truth (DEFAULT_CLASSIFICATION_LEVEL
// there is derived from this same list) — not redefined independently.
export { CLASSIFICATION_OPTIONS } from '../../types';

export const ORGANIZATION_OPTIONS = ['ארגון א׳', 'ארגון ב׳', 'ארגון ג׳', 'ארגון ד׳'];

export const DEPARTMENT_OPTIONS = ['אגף מבצעים', 'אגף משאבי אנוש', 'אגף לוגיסטיקה', 'אגף תקשוב'];

/** Shown until a duplicate is renamed — two documents with one name are indistinguishable. */
export const DUPLICATE_NAME_HINT = 'חובה לשנות שם';
