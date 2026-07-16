export const COLUMN_STYLE_LIST_IDS = {
  addSelect: 'column-style-add',
  row: (column: string) => `column-style-row-${column}`,
  removeBtn: (column: string) => `column-style-remove-${column}`,
} as const;
