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

// Filter option lists. Templates and departments are fixed; statuses and
// organisations are derived from whatever the current shelf actually contains.
export const TEMPLATE_OPTIONS = ['פקודה', 'הוראה', 'מסמך', 'נספח'];

export const DEPARTMENT_OPTIONS = [
  'משאבי אנוש',
  'כספים',
  'טכנולוגיה',
  'תפעול',
  'לוגיסטיקה',
  'הנדסה',
  'מודיעין',
  'תקשוב',
];

export const FILTER_TITLES = {
  template: 'תבנית',
  status: 'סטטוס',
  dept: 'מחלקה',
  dateRange: 'מועד כניסה לתוקף',
  org: 'שם ארגון',
} as const;

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

// The clock and the receipt/reshare cells aren't in the row menu, but they
// resolve to the same modals, so they travel out through the same channel and
// need names of their own.
export const RECEIPTS_ACTION = 'צפייה בווידוא קבלה';
export const RESHARE_ACTION = 'שיתוף מחדש למשתמשים חדשים';
