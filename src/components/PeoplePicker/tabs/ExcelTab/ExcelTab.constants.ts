// main's example sheet, verbatim (TopNavbar.tsx:781-796): four columns, seven
// rows, personal numbers in column A and nothing anywhere else — which is the
// whole instruction the tab is giving.

export const ACCEPTED_FILE_TYPES = '.xlsx,.xls';

/** main draws the preview at a fixed 340px rather than letting it fill. */
export const SHEET_WIDTH = 340;

export const SHEET_COLUMNS = ['A', 'B', 'C', 'D'] as const;

/** The column the personal numbers go in — headed navy, and outlined on row 1. */
export const TARGET_COLUMN = SHEET_COLUMNS[0];

export const SHEET_ROWS: Array<{ id: string; value: string }> = [
  { id: 'row-1', value: 's1234567' },
  { id: 'row-2', value: 's7654321' },
  { id: 'row-3', value: 'm1234567' },
  { id: 'row-4', value: 'm7654321' },
  { id: 'row-5', value: '' },
  { id: 'row-6', value: '' },
  { id: 'row-7', value: '' },
];
