export const ACCEPTED_FILE_TYPES = '.xlsx';

export const ID_COLUMN = 'A';

const PERSONAL_NUMBER = /^[A-Za-z]?\d{6,9}$/;

export const isPersonalNumber = (value: string) => PERSONAL_NUMBER.test(value);

export const SHEET_WIDTH = 340;

export const SHEET_COLUMNS = ['A', 'B', 'C', 'D'] as const;

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
