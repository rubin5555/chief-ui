export { GridTable } from './GridTable';
// For a continuation block that repeats a table's tracks outside the table —
// the catalog's expanded child rows. Driven by the same `ColumnDef` array, so
// the two can't drift. Regular tables never need these.
export { renderBodyCells } from './GridTable.cells';
// The row metrics such a block has to repeat to line up under the real table.
export { DENSITY } from './GridTable.constants';
export type { ColumnDef, Density, RowConfig } from './GridTable.types';
export { gridTemplateOf } from './GridTable.types';
