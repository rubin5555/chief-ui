'use client';

import { useEffect, useRef, useState } from 'react';
import { CellBounds } from '../types';
import { getCellCoords } from '../tableEngine';

interface UseEditorCanvasEventsParams {
  editorRootWrapperRef: React.MutableRefObject<HTMLDivElement | null>;
  editorContainerRef: React.MutableRefObject<HTMLDivElement | null>;
  quillInstanceRef: React.MutableRefObject<any>;
  activeTableRef: React.MutableRefObject<HTMLTableElement | null>;
  activeCellRef: React.MutableRefObject<HTMLTableCellElement | null>;
  selectSingleCell: (
    table: HTMLTableElement,
    cell: HTMLTableCellElement
  ) => { originRow: number; originCol: number; rowSpan: number; colSpan: number } | null;
  applySelectionBoundsOnTable: (
    table: HTMLTableElement,
    bounds: CellBounds,
    primaryCell?: HTMLTableCellElement | null
  ) => void;
  syncTableAndCellState: (
    table: HTMLTableElement | null,
    cell: HTMLTableCellElement | null,
    cells?: HTMLTableCellElement[]
  ) => void;
  clearTableSelection: (root?: HTMLElement | null) => void;
  applyFormatPainterOnMouseUp: (e: MouseEvent) => void;
  cancelFormatPainter: () => void;
  pushHistorySnapshot: (immediate?: boolean) => void;
  closeAllPopovers: () => void;
  onOpenContextMenu: (pos: { x: number; y: number }) => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

export function useEditorCanvasEvents({
  editorRootWrapperRef,
  editorContainerRef,
  quillInstanceRef,
  activeTableRef,
  activeCellRef,
  selectSingleCell,
  applySelectionBoundsOnTable,
  syncTableAndCellState,
  clearTableSelection,
  applyFormatPainterOnMouseUp,
  cancelFormatPainter,
  pushHistorySnapshot,
  closeAllPopovers,
  onOpenContextMenu,
  onUndo,
  onRedo,
}: UseEditorCanvasEventsParams) {
  const [activeImage, setActiveImage] = useState<HTMLImageElement | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<string[]>(['p']);

  // Drag Selection Refs
  const isDraggingCellsRef = useRef(false);
  const dragStartCellRef = useRef<HTMLTableCellElement | null>(null);
  const dragTableRef = useRef<HTMLTableElement | null>(null);

  useEffect(() => {
    const container = editorContainerRef.current;
    if (!container) return;

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('[data-tiny-table-ui="true"]') ||
        target.closest('[data-tiny-image-ui="true"]') ||
        target.closest('[data-modal-container="true"]') ||
        target.closest('[data-editor-chrome="true"]')
      ) {
        return;
      }

      // Check if clicking directly on an image
      const imgTarget = target.closest('img') as HTMLImageElement | null;
      if (imgTarget && container.contains(imgTarget)) {
        setActiveImage(imgTarget);
        setBreadcrumb(['img']);
      } else {
        setActiveImage(null);
      }

      // Close popovers when clicking inside editor canvas
      closeAllPopovers();

      if (e.button === 2) {
        const cell = target.closest('td, th') as HTMLTableCellElement | null;
        const table = target.closest('table.ql-tiny-table') as HTMLTableElement | null;
        if (cell && table) {
          if (!cell.classList.contains('ql-tiny-cell-selected')) {
            selectSingleCell(table, cell);
          } else {
            syncTableAndCellState(table, cell);
          }
        }
        return;
      }

      if (e.button !== 0) return;

      const cell = target.closest('td, th') as HTMLTableCellElement | null;
      const table = target.closest('table.ql-tiny-table') as HTMLTableElement | null;

      if (cell && table) {
        const currentCell = activeCellRef.current;
        const currentTable = activeTableRef.current;

        // Shift+Click rectangular range selection
        if (e.shiftKey && currentCell && currentTable === table) {
          e.preventDefault();
          const startCoords = getCellCoords(table, currentCell);
          const endCoords = getCellCoords(table, cell);
          if (startCoords && endCoords) {
            applySelectionBoundsOnTable(
              table,
              {
                minRow: Math.min(startCoords.originRow, endCoords.originRow),
                maxRow: Math.max(
                  startCoords.originRow + startCoords.rowSpan - 1,
                  endCoords.originRow + endCoords.rowSpan - 1
                ),
                minCol: Math.min(startCoords.originCol, endCoords.originCol),
                maxCol: Math.max(
                  startCoords.originCol + startCoords.colSpan - 1,
                  endCoords.originCol + endCoords.colSpan - 1
                ),
              },
              currentCell
            );
          }
          return;
        }

        // Start potential multi-cell drag selection
        isDraggingCellsRef.current = true;
        dragStartCellRef.current = cell;
        dragTableRef.current = table;

        const hadCellEditor = Boolean(cell.querySelector(':scope > .ql-tiny-cell-editor'));
        const coords = selectSingleCell(table, cell);
        if (!hadCellEditor) {
          const lazyEditor = cell.querySelector(':scope > .ql-tiny-cell-editor') as HTMLElement | null;
          lazyEditor?.focus();
          requestAnimationFrame(() => {
            if (lazyEditor && lazyEditor.isConnected) {
              lazyEditor.focus();
            }
          });
        }
        if (coords) {
          const section = cell.parentElement?.parentElement?.tagName.toLowerCase() || 'tbody';
          const spanInfo =
            coords.rowSpan > 1 || coords.colSpan > 1
              ? ` (${coords.colSpan}×${coords.rowSpan} merged)`
              : '';
          setBreadcrumb([
            'table',
            section,
            `tr [Row ${coords.originRow + 1}]`,
            `${cell.tagName.toLowerCase()} [Col ${coords.originCol + 1}${spanInfo}]`,
          ]);
        }
      } else if (table) {
        const currentCell = activeCellRef.current;
        const fallbackCell =
          currentCell && table.contains(currentCell)
            ? currentCell
            : (table.querySelector('td, th') as HTMLTableCellElement | null);
        syncTableAndCellState(table, fallbackCell);
        setBreadcrumb(['table', 'caption']);
      } else if (!target.closest('.ql-tiny-table-wrapper')) {
        // Clicked outside any table inside the editor -> clear table & cell focus
        clearTableSelection();

        if (imgTarget) {
          setBreadcrumb(['img']);
        } else {
          const block = target.closest('p, h1, h2, h3, h4, ul, ol, blockquote, pre');
          setBreadcrumb([block ? block.tagName.toLowerCase() : 'p']);
        }
      }
    };

    const handleGlobalMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const rootWrapper = editorRootWrapperRef.current;
      if (rootWrapper && !rootWrapper.contains(target)) {
        if (
          target.closest('[data-tiny-table-ui="true"]') ||
          target.closest('[data-tiny-image-ui="true"]') ||
          target.closest('[data-modal-container="true"]') ||
          target.closest('[data-editor-chrome="true"]') ||
          target.closest('[data-editor-ribbon]')
        ) {
          return;
        }
        clearTableSelection();
        setActiveImage(null);
        closeAllPopovers();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingCellsRef.current || !dragStartCellRef.current || !dragTableRef.current) {
        return;
      }
      const target = e.target as HTMLElement;
      const hoverCell = target.closest('td, th') as HTMLTableCellElement | null;
      if (!hoverCell) return;

      const table = dragTableRef.current;
      if (!table.contains(hoverCell)) return;

      if (hoverCell !== dragStartCellRef.current) {
        window.getSelection()?.removeAllRanges();
        const startCoords = getCellCoords(table, dragStartCellRef.current);
        const endCoords = getCellCoords(table, hoverCell);
        if (startCoords && endCoords) {
          applySelectionBoundsOnTable(
            table,
            {
              minRow: Math.min(startCoords.originRow, endCoords.originRow),
              maxRow: Math.max(
                startCoords.originRow + startCoords.rowSpan - 1,
                endCoords.originRow + endCoords.rowSpan - 1
              ),
              minCol: Math.min(startCoords.originCol, endCoords.originCol),
              maxCol: Math.max(
                startCoords.originCol + startCoords.colSpan - 1,
                endCoords.originCol + endCoords.colSpan - 1
              ),
            },
            dragStartCellRef.current
          );
        }
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      isDraggingCellsRef.current = false;
      applyFormatPainterOnMouseUp(e);
    };

    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const cell = target.closest('td, th') as HTMLTableCellElement | null;
      const table = target.closest('table.ql-tiny-table') as HTMLTableElement | null;
      if (cell && table) {
        e.preventDefault();
        onOpenContextMenu({ x: e.clientX, y: e.clientY });
      }
    };

    const handleTableCustomChange = () => {
      pushHistorySnapshot(false);
    };

    const handleTableExitBelow = (e: Event) => {
      const customEvt = e as CustomEvent<{ wrapper: HTMLElement }>;
      const wrapper = customEvt.detail?.wrapper;
      const quill = quillInstanceRef.current;
      if (!wrapper || !quill) return;

      const p = document.createElement('p');
      p.innerHTML = '<br>';
      wrapper.parentNode?.insertBefore(p, wrapper.nextSibling);
      const sel = window.getSelection();
      if (sel) {
        const range = document.createRange();
        range.setStart(p, 0);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
      pushHistorySnapshot(true);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cancelFormatPainter();
      }
    };

    const handleTableUndo = () => {
      onUndo?.();
    };
    const handleTableRedo = () => {
      onRedo?.();
    };

    container.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousedown', handleGlobalMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('contextmenu', handleContextMenu);
    container.addEventListener('tiny-table-change', handleTableCustomChange);
    container.addEventListener('tiny-table-exit-below', handleTableExitBelow);
    container.addEventListener('tiny-table-undo', handleTableUndo);
    container.addEventListener('tiny-table-redo', handleTableRedo);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousedown', handleGlobalMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('contextmenu', handleContextMenu);
      container.removeEventListener('tiny-table-change', handleTableCustomChange);
      container.removeEventListener('tiny-table-exit-below', handleTableExitBelow);
      container.removeEventListener('tiny-table-undo', handleTableUndo);
      container.removeEventListener('tiny-table-redo', handleTableRedo);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    activeCellRef,
    activeTableRef,
    applyFormatPainterOnMouseUp,
    applySelectionBoundsOnTable,
    cancelFormatPainter,
    clearTableSelection,
    closeAllPopovers,
    editorContainerRef,
    editorRootWrapperRef,
    onOpenContextMenu,
    onRedo,
    onUndo,
    pushHistorySnapshot,
    quillInstanceRef,
    selectSingleCell,
    syncTableAndCellState,
  ]);

  return {
    activeImage,
    setActiveImage,
    breadcrumb,
    setBreadcrumb,
  };
}
