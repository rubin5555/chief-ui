export interface SectionTable {
  rows: number;
  cols: number;
  cells: string[][];
}

export interface ActiveCell {
  row: number;
  col: number;
}

export interface CellProps {
  width: string;
  height: string;
  type: string;
  scope: string;
  hAlign: string;
  vAlign: string;
}

export interface TableProps {
  width: string;
  height: string;
  cellSpacing: string;
  cellPadding: string;
  borderWidth: string;
  showCaption: boolean;
  align: string;
}

export type PropsPanelKind = 'cell' | 'table';
