// main's example sheet, verbatim (TopNavbar.tsx:781-796): four columns, seven
// rows, personal numbers in column A and nothing anywhere else — which is the
// whole instruction the tab is giving.

/** .xls is deliberately absent: the old binary format can't be read the way
 *  `parseXlsxColumn` reads a file, and offering it would be a promise broken at
 *  the point of picking. main accepts both and reads neither. */
export const ACCEPTED_FILE_TYPES = '.xlsx';

/** The column the personal numbers are read out of. */
export const ID_COLUMN = 'A';

/**
 * What could be a personal number: the directory holds nine digits, and main
 * writes them elsewhere with a leading letter (`s2345678`). Anything else is
 * refused here rather than asked about — a date, a header row, half a formula.
 */
const PERSONAL_NUMBER = /^[A-Za-z]?\d{6,9}$/;

export const isPersonalNumber = (value: string) => PERSONAL_NUMBER.test(value);

/** Checkbox, name, personal number, organisation. */
export const EXCEL_PREVIEW_GRID = '28px 1fr 80px 80px';

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
