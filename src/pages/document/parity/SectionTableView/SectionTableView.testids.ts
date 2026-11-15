export const SECTION_TABLE_VIEW_IDS = {
  root: 'parity-section-table',
  cell: (row: number, col: number) => `parity-section-table-cell-${row}-${col}`,
  toolbar: 'parity-section-table-toolbar',
  toolbarAction: (action: string) => `parity-section-table-action-${action}`,
  propsPanel: 'parity-section-table-props',
  propsField: (name: string) => `parity-section-table-props-${name}`,
  deleteConfirm: 'parity-section-table-delete-confirm',
};
