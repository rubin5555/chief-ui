export const TABLE_DESIGN_MODAL_IDS = {
  root: 'table-design-modal',
  captionInput: 'table-design-caption',
  totalsToggle: 'table-design-totals',
  renderAsTableToggle: 'table-design-render-as-table',
  aggregateSelect: 'table-design-aggregate',
  rowTitleSelect: 'table-design-row-title',
  labelInput: (column: string) => `table-design-label-${column}`,
  styleTargetSelect: 'table-design-style-target',
  cancelBtn: 'table-design-cancel',
  saveBtn: 'table-design-save',
} as const;
