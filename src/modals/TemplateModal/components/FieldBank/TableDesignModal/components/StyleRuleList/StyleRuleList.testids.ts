export const STYLE_RULE_LIST_IDS = {
  addBtn: 'style-rule-add',
  row: (id: string) => `style-rule-row-${id}`,
  columnSelect: (id: string) => `style-rule-column-${id}`,
  operatorSelect: (id: string) => `style-rule-operator-${id}`,
  valueInput: (id: string) => `style-rule-value-${id}`,
  removeBtn: (id: string) => `style-rule-remove-${id}`,
} as const;
