import type { CatalogTab } from '@/api/catalog';

// Must match the defaults duplicated in src/routes/catalog.tsx — the route file
// cannot import this one without pulling the page into the eager bundle.
export const CATALOG_DEFAULTS = {
  tab: 'distributed' as CatalogTab,
  distSub: 'כל המסמכים',
  page: 1,
} as const;

// The sidebar's own environment, and the pseudo-department that widens the
// catalog to every environment at once.
export const ALL_DOCS_DEPARTMENT = 'כל המסמכים';

export const CATALOG_TABS: { key: CatalogTab; label: string }[] = [
  { key: 'drafts', label: 'טיוטות' },
  { key: 'distribution', label: 'הפצה' },
  { key: 'distributed', label: 'מסמכים שהופצו' },
  { key: 'archive', label: 'ארכיון' },
];

export const PAGE_SIZE = 8;

export const EMPTY_STATE_TEXT = 'בחר אגף מהסרגל הצדדי להצגת הקטלוג';
