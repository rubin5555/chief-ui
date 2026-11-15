'use client';

import { useCallback, useState } from 'react';
import {
  CellBounds,
  CellProperties,
  RowProperties,
  TableProperties,
} from '../types';
import {
  applyTableBorderPreset,
  createNewTableHTML,
  deleteTableColumn,
  deleteTableRow,
  distributeColumnsEvenly,
  distributeRowsEvenly,
  ensureCellEditor,
  getAllTableRows,
  getCellCoords,
  insertTableColumn,
  insertTableRow,
  mergeCellsInBounds,
  moveTableColumn,
  moveTableRow,
  sortTableByColumn,
  splitTableCell,
  toggleTableCaption,
  toggleTableHeaderRow,
  writeCellProperties,
  writeRowProperties,
  writeTableProperties,
} from '../tableEngine';
import { focusCellEditor } from '../TinyTableBlot';
import { EditorTranslations } from '../i18n';

interface UseTableActionsParams {
  quillInstanceRef: React.MutableRefObject<any>;
  selectedCellsRef: React.MutableRefObject<HTMLTableCellElement[]>;
  selectionBoundsRef: React.MutableRefObject<CellBounds | null>;
  resolveTargetTable: () => HTMLTableElement | null;
  resolveTargetCell: () => HTMLTableCellElement | null;
  applySelectionBoundsOnTable: (
    table: HTMLTableElement,
    bounds: CellBounds,
    primaryCell?: HTMLTableCellElement | null
  ) => void;
  clearTableSelection: () => void;
  syncTableAndCellState: (
    table: HTMLTableElement | null,
    cell: HTMLTableCellElement | null,
    cells?: HTMLTableCellElement[]
  ) => void;
  rebindAllTables: (root: HTMLElement) => void;
  pushHistorySnapshot: (immediate?: boolean) => void;
  showToast: (msg: string) => void;
  translations: EditorTranslations;
}

export function useTableActions({
  quillInstanceRef,
  selectedCellsRef,
  selectionBoundsRef,
  resolveTargetTable,
  resolveTargetCell,
  applySelectionBoundsOnTable,
  clearTableSelection,
  syncTableAndCellState,
  rebindAllTables,
  pushHistorySnapshot,
  showToast,
  translations: t,
}: UseTableActionsParams) {
  const [copiedRowHTML, setCopiedRowHTML] = useState<string[] | null>(null);

  const handleInsertTable = useCallback(
    (
      rows: number,
      cols: number,
      options?: {
        withHeader?: boolean;
        striped?: boolean;
        width?: string;
        height?: string;
      }
    ) => {
      const quill = quillInstanceRef.current;
      if (!quill) return;

      const html = createNewTableHTML(rows, cols, {
        withHeader: options?.withHeader ?? false,
        striped: options?.striped ?? false,
        width: options?.width,
        height: options?.height,
      });
      const range = quill.getSelection(true) || { index: Math.max(0, quill.getLength() - 1), length: 0 };

      quill.insertEmbed(range.index, 'tiny-table', { html }, 'user');
      quill.insertText(range.index + 1, '\n', 'silent');
      quill.setSelection(range.index + 2, 0, 'silent');

      rebindAllTables(quill.root as HTMLElement);
      const tables = Array.from(
        (quill.root as HTMLElement).querySelectorAll('table.ql-tiny-table')
      ) as HTMLTableElement[];
      const newest = tables[tables.length - 1];
      if (newest) {
        const firstCell = newest.querySelector('td, th') as HTMLTableCellElement | null;
        if (firstCell) {
          applySelectionBoundsOnTable(
            newest,
            { minRow: 0, maxRow: 0, minCol: 0, maxCol: 0 },
            firstCell
          );
          focusCellEditor(ensureCellEditor(firstCell), false);
        }
      }
      pushHistorySnapshot(true);
    },
    [applySelectionBoundsOnTable, pushHistorySnapshot, quillInstanceRef, rebindAllTables]
  );

  const handleInsertRow = useCallback(
    (pos: 'before' | 'after') => {
      const table = resolveTargetTable();
      const cell = resolveTargetCell();
      if (!table || !cell) return;
      const coords = getCellCoords(table, cell);
      if (!coords) return;
      const targetRow =
        pos === 'before' ? coords.originRow : coords.originRow + coords.rowSpan - 1;
      const newTr = insertTableRow(table, targetRow, pos);
      if (newTr) {
        const firstCell = newTr.cells[0];
        if (firstCell) {
          const newCoords = getCellCoords(table, firstCell);
          if (newCoords) {
            applySelectionBoundsOnTable(
              table,
              {
                minRow: newCoords.originRow,
                maxRow: newCoords.originRow,
                minCol: newCoords.originCol,
                maxCol: newCoords.originCol,
              },
              firstCell
            );
            focusCellEditor(ensureCellEditor(firstCell), false);
          }
        }
      }
      pushHistorySnapshot(true);
    },
    [applySelectionBoundsOnTable, pushHistorySnapshot, resolveTargetCell, resolveTargetTable]
  );

  const handleDeleteRow = useCallback(() => {
    const table = resolveTargetTable();
    const cell = resolveTargetCell();
    if (!table || !cell) return;
    const coords = getCellCoords(table, cell);
    if (!coords) return;

    const bounds = selectionBoundsRef.current;
    const minR = bounds ? bounds.minRow : coords.originRow;
    const maxR = bounds ? bounds.maxRow : coords.originRow;

    for (let r = maxR; r >= minR; r--) {
      const ok = deleteTableRow(table, r);
      if (!ok) {
        const wrapper = table.closest('.ql-tiny-table-wrapper');
        wrapper?.remove();
        clearTableSelection();
        pushHistorySnapshot(true);
        return;
      }
    }

    const rows = getAllTableRows(table);
    const nextRow = rows[Math.min(minR, rows.length - 1)];
    const nextCell = nextRow?.cells[0] || null;
    if (nextCell) {
      const c = getCellCoords(table, nextCell);
      if (c) {
        applySelectionBoundsOnTable(
          table,
          { minRow: c.originRow, maxRow: c.originRow, minCol: c.originCol, maxCol: c.originCol },
          nextCell
        );
      }
    }
    pushHistorySnapshot(true);
  }, [
    applySelectionBoundsOnTable,
    clearTableSelection,
    pushHistorySnapshot,
    resolveTargetCell,
    resolveTargetTable,
    selectionBoundsRef,
  ]);

  const handleInsertCol = useCallback(
    (pos: 'before' | 'after') => {
      const table = resolveTargetTable();
      const cell = resolveTargetCell();
      if (!table || !cell) return;
      const coords = getCellCoords(table, cell);
      if (!coords) return;
      const targetCol =
        pos === 'before' ? coords.originCol : coords.originCol + coords.colSpan - 1;
      insertTableColumn(table, targetCol, pos);
      const updatedCoords = getCellCoords(table, cell);
      if (updatedCoords) {
        applySelectionBoundsOnTable(
          table,
          {
            minRow: updatedCoords.originRow,
            maxRow: updatedCoords.originRow + updatedCoords.rowSpan - 1,
            minCol: updatedCoords.originCol,
            maxCol: updatedCoords.originCol + updatedCoords.colSpan - 1,
          },
          cell
        );
      }
      pushHistorySnapshot(true);
    },
    [applySelectionBoundsOnTable, pushHistorySnapshot, resolveTargetCell, resolveTargetTable]
  );

  const handleDeleteCol = useCallback(() => {
    const table = resolveTargetTable();
    const cell = resolveTargetCell();
    if (!table || !cell) return;
    const coords = getCellCoords(table, cell);
    if (!coords) return;

    const bounds = selectionBoundsRef.current;
    const minC = bounds ? bounds.minCol : coords.originCol;
    const maxC = bounds ? bounds.maxCol : coords.originCol;

    for (let c = maxC; c >= minC; c--) {
      const ok = deleteTableColumn(table, c);
      if (!ok) {
        const wrapper = table.closest('.ql-tiny-table-wrapper');
        wrapper?.remove();
        clearTableSelection();
        pushHistorySnapshot(true);
        return;
      }
    }

    const firstCell = table.querySelector('td, th') as HTMLTableCellElement | null;
    if (firstCell) {
      const c = getCellCoords(table, firstCell);
      if (c) {
        applySelectionBoundsOnTable(
          table,
          { minRow: c.originRow, maxRow: c.originRow, minCol: c.originCol, maxCol: c.originCol },
          firstCell
        );
      }
    }
    pushHistorySnapshot(true);
  }, [
    applySelectionBoundsOnTable,
    clearTableSelection,
    pushHistorySnapshot,
    resolveTargetCell,
    resolveTargetTable,
    selectionBoundsRef,
  ]);

  const handleMergeCells = useCallback(() => {
    const table = resolveTargetTable();
    let bounds = selectionBoundsRef.current;
    const cells = selectedCellsRef.current;
    if (!table || !bounds) return;
    if (cells.length < 2) {
      bounds = { ...bounds, maxCol: bounds.maxCol + 1 };
    }
    const merged = mergeCellsInBounds(table, bounds);
    if (merged) {
      const coords = getCellCoords(table, merged);
      if (coords) {
        applySelectionBoundsOnTable(
          table,
          {
            minRow: coords.originRow,
            maxRow: coords.originRow + coords.rowSpan - 1,
            minCol: coords.originCol,
            maxCol: coords.originCol + coords.colSpan - 1,
          },
          merged
        );
        focusCellEditor(ensureCellEditor(merged), false);
      }
      pushHistorySnapshot(true);
    }
  }, [
    applySelectionBoundsOnTable,
    pushHistorySnapshot,
    resolveTargetTable,
    selectedCellsRef,
    selectionBoundsRef,
  ]);

  const handleSplitCell = useCallback(
    (mode: 'unmerge' | 'horizontal' | 'vertical') => {
      const table = resolveTargetTable();
      const cell = resolveTargetCell();
      if (!table || !cell) return;
      splitTableCell(table, cell, mode);
      const coords = getCellCoords(table, cell);
      if (coords) {
        applySelectionBoundsOnTable(
          table,
          {
            minRow: coords.originRow,
            maxRow: coords.originRow + coords.rowSpan - 1,
            minCol: coords.originCol,
            maxCol: coords.originCol + coords.colSpan - 1,
          },
          cell
        );
      }
      pushHistorySnapshot(true);
    },
    [applySelectionBoundsOnTable, pushHistorySnapshot, resolveTargetCell, resolveTargetTable]
  );

  const handleSetCellBackground = useCallback(
    (color: string) => {
      const cell = resolveTargetCell();
      const connectedSelected = selectedCellsRef.current.filter((c) => c.isConnected);
      const targets =
        connectedSelected.length > 0 ? connectedSelected : cell ? [cell] : [];
      if (targets.length === 0) return;
      targets.forEach((c) => {
        c.style.backgroundColor = color;
      });
      pushHistorySnapshot(true);
    },
    [pushHistorySnapshot, resolveTargetCell, selectedCellsRef]
  );

  const handleSetBorderPreset = useCallback(
    (preset: 'grid' | 'horizontal' | 'outer' | 'none', color?: string) => {
      const table = resolveTargetTable();
      if (!table) return;
      applyTableBorderPreset(table, preset, color || '#cbd5e1', '1px');
      pushHistorySnapshot(true);
    },
    [pushHistorySnapshot, resolveTargetTable]
  );

  const handleSetVerticalAlign = useCallback(
    (align: 'top' | 'middle' | 'bottom') => {
      const cell = resolveTargetCell();
      const connectedSelected = selectedCellsRef.current.filter((c) => c.isConnected);
      const targets =
        connectedSelected.length > 0 ? connectedSelected : cell ? [cell] : [];
      targets.forEach((c) => {
        c.style.verticalAlign = align;
      });
      pushHistorySnapshot(true);
    },
    [pushHistorySnapshot, resolveTargetCell, selectedCellsRef]
  );

  const handleDeleteTable = useCallback(() => {
    const table = resolveTargetTable();
    if (!table) return;
    const wrapper = table.closest('.ql-tiny-table-wrapper');
    wrapper?.remove();
    clearTableSelection();
    pushHistorySnapshot(true);
    showToast(t.toasts.tableDeleted);
  }, [clearTableSelection, pushHistorySnapshot, resolveTargetTable, showToast, t.toasts]);

  const handleCopyRow = useCallback(
    (cut = false) => {
      const table = resolveTargetTable();
      const cell = resolveTargetCell();
      if (!table || !cell) return;
      const coords = getCellCoords(table, cell);
      if (!coords) return;
      const rows = getAllTableRows(table);
      const tr = rows[coords.originRow];
      if (!tr) return;
      const rowHTMLs = Array.from(tr.cells).map((c) => ensureCellEditor(c).innerHTML);
      setCopiedRowHTML(rowHTMLs);
      if (cut) {
        handleDeleteRow();
        showToast(t.toasts.rowCut);
      } else {
        showToast(t.toasts.rowCopied);
      }
    },
    [handleDeleteRow, resolveTargetCell, resolveTargetTable, showToast, t.toasts]
  );

  const handlePasteRow = useCallback(
    (pos: 'before' | 'after') => {
      const table = resolveTargetTable();
      const cell = resolveTargetCell();
      if (!table || !cell || !copiedRowHTML) return;
      const coords = getCellCoords(table, cell);
      if (!coords) return;
      const newTr = insertTableRow(table, coords.originRow, pos);
      if (newTr) {
        Array.from(newTr.cells).forEach((c, idx) => {
          if (copiedRowHTML[idx] !== undefined) {
            ensureCellEditor(c).innerHTML = copiedRowHTML[idx];
          }
        });
      }
      pushHistorySnapshot(true);
      showToast(t.toasts.rowPasted);
    },
    [copiedRowHTML, pushHistorySnapshot, resolveTargetCell, resolveTargetTable, showToast, t.toasts]
  );

  const handleMoveRow = useCallback(
    (dir: 'up' | 'down') => {
      const table = resolveTargetTable();
      const cell = resolveTargetCell();
      if (!table || !cell) return;
      const coords = getCellCoords(table, cell);
      if (coords && moveTableRow(table, coords.originRow, dir)) {
        pushHistorySnapshot(true);
      } else {
        showToast('Cannot move row across merged rowspan');
      }
    },
    [pushHistorySnapshot, resolveTargetCell, resolveTargetTable, showToast]
  );

  const handleMoveCol = useCallback(
    (dir: 'left' | 'right') => {
      const table = resolveTargetTable();
      const cell = resolveTargetCell();
      if (!table || !cell) return;
      const coords = getCellCoords(table, cell);
      if (coords && moveTableColumn(table, coords.originCol, dir)) {
        pushHistorySnapshot(true);
      } else {
        showToast('Cannot move column across merged colspan');
      }
    },
    [pushHistorySnapshot, resolveTargetCell, resolveTargetTable, showToast]
  );

  const handleSortCol = useCallback(
    (dir: 'asc' | 'desc') => {
      const table = resolveTargetTable();
      const cell = resolveTargetCell();
      if (!table || !cell) return;
      const coords = getCellCoords(table, cell);
      if (!coords) return;
      sortTableByColumn(table, coords.originCol, dir);
      pushHistorySnapshot(true);
      showToast(t.toasts.sortedColumn);
    },
    [pushHistorySnapshot, resolveTargetCell, resolveTargetTable, showToast, t.toasts]
  );

  const handleDistributeCols = useCallback(() => {
    const table = resolveTargetTable();
    if (!table) return;
    distributeColumnsEvenly(table);
    pushHistorySnapshot(true);
    showToast(t.toasts.columnsDistributed);
  }, [pushHistorySnapshot, resolveTargetTable, showToast, t.toasts]);

  const handleDistributeRows = useCallback(() => {
    const table = resolveTargetTable();
    if (!table) return;
    distributeRowsEvenly(table);
    pushHistorySnapshot(true);
    showToast(t.toasts.rowsDistributed);
  }, [pushHistorySnapshot, resolveTargetTable, showToast, t.toasts]);

  const handleToggleHeaderRow = useCallback(() => {
    const table = resolveTargetTable();
    if (!table) return;
    toggleTableHeaderRow(table);
    const firstCell = table.querySelector('td, th') as HTMLTableCellElement | null;
    if (firstCell) {
      syncTableAndCellState(table, firstCell, [firstCell]);
    }
    pushHistorySnapshot(true);
    showToast(t.toasts.headerToggled);
  }, [pushHistorySnapshot, resolveTargetTable, showToast, syncTableAndCellState, t.toasts]);

  const handleToggleCaption = useCallback(() => {
    const table = resolveTargetTable();
    if (!table) return;
    toggleTableCaption(table);
    pushHistorySnapshot(true);
  }, [pushHistorySnapshot, resolveTargetTable]);

  const handleToggleStriped = useCallback(() => {
    const table = resolveTargetTable();
    if (!table) return;
    table.classList.toggle('ql-tiny-table-striped');
    pushHistorySnapshot(true);
  }, [pushHistorySnapshot, resolveTargetTable]);

  const handleClearSelectedCells = useCallback(() => {
    const cell = resolveTargetCell();
    const connectedSelected = selectedCellsRef.current.filter((c) => c.isConnected);
    const targets =
      connectedSelected.length > 0 ? connectedSelected : cell ? [cell] : [];
    targets.forEach((c) => {
      ensureCellEditor(c).innerHTML = '<p><br></p>';
    });
    pushHistorySnapshot(true);
  }, [pushHistorySnapshot, resolveTargetCell, selectedCellsRef]);

  const handleSaveTableProps = useCallback(
    (props: TableProperties) => {
      const table = resolveTargetTable();
      if (!table) return;
      writeTableProperties(table, props);
      pushHistorySnapshot(true);
      showToast(t.toasts.tablePropertiesUpdated);
    },
    [pushHistorySnapshot, resolveTargetTable, showToast, t.toasts]
  );

  const handleSaveCellProps = useCallback(
    (props: CellProperties) => {
      const table = resolveTargetTable();
      if (!table) return;
      const cell = resolveTargetCell();
      const connectedSelected = selectedCellsRef.current.filter((c) => c.isConnected);
      const targets =
        connectedSelected.length > 0 ? connectedSelected : cell ? [cell] : [];
      if (targets.length === 0) return;
      const updated = writeCellProperties(table, targets, props);
      syncTableAndCellState(table, updated[0] || null, updated);
      pushHistorySnapshot(true);
      showToast(t.toasts.cellPropertiesUpdated);
    },
    [
      pushHistorySnapshot,
      resolveTargetCell,
      resolveTargetTable,
      selectedCellsRef,
      showToast,
      syncTableAndCellState,
      t.toasts,
    ]
  );

  const handleSaveRowProps = useCallback(
    (props: RowProperties) => {
      const table = resolveTargetTable();
      const cell = resolveTargetCell();
      if (!table || !cell?.parentElement) return;
      writeRowProperties(table, cell.parentElement as HTMLTableRowElement, props);
      pushHistorySnapshot(true);
      showToast(t.toasts.rowPropertiesUpdated);
    },
    [pushHistorySnapshot, resolveTargetCell, resolveTargetTable, showToast, t.toasts]
  );

  return {
    copiedRowHTML,
    handleInsertTable,
    handleInsertRow,
    handleDeleteRow,
    handleInsertCol,
    handleDeleteCol,
    handleMergeCells,
    handleSplitCell,
    handleSetCellBackground,
    handleSetBorderPreset,
    handleSetVerticalAlign,
    handleDeleteTable,
    handleCopyRow,
    handlePasteRow,
    handleMoveRow,
    handleMoveCol,
    handleSortCol,
    handleDistributeCols,
    handleDistributeRows,
    handleToggleHeaderRow,
    handleToggleCaption,
    handleToggleStriped,
    handleClearSelectedCells,
    handleSaveTableProps,
    handleSaveCellProps,
    handleSaveRowProps,
  };
}
