export const FIELD_BANK_IDS = {
  bar: (edge: 'top' | 'bottom') => `field-bank-bar-${edge}`,
  toggleBtn: 'field-bank-toggle',
  openPickerBtn: 'field-bank-open-picker',
  list: 'field-bank-list',
  chip: (fieldId: string) => `field-bank-chip-${fieldId}`,
  chipRemoveBtn: (fieldId: string) => `field-bank-chip-remove-${fieldId}`,
  addMoreBtn: 'field-bank-add-more',
} as const;
