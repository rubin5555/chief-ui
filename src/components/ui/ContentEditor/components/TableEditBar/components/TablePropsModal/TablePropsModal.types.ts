export type TablePropsTarget = 'cell' | 'table';

export type CellType = 'td' | 'th';

export interface CellPropsDraft {
  width: string;
  height: string;
  type: CellType;
  scope: string;
  hAlign: string;
  vAlign: string;
}

export interface TablePropsDraft {
  width: string;
  height: string;
  cellSpacing: string;
  cellPadding: string;
  borderWidth: string;
  showCaption: boolean;
  align: string;
}

export interface PropsOption {
  value: string;
  label: string;
}
