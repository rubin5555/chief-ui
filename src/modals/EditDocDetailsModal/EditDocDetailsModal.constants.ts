import type { PdfAccess } from '@/pages/document/types';

export type EditDocDetailsMode =
  | 'new'
  | 'edit'
  | 'duplicate'
  | 'issue-update'
  | 'issue-new'
  | 'approval';

// `new` is the only mode where the five facts across the top are editable —
// nothing has been decided about the document yet. Everywhere else they are
// settled and the dialog shows them read-only.
export const isCreationMode = (mode: EditDocDetailsMode) => mode === 'new';

export const MODAL_TITLES: Record<EditDocDetailsMode, string> = {
  new: 'פתיחת מסמך חדש',
  edit: 'פרטי המסמך',
  duplicate: 'שכפול מסמך',
  'issue-update': 'הוצאת עדכון למסמך',
  'issue-new': 'הוצאת מספר פקודה חדש',
  approval: 'העברה לסבב אישורים',
};

export const SUBMIT_LABELS: Record<EditDocDetailsMode, string> = {
  new: 'יצירת מסמך',
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

// Creation-only option lists.
export const ENVIRONMENT_OPTIONS = [
  'הסביבה שלי',
  'משרד הבריאות',
  'משרד הביטחון',
  'משרד החינוך',
  'משרד הפנים',
  'ארגון א׳',
  'ארגון ב׳',
];

export const CLASSIFICATION_LEVELS = ['בלמ"ס', 'סודי', 'סודי ביותר', 'סודי ביותר לשו"ס'];

// Only the two highest levels carry a tag, and each offers a different set —
// which is also what makes the tag field appear and disappear.
export const CLASSIFICATION_TAGS: Record<string, string[]> = {
  'סודי ביותר': ['ללא', 'תגית א׳', 'תגית ב׳'],
  'סודי ביותר לשו"ס': ['תגית א׳', 'תגית ב׳'],
};

export const TEMPLATE_OPTIONS = [
  'תבנית פקודה מבצעית',
  'תבנית הוראת נהלים',
  'תבנית מדיניות',
  'תבנית דוח',
  'תבנית חוזר',
];

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
