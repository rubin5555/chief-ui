export const CELL_STYLE_FIELDS_IDS = {
  backgroundSwatch: (prefix: string, name: string) => `cell-style-${prefix}-bg-${name}`,
  colorSwatch: (prefix: string, name: string) => `cell-style-${prefix}-color-${name}`,
  boldToggle: (prefix: string) => `cell-style-${prefix}-bold`,
  italicToggle: (prefix: string) => `cell-style-${prefix}-italic`,
  alignSelect: (prefix: string) => `cell-style-${prefix}-align`,
} as const;
