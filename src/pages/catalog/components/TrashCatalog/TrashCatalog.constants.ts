// Below this many days left, the countdown turns from a warning red to a
// danger red.
export const URGENT_DAYS = 7;

export const TRASH_HEADING = 'סל מחזור';
export const TRASH_NOTE = '· פריטים יימחקו לצמיתות לאחר 30 יום';
export const BACK_LABEL = 'חזרה';

export const TRASH_CATALOG_IDS = {
  root: 'catalog-trash',
  back: 'catalog-trash-back',
  search: 'catalog-trash-search',
  table: 'catalog-trash-table',
  noDocs: 'catalog-trash-no-docs',
  rowMenu: (id: string) => `catalog-trash-row-menu-${id}`,
} as const;
