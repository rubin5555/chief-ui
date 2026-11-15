import { CellBounds, GridSlot } from '../types';
import {
  buildTableGrid,
  createTableCell,
  ensureCellEditor,
  ensureColGroup,
  expandBoundsToMergedCells,
  getCellCoords,
  syncTableDOMFromGrid,
} from './gridMatrix';

/**
 * Merges all cells inside `bounds` into the top-left origin cell.
 * Preserves all non-empty content from absorbed cells.
 */
export function mergeCellsInBounds(
  table: HTMLTableElement,
  bounds: CellBounds
): HTMLTableCellElement | null {
  const { grid, rows } = buildTableGrid(table);
  const expanded = expandBoundsToMergedCells(grid, bounds);
  const { minRow, maxRow, minCol, maxCol } = expanded;

  const targetSlot = grid[minRow]?.[minCol];
  if (!targetSlot) return null;

  const targetCell = targetSlot.cell;
  const isTiny = table.classList.contains('ql-tiny-table');
  const absorbedCells = new Set<HTMLTableCellElement>();

  if (isTiny) {
    const targetEditor = ensureCellEditor(targetCell);
    const targetIsEmpty = !targetEditor.textContent?.trim() && !targetEditor.querySelector('img');

    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        const slot = grid[r]?.[c];
        if (!slot || slot.cell === targetCell || absorbedCells.has(slot.cell)) continue;
        absorbedCells.add(slot.cell);

        const srcEditor = ensureCellEditor(slot.cell);
        const hasContent =
          Boolean(srcEditor.textContent?.trim()) || Boolean(srcEditor.querySelector('img, ul, ol'));
        if (hasContent) {
          if (
            targetIsEmpty &&
            targetEditor.children.length === 1 &&
            !targetEditor.textContent?.trim()
          ) {
            targetEditor.innerHTML = '';
          }
          Array.from(srcEditor.childNodes).forEach((node) => {
            targetEditor.appendChild(node.cloneNode(true));
          });
        }
        slot.cell.remove();
      }
    }
  } else {
    const parts: string[] = [];
    const initHtml = targetCell.innerHTML.trim();
    if (initHtml && initHtml !== '<br>' && initHtml !== '<p><br></p>') {
      parts.push(initHtml);
    }
    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        const slot = grid[r]?.[c];
        if (!slot || slot.cell === targetCell || absorbedCells.has(slot.cell)) continue;
        absorbedCells.add(slot.cell);
        const cellHtml = slot.cell.innerHTML.trim();
        if (cellHtml && cellHtml !== '<br>' && cellHtml !== '<p><br></p>') {
          parts.push(cellHtml);
        }
        slot.cell.remove();
      }
    }
    targetCell.innerHTML = parts.join(' ') || '<br>';
  }

  const newRowSpan = maxRow - minRow + 1;
  const newColSpan = maxCol - minCol + 1;

  for (let r = minRow; r <= maxRow; r++) {
    for (let c = minCol; c <= maxCol; c++) {
      grid[r][c] = {
        cell: targetCell,
        originRow: minRow,
        originCol: minCol,
        rowSpan: newRowSpan,
        colSpan: newColSpan,
        isOrigin: r === minRow && c === minCol,
      };
    }
  }

  syncTableDOMFromGrid(table, rows, grid);
  return targetCell;
}

/**
 * Splits a cell:
 * - 'unmerge': completely unmerges a merged cell (rowSpan > 1 or colSpan > 1) into 1x1 cells
 * - 'horizontal': splits a cell into 2 columns (works on both merged AND 1x1 cells!)
 * - 'vertical': splits a cell into 2 rows (works on both merged AND 1x1 cells!)
 */
export function splitTableCell(
  table: HTMLTableElement,
  targetCell: HTMLTableCellElement,
  mode: 'unmerge' | 'horizontal' | 'vertical' = 'unmerge'
): void {
  const { grid, rows, numRows, numCols } = buildTableGrid(table);
  const coords = getCellCoords(table, targetCell);
  if (!coords) return;

  const { originRow, originCol, rowSpan, colSpan } = coords;
  const tagName = (targetCell.tagName.toLowerCase() === 'th' ? 'th' : 'td') as 'td' | 'th';

  if (mode === 'unmerge') {
    if (rowSpan <= 1 && colSpan <= 1) return;
    for (let r = originRow; r < originRow + rowSpan; r++) {
      for (let c = originCol; c < originCol + colSpan; c++) {
        const isOrigin = r === originRow && c === originCol;
        const cell = isOrigin ? targetCell : createTableCell(tagName, targetCell);
        grid[r][c] = {
          cell,
          originRow: r,
          originCol: c,
          rowSpan: 1,
          colSpan: 1,
          isOrigin: true,
        };
      }
    }
    syncTableDOMFromGrid(table, rows, grid);
    return;
  }

  if (mode === 'horizontal') {
    if (colSpan > 1) {
      const leftSpan = Math.floor(colSpan / 2);
      const rightSpan = colSpan - leftSpan;
      const newCell = createTableCell(tagName, targetCell);
      for (let r = originRow; r < originRow + rowSpan; r++) {
        for (let c = originCol; c < originCol + leftSpan; c++) {
          grid[r][c] = {
            cell: targetCell,
            originRow,
            originCol,
            rowSpan,
            colSpan: leftSpan,
            isOrigin: r === originRow && c === originCol,
          };
        }
        for (let c = originCol + leftSpan; c < originCol + colSpan; c++) {
          grid[r][c] = {
            cell: newCell,
            originRow,
            originCol: originCol + leftSpan,
            rowSpan,
            colSpan: rightSpan,
            isOrigin: r === originRow && c === originCol + leftSpan,
          };
        }
      }
      syncTableDOMFromGrid(table, rows, grid);
    } else {
      const newCell = createTableCell(tagName, targetCell);
      const expandedCells = new Set<HTMLTableCellElement>();

      for (let r = 0; r < numRows; r++) {
        if (r >= originRow && r < originRow + rowSpan) {
          const newSlot: GridSlot = {
            cell: newCell,
            originRow,
            originCol: originCol + 1,
            rowSpan,
            colSpan: 1,
            isOrigin: r === originRow,
          };
          grid[r].splice(originCol + 1, 0, newSlot);
        } else {
          const existingSlot = grid[r][originCol];
          if (existingSlot && !expandedCells.has(existingSlot.cell)) {
            expandedCells.add(existingSlot.cell);
            const newColSpan = existingSlot.colSpan + 1;
            for (let rr = 0; rr < numRows; rr++) {
              for (let cc = 0; cc < grid[rr].length; cc++) {
                if (grid[rr][cc]?.cell === existingSlot.cell) {
                  grid[rr][cc].colSpan = newColSpan;
                }
              }
            }
          }
          const dupSlot: GridSlot = {
            ...existingSlot,
            colSpan: existingSlot ? existingSlot.colSpan : 1,
            isOrigin: false,
          };
          grid[r].splice(originCol + 1, 0, dupSlot);
        }
      }
      const updatedOrigins = new Map<HTMLTableCellElement, { r: number; c: number }>();
      for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < grid[r].length; c++) {
          const slot = grid[r][c];
          if (!slot) continue;
          if (!updatedOrigins.has(slot.cell)) {
            updatedOrigins.set(slot.cell, { r, c });
          }
          const orig = updatedOrigins.get(slot.cell)!;
          slot.originRow = orig.r;
          slot.originCol = orig.c;
          slot.isOrigin = r === orig.r && c === orig.c;
        }
      }
      syncTableDOMFromGrid(table, rows, grid);
    }
    return;
  }

  if (mode === 'vertical') {
    if (rowSpan > 1) {
      const topSpan = Math.floor(rowSpan / 2);
      const bottomSpan = rowSpan - topSpan;
      const newCell = createTableCell(tagName, targetCell);
      for (let r = originRow; r < originRow + topSpan; r++) {
        for (let c = originCol; c < originCol + colSpan; c++) {
          grid[r][c] = {
            cell: targetCell,
            originRow,
            originCol,
            rowSpan: topSpan,
            colSpan,
            isOrigin: r === originRow && c === originCol,
          };
        }
      }
      for (let r = originRow + topSpan; r < originRow + rowSpan; r++) {
        for (let c = originCol; c < originCol + colSpan; c++) {
          grid[r][c] = {
            cell: newCell,
            originRow: originRow + topSpan,
            originCol,
            rowSpan: bottomSpan,
            colSpan,
            isOrigin: r === originRow + topSpan && c === originCol,
          };
        }
      }
      syncTableDOMFromGrid(table, rows, grid);
    } else {
      const currentTr = rows[originRow];
      const newTr = document.createElement('tr');
      currentTr.parentNode?.insertBefore(newTr, currentTr.nextSibling);
      rows.splice(originRow + 1, 0, newTr);

      const newCell = createTableCell(tagName, targetCell);
      const newRowSlots: GridSlot[] = [];
      const expandedCells = new Set<HTMLTableCellElement>();

      for (let c = 0; c < numCols; c++) {
        if (c >= originCol && c < originCol + colSpan) {
          newRowSlots[c] = {
            cell: newCell,
            originRow: originRow + 1,
            originCol,
            rowSpan: 1,
            colSpan,
            isOrigin: c === originCol,
          };
        } else {
          const slotAbove = grid[originRow][c];
          if (slotAbove && !expandedCells.has(slotAbove.cell)) {
            expandedCells.add(slotAbove.cell);
            const newSpan = slotAbove.rowSpan + 1;
            for (let rr = 0; rr < grid.length; rr++) {
              for (let cc = 0; cc < numCols; cc++) {
                if (grid[rr][cc]?.cell === slotAbove.cell) {
                  grid[rr][cc].rowSpan = newSpan;
                }
              }
            }
          }
          newRowSlots[c] = {
            ...slotAbove,
            rowSpan: slotAbove.rowSpan,
            isOrigin: false,
          };
        }
      }

      grid.splice(originRow + 1, 0, newRowSlots);
      const updatedOrigins = new Map<HTMLTableCellElement, { r: number; c: number }>();
      for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < numCols; c++) {
          const slot = grid[r][c];
          if (!slot) continue;
          if (!updatedOrigins.has(slot.cell)) {
            updatedOrigins.set(slot.cell, { r, c });
          }
          const orig = updatedOrigins.get(slot.cell)!;
          slot.originRow = orig.r;
          slot.originCol = orig.c;
          slot.isOrigin = r === orig.r && c === orig.c;
        }
      }
      syncTableDOMFromGrid(table, rows, grid);
    }
  }
}

/**
 * Inserts a new row before or after `targetRowIndex`, properly handling cells that span across the insertion point.
 */
export function insertTableRow(
  table: HTMLTableElement,
  targetRowIndex: number,
  position: 'before' | 'after'
): HTMLTableRowElement | null {
  const { grid, rows, numRows, numCols } = buildTableGrid(table);
  if (targetRowIndex < 0 || targetRowIndex >= numRows) return null;

  const refTr = rows[targetRowIndex];
  const insertIdx = position === 'before' ? targetRowIndex : targetRowIndex + 1;
  const newTr = document.createElement('tr');
  if (refTr.style.height) {
    newTr.style.height = refTr.style.height;
  }

  const parentSection = refTr.parentElement || table.tBodies[0] || table;
  const isHeaderSection = parentSection.tagName.toLowerCase() === 'thead';
  const defaultTag: 'td' | 'th' = isHeaderSection ? 'th' : 'td';

  if (position === 'before') {
    parentSection.insertBefore(newTr, refTr);
  } else {
    parentSection.insertBefore(newTr, refTr.nextSibling);
  }

  rows.splice(insertIdx, 0, newTr);
  const newRowSlots: GridSlot[] = [];
  const handledSpanCells = new Set<HTMLTableCellElement>();

  for (let c = 0; c < numCols; c++) {
    const slotAbove = insertIdx > 0 ? grid[insertIdx - 1]?.[c] : undefined;
    const slotBelow = insertIdx < numRows ? grid[insertIdx]?.[c] : undefined;

    if (
      slotAbove &&
      slotBelow &&
      slotAbove.cell === slotBelow.cell &&
      slotAbove.originRow < insertIdx
    ) {
      if (!handledSpanCells.has(slotAbove.cell)) {
        handledSpanCells.add(slotAbove.cell);
        for (let rr = 0; rr < grid.length; rr++) {
          for (let cc = 0; cc < numCols; cc++) {
            if (grid[rr][cc]?.cell === slotAbove.cell) {
              grid[rr][cc].rowSpan += 1;
            }
          }
        }
      }
      newRowSlots[c] = {
        cell: slotAbove.cell,
        originRow: slotAbove.originRow,
        originCol: slotAbove.originCol,
        rowSpan: slotAbove.rowSpan,
        colSpan: slotAbove.colSpan,
        isOrigin: false,
      };
    } else {
      const refCell =
        grid[targetRowIndex]?.[c]?.cell ??
        (table.querySelector('td, th') as HTMLTableCellElement | null);
      const cellTag: 'td' | 'th' =
        refCell?.tagName.toLowerCase() === 'th' && isHeaderSection ? 'th' : defaultTag;
      const newCell = createTableCell(cellTag, refCell);
      newRowSlots[c] = {
        cell: newCell,
        originRow: insertIdx,
        originCol: c,
        rowSpan: 1,
        colSpan: 1,
        isOrigin: true,
      };
    }
  }

  grid.splice(insertIdx, 0, newRowSlots);

  const updatedOrigins = new Map<HTMLTableCellElement, { r: number; c: number }>();
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < numCols; c++) {
      const slot = grid[r][c];
      if (!slot) continue;
      if (!updatedOrigins.has(slot.cell)) {
        updatedOrigins.set(slot.cell, { r, c });
      }
      const orig = updatedOrigins.get(slot.cell)!;
      slot.originRow = orig.r;
      slot.originCol = orig.c;
      slot.isOrigin = r === orig.r && c === orig.c;
    }
  }

  syncTableDOMFromGrid(table, rows, grid);
  return newTr;
}

/**
 * Deletes the row at `rowIndex`, safely preserving and shrinking any cells with rowSpan > 1.
 * Returns false if the table has only 1 row (caller should delete the table).
 */
export function deleteTableRow(table: HTMLTableElement, rowIndex: number): boolean {
  const { grid, rows, numRows, numCols } = buildTableGrid(table);
  if (numRows <= 1) return false;
  if (rowIndex < 0 || rowIndex >= numRows) return true;

  const shrunkCells = new Set<HTMLTableCellElement>();

  for (let c = 0; c < numCols; c++) {
    const slot = grid[rowIndex]?.[c];
    if (!slot || shrunkCells.has(slot.cell)) continue;
    shrunkCells.add(slot.cell);

    if (slot.rowSpan > 1) {
      for (let rr = 0; rr < numRows; rr++) {
        for (let cc = 0; cc < numCols; cc++) {
          if (grid[rr][cc]?.cell === slot.cell) {
            grid[rr][cc].rowSpan -= 1;
          }
        }
      }
    } else {
      slot.cell.remove();
    }
  }

  const trToRemove = rows[rowIndex];
  rows.splice(rowIndex, 1);
  grid.splice(rowIndex, 1);
  trToRemove.remove();

  const updatedOrigins = new Map<HTMLTableCellElement, { r: number; c: number }>();
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < numCols; c++) {
      const slot = grid[r][c];
      if (!slot) continue;
      if (!updatedOrigins.has(slot.cell)) {
        updatedOrigins.set(slot.cell, { r, c });
      }
      const orig = updatedOrigins.get(slot.cell)!;
      slot.originRow = orig.r;
      slot.originCol = orig.c;
      slot.isOrigin = r === orig.r && c === orig.c;
    }
  }

  syncTableDOMFromGrid(table, rows, grid);
  return true;
}

/**
 * Inserts a new column before or after `targetColIndex`, properly handling cells with colSpan > 1.
 */
export function insertTableColumn(
  table: HTMLTableElement,
  targetColIndex: number,
  position: 'before' | 'after'
): void {
  const { grid, rows, numRows, numCols } = buildTableGrid(table);
  if (targetColIndex < 0 || targetColIndex >= numCols) return;

  const insertColIdx = position === 'before' ? targetColIndex : targetColIndex + 1;
  const handledSpanCells = new Set<HTMLTableCellElement>();

  for (let r = 0; r < numRows; r++) {
    const slotLeft = insertColIdx > 0 ? grid[r]?.[insertColIdx - 1] : undefined;
    const slotRight = insertColIdx < numCols ? grid[r]?.[insertColIdx] : undefined;

    if (
      slotLeft &&
      slotRight &&
      slotLeft.cell === slotRight.cell &&
      slotLeft.originCol < insertColIdx
    ) {
      if (!handledSpanCells.has(slotLeft.cell)) {
        handledSpanCells.add(slotLeft.cell);
        for (let rr = 0; rr < numRows; rr++) {
          for (let cc = 0; cc < grid[rr].length; cc++) {
            if (grid[rr][cc]?.cell === slotLeft.cell) {
              grid[rr][cc].colSpan += 1;
            }
          }
        }
      }
      grid[r].splice(insertColIdx, 0, {
        cell: slotLeft.cell,
        originRow: slotLeft.originRow,
        originCol: slotLeft.originCol,
        rowSpan: slotLeft.rowSpan,
        colSpan: slotLeft.colSpan,
        isOrigin: false,
      });
    } else {
      const refCell =
        grid[r]?.[targetColIndex]?.cell ??
        (table.querySelector('td, th') as HTMLTableCellElement | null);
      const tr = rows[r];
      const isHeader =
        tr.parentElement?.tagName.toLowerCase() === 'thead' ||
        refCell?.tagName.toLowerCase() === 'th';
      const newCell = createTableCell(isHeader ? 'th' : 'td', refCell);
      grid[r].splice(insertColIdx, 0, {
        cell: newCell,
        originRow: r,
        originCol: insertColIdx,
        rowSpan: 1,
        colSpan: 1,
        isOrigin: true,
      });
    }
  }

  const updatedOrigins = new Map<HTMLTableCellElement, { r: number; c: number }>();
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      const slot = grid[r][c];
      if (!slot) continue;
      if (!updatedOrigins.has(slot.cell)) {
        updatedOrigins.set(slot.cell, { r, c });
      }
      const orig = updatedOrigins.get(slot.cell)!;
      slot.originRow = orig.r;
      slot.originCol = orig.c;
      slot.isOrigin = r === orig.r && c === orig.c;
    }
  }

  const colgroup = table.querySelector(':scope > colgroup');
  if (colgroup) {
    const cols = Array.from(colgroup.querySelectorAll(':scope > col')) as HTMLTableColElement[];
    const newCol = document.createElement('col');
    const refCol = cols[targetColIndex];
    if (refCol?.style.width) {
      newCol.style.width = refCol.style.width;
    }
    if (position === 'before' && refCol) {
      colgroup.insertBefore(newCol, refCol);
    } else if (refCol && refCol.nextSibling) {
      colgroup.insertBefore(newCol, refCol.nextSibling);
    } else {
      colgroup.appendChild(newCol);
    }
  }

  syncTableDOMFromGrid(table, rows, grid);
}

/**
 * Deletes the column at `colIndex`, safely shrinking any cells with colSpan > 1.
 * Returns false if the table only has 1 column left.
 */
export function deleteTableColumn(table: HTMLTableElement, colIndex: number): boolean {
  const { grid, rows, numRows, numCols } = buildTableGrid(table);
  if (numCols <= 1) return false;
  if (colIndex < 0 || colIndex >= numCols) return true;

  const shrunkCells = new Set<HTMLTableCellElement>();

  for (let r = 0; r < numRows; r++) {
    const slot = grid[r]?.[colIndex];
    if (!slot || shrunkCells.has(slot.cell)) continue;
    shrunkCells.add(slot.cell);

    if (slot.colSpan > 1) {
      for (let rr = 0; rr < numRows; rr++) {
        for (let cc = 0; cc < numCols; cc++) {
          if (grid[rr][cc]?.cell === slot.cell) {
            grid[rr][cc].colSpan -= 1;
          }
        }
      }
    } else {
      slot.cell.remove();
    }
  }

  for (let r = 0; r < numRows; r++) {
    grid[r].splice(colIndex, 1);
  }

  const colgroup = table.querySelector(':scope > colgroup');
  if (colgroup) {
    const cols = Array.from(colgroup.querySelectorAll(':scope > col'));
    if (cols[colIndex]) {
      cols[colIndex].remove();
    }
  }

  const updatedOrigins = new Map<HTMLTableCellElement, { r: number; c: number }>();
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      const slot = grid[r][c];
      if (!slot) continue;
      if (!updatedOrigins.has(slot.cell)) {
        updatedOrigins.set(slot.cell, { r, c });
      }
      const orig = updatedOrigins.get(slot.cell)!;
      slot.originRow = orig.r;
      slot.originCol = orig.c;
      slot.isOrigin = r === orig.r && c === orig.c;
    }
  }

  syncTableDOMFromGrid(table, rows, grid);
  return true;
}

/**
 * Moves a row up or down when rows do not have vertical rowspans crossing the swap boundary.
 */
export function moveTableRow(
  table: HTMLTableElement,
  rowIndex: number,
  direction: 'up' | 'down'
): boolean {
  const { grid, rows, numRows, numCols } = buildTableGrid(table);
  const targetIdx = direction === 'up' ? rowIndex - 1 : rowIndex + 1;
  if (targetIdx < 0 || targetIdx >= numRows) return false;

  for (let c = 0; c < numCols; c++) {
    if ((grid[rowIndex]?.[c]?.rowSpan || 1) > 1 || (grid[targetIdx]?.[c]?.rowSpan || 1) > 1) {
      return false;
    }
  }

  const rowA = rows[rowIndex];
  const rowB = rows[targetIdx];
  if (rowA.parentElement !== rowB.parentElement) return false;

  if (direction === 'up') {
    rowA.parentElement?.insertBefore(rowA, rowB);
  } else {
    rowA.parentElement?.insertBefore(rowB, rowA);
  }
  return true;
}

/**
 * Moves a column left or right when columns do not have horizontal colspans crossing the swap boundary.
 */
export function moveTableColumn(
  table: HTMLTableElement,
  colIndex: number,
  direction: 'left' | 'right'
): boolean {
  const { grid, rows, numRows, numCols } = buildTableGrid(table);
  const targetIdx = direction === 'left' ? colIndex - 1 : colIndex + 1;
  if (targetIdx < 0 || targetIdx >= numCols) return false;

  for (let r = 0; r < numRows; r++) {
    if ((grid[r]?.[colIndex]?.colSpan || 1) > 1 || (grid[r]?.[targetIdx]?.colSpan || 1) > 1) {
      return false;
    }
  }

  for (let r = 0; r < numRows; r++) {
    const temp = grid[r][colIndex];
    grid[r][colIndex] = grid[r][targetIdx];
    grid[r][targetIdx] = temp;
  }

  const updatedOrigins = new Map<HTMLTableCellElement, { r: number; c: number }>();
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      const slot = grid[r][c];
      if (!slot) continue;
      if (!updatedOrigins.has(slot.cell)) {
        updatedOrigins.set(slot.cell, { r, c });
      }
      const orig = updatedOrigins.get(slot.cell)!;
      slot.originRow = orig.r;
      slot.originCol = orig.c;
      slot.isOrigin = r === orig.r && c === orig.c;
    }
  }

  const cols = ensureColGroup(table);
  if (cols[colIndex] && cols[targetIdx]) {
    const wA = cols[colIndex].style.width;
    cols[colIndex].style.width = cols[targetIdx].style.width;
    cols[targetIdx].style.width = wA;
  }

  syncTableDOMFromGrid(table, rows, grid);
  return true;
}
