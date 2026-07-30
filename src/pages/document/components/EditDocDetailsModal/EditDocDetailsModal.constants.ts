import type { PdfAccess } from '../../types';

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

export const MODAL_WIDTH = 620;
export const MODAL_MAX_HEIGHT = '88vh';

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

export const OPTION_TOGGLES = [
  { field: 'cancelApproval', label: 'ביטול סבב האישורים' },
  { field: 'watermark', label: 'הצגת סימן מים' },
  { field: 'distributeNatzura', label: 'האם תרצה להפיץ את הפקודה כפקודה נצורה?' },
] as const;

export const DUPLICATE_NAME_HINT = 'חובה לשנות שם';

export const EMPTY_VALUE = '—';
