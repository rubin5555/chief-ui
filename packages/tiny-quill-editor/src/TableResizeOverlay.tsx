'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { buildTableGrid, ensureColGroup, getAllTableRows } from './tableEngine';
import { CellBounds } from './types';

interface TableResizeOverlayProps {
  editorContainerRef: React.RefObject<HTMLDivElement | null>;
  activeTable: HTMLTableElement | null;
  onSelectBounds: (bounds: CellBounds) => void;
  onTableMutated: () => void;
}

interface ColBoundary {
  colIndex: number;
  x: number; // relative to overlay container
  leftColX: number;
}

interface RowBoundary {
  rowIndex: number;
  y: number; // relative to overlay container
  topRowY: number;
}

type TableResizeDirection = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

export const TableResizeOverlay: React.FC<TableResizeOverlayProps> = ({
  editorContainerRef,
  activeTable,
  onSelectBounds,
  onTableMutated,
}) => {
  const [tableRect, setTableRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);
  const [colBoundaries, setColBoundaries] = useState<ColBoundary[]>([]);
  const [rowBoundaries, setRowBoundaries] = useState<RowBoundary[]>([]);

  // Individual Column Divider Drag State
  const [draggingCol, setDraggingCol] = useState<{
    colIndex: number;
    startX: number;
    currentX: number;
    initialWidths: number[];
    tableWidth: number;
  } | null>(null);

  // Individual Row Divider Drag State
  const [draggingRow, setDraggingRow] = useState<{
    rowIndex: number;
    startY: number;
    currentY: number;
    initialHeight: number;
  } | null>(null);

  // Whole-Table 8-Handle Resize State (TinyMCE style: 4 corners + 4 edges)
  const [draggingTable, setDraggingTable] = useState<{
    direction: TableResizeDirection;
    startX: number;
    startY: number;
    initialWidth: number;
    initialHeight: number;
    initialColWidths: number[];
    initialRowHeights: number[];
    currentWidth: number;
    currentHeight: number;
    editorInnerWidth: number;
  } | null>(null);

  const rafRef = useRef<number | null>(null);

  const measureTable = useCallback(() => {
    const container = editorContainerRef.current;
    if (!container || !activeTable || !activeTable.isConnected) {
      setTableRect(null);
      return;
    }

    const containerBox = container.getBoundingClientRect();
    const tblBox = activeTable.getBoundingClientRect();

    const top = tblBox.top - containerBox.top + container.scrollTop;
    const left = tblBox.left - containerBox.left + container.scrollLeft;

    setTableRect({
      top,
      left,
      width: tblBox.width,
      height: tblBox.height,
    });

    // Compute logical column boundaries using the 2D grid
    const { grid, rows, numRows, numCols } = buildTableGrid(activeTable);
    if (numRows === 0 || numCols === 0) return;

    const colRightEdges: number[] = new Array(numCols).fill(0);
    const colLeftEdges: number[] = new Array(numCols).fill(0);

    for (let c = 0; c < numCols; c++) {
      let foundRect: DOMRect | null = null;
      for (let r = 0; r < numRows; r++) {
        const slot = grid[r]?.[c];
        if (slot && slot.colSpan === 1) {
          foundRect = slot.cell.getBoundingClientRect();
          break;
        }
      }
      if (foundRect) {
        colLeftEdges[c] = foundRect.left - containerBox.left + container.scrollLeft;
        colRightEdges[c] = foundRect.right - containerBox.left + container.scrollLeft;
      } else {
        const colW = tblBox.width / numCols;
        colLeftEdges[c] = left + c * colW;
        colRightEdges[c] = left + (c + 1) * colW;
      }
    }

    const computedCols: ColBoundary[] = colRightEdges.map((x, idx) => ({
      colIndex: idx,
      x,
      leftColX: colLeftEdges[idx],
    }));
    setColBoundaries(computedCols);

    // ponytail: cap row resize handles at 50 rows on large tables so scroll/resize frames don't measure & mount hundreds of overlay nodes
    const computedRows: RowBoundary[] = rows.slice(0, 50).map((tr, idx) => {
      const rBox = tr.getBoundingClientRect();
      return {
        rowIndex: idx,
        topRowY: rBox.top - containerBox.top + container.scrollTop,
        y: rBox.bottom - containerBox.top + container.scrollTop,
      };
    });
    setRowBoundaries(computedRows);
  }, [editorContainerRef, activeTable]);

  useEffect(() => {
    measureTable();
    const container = editorContainerRef.current;
    const handleUpdate = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(measureTable);
    };

    window.addEventListener('resize', handleUpdate);
    // Capture-phase scroll listener catches scroll on editorContainerRef, .ql-editor, or window
    window.addEventListener('scroll', handleUpdate, true);
    container?.addEventListener('scroll', handleUpdate, { passive: true });

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(handleUpdate);
      if (activeTable) resizeObserver.observe(activeTable);
      if (container) resizeObserver.observe(container);
      const qlEditor = container?.querySelector('.ql-editor');
      if (qlEditor) resizeObserver.observe(qlEditor);
    }

    return () => {
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('scroll', handleUpdate, true);
      container?.removeEventListener('scroll', handleUpdate);
      resizeObserver?.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [measureTable, activeTable, editorContainerRef]);

  // 1. Handle Individual Column Resize Mouse Move / Up
  useEffect(() => {
    if (!draggingCol || !activeTable) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - draggingCol.startX;
      const colIdx = draggingCol.colIndex;
      const minW = 45;

      const cols = ensureColGroup(activeTable);
      if (colIdx < cols.length - 1) {
        const leftOrig = draggingCol.initialWidths[colIdx];
        const rightOrig = draggingCol.initialWidths[colIdx + 1];
        const combined = leftOrig + rightOrig;
        const newLeft = Math.max(minW, Math.min(combined - minW, leftOrig + deltaX));
        const newRight = combined - newLeft;

        cols[colIdx].style.width = `${Math.round(newLeft)}px`;
        cols[colIdx + 1].style.width = `${Math.round(newRight)}px`;
        setDraggingCol((prev) =>
          prev
            ? {
                ...prev,
                currentX: prev.startX + (newLeft - leftOrig),
              }
            : null
        );
      } else {
        const lastOrig = draggingCol.initialWidths[colIdx];
        const newLast = Math.max(minW, lastOrig + deltaX);
        const diff = newLast - lastOrig;
        cols[colIdx].style.width = `${Math.round(newLast)}px`;
        activeTable.style.width = `${Math.round(draggingCol.tableWidth + diff)}px`;
        setDraggingCol((prev) =>
          prev
            ? {
                ...prev,
                currentX: prev.startX + diff,
              }
            : null
        );
      }
    };

    const handleMouseUp = () => {
      setDraggingCol(null);
      measureTable();
      onTableMutated();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingCol, activeTable, measureTable, onTableMutated]);

  // 2. Handle Individual Row Resize Mouse Move / Up
  useEffect(() => {
    if (!draggingRow || !activeTable) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = e.clientY - draggingRow.startY;
      const newHeight = Math.max(28, draggingRow.initialHeight + deltaY);
      const rows = getAllTableRows(activeTable);
      const targetRow = rows[draggingRow.rowIndex];
      if (targetRow) {
        targetRow.style.height = `${Math.round(newHeight)}px`;
      }
      setDraggingRow((prev) =>
        prev
          ? {
              ...prev,
              currentY: prev.startY + (newHeight - prev.initialHeight),
            }
          : null
      );
    };

    const handleMouseUp = () => {
      setDraggingRow(null);
      measureTable();
      onTableMutated();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingRow, activeTable, measureTable, onTableMutated]);

  // 3. Handle Whole-Table 8-Handle Resize (Proportional Width & Height Scaling)
  useEffect(() => {
    if (!draggingTable || !activeTable) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dX = e.clientX - draggingTable.startX;
      const dY = e.clientY - draggingTable.startY;
      const dir = draggingTable.direction;

      const numCols = Math.max(1, draggingTable.initialColWidths.length);
      const numRows = Math.max(1, draggingTable.initialRowHeights.length);
      const minTableWidth = Math.max(180, numCols * 48);
      const minTableHeight = Math.max(60, numRows * 28);

      let newW = draggingTable.initialWidth;
      let newH = draggingTable.initialHeight;

      if (dir.includes('e')) {
        newW = Math.max(minTableWidth, Math.round(draggingTable.initialWidth + dX));
      } else if (dir.includes('w')) {
        newW = Math.max(minTableWidth, Math.round(draggingTable.initialWidth - dX));
      }

      if (dir.includes('s')) {
        newH = Math.max(minTableHeight, Math.round(draggingTable.initialHeight + dY));
      } else if (dir.includes('n')) {
        newH = Math.max(minTableHeight, Math.round(draggingTable.initialHeight - dY));
      }

      // Apply proportional column width scaling if width changed
      if (dir.includes('e') || dir.includes('w')) {
        activeTable.style.width = `${newW}px`;
        const cols = ensureColGroup(activeTable);
        const wRatio = newW / Math.max(1, draggingTable.initialWidth);
        cols.forEach((col, idx) => {
          const baseW = draggingTable.initialColWidths[idx] || newW / numCols;
          col.style.width = `${Math.max(45, Math.round(baseW * wRatio))}px`;
        });
      }

      // Apply proportional row height scaling if height changed
      if (dir.includes('s') || dir.includes('n')) {
        const rows = getAllTableRows(activeTable);
        const hRatio = newH / Math.max(1, draggingTable.initialHeight);
        rows.forEach((tr, idx) => {
          const baseH = draggingTable.initialRowHeights[idx] || newH / numRows;
          tr.style.height = `${Math.max(26, Math.round(baseH * hRatio))}px`;
        });
        activeTable.style.height = `${newH}px`;
      }

      setDraggingTable((prev) =>
        prev
          ? {
              ...prev,
              currentWidth: newW,
              currentHeight: newH,
            }
          : null
      );

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(measureTable);
    };

    const handleMouseUp = () => {
      setDraggingTable(null);
      measureTable();
      onTableMutated();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingTable, activeTable, measureTable, onTableMutated]);

  if (!activeTable || !tableRect) return null;

  const startColumnResize = (e: React.MouseEvent, colIndex: number) => {
    e.preventDefault();
    e.stopPropagation();

    const cols = ensureColGroup(activeTable);
    const widths = colBoundaries.map((b) => Math.max(45, b.x - b.leftColX));
    cols.forEach((col, i) => {
      if (widths[i]) {
        col.style.width = `${Math.round(widths[i])}px`;
      }
    });
    Array.from(activeTable.querySelectorAll('td, th')).forEach((cell) => {
      (cell as HTMLElement).style.width = '';
    });

    setDraggingCol({
      colIndex,
      startX: e.clientX,
      currentX: e.clientX,
      initialWidths: widths,
      tableWidth: tableRect.width,
    });
  };

  const startRowResize = (e: React.MouseEvent, rowIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    const rows = getAllTableRows(activeTable);
    const tr = rows[rowIndex];
    if (!tr) return;
    const initialHeight = tr.getBoundingClientRect().height;
    setDraggingRow({
      rowIndex,
      startY: e.clientY,
      currentY: e.clientY,
      initialHeight,
    });
  };

  const startWholeTableResize = (e: React.MouseEvent, direction: TableResizeDirection) => {
    e.preventDefault();
    e.stopPropagation();

    const initialColWidths = colBoundaries.map((b) => Math.max(45, b.x - b.leftColX));
    const rows = getAllTableRows(activeTable);
    const initialRowHeights = rows.map((r) => Math.max(26, r.getBoundingClientRect().height));

    // Clear explicit cell widths/heights so colgroup & tr govern dimensions cleanly
    Array.from(activeTable.querySelectorAll('td, th')).forEach((cell) => {
      const el = cell as HTMLElement;
      el.style.width = '';
      el.style.height = '';
    });

    const containerWidth = editorContainerRef.current
      ? editorContainerRef.current.clientWidth - 72
      : 800;

    setDraggingTable({
      direction,
      startX: e.clientX,
      startY: e.clientY,
      initialWidth: Math.round(tableRect.width),
      initialHeight: Math.round(tableRect.height),
      initialColWidths,
      initialRowHeights,
      currentWidth: Math.round(tableRect.width),
      currentHeight: Math.round(tableRect.height),
      editorInnerWidth: Math.max(200, containerWidth),
    });
  };

  const handleSelectEntireTable = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (rowBoundaries.length === 0 || colBoundaries.length === 0) return;
    onSelectBounds({
      minRow: 0,
      maxRow: rowBoundaries.length - 1,
      minCol: 0,
      maxCol: colBoundaries.length - 1,
    });
  };

  const handleSelectColumn = (e: React.MouseEvent, colIdx: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (rowBoundaries.length === 0) return;
    onSelectBounds({
      minRow: 0,
      maxRow: rowBoundaries.length - 1,
      minCol: colIdx,
      maxCol: colIdx,
    });
  };

  const handleSelectRow = (e: React.MouseEvent, rowIdx: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (colBoundaries.length === 0) return;
    onSelectBounds({
      minRow: rowIdx,
      maxRow: rowIdx,
      minCol: 0,
      maxCol: colBoundaries.length - 1,
    });
  };

  // Define the 8 TinyMCE whole-table resize handles around the table bounding box
  const wholeTableHandles: Array<{
    dir: TableResizeDirection;
    top: number;
    left: number;
    cursor: string;
    title: string;
  }> = [
    {
      dir: 'nw',
      top: tableRect.top - 5,
      left: tableRect.left - 5,
      cursor: 'cursor-nwse-resize',
      title: 'Drag corner to resize entire table (Width & Height)',
    },
    {
      dir: 'n',
      top: tableRect.top - 5,
      left: tableRect.left + tableRect.width / 2 - 5,
      cursor: 'cursor-ns-resize',
      title: 'Drag top edge to resize table height',
    },
    {
      dir: 'ne',
      top: tableRect.top - 5,
      left: tableRect.left + tableRect.width - 5,
      cursor: 'cursor-nesw-resize',
      title: 'Drag corner to resize entire table (Width & Height)',
    },
    {
      dir: 'e',
      top: tableRect.top + tableRect.height / 2 - 5,
      left: tableRect.left + tableRect.width - 5,
      cursor: 'cursor-ew-resize',
      title: 'Drag right edge to resize entire table width proportionally',
    },
    {
      dir: 'se',
      top: tableRect.top + tableRect.height - 5,
      left: tableRect.left + tableRect.width - 5,
      cursor: 'cursor-nwse-resize',
      title: 'Drag corner to resize entire table (Width & Height)',
    },
    {
      dir: 's',
      top: tableRect.top + tableRect.height - 5,
      left: tableRect.left + tableRect.width / 2 - 5,
      cursor: 'cursor-ns-resize',
      title: 'Drag bottom edge to resize table height proportionally',
    },
    {
      dir: 'sw',
      top: tableRect.top + tableRect.height - 5,
      left: tableRect.left - 5,
      cursor: 'cursor-nesw-resize',
      title: 'Drag corner to resize entire table (Width & Height)',
    },
    {
      dir: 'w',
      top: tableRect.top + tableRect.height / 2 - 5,
      left: tableRect.left - 5,
      cursor: 'cursor-ew-resize',
      title: 'Drag left edge to resize entire table width proportionally',
    },
  ];

  return (
    <div
      data-tiny-table-ui="true"
      className="pointer-events-none absolute top-0 left-0 w-full z-20 select-none"
    >
      {/* Active Table Bounding Outline when Resizing Whole Table */}
      <div
        style={{
          top: tableRect.top,
          left: tableRect.left,
          width: tableRect.width,
          height: tableRect.height,
        }}
        className={`pointer-events-none absolute transition-colors ${
          draggingTable
            ? 'border-2 border-dashed border-blue-600 bg-blue-500/5 z-30'
            : 'border border-blue-500/40'
        }`}
      />

      {/* Top-Left Select All Table Button (offset slightly outside NW handle) */}
      <button
        type="button"
        title="Select Entire Table"
        onMouseDown={handleSelectEntireTable}
        style={{
          top: Math.max(2, tableRect.top - 22),
          left: Math.max(2, tableRect.left - 18),
        }}
        className="pointer-events-auto absolute z-30 flex h-4 w-4 items-center justify-center rounded border border-blue-600 bg-blue-600 text-[10px] text-white shadow-sm transition hover:bg-blue-700"
      >
        ⊞
      </button>

      {/* Top Column Selector Bars */}
      {colBoundaries.map((col) => {
        const colW = Math.max(16, col.x - col.leftColX);
        return (
          <button
            key={`col-sel-${col.colIndex}`}
            type="button"
            title={`Click to select Column ${col.colIndex + 1}`}
            onMouseDown={(e) => handleSelectColumn(e, col.colIndex)}
            style={{
              top: Math.max(2, tableRect.top - 15),
              left: col.leftColX,
              width: colW - 1,
              height: 10,
            }}
            className="pointer-events-auto absolute flex items-center justify-center border border-slate-300 bg-slate-100/90 text-[8px] text-slate-500 opacity-75 transition hover:border-blue-500 hover:bg-blue-100 hover:text-blue-700 hover:opacity-100"
          >
            ▾
          </button>
        );
      })}

      {/* Left Row Selector Bars */}
      {rowBoundaries.map((row) => {
        const rowH = Math.max(16, row.y - row.topRowY);
        return (
          <button
            key={`row-sel-${row.rowIndex}`}
            type="button"
            title={`Click to select Row ${row.rowIndex + 1}`}
            onMouseDown={(e) => handleSelectRow(e, row.rowIndex)}
            style={{
              top: row.topRowY,
              left: Math.max(2, tableRect.left - 15),
              width: 10,
              height: rowH - 1,
            }}
            className="pointer-events-auto absolute flex items-center justify-center border border-slate-300 bg-slate-100/90 text-[8px] text-slate-500 opacity-75 transition hover:border-blue-500 hover:bg-blue-100 hover:text-blue-700 hover:opacity-100"
          >
            ▸
          </button>
        );
      })}

      {/* Internal Column Resize Drag Handles */}
      {colBoundaries.map((col) => (
        <div
          key={`col-resizer-${col.colIndex}`}
          title="Drag to resize column"
          onMouseDown={(e) => startColumnResize(e, col.colIndex)}
          style={{
            top: tableRect.top,
            left: col.x - 4,
            height: tableRect.height,
            width: 8,
          }}
          className="pointer-events-auto absolute z-20 cursor-col-resize group"
        >
          <div className="mx-auto h-full w-[2px] bg-transparent transition-colors group-hover:bg-blue-500" />
        </div>
      ))}

      {/* Internal Row Resize Drag Handles (for internal row dividers) */}
      {rowBoundaries.slice(0, -1).map((row) => (
        <div
          key={`row-resizer-${row.rowIndex}`}
          title="Drag to resize row height"
          onMouseDown={(e) => startRowResize(e, row.rowIndex)}
          style={{
            top: row.y - 4,
            left: tableRect.left,
            width: tableRect.width,
            height: 8,
          }}
          className="pointer-events-auto absolute z-20 cursor-row-resize group"
        >
          <div className="my-auto h-[2px] w-full bg-transparent transition-colors group-hover:bg-blue-500" />
        </div>
      ))}

      {/* Prominent Bottom Table Drag Bar (Resize Table Height from Bottom) */}
      <div
        title="Drag bottom bar to resize table height"
        onMouseDown={(e) => startWholeTableResize(e, 's')}
        style={{
          top: tableRect.top + tableRect.height - 4,
          left: tableRect.left,
          width: tableRect.width,
          height: 14,
        }}
        className="pointer-events-auto absolute z-25 flex cursor-ns-resize items-center justify-center group"
      >
        <div className="h-[3px] w-full bg-blue-500/20 transition-colors group-hover:bg-blue-600" />
        <div className="absolute flex h-3.5 w-14 items-center justify-center rounded-full border border-blue-500 bg-white text-[9px] font-bold text-blue-600 shadow-sm transition group-hover:bg-blue-600 group-hover:text-white">
          ═══
        </div>
      </div>

      {/* Prominent Bottom-Right Corner Diagonal Table Resize Grip */}
      <div
        title="Drag corner to resize whole table width & height"
        onMouseDown={(e) => startWholeTableResize(e, 'se')}
        style={{
          top: tableRect.top + tableRect.height - 8,
          left: tableRect.left + tableRect.width - 8,
          width: 16,
          height: 16,
        }}
        className="pointer-events-auto absolute z-35 flex cursor-nwse-resize items-center justify-center rounded border-2 border-white bg-blue-600 text-[9px] leading-none text-white shadow-md transition-transform hover:scale-125 hover:bg-blue-700"
      >
        ◢
      </div>

      {/* 8 TinyMCE Whole-Table Resize Handles (4 Corners + 4 Mid-Sides) */}
      {wholeTableHandles.map((h) => (
        <div
          key={`tbl-handle-${h.dir}`}
          title={h.title}
          onMouseDown={(e) => startWholeTableResize(e, h.dir)}
          style={{
            top: h.top,
            left: h.left,
            width: 10,
            height: 10,
          }}
          className={`pointer-events-auto absolute z-30 ${h.cursor} rounded-[2px] border-2 border-white bg-blue-600 shadow-md transition-transform hover:scale-125 hover:bg-blue-700`}
        />
      ))}

      {/* Live Column Resize Guide Line & Dimension Badge */}
      {draggingCol && (
        <div
          style={{
            top: tableRect.top - 26,
            left:
              colBoundaries[draggingCol.colIndex]?.x +
              (draggingCol.currentX - draggingCol.startX),
            height: tableRect.height + 26,
          }}
          className="pointer-events-none absolute z-30 border-l-2 border-dashed border-blue-600"
        >
          <span className="absolute -top-1 -left-10 rounded bg-blue-600 px-1.5 py-0.5 text-[11px] font-semibold text-white shadow">
            {Math.round(
              draggingCol.initialWidths[draggingCol.colIndex] +
                (draggingCol.currentX - draggingCol.startX)
            )}
            px
          </span>
        </div>
      )}

      {/* Live Row Resize Guide Line & Height Badge */}
      {draggingRow && (
        <div
          style={{
            top:
              rowBoundaries[draggingRow.rowIndex]?.y +
              (draggingRow.currentY - draggingRow.startY),
            left: tableRect.left,
            width: tableRect.width,
          }}
          className="pointer-events-none absolute z-30 border-t-2 border-dashed border-blue-600"
        >
          <span className="absolute -top-6 right-2 rounded bg-blue-600 px-1.5 py-0.5 text-[11px] font-semibold text-white shadow">
            {Math.round(
              draggingRow.initialHeight + (draggingRow.currentY - draggingRow.startY)
            )}
            px
          </span>
        </div>
      )}

      {/* Live Whole-Table Resize Dimension & Percentage Badge */}
      {draggingTable && (
        <div
          style={{
            top: Math.max(8, tableRect.top + tableRect.height / 2 - 16),
            left: Math.max(8, tableRect.left + tableRect.width / 2 - 75),
          }}
          className="pointer-events-none absolute z-40 flex items-center gap-1.5 rounded-lg bg-slate-900/95 px-3 py-1.5 text-xs font-bold text-white shadow-xl border border-slate-700"
        >
          <span className="text-blue-400">Table:</span>
          <span>
            {draggingTable.currentWidth}px (
            {Math.min(
              100,
              Math.round((draggingTable.currentWidth / draggingTable.editorInnerWidth) * 100)
            )}
            %) × {draggingTable.currentHeight}px
          </span>
        </div>
      )}
    </div>
  );
};
