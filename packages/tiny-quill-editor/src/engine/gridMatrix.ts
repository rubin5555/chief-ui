import { CellBounds, GridSlot } from '../types';

let tableIdCounter = 1;

export function generateTableId(): string {
  return `tiny-tbl-${Date.now().toString(36)}-${(tableIdCounter++).toString(36)}`;
}

/**
 * Ensures a table cell contains our editable `.ql-tiny-cell-editor` wrapper
 * so rich content (lists, multiple paragraphs, headings, inline styles) works cleanly.
 */
export function ensureCellEditor(cell: HTMLTableCellElement): HTMLElement {
  let editor = cell.querySelector(':scope > .ql-tiny-cell-editor') as HTMLElement | null;
  if (!editor) {
    editor = document.createElement('div');
    editor.className = 'ql-tiny-cell-editor';
    editor.setAttribute('contenteditable', '');
    editor.setAttribute('spellcheck', 'true');

    const hasBlock = Boolean(
      cell.querySelector('p, h1, h2, h3, h4, h5, h6, ul, ol, blockquote, pre, div')
    );
    if (!cell.firstChild || (!cell.textContent?.trim() && !cell.querySelector('img, br'))) {
      while (cell.firstChild) {
        cell.removeChild(cell.firstChild);
      }
      const p = document.createElement('p');
      p.appendChild(document.createElement('br'));
      editor.appendChild(p);
    } else if (hasBlock) {
      while (cell.firstChild) {
        editor.appendChild(cell.firstChild);
      }
    } else {
      // ponytail: reparent existing inline child nodes into <p> without innerHTML re-parse
      // so mousedown e.target nodes stay connected inside the editor wrapper.
      const p = document.createElement('p');
      while (cell.firstChild) {
        p.appendChild(cell.firstChild);
      }
      editor.appendChild(p);
    }

    cell.appendChild(editor);
  }
  return editor;
}

/**
 * Collects all TR elements in visual order (thead -> tbody -> tfoot)
 */
export function getAllTableRows(table: HTMLTableElement): HTMLTableRowElement[] {
  const rows: HTMLTableRowElement[] = [];
  if (table.tHead) {
    rows.push(...Array.from(table.tHead.rows));
  }
  Array.from(table.tBodies).forEach((tbody) => {
    rows.push(...Array.from(tbody.rows));
  });
  if (table.tFoot) {
    rows.push(...Array.from(table.tFoot.rows));
  }
  if (rows.length === 0) {
    rows.push(
      ...(Array.from(table.querySelectorAll(':scope > tr')) as HTMLTableRowElement[])
    );
  }
  return rows;
}

/**
 * Builds a complete 2D logical occupancy matrix for an HTMLTableElement,
 * accurately resolving arbitrary rowspan and colspan combinations.
 */
export function buildTableGrid(table: HTMLTableElement): {
  grid: GridSlot[][];
  rows: HTMLTableRowElement[];
  numRows: number;
  numCols: number;
} {
  const rows = getAllTableRows(table);
  const numRows = rows.length;
  const grid: GridSlot[][] = Array.from({ length: numRows }, () => []);
  let maxCols = 0;

  for (let r = 0; r < numRows; r++) {
    const tr = rows[r];
    const cells = Array.from(tr.cells);
    let c = 0;

    for (const cell of cells) {
      while (grid[r][c] !== undefined) {
        c++;
      }
      const rowSpan = Math.max(1, cell.rowSpan || 1);
      const colSpan = Math.max(1, cell.colSpan || 1);

      for (let dr = 0; dr < rowSpan; dr++) {
        const targetRow = r + dr;
        if (targetRow >= numRows) break;
        for (let dc = 0; dc < colSpan; dc++) {
          const targetCol = c + dc;
          grid[targetRow][targetCol] = {
            cell,
            originRow: r,
            originCol: c,
            rowSpan: Math.min(rowSpan, numRows - r),
            colSpan,
            isOrigin: dr === 0 && dc === 0,
          };
          if (targetCol + 1 > maxCols) {
            maxCols = targetCol + 1;
          }
        }
      }
      c += colSpan;
    }
  }

  return {
    grid,
    rows,
    numRows,
    numCols: maxCols,
  };
}

/**
 * Synchronizes the actual DOM `<tr/>` children and `rowSpan`/`colSpan` attributes
 * from the 2D logical `GridSlot[][]` matrix.
 */
export function syncTableDOMFromGrid(
  table: HTMLTableElement,
  rows: HTMLTableRowElement[],
  grid: GridSlot[][]
): void {
  const isTiny = table.classList.contains('ql-tiny-table');
  const usedRowIds = new Set<string>();
  const numRows = grid.length;

  for (let r = 0; r < numRows; r++) {
    const tr = rows[r];
    if (!tr) continue;
    const rowSlots = grid[r] || [];
    const expectedCells: HTMLTableCellElement[] = [];

    let rowId: string | null = null;
    if (!isTiny) {
      const existingId = Array.from(tr.cells)
        .map((c) => c.getAttribute('data-row'))
        .find(Boolean);
      rowId =
        existingId && !usedRowIds.has(existingId)
          ? existingId
          : Math.random().toString(36).slice(2, 8);
      usedRowIds.add(rowId);
    }

    for (let c = 0; c < rowSlots.length; c++) {
      const slot = rowSlots[c];
      if (slot && slot.isOrigin && slot.originRow === r && slot.originCol === c) {
        const { cell, rowSpan, colSpan } = slot;
        if (rowSpan > 1) {
          cell.rowSpan = rowSpan;
        } else {
          cell.removeAttribute('rowspan');
        }
        if (colSpan > 1) {
          cell.colSpan = colSpan;
        } else {
          cell.removeAttribute('colspan');
        }
        if (isTiny) {
          ensureCellEditor(cell);
        } else if (rowId) {
          cell.setAttribute('data-row', rowId);
        }
        expectedCells.push(cell);
      }
    }

    expectedCells.forEach((cell, idx) => {
      if (tr.cells[idx] !== cell) {
        tr.insertBefore(cell, tr.cells[idx] || null);
      }
    });

    while (tr.cells.length > expectedCells.length) {
      const extra = tr.cells[tr.cells.length - 1];
      extra.remove();
    }
  }

  if (isTiny || table.querySelector(':scope > colgroup')) {
    ensureColGroup(table);
  }
}

/**
 * Ensures `<colgroup>` has the exact number of `<col>` elements matching `numCols`.
 */
export function ensureColGroup(table: HTMLTableElement): HTMLTableColElement[] {
  const { numCols } = buildTableGrid(table);
  if (numCols === 0) return [];

  let colgroup = table.querySelector(':scope > colgroup') as HTMLTableColElement | null;
  if (!colgroup) {
    colgroup = document.createElement('colgroup') as HTMLTableColElement;
    const caption = table.querySelector(':scope > caption');
    if (caption && caption.nextSibling) {
      table.insertBefore(colgroup, caption.nextSibling);
    } else if (caption) {
      table.appendChild(colgroup);
    } else {
      table.insertBefore(colgroup, table.firstChild);
    }
  }

  const cols = Array.from(colgroup.querySelectorAll(':scope > col')) as HTMLTableColElement[];
  if (cols.length < numCols) {
    for (let i = cols.length; i < numCols; i++) {
      const col = document.createElement('col');
      colgroup.appendChild(col);
      cols.push(col);
    }
  } else if (cols.length > numCols) {
    for (let i = cols.length - 1; i >= numCols; i--) {
      cols[i].remove();
      cols.pop();
    }
  }

  return cols;
}

/**
 * Finds the logical coordinates (originRow, originCol) of a TD/TH element.
 */
export function getCellCoords(
  table: HTMLTableElement,
  targetCell: HTMLTableCellElement
): { originRow: number; originCol: number; rowSpan: number; colSpan: number } | null {
  const { grid, numRows, numCols } = buildTableGrid(table);
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      const slot = grid[r]?.[c];
      if (slot && slot.cell === targetCell && slot.isOrigin) {
        return {
          originRow: slot.originRow,
          originCol: slot.originCol,
          rowSpan: slot.rowSpan,
          colSpan: slot.colSpan,
        };
      }
    }
  }
  return null;
}

/**
 * Expands a rectangular selection bounding box so that any merged cell (rowspan/colspan)
 * partially inside the box is completely enclosed.
 */
export function expandBoundsToMergedCells(
  grid: GridSlot[][],
  initialBounds: CellBounds
): CellBounds {
  let { minRow, maxRow, minCol, maxCol } = initialBounds;
  let changed = true;

  while (changed) {
    changed = false;
    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        const slot = grid[r]?.[c];
        if (!slot) continue;
        const cellMinR = slot.originRow;
        const cellMaxR = slot.originRow + slot.rowSpan - 1;
        const cellMinC = slot.originCol;
        const cellMaxC = slot.originCol + slot.colSpan - 1;

        if (cellMinR < minRow) {
          minRow = cellMinR;
          changed = true;
        }
        if (cellMaxR > maxRow) {
          maxRow = cellMaxR;
          changed = true;
        }
        if (cellMinC < minCol) {
          minCol = cellMinC;
          changed = true;
        }
        if (cellMaxC > maxCol) {
          maxCol = cellMaxC;
          changed = true;
        }
      }
    }
  }

  return { minRow, maxRow, minCol, maxCol };
}

/**
 * Returns all unique HTMLTableCellElements within the given logical bounds.
 */
export function getCellsInBounds(
  table: HTMLTableElement,
  bounds: CellBounds
): HTMLTableCellElement[] {
  const { grid } = buildTableGrid(table);
  const expanded = expandBoundsToMergedCells(grid, bounds);
  const seen = new Set<HTMLTableCellElement>();
  const result: HTMLTableCellElement[] = [];

  for (let r = expanded.minRow; r <= expanded.maxRow; r++) {
    for (let c = expanded.minCol; c <= expanded.maxCol; c++) {
      const slot = grid[r]?.[c];
      if (slot && !seen.has(slot.cell)) {
        seen.add(slot.cell);
        result.push(slot.cell);
      }
    }
  }
  return result;
}

/**
 * Creates a new cell (`td` or `th`) with an initialized `.ql-tiny-cell-editor`
 * and optional copied visual styles from a reference cell.
 */
export function createTableCell(
  tagName: 'td' | 'th' = 'td',
  referenceCell?: HTMLTableCellElement | null,
  initialHTML = '<p><br></p>'
): HTMLTableCellElement {
  const cell = document.createElement(tagName);
  if (referenceCell) {
    const styleProps = [
      'backgroundColor',
      'borderColor',
      'borderStyle',
      'borderWidth',
      'borderTop',
      'borderRight',
      'borderBottom',
      'borderLeft',
      'padding',
      'textAlign',
      'verticalAlign',
    ] as const;
    styleProps.forEach((prop) => {
      if (referenceCell.style[prop]) {
        cell.style[prop] = referenceCell.style[prop];
      }
    });
  }
  const useTinyCellEditor =
    !referenceCell ||
    Boolean(referenceCell.querySelector(':scope > .ql-tiny-cell-editor')) ||
    Boolean(referenceCell.closest('table')?.classList.contains('ql-tiny-table'));

  if (useTinyCellEditor) {
    const editor = document.createElement('div');
    editor.className = 'ql-tiny-cell-editor';
    editor.setAttribute('contenteditable', '');
    editor.setAttribute('spellcheck', 'true');
    editor.innerHTML = initialHTML;
    cell.appendChild(editor);
  } else {
    cell.innerHTML = initialHTML === '<p><br></p>' ? '<br>' : initialHTML;
  }
  return cell;
}
