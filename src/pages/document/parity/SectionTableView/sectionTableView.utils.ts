import type { SectionTable } from './sectionTableView.types';

export const createTable = (rows: number, cols: number): SectionTable => ({
  rows,
  cols,
  cells: Array.from({ length: rows }, () => Array.from({ length: cols }, () => '')),
});

const emptyRow = (cols: number) => Array.from({ length: cols }, () => '');

// main keeps the six grid edits in the page component alongside every other piece
// of document state (Edit.tsx:3393-3396 and the handlers it passes down). They are
// pure array work with no React in them, so they live here and the view applies
// them — which is also what lets the table own its own active cell.
export const insertRow = (table: SectionTable, at: number): SectionTable => {
  const cells = [...table.cells];
  cells.splice(at, 0, emptyRow(table.cols));
  return { ...table, rows: table.rows + 1, cells };
};

export const deleteRow = (table: SectionTable, at: number): SectionTable => {
  // A table with no rows has nothing to type into and no way back; main's own
  // delete has no such floor, which is how its toolbar can strand an empty grid.
  if (table.rows <= 1) return table;
  return {
    ...table,
    rows: table.rows - 1,
    cells: table.cells.filter((_, index) => index !== at),
  };
};

export const insertColumn = (table: SectionTable, at: number): SectionTable => ({
  ...table,
  cols: table.cols + 1,
  cells: table.cells.map((row) => {
    const next = [...row];
    next.splice(at, 0, '');
    return next;
  }),
});

export const deleteColumn = (table: SectionTable, at: number): SectionTable => {
  if (table.cols <= 1) return table;
  return {
    ...table,
    cols: table.cols - 1,
    cells: table.cells.map((row) => row.filter((_, index) => index !== at)),
  };
};

export const setCell = (
  table: SectionTable,
  row: number,
  col: number,
  value: string,
): SectionTable => ({
  ...table,
  cells: table.cells.map((cells, rowIndex) =>
    rowIndex === row ? cells.map((cell, colIndex) => (colIndex === col ? value : cell)) : cells,
  ),
});

/** Keeps the cursor inside the grid after a row or column is removed. */
export const clampCell = (table: SectionTable, row: number, col: number) => ({
  row: Math.min(row, table.rows - 1),
  col: Math.min(col, table.cols - 1),
});
