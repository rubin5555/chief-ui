import type { ReactNode } from 'react';

// One column, declared once. The table derives three things from a list of
// these that used to be three hand-maintained props: the grid track list, the
// header row, and each body cell. They drifted apart before — a column added to
// the grid string but not to `headers` silently shifted every label one slot to
// the left, and nothing caught it.
export interface ColumnDef<T> {
  key: string;
  // A CSS grid track: '28px', '1fr', 'minmax(80px, 1fr)'.
  width: string;
  // Omit for spacer columns — checkbox gutters, action buttons, the empty slot
  // a sub-table leaves under its parent's chevron.
  header?: ReactNode;
  // Applies to the header, and to any cell that returns a bare string or
  // number. A cell that returns an element is left alone.
  align?: 'right' | 'center';
  // Omit to leave the cell empty and keep the column as a spacer.
  cell?: (item: T, index: number) => ReactNode;
}

// Row-level state the table cannot infer from the item alone.
export interface RowConfig {
  isSelected?: boolean;
  isAdded?: boolean;
  onClick?: () => void;
  expansion?: ReactNode;
}

export const gridTemplateOf = <T>(columns: ColumnDef<T>[]): string =>
  columns.map((column) => column.width).join(' ');
