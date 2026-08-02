import type { CatalogTab } from '@/api/catalog';

// The `כניסה לתוקף` column means something different on each shelf, so its
// header changes while the data behind it doesn't.
export const DATE_HEADER: Record<CatalogTab, string> = {
  drafts: 'תאריך עדכון',
  distribution: 'תאריך הפצה',
  distributed: 'כניסה לתוקף',
  archive: 'כניסה לתוקף',
};

export const DIST_SUB_TABS = [
  'כל המסמכים',
  'בסבב אישורים',
  'ממתינות לחמ״ל',
  'הופצו',
  'בוטלו',
] as const;

// Each distribution sub-tab is a status filter in disguise. `כל המסמכים` maps
// to nothing, which is what makes it the "no filter" entry.
export const DIST_SUB_STATUS: Record<string, string> = {
  'בסבב אישורים': 'בסבב אישורים',
  'ממתינות לחמ״ל': 'ממתין להפצה',
  הופצו: 'מבצעית',
  בוטלו: 'התבטלה',
};

export const SEARCH_PLACEHOLDER = 'חיפוש לפי שם, מספר פקודה...';
export const NO_DOCS_TEXT = 'לא נמצאו מסמכים';
export const EXPAND_TITLE = 'הצג מסמכים תחת מסמך זה';
export const HISTORY_TITLE = 'היסטוריית גרסאות';
export const ACTIONS_TITLE = 'פעולות';
export const TRASH_TITLE = 'סל מחזור';
export const RESHARE_LABEL = 'שיתוף מחדש';
export const NEW_VIEWERS_LABEL = 'נוספו משתמשים';
export const NO_RECEIPT = '—';

// How many page buttons the pager shows at once, and the size of a page.
export const PAGE_WINDOW = 5;
export const PAGE_SIZE = 8;
