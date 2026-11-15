export * from './i18n';

export interface CellCoords {
  row: number;
  col: number;
}

export interface CellBounds {
  minRow: number;
  maxRow: number;
  minCol: number;
  maxCol: number;
}

export interface GridSlot {
  /** The actual TD or TH element that occupies this logical (row, col) coordinate */
  cell: HTMLTableCellElement;
  /** The logical row where this cell originates */
  originRow: number;
  /** The logical col where this cell originates */
  originCol: number;
  /** Rowspan of the origin cell */
  rowSpan: number;
  /** Colspan of the origin cell */
  colSpan: number;
  /** True only when row === originRow && col === originCol */
  isOrigin: boolean;
}

export interface TableProperties {
  width: string;
  height: string;
  align: 'left' | 'center' | 'right' | 'none';
  cellPadding: string;
  borderWidth: string;
  borderStyle: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  borderColor: string;
  backgroundColor: string;
  borderCollapse: 'collapse' | 'separate';
  borderSpacing: string;
  hasCaption: boolean;
  captionText: string;
  stripedRows: boolean;
  hoverHighlight: boolean;
}

export interface CellProperties {
  width: string;
  height: string;
  cellType: 'td' | 'th';
  scope: '' | 'col' | 'row' | 'colgroup' | 'rowgroup';
  hAlign: '' | 'left' | 'center' | 'right' | 'justify';
  vAlign: '' | 'top' | 'middle' | 'bottom';
  backgroundColor: string;
  borderWidth: string;
  borderStyle: '' | 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  borderColor: string;
  padding: string;
  whiteSpace: 'normal' | 'nowrap';
}

export interface RowProperties {
  rowType: 'thead' | 'tbody' | 'tfoot';
  height: string;
  hAlign: '' | 'left' | 'center' | 'right';
  vAlign: '' | 'top' | 'middle' | 'bottom';
  backgroundColor: string;
  borderBottomColor: string;
  borderBottomWidth: string;
  borderBottomStyle: '' | 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
}

export type ActiveModalType = 'table' | 'cell' | 'row' | 'source' | 'insert-custom-table' | 'link' | 'image' | 'special-char' | null;
