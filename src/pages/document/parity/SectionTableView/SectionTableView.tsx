import { useRef, useState } from 'react';
import { DeleteTableModal } from './components/DeleteTableModal';
import { TableCellInput } from './components/TableCellInput';
import { TableFloatingToolbar } from './components/TableFloatingToolbar';
import {
  CELL_PROPS_DEFAULT,
  TABLE_PROPS_DEFAULT,
  TablePropsPanel,
} from './components/TablePropsPanel';
import { Grid, GridCell, TableScroller } from './SectionTableView.styles';
import { SECTION_TABLE_VIEW_IDS } from './SectionTableView.testids';
import type {
  ActiveCell,
  CellProps,
  PropsPanelKind,
  SectionTable,
  TableProps,
} from './sectionTableView.types';
import {
  clampCell,
  deleteColumn,
  deleteRow,
  insertColumn,
  insertRow,
  setCell,
} from './sectionTableView.utils';

export interface SectionTableViewProps {
  table: SectionTable;
  onChange: (table: SectionTable) => void;
  onDelete: () => void;
}

export const SectionTableView = ({ table, onChange, onDelete }: SectionTableViewProps) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const [activeCell, setActiveCell] = useState<ActiveCell | null>(null);
  const [openPanel, setOpenPanel] = useState<PropsPanelKind | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [cellProps, setCellProps] = useState<CellProps>(CELL_PROPS_DEFAULT);
  const [tableProps, setTableProps] = useState<TableProps>(TABLE_PROPS_DEFAULT);

  const row = activeCell?.row ?? 0;
  const col = activeCell?.col ?? 0;

  const handleFocusCell = (nextRow: number, nextCol: number) => () =>
    setActiveCell({ row: nextRow, col: nextCol });

  const handleCellChange = (nextRow: number, nextCol: number) => (value: string) =>
    onChange(setCell(table, nextRow, nextCol, value));

  const handleInsertRowBefore = () => onChange(insertRow(table, row));
  const handleInsertRowAfter = () => onChange(insertRow(table, row + 1));
  const handleInsertColumnBefore = () => onChange(insertColumn(table, col));
  const handleInsertColumnAfter = () => onChange(insertColumn(table, col + 1));

  const handleDeleteRow = () => {
    const next = deleteRow(table, row);
    onChange(next);
    setActiveCell(clampCell(next, row, col));
  };

  const handleDeleteColumn = () => {
    const next = deleteColumn(table, col);
    onChange(next);
    setActiveCell(clampCell(next, row, col));
  };

  const handleOpenCellProps = () => setOpenPanel('cell');
  const handleOpenTableProps = () => setOpenPanel('table');
  const handleClosePanel = () => setOpenPanel(null);

  const handleOpenDelete = () => setIsDeleteOpen(true);
  const handleCloseDelete = () => setIsDeleteOpen(false);

  return (
    <div>
      <TableScroller ref={tableRef} data-testid={SECTION_TABLE_VIEW_IDS.root}>
        <Grid>
          <tbody>
            {table.cells.map((cells, rowIndex) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: a grid row is its position
              <tr key={`row-${rowIndex}`}>
                {cells.map((cell, colIndex) => (
                  <GridCell
                    // biome-ignore lint/suspicious/noArrayIndexKey: a grid cell is its position
                    key={`cell-${rowIndex}-${colIndex}`}
                    $active={activeCell?.row === rowIndex && activeCell?.col === colIndex}
                  >
                    <TableCellInput
                      row={rowIndex}
                      col={colIndex}
                      value={cell}
                      onChange={handleCellChange(rowIndex, colIndex)}
                      onFocus={handleFocusCell(rowIndex, colIndex)}
                    />
                  </GridCell>
                ))}
              </tr>
            ))}
          </tbody>
        </Grid>
      </TableScroller>

      {activeCell && (
        <TableFloatingToolbar
          anchorRef={tableRef}
          onInsertRowBefore={handleInsertRowBefore}
          onInsertRowAfter={handleInsertRowAfter}
          onDeleteRow={handleDeleteRow}
          onInsertColumnBefore={handleInsertColumnBefore}
          onInsertColumnAfter={handleInsertColumnAfter}
          onDeleteColumn={handleDeleteColumn}
          onOpenCellProps={handleOpenCellProps}
          onOpenTableProps={handleOpenTableProps}
          onDeleteTable={handleOpenDelete}
        />
      )}

      {openPanel && (
        <TablePropsPanel
          kind={openPanel}
          cellProps={cellProps}
          tableProps={tableProps}
          onSaveCell={setCellProps}
          onSaveTable={setTableProps}
          onClose={handleClosePanel}
        />
      )}

      {isDeleteOpen && <DeleteTableModal onConfirm={onDelete} onClose={handleCloseDelete} />}
    </div>
  );
};
