import type { PdfAccess } from '../../types';

/**
 * `approval` is the review step on the way into an approval round (main's
 * `isApproval`, Edit.tsx:2431): the same fields, but its footer continues the flow
 * instead of saving and closing.
 */
export type EditDocDetailsMode = 'edit' | 'duplicate' | 'issue-update' | 'issue-new' | 'approval';

export const MODAL_TITLES: Record<EditDocDetailsMode, string> = {
  edit: 'פרטי המסמך',
  duplicate: 'שכפול מסמך',
  'issue-update': 'הוצאת עדכון למסמך',
  'issue-new': 'הוצאת מספר פקודה חדש',
  approval: 'העברה לסבב אישורים',
};

export const SUBMIT_LABELS: Record<EditDocDetailsMode, string> = {
  edit: 'שמור שינויים',
  duplicate: 'שכפל',
  'issue-update': 'אישור',
  'issue-new': 'אישור',
  approval: 'המשך',
};

/** main's dialog is 620 wide and stops at 88vh (Edit.tsx:2246). */
export const MODAL_WIDTH = 620;
export const MODAL_MAX_HEIGHT = '88vh';

/** Order numbers read as `001` — main pads to three (Edit.tsx:2264). */
export const ORDER_NUM_DIGITS = 3;

export const DEPARTMENT_OPTIONS = ['משאבי אנוש', 'מבצעים', 'לוגיסטיקה', 'כספים', 'טכנולוגיה'];

export const DOC_TYPE_OPTIONS = ['פקודה', 'נוהל', 'הוראה', 'הנחיה', 'נספח'];

export const FOLDER_OPTIONS = [
  'תיקיית מבצעים 2026',
  'תיקיית נהלים',
  'תיקיית הוראות',
  'תיקיית לוגיסטיקה',
  'תיקיית משאבי אנוש',
];

/**
 * The Amazon hierarchy, level by level (main's EDIT_AMAZON_ENTITIES,
 * Edit.tsx:2138). Keyed by level, because picking a level is what decides which
 * names are offered beside it.
 */
export const ENTITY_NAMES: Record<string, string[]> = {
  פרויקט: ['פרויקט הגנה 2026', 'פרויקט לוגיסטיקה', 'פרויקט תשתיות', 'פרויקט חינוך', 'פרויקט אלפא'],
  מבנה: ['בניין מרכזי', 'בניין A', 'בניין B', 'בניין C', 'מבנה הנהלה', 'מבנה תפעול'],
  קומה: ['קומה 1', 'קומה 2', 'קומה 3', 'קומה 4', 'קומה 5'],
  חדר: ['חדר 101', 'חדר 102', 'חדר 201', 'חדר 202', 'חדר ישיבות א׳', 'חדר מפקד'],
};

export const ENTITY_TYPE_OPTIONS = Object.keys(ENTITY_NAMES);

export const PDF_ACCESS_OPTIONS: { id: PdfAccess; label: string }[] = [
  { id: 'authorized', label: 'למורשים בלבד' },
  { id: 'all', label: 'לאפשר לכולם' },
];

/**
 * The three plain switches under the PDF row, in main's order (Edit.tsx:2382).
 * A list rather than three copies of the same markup: they differ only in which
 * field they write and what they say.
 */
export const OPTION_TOGGLES = [
  { field: 'cancelApproval', label: 'ביטול סבב האישורים' },
  { field: 'watermark', label: 'הצגת סימן מים' },
  { field: 'distributeNatzura', label: 'האם תרצה להפיץ את הפקודה כפקודה נצורה?' },
] as const;

/** Shown until a duplicate is renamed — two documents with one name are indistinguishable. */
export const DUPLICATE_NAME_HINT = 'חובה לשנות שם';

/** What a field with nothing in it reads as, rather than an empty box. */
export const EMPTY_VALUE = '—';
