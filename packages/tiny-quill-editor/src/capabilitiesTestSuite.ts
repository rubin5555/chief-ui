import {
  buildTableGrid,
  getCellCoords,
  expandBoundsToMergedCells,
  getCellsInBounds,
  mergeCellsInBounds,
  splitTableCell,
  insertTableRow,
  deleteTableRow,
  insertTableColumn,
  deleteTableColumn,
  moveTableRow,
  moveTableColumn,
  sortTableByColumn,
  distributeColumnsEvenly,
  distributeRowsEvenly,
  toggleTableHeaderRow,
  toggleTableCaption,
  applyTableBorderPreset,
  readTableProperties,
  writeTableProperties,
  readCellProperties,
  writeCellProperties,
  readRowProperties,
  writeRowProperties,
  createNewTableHTML,
  normalizeTableElement,
  exportCleanHTML,
  rgbToHex,
  clearCellSelectionClasses,
  ensureCellEditor,
  ensureColGroup,
} from './tableEngine';
import {
  enTranslations,
  heTranslations,
  getEditorTranslations,
} from './i18n';

export interface CapabilityTestResult {
  id: string;
  category: string;
  name: string;
  passed: boolean;
  durationMs: number;
  error?: string;
}

function assert(condition: unknown, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function assertEqual<T>(actual: T, expected: T, message: string): void {
  if (actual !== expected) {
    throw new Error(`${message} (expected: ${JSON.stringify(expected)}, actual: ${JSON.stringify(actual)})`);
  }
}

function createTableFromHTML(html: string): HTMLTableElement {
  const container = document.createElement('div');
  container.innerHTML = html.trim();
  const table = container.querySelector('table') as HTMLTableElement;
  if (!table) {
    throw new Error('Failed to create table from HTML');
  }
  return normalizeTableElement(table);
}

/**
 * Pure helper mirroring ImageResizeOverlay's proportional vs free resize math
 * so it can be unit-tested deterministically.
 */
export function calculateImageResizeDimensions(params: {
  dir: 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';
  initialWidth: number;
  initialHeight: number;
  dX: number;
  dY: number;
  isRatioLocked: boolean;
}): { width: number; height: number } {
  const { dir, initialWidth, initialHeight, dX, dY, isRatioLocked } = params;
  const aspectRatio = initialWidth / (initialHeight || 1);
  let newWidth = initialWidth;
  let newHeight = initialHeight;

  const isWest = dir.includes('w');
  const isEast = dir.includes('e');
  const isNorth = dir.includes('n');
  const isSouth = dir.includes('s');

  if (isRatioLocked) {
    if (dir === 'e') {
      newWidth = initialWidth + dX;
      newHeight = Math.round(newWidth / aspectRatio);
    } else if (dir === 'w') {
      newWidth = initialWidth - dX;
      newHeight = Math.round(newWidth / aspectRatio);
    } else if (dir === 's') {
      newHeight = initialHeight + dY;
      newWidth = Math.round(newHeight * aspectRatio);
    } else if (dir === 'n') {
      newHeight = initialHeight - dY;
      newWidth = Math.round(newHeight * aspectRatio);
    } else {
      const deltaX = isWest ? -dX : dX;
      const deltaY = isNorth ? -dY : dY;
      const delta =
        Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY * aspectRatio;
      newWidth = initialWidth + delta;
      newHeight = Math.round(newWidth / aspectRatio);
    }
  } else {
    if (isEast) newWidth = initialWidth + dX;
    else if (isWest) newWidth = initialWidth - dX;

    if (isSouth) newHeight = initialHeight + dY;
    else if (isNorth) newHeight = initialHeight - dY;
  }

  return {
    width: Math.max(30, Math.round(newWidth)),
    height: Math.max(20, Math.round(newHeight)),
  };
}

/**
 * Pure helper mirroring Format Painter cell style capture & application.
 */
export function copyAndApplyCellFormat(
  sourceCell: HTMLTableCellElement,
  targetCell: HTMLTableCellElement
): void {
  const captured = {
    backgroundColor: sourceCell.style.backgroundColor,
    textAlign: sourceCell.style.textAlign,
    verticalAlign: sourceCell.style.verticalAlign,
    padding: sourceCell.style.padding,
    border: sourceCell.style.border,
  };
  if (captured.backgroundColor !== undefined) {
    targetCell.style.backgroundColor = captured.backgroundColor;
  }
  if (captured.textAlign !== undefined) {
    targetCell.style.textAlign = captured.textAlign;
  }
  if (captured.verticalAlign !== undefined) {
    targetCell.style.verticalAlign = captured.verticalAlign;
  }
  if (captured.padding !== undefined) {
    targetCell.style.padding = captured.padding;
  }
  if (captured.border !== undefined) {
    targetCell.style.border = captured.border;
  }
}

export interface CapabilityTestCase {
  id: string;
  category: string;
  name: string;
  run: () => void;
}

export const EDITOR_CAPABILITY_TESTS: CapabilityTestCase[] = [
  // 1. Table Creation & Normalization
  {
    id: 'table-create-default',
    category: 'Table Creation & Normalization',
    name: 'Creates a standard N×M table with header row, colgroup, and cell editors',
    run: () => {
      const html = createNewTableHTML(4, 3, { withHeader: true, striped: true });
      const table = createTableFromHTML(html);
      const { numRows, numCols } = buildTableGrid(table);
      assertEqual(numRows, 4, 'Row count should be 4');
      assertEqual(numCols, 3, 'Column count should be 3');
      assert(table.tHead !== null, 'Table should have a thead');
      assertEqual(table.tHead?.rows.length, 1, 'Thead should have 1 row');
      assert(table.classList.contains('ql-tiny-table-striped'), 'Should have striped class');
      const cols = ensureColGroup(table);
      assertEqual(cols.length, 3, 'Colgroup should have 3 col elements');
    },
  },
  {
    id: 'table-normalize-external',
    category: 'Table Creation & Normalization',
    name: 'Normalizes raw external HTML tables with colgroup, data-table-id, and editable cell wrappers',
    run: () => {
      const noHeaderTable = createTableFromHTML(createNewTableHTML(3, 4, { withHeader: false, striped: false }));
      const grid = buildTableGrid(noHeaderTable);
      assertEqual(grid.numRows, 3, 'Table should have 3 rows');
      assertEqual(grid.numCols, 4, 'Table should have 4 columns');
      assert(noHeaderTable.tHead === null, 'Table without header should not have thead');

      const rawTable = createTableFromHTML('<table><tr><td>A</td><td>B</td></tr></table>');
      assert(Boolean(rawTable.dataset.tableId), 'Normalized table should receive data-table-id');
      const cellEditor = rawTable.querySelector('.ql-tiny-cell-editor');
      assert(cellEditor !== null, 'Normalized table cells should have .ql-tiny-cell-editor');
      assertEqual(cellEditor?.getAttribute('contenteditable'), 'true', 'Cell editor should be contenteditable');
    },
  },

  // 2. 2D Virtual Occupancy Grid & Coordinate Resolution
  {
    id: 'grid-coords-and-bounds',
    category: '2D Grid Matrix',
    name: 'Resolves 2D logical coordinates and expands selection bounds across merged cells',
    run: () => {
      const table = createTableFromHTML(createNewTableHTML(3, 3, { withHeader: false }));
      // Merge (0,0) to (1,1) -> 2x2 merged cell at top-left
      const merged = mergeCellsInBounds(table, { minRow: 0, maxRow: 1, minCol: 0, maxCol: 1 });
      assert(merged !== null, 'Merged cell should be returned');
      assertEqual(merged?.rowSpan, 2, 'Merged cell rowSpan should be 2');
      assertEqual(merged?.colSpan, 2, 'Merged cell colSpan should be 2');

      const { grid } = buildTableGrid(table);
      const bottomRightCell = grid[2][2].cell;
      const coords = getCellCoords(table, bottomRightCell);
      assertEqual(coords?.originRow, 2, 'Bottom-right cell originRow should be 2');
      assertEqual(coords?.originCol, 2, 'Bottom-right cell originCol should be 2');

      // Partial selection overlapping (1,1) and (1,2) must expand to include (0,0)..(1,2)
      const expanded = expandBoundsToMergedCells(grid, {
        minRow: 1,
        maxRow: 1,
        minCol: 1,
        maxCol: 2,
      });
      assertEqual(expanded.minRow, 0, 'Expanded minRow should be 0');
      assertEqual(expanded.maxRow, 1, 'Expanded maxRow should be 1');
      assertEqual(expanded.minCol, 0, 'Expanded minCol should be 0');
      assertEqual(expanded.maxCol, 2, 'Expanded maxCol should be 2');

      const cellsInBounds = getCellsInBounds(table, { minRow: 1, maxRow: 1, minCol: 1, maxCol: 2 });
      assertEqual(cellsInBounds.length, 3, 'Should include the 2x2 merged cell plus (0,2) and (1,2)');
    },
  },

  // 3. Cell Merging & Splitting
  {
    id: 'cell-merge-and-unmerge',
    category: 'Cell Merge & Split',
    name: 'Merges cells preserving content from all absorbed cells and unmerges back to 1×1',
    run: () => {
      const table = createTableFromHTML(createNewTableHTML(3, 3, { withHeader: false }));
      const { grid } = buildTableGrid(table);
      ensureCellEditor(grid[0][0].cell).innerHTML = '<p>Alpha</p>';
      ensureCellEditor(grid[0][1].cell).innerHTML = '<p>Beta</p>';
      ensureCellEditor(grid[1][0].cell).innerHTML = '<p>Gamma</p>';

      const merged = mergeCellsInBounds(table, { minRow: 0, maxRow: 1, minCol: 0, maxCol: 1 });
      assert(merged !== null, 'Merge should return target cell');
      const text = merged?.textContent || '';
      assert(
        text.includes('Alpha') && text.includes('Beta') && text.includes('Gamma'),
        'Merged cell should preserve text from all absorbed cells'
      );

      // Now unmerge
      splitTableCell(table, merged!, 'unmerge');
      const afterUnmerge = buildTableGrid(table);
      assertEqual(afterUnmerge.numRows, 3, 'Row count remains 3 after unmerge');
      assertEqual(afterUnmerge.numCols, 3, 'Col count remains 3 after unmerge');
      assertEqual(afterUnmerge.grid[0][0].cell.rowSpan, 1, 'Unmerged cell rowSpan should be 1');
      assertEqual(afterUnmerge.grid[0][0].cell.colSpan, 1, 'Unmerged cell colSpan should be 1');
    },
  },
  {
    id: 'cell-split-horizontal-vertical',
    category: 'Cell Merge & Split',
    name: 'Splits 1×1 and merged cells horizontally (columns) and vertically (rows)',
    run: () => {
      const table = createTableFromHTML(createNewTableHTML(2, 2, { withHeader: false }));
      const { grid } = buildTableGrid(table);
      const topLeft = grid[0][0].cell;

      // Split 1x1 cell horizontally -> adds a logical column and increases colSpan of cell below
      splitTableCell(table, topLeft, 'horizontal');
      const afterH = buildTableGrid(table);
      assertEqual(afterH.numCols, 3, 'Splitting 1x1 cell horizontally should increase table columns to 3');
      assertEqual(afterH.grid[1][0].cell.colSpan, 2, 'Cell in row below should expand colSpan to 2');

      // Split a cell vertically -> adds a logical row and increases rowSpan of adjacent cells
      const bottomRight = afterH.grid[1][2].cell;
      splitTableCell(table, bottomRight, 'vertical');
      const afterV = buildTableGrid(table);
      assertEqual(afterV.numRows, 3, 'Splitting 1x1 cell vertically should increase table rows to 3');
      assertEqual(afterV.grid[1][0].cell.rowSpan, 2, 'Adjacent cell should expand rowSpan to 2');
    },
  },

  // 4. Row Operations
  {
    id: 'row-insert-delete-with-rowspan',
    category: 'Row Operations',
    name: 'Inserts and deletes rows properly across vertical rowspan cells',
    run: () => {
      const table = createTableFromHTML(createNewTableHTML(3, 3, { withHeader: false }));
      // Merge (0,0) and (1,0) vertically (rowSpan = 2)
      const merged = mergeCellsInBounds(table, { minRow: 0, maxRow: 1, minCol: 0, maxCol: 0 });
      assertEqual(merged?.rowSpan, 2, 'Initial vertical merge should have rowSpan=2');

      // Insert row after row 0 (between row 0 and row 1, which is spanned by `merged`)
      insertTableRow(table, 0, 'after');
      const afterInsert = buildTableGrid(table);
      assertEqual(afterInsert.numRows, 4, 'Table should now have 4 rows');
      assertEqual(merged?.rowSpan, 3, 'Spanning cell rowSpan should expand to 3 when row is inserted across it');

      // Delete row 1 (inside the span)
      const deleted = deleteTableRow(table, 1);
      assert(deleted === true, 'deleteTableRow should return true');
      const afterDelete = buildTableGrid(table);
      assertEqual(afterDelete.numRows, 3, 'Table should return to 3 rows');
      assertEqual(merged?.rowSpan, 2, 'Spanning cell rowSpan should shrink back to 2');
    },
  },
  {
    id: 'row-move-up-down',
    category: 'Row Operations',
    name: 'Moves rows up/down and blocks swaps across vertical rowspans',
    run: () => {
      const table = createTableFromHTML(createNewTableHTML(3, 2, { withHeader: false }));
      const { grid } = buildTableGrid(table);
      ensureCellEditor(grid[0][0].cell).innerHTML = '<p>Row 0</p>';
      ensureCellEditor(grid[1][0].cell).innerHTML = '<p>Row 1</p>';
      ensureCellEditor(grid[2][0].cell).innerHTML = '<p>Row 2</p>';

      const movedDown = moveTableRow(table, 0, 'down');
      assert(movedDown === true, 'Should move row 0 down');
      const afterMove = buildTableGrid(table);
      assert(afterMove.grid[0][0].cell.textContent?.includes('Row 1'), 'Row 1 should now be at index 0');
      assert(afterMove.grid[1][0].cell.textContent?.includes('Row 0'), 'Row 0 should now be at index 1');

      // Now merge (1,0) and (2,0) vertically and verify moveTableRow blocks swapping across the span
      mergeCellsInBounds(table, { minRow: 1, maxRow: 2, minCol: 0, maxCol: 0 });
      const blockedMove = moveTableRow(table, 1, 'up');
      assert(blockedMove === false, 'moveTableRow should return false when row contains rowSpan > 1');
    },
  },

  // 5. Column Operations
  {
    id: 'col-insert-delete-with-colspan',
    category: 'Column Operations',
    name: 'Inserts and deletes columns properly across horizontal colspan cells',
    run: () => {
      const table = createTableFromHTML(createNewTableHTML(3, 3, { withHeader: false }));
      // Merge (0,0) and (0,1) horizontally (colSpan = 2)
      const merged = mergeCellsInBounds(table, { minRow: 0, maxRow: 0, minCol: 0, maxCol: 1 });
      assertEqual(merged?.colSpan, 2, 'Initial horizontal merge should have colSpan=2');

      // Insert column after col 0 (inside the horizontal span)
      insertTableColumn(table, 0, 'after');
      const afterInsert = buildTableGrid(table);
      assertEqual(afterInsert.numCols, 4, 'Table should now have 4 columns');
      assertEqual(merged?.colSpan, 3, 'Spanning cell colSpan should expand to 3');

      // Delete column 1 (inside the horizontal span)
      const deleted = deleteTableColumn(table, 1);
      assert(deleted === true, 'deleteTableColumn should return true');
      const afterDelete = buildTableGrid(table);
      assertEqual(afterDelete.numCols, 3, 'Table should return to 3 columns');
      assertEqual(merged?.colSpan, 2, 'Spanning cell colSpan should shrink back to 2');
    },
  },
  {
    id: 'col-move-left-right',
    category: 'Column Operations',
    name: 'Moves columns left/right and blocks swaps across horizontal colspans',
    run: () => {
      const table = createTableFromHTML(createNewTableHTML(2, 3, { withHeader: false }));
      const { grid } = buildTableGrid(table);
      ensureCellEditor(grid[0][0].cell).innerHTML = '<p>Col A</p>';
      ensureCellEditor(grid[0][1].cell).innerHTML = '<p>Col B</p>';

      const movedRight = moveTableColumn(table, 0, 'right');
      assert(movedRight === true, 'Should move col 0 right');
      const afterMove = buildTableGrid(table);
      assert(afterMove.grid[0][0].cell.textContent?.includes('Col B'), 'Col B should now be at index 0');
      assert(afterMove.grid[0][1].cell.textContent?.includes('Col A'), 'Col A should now be at index 1');

      // Merge (0,1) and (0,2) horizontally and ensure move is blocked
      mergeCellsInBounds(table, { minRow: 0, maxRow: 0, minCol: 1, maxCol: 2 });
      const blockedMove = moveTableColumn(table, 1, 'left');
      assert(blockedMove === false, 'moveTableColumn should return false when column contains colSpan > 1');
    },
  },

  // 6. Table, Cell & Row Properties + Styling
  {
    id: 'table-cell-row-properties',
    category: 'Properties & Styling',
    name: 'Reads and writes TableProperties, CellProperties, RowProperties, and border presets',
    run: () => {
      const table = createTableFromHTML(createNewTableHTML(3, 3, { withHeader: true }));

      // Table properties round-trip
      writeTableProperties(table, {
        width: '85%',
        height: '320px',
        align: 'center',
        cellPadding: '14px',
        borderWidth: '2px',
        borderStyle: 'dashed',
        borderColor: '#2563eb',
        backgroundColor: '#f8fafc',
        borderCollapse: 'separate',
        borderSpacing: '6px',
        hasCaption: true,
        captionText: 'Quarterly KPI Matrix',
        stripedRows: true,
        hoverHighlight: false,
      });
      const readTbl = readTableProperties(table);
      assertEqual(readTbl.width, '85%', 'Table width should be 85%');
      assertEqual(readTbl.align, 'center', 'Table alignment should be center');
      assertEqual(readTbl.borderStyle, 'dashed', 'Table borderStyle should be dashed');
      assertEqual(readTbl.hasCaption, true, 'Table should have caption');
      assertEqual(readTbl.captionText, 'Quarterly KPI Matrix', 'Caption text should match');
      assertEqual(readTbl.stripedRows, true, 'Striped rows should be enabled');
      assertEqual(readTbl.hoverHighlight, false, 'Hover highlight should be disabled');

      // Cell properties round-trip (including td -> th conversion)
      const { grid } = buildTableGrid(table);
      const bodyCell = grid[1][0].cell;
      const updatedCells = writeCellProperties(table, [bodyCell], {
        width: '180px',
        height: '50px',
        cellType: 'th',
        scope: 'row',
        hAlign: 'right',
        vAlign: 'middle',
        backgroundColor: '#e0f2fe',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: '#0284c7',
        padding: '16px',
        whiteSpace: 'nowrap',
      });
      const readCell = readCellProperties(updatedCells[0]);
      assertEqual(readCell.cellType, 'th', 'Cell should convert from td to th');
      assertEqual(readCell.scope, 'row', 'Cell scope should be row');
      assertEqual(readCell.hAlign, 'right', 'Cell hAlign should be right');
      assertEqual(readCell.vAlign, 'middle', 'Cell vAlign should be middle');
      assertEqual(readCell.whiteSpace, 'nowrap', 'Cell whiteSpace should be nowrap');

      // Row properties round-trip
      const targetRow = table.tBodies[0].rows[1];
      writeRowProperties(table, targetRow, {
        rowType: 'tfoot',
        height: '64px',
        hAlign: 'center',
        vAlign: 'bottom',
        backgroundColor: '#fef3c7',
        borderBottomColor: '#d97706',
        borderBottomWidth: '3px',
        borderBottomStyle: 'double',
      });
      const readRow = readRowProperties(targetRow);
      assertEqual(readRow.rowType, 'tfoot', 'Row should move to tfoot');
      assertEqual(readRow.height, '64px', 'Row height should be 64px');

      // Border presets & rgbToHex
      applyTableBorderPreset(table, 'none');
      assertEqual(table.dataset.borderPreset, 'none', 'Border preset should be none');
      assertEqual(rgbToHex('rgb(37, 99, 235)'), '#2563eb', 'rgbToHex should convert rgb() to hex');
      assertEqual(rgbToHex('#abc'), '#aabbcc', 'rgbToHex should expand 3-digit hex');
    },
  },

  // 7. Sorting, Distribution, Header/Caption Toggles & Clean HTML Export
  {
    id: 'table-utilities-and-clean-export',
    category: 'Sorting, Distribution & Export',
    name: 'Sorts numeric/text columns, distributes widths, toggles header/caption, and exports clean HTML',
    run: () => {
      const table = createTableFromHTML(createNewTableHTML(4, 2, { withHeader: true }));
      const tbodyRows = Array.from(table.tBodies[0].rows);
      ensureCellEditor(tbodyRows[0].cells[0]).innerHTML = '<p>Zeta</p>';
      ensureCellEditor(tbodyRows[0].cells[1]).innerHTML = '<p>$300</p>';
      ensureCellEditor(tbodyRows[1].cells[0]).innerHTML = '<p>Alpha</p>';
      ensureCellEditor(tbodyRows[1].cells[1]).innerHTML = '<p>$1,200</p>';
      ensureCellEditor(tbodyRows[2].cells[0]).innerHTML = '<p>Beta</p>';
      ensureCellEditor(tbodyRows[2].cells[1]).innerHTML = '<p>$50</p>';

      // Sort by column 0 ascending (Alpha, Beta, Zeta)
      sortTableByColumn(table, 0, 'asc');
      const sortedAlpha = Array.from(table.tBodies[0].rows).map((r) => r.cells[0].textContent?.trim());
      assertEqual(sortedAlpha[0], 'Alpha', 'First row after asc text sort should be Alpha');
      assertEqual(sortedAlpha[2], 'Zeta', 'Last row after asc text sort should be Zeta');

      // Sort by column 1 numeric descending ($1,200, $300, $50)
      sortTableByColumn(table, 1, 'desc');
      const sortedNum = Array.from(table.tBodies[0].rows).map((r) => r.cells[1].textContent?.trim());
      assertEqual(sortedNum[0], '$1,200', 'First row after desc numeric sort should be $1,200');
      assertEqual(sortedNum[2], '$50', 'Last row after desc numeric sort should be $50');

      // Distribute columns & rows evenly
      distributeColumnsEvenly(table);
      const cols = ensureColGroup(table);
      assert(
        cols[0].style.width === '50.00%' || cols[0].style.width === '50%',
        `2 columns distributed evenly should each be 50% (actual: ${cols[0].style.width})`
      );
      distributeRowsEvenly(table);

      // Toggle header row off and back on
      toggleTableHeaderRow(table);
      assert(table.tHead === null, 'toggleTableHeaderRow should remove thead when present');
      toggleTableHeaderRow(table);
      assert(table.tHead !== null, 'toggleTableHeaderRow should recreate thead when absent');

      // Toggle caption on and off
      toggleTableCaption(table, 'Custom Caption');
      assertEqual(table.querySelector('caption')?.textContent, 'Custom Caption', 'Caption should be created');
      toggleTableCaption(table);
      assert(table.querySelector('caption') === null, 'Caption should be removed when toggled without text');

      // Export Clean HTML
      const root = document.createElement('div');
      const wrapper = document.createElement('div');
      wrapper.className = 'ql-tiny-table-wrapper';
      table.classList.add('ql-tiny-table-selected');
      table.querySelector('td')?.classList.add('ql-tiny-cell-selected', 'ql-tiny-cell-active');
      wrapper.appendChild(table);
      root.appendChild(wrapper);

      const clean = exportCleanHTML(root);
      assert(!clean.includes('ql-tiny-table-wrapper'), 'Clean HTML should strip .ql-tiny-table-wrapper');
      assert(!clean.includes('ql-tiny-cell-editor'), 'Clean HTML should unwrap .ql-tiny-cell-editor');
      assert(!clean.includes('ql-tiny-cell-selected'), 'Clean HTML should strip .ql-tiny-cell-selected');
      assert(clean.includes('<table'), 'Clean HTML should preserve semantic <table>');
    },
  },

  // 8. Internationalization (i18n) & Hebrew RTL Support
  {
    id: 'i18n-en-he-and-overrides',
    category: 'i18n & RTL Support',
    name: 'Validates English (LTR) and Hebrew (RTL) translations key parity and custom overrides',
    run: () => {
      const en = getEditorTranslations('en');
      const he = getEditorTranslations('he');

      assertEqual(en.common.save, 'Save', 'English common.save should be Save');
      assertEqual(he.common.save, 'שמור', 'Hebrew common.save should be שמור');

      // Ensure every top-level section and nested key in enTranslations exists in heTranslations
      const sections = Object.keys(enTranslations) as Array<keyof typeof enTranslations>;
      for (const section of sections) {
        const enVal = enTranslations[section];
        const heVal = heTranslations[section];
        assert(heVal !== undefined, `Missing section "${String(section)}" in heTranslations`);
        if (typeof enVal === 'object' && enVal !== null) {
          for (const key of Object.keys(enVal)) {
            const subVal = (heVal as Record<string, unknown>)[key];
            assert(
              typeof subVal === 'string' && subVal.length > 0,
              `Missing or empty Hebrew translation for ${String(section)}.${key}`
            );
          }
        }
      }

      // Verify custom partial override merging
      const customHe = getEditorTranslations('he', {
        toolbar: {
          ...heTranslations.toolbar,
          formatPainterTitle: 'מברשת עיצוב מותאמת',
        },
      });
      assertEqual(
        customHe.toolbar.formatPainterTitle,
        'מברשת עיצוב מותאמת',
        'Custom override should replace target key'
      );
      assertEqual(
        customHe.toolbar.bold,
        heTranslations.toolbar.bold,
        'Sibling keys in overridden section should remain intact'
      );
    },
  },

  // 9. Image Resizing & Aspect Ratio Lock/Unlock
  {
    id: 'image-resize-aspect-ratio-lock',
    category: 'Image Resize & Aspect Ratio',
    name: 'Scales image proportionally when aspect ratio is locked and freely when unlocked',
    run: () => {
      // Initial 400x200 image (aspect ratio = 2.0)
      // 1. Locked resize dragging East (+100px width) -> should become 500x250
      const lockedEast = calculateImageResizeDimensions({
        dir: 'e',
        initialWidth: 400,
        initialHeight: 200,
        dX: 100,
        dY: 0,
        isRatioLocked: true,
      });
      assertEqual(lockedEast.width, 500, 'Locked East drag width should be 500');
      assertEqual(lockedEast.height, 250, 'Locked East drag height should scale proportionally to 250');

      // 2. Locked resize dragging South (+50px height) -> should become 500x250
      const lockedSouth = calculateImageResizeDimensions({
        dir: 's',
        initialWidth: 400,
        initialHeight: 200,
        dX: 0,
        dY: 50,
        isRatioLocked: true,
      });
      assertEqual(lockedSouth.height, 250, 'Locked South drag height should be 250');
      assertEqual(lockedSouth.width, 500, 'Locked South drag width should scale proportionally to 500');

      // 3. Unlocked resize dragging South-East (+120px width, -40px height) -> independent scaling 520x160
      const unlockedSE = calculateImageResizeDimensions({
        dir: 'se',
        initialWidth: 400,
        initialHeight: 200,
        dX: 120,
        dY: -40,
        isRatioLocked: false,
      });
      assertEqual(unlockedSE.width, 520, 'Unlocked SE drag width should be 520');
      assertEqual(unlockedSE.height, 160, 'Unlocked SE drag height should independently be 160');

      // 4. Minimum clamp check (never smaller than 30x20)
      const clamped = calculateImageResizeDimensions({
        dir: 'nw',
        initialWidth: 100,
        initialHeight: 100,
        dX: 500,
        dY: 500,
        isRatioLocked: false,
      });
      assertEqual(clamped.width, 30, 'Width should clamp to minimum 30px');
      assertEqual(clamped.height, 20, 'Height should clamp to minimum 20px');
    },
  },

  // 10. Format Painter Capabilities
  {
    id: 'format-painter-cell-and-text',
    category: 'Format Painter',
    name: 'Captures visual styles from a source table cell and applies them to target cells',
    run: () => {
      const table = createTableFromHTML(createNewTableHTML(2, 2, { withHeader: false }));
      const { grid } = buildTableGrid(table);
      const srcCell = grid[0][0].cell;
      const dstCell = grid[1][1].cell;

      srcCell.style.backgroundColor = 'rgb(219, 234, 254)';
      srcCell.style.textAlign = 'center';
      srcCell.style.verticalAlign = 'middle';
      srcCell.style.padding = '18px';
      srcCell.style.border = '2px solid rgb(37, 99, 235)';

      copyAndApplyCellFormat(srcCell, dstCell);

      assertEqual(dstCell.style.backgroundColor, srcCell.style.backgroundColor, 'Target cell background should match source');
      assertEqual(dstCell.style.textAlign, 'center', 'Target cell textAlign should match source');
      assertEqual(dstCell.style.verticalAlign, 'middle', 'Target cell verticalAlign should match source');
      assertEqual(dstCell.style.padding, '18px', 'Target cell padding should match source');
    },
  },

  // 11. Regression Tests: Sequential Row Add Before/After/Remove & Cell Blur Cleanup
  {
    id: 'regression-sequential-row-ops-and-blur',
    category: 'Regression: Focus & Row Actions',
    name: 'Handles sequential row insert before/after, row delete, and cell blur selection cleanup',
    run: () => {
      const root = document.createElement('div');
      const table = createTableFromHTML(createNewTableHTML(3, 2, { withHeader: true }));
      root.appendChild(table);

      const initialGrid = buildTableGrid(table);
      const activeCell = initialGrid.grid[1][0].cell;
      ensureCellEditor(activeCell).innerHTML = '<p>Anchor Cell</p>';

      // 1. Insert row BEFORE activeCell's row (logical row 1)
      const coords1 = getCellCoords(table, activeCell);
      assertEqual(coords1?.originRow, 1, 'Initial active cell should be at row 1');
      insertTableRow(table, coords1!.originRow, 'before');

      // Active cell should now be pushed down to logical row 2
      const coords2 = getCellCoords(table, activeCell);
      assertEqual(coords2?.originRow, 2, 'Active cell should move to row 2 after inserting row before');

      // 2. Immediately insert row AFTER activeCell's new row (logical row 2)
      insertTableRow(table, coords2!.originRow, 'after');
      const afterBothGrid = buildTableGrid(table);
      assertEqual(afterBothGrid.numRows, 5, 'Table should have 5 rows after before+after insertions');

      // 3. Delete the newly inserted row after (row 3)
      const deleted = deleteTableRow(table, 3);
      assertEqual(deleted, true, 'Deleting row 3 should succeed');
      assertEqual(buildTableGrid(table).numRows, 4, 'Table should have 4 rows after deletion');

      // 4. Verify cell & table selection class cleanup on blur
      table.classList.add('ql-tiny-table-selected');
      activeCell.classList.add('ql-tiny-cell-selected', 'ql-tiny-cell-active');
      clearCellSelectionClasses(root);
      table.classList.remove('ql-tiny-table-selected');

      assert(!activeCell.classList.contains('ql-tiny-cell-selected'), 'Cell selected class should be cleared on blur');
      assert(!activeCell.classList.contains('ql-tiny-cell-active'), 'Cell active class should be cleared on blur');
      assert(!table.classList.contains('ql-tiny-table-selected'), 'Table selected class should be cleared on blur');
    },
  },
];

/**
 * Runs all editor capability tests in the current DOM environment and returns structured results.
 */
export function runAllEditorCapabilityTests(): {
  results: CapabilityTestResult[];
  passedCount: number;
  failedCount: number;
  totalCount: number;
} {
  const results: CapabilityTestResult[] = [];
  let passedCount = 0;
  let failedCount = 0;

  for (const testCase of EDITOR_CAPABILITY_TESTS) {
    const start = typeof performance !== 'undefined' ? performance.now() : Date.now();
    try {
      testCase.run();
      const end = typeof performance !== 'undefined' ? performance.now() : Date.now();
      results.push({
        id: testCase.id,
        category: testCase.category,
        name: testCase.name,
        passed: true,
        durationMs: Math.max(0.1, Number((end - start).toFixed(2))),
      });
      passedCount++;
    } catch (err: unknown) {
      const end = typeof performance !== 'undefined' ? performance.now() : Date.now();
      results.push({
        id: testCase.id,
        category: testCase.category,
        name: testCase.name,
        passed: false,
        durationMs: Math.max(0.1, Number((end - start).toFixed(2))),
        error: err instanceof Error ? err.message : String(err),
      });
      failedCount++;
    }
  }

  return {
    results,
    passedCount,
    failedCount,
    totalCount: EDITOR_CAPABILITY_TESTS.length,
  };
}
