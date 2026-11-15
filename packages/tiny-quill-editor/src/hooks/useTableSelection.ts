'use client';

import { useCallback, useRef, useState } from 'react';
import { CellBounds } from '../types';
import {
  buildTableGrid,
  clearCellSelectionClasses as clearSelectionDOMClasses,
  ensureCellEditor,
  expandBoundsToMergedCells,
  getCellCoords,
  getCellsInBounds,
} from '../tableEngine';

interface UseTableSelectionParams {
  quillInstanceRef: React.MutableRefObject<any>;
}

export function useTableSelection({ quillInstanceRef }: UseTableSelectionParams) {
  const [activeTable, setActiveTable] = useState<HTMLTableElement | null>(null);
  const [activeCell, setActiveCell] = useState<HTMLTableCellElement | null>(null);
  const [selectedCells, setSelectedCells] = useState<HTMLTableCellElement[]>([]);
  const [selectionBounds, setSelectionBounds] = useState<CellBounds | null>(null);

  // Synchronous refs mirror state immediately so event handlers and table actions
  // never suffer from stale closures between renders.
  const activeTableRef = useRef<HTMLTableElement | null>(null);
  const activeCellRef = useRef<HTMLTableCellElement | null>(null);
  const selectedCellsRef = useRef<HTMLTableCellElement[]>([]);
  const selectionBoundsRef = useRef<CellBounds | null>(null);

  const clearCellSelectionClasses = useCallback(
    (root?: HTMLElement | null) => {
      const scope = root || quillInstanceRef.current?.root || document;
      clearSelectionDOMClasses(scope);
    },
    [quillInstanceRef]
  );

  const clearTableSelection = useCallback(
    (root?: HTMLElement | null) => {
      clearCellSelectionClasses(root);
      activeTableRef.current = null;
      activeCellRef.current = null;
      selectedCellsRef.current = [];
      selectionBoundsRef.current = null;

      setActiveTable(null);
      setActiveCell(null);
      setSelectedCells([]);
      setSelectionBounds(null);
    },
    [clearCellSelectionClasses]
  );

  const applySelectionBoundsOnTable = useCallback(
    (
      table: HTMLTableElement,
      bounds: CellBounds,
      primaryCell?: HTMLTableCellElement | null
    ) => {
      clearCellSelectionClasses();
      table.classList.add('ql-tiny-table-selected');
      const { grid } = buildTableGrid(table);
      const expanded = expandBoundsToMergedCells(grid, bounds);
      const cells = getCellsInBounds(table, expanded);

      cells.forEach((c) => {
        c.classList.add('ql-tiny-cell-selected');
        if (cells.length > 1) {
          c.setAttribute('data-selected-cell', 'true');
        }
      });
      const active = primaryCell || cells[0] || null;
      if (active) {
        active.classList.add('ql-tiny-cell-active');
      }

      activeTableRef.current = table;
      activeCellRef.current = active;
      selectedCellsRef.current = cells;
      selectionBoundsRef.current = expanded;

      setActiveTable(table);
      setActiveCell(active);
      setSelectedCells(cells);
      setSelectionBounds(expanded);
    },
    [clearCellSelectionClasses]
  );

  const syncTableAndCellState = useCallback(
    (
      table: HTMLTableElement | null,
      cell: HTMLTableCellElement | null,
      cells?: HTMLTableCellElement[]
    ) => {
      activeTableRef.current = table;
      activeCellRef.current = cell;
      setActiveTable(table);
      setActiveCell(cell);
      if (cells !== undefined) {
        selectedCellsRef.current = cells;
        setSelectedCells(cells);
      }
    },
    []
  );

  const resolveTargetTable = useCallback((): HTMLTableElement | null => {
    if (activeTableRef.current && activeTableRef.current.isConnected) {
      return activeTableRef.current;
    }
    if (activeTable && activeTable.isConnected) {
      return activeTable;
    }
    if (typeof window === 'undefined' || typeof HTMLElement === 'undefined') {
      return null;
    }
    const sel = window.getSelection();
    const anchorEl =
      sel?.anchorNode instanceof HTMLElement
        ? sel.anchorNode
        : sel?.anchorNode?.parentElement;
    const domTable = anchorEl?.closest('table.ql-tiny-table') as HTMLTableElement | null;
    if (domTable && domTable.isConnected) {
      return domTable;
    }
    return null;
  }, [activeTable]);

  const resolveTargetCell = useCallback((): HTMLTableCellElement | null => {
    const tbl = resolveTargetTable();
    if (
      activeCellRef.current &&
      activeCellRef.current.isConnected &&
      (!tbl || tbl.contains(activeCellRef.current))
    ) {
      return activeCellRef.current;
    }
    if (activeCell && activeCell.isConnected && (!tbl || tbl.contains(activeCell))) {
      return activeCell;
    }
    const validSelected = selectedCellsRef.current.find(
      (c) => c.isConnected && (!tbl || tbl.contains(c))
    );
    if (validSelected) return validSelected;

    if (typeof window !== 'undefined' && typeof HTMLElement !== 'undefined') {
      const sel = window.getSelection();
      const anchorEl =
        sel?.anchorNode instanceof HTMLElement
          ? sel.anchorNode
          : sel?.anchorNode?.parentElement;
      const domCell = anchorEl?.closest('td, th') as HTMLTableCellElement | null;
      if (domCell && domCell.isConnected && (!tbl || tbl.contains(domCell))) {
        return domCell;
      }
    }

    if (tbl) {
      return tbl.querySelector('td, th') as HTMLTableCellElement | null;
    }
    return null;
  }, [activeCell, resolveTargetTable]);

  const selectSingleCell = useCallback(
    (table: HTMLTableElement, cell: HTMLTableCellElement) => {
      ensureCellEditor(cell);
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
      return coords;
    },
    [applySelectionBoundsOnTable]
  );

  return {
    activeTable,
    activeCell,
    selectedCells,
    selectionBounds,
    activeTableRef,
    activeCellRef,
    selectedCellsRef,
    selectionBoundsRef,
    clearCellSelectionClasses,
    clearTableSelection,
    applySelectionBoundsOnTable,
    syncTableAndCellState,
    resolveTargetTable,
    resolveTargetCell,
    selectSingleCell,
  };
}
