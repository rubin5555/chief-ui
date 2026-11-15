import {
  createTableCell,
  ensureCellEditor,
  ensureColGroup,
  generateTableId,
  getAllTableRows,
} from './gridMatrix';

/**
 * Sorts tbody rows by the text/numeric value in `colIndex`.
 */
export function sortTableByColumn(
  table: HTMLTableElement,
  colIndex: number,
  direction: 'asc' | 'desc'
): void {
  const tbody = table.tBodies[0];
  if (!tbody) return;
  const tbodyRows = Array.from(tbody.rows);
  if (tbodyRows.length <= 1) return;

  const hasRowSpan = tbodyRows.some((tr) =>
    Array.from(tr.cells).some((cell) => (cell.rowSpan || 1) > 1)
  );
  if (hasRowSpan) return;

  const startIdx =
    !table.tHead &&
    tbodyRows[0] &&
    Array.from(tbodyRows[0].cells).every((c) => c.tagName.toLowerCase() === 'th')
      ? 1
      : 0;

  const sortableRows = tbodyRows.slice(startIdx);
  sortableRows.sort((rowA, rowB) => {
    const cellA = rowA.cells[Math.min(colIndex, rowA.cells.length - 1)];
    const cellB = rowB.cells[Math.min(colIndex, rowB.cells.length - 1)];
    const textA = (cellA?.textContent || '').trim();
    const textB = (cellB?.textContent || '').trim();

    const numA = parseFloat(textA.replace(/[$,%\s]/g, ''));
    const numB = parseFloat(textB.replace(/[$,%\s]/g, ''));

    if (
      !Number.isNaN(numA) &&
      !Number.isNaN(numB) &&
      /^[-+$%\d.,\s]+$/.test(textA) &&
      /^[-+$%\d.,\s]+$/.test(textB)
    ) {
      return direction === 'asc' ? numA - numB : numB - numA;
    }
    return direction === 'asc'
      ? textA.localeCompare(textB, undefined, { numeric: true, sensitivity: 'base' })
      : textB.localeCompare(textA, undefined, { numeric: true, sensitivity: 'base' });
  });

  sortableRows.forEach((tr) => tbody.appendChild(tr));
}

/**
 * Distributes column widths evenly across the table.
 */
export function distributeColumnsEvenly(table: HTMLTableElement): void {
  const cols = ensureColGroup(table);
  if (cols.length === 0) return;
  const pct = `${(100 / cols.length).toFixed(2)}%`;
  cols.forEach((col) => {
    col.style.width = pct;
  });
  Array.from(table.querySelectorAll('td, th')).forEach((cell) => {
    (cell as HTMLElement).style.width = '';
  });
}

/**
 * Distributes row heights evenly across the table.
 */
export function distributeRowsEvenly(table: HTMLTableElement): void {
  const rows = getAllTableRows(table);
  if (rows.length === 0) return;
  const maxHeight = Math.max(
    40,
    ...rows.map((r) => r.getBoundingClientRect().height || 40)
  );
  rows.forEach((r) => {
    r.style.height = `${Math.round(maxHeight)}px`;
  });
}

/**
 * Toggles a header row (`<thead>` with `<th>` cells) on the table.
 */
export function toggleTableHeaderRow(table: HTMLTableElement): void {
  const rows = getAllTableRows(table);
  if (rows.length === 0) return;

  if (table.tHead && table.tHead.rows.length > 0) {
    const thead = table.tHead;
    const tbody = table.tBodies[0] || table.createTBody();
    const headerRows = Array.from(thead.rows).reverse();
    headerRows.forEach((tr) => {
      Array.from(tr.cells).forEach((cell) => {
        if (cell.tagName.toLowerCase() === 'th') {
          const td = createTableCell('td', cell, ensureCellEditor(cell).innerHTML);
          if (cell.rowSpan > 1) td.rowSpan = cell.rowSpan;
          if (cell.colSpan > 1) td.colSpan = cell.colSpan;
          tr.replaceChild(td, cell);
        }
      });
      tbody.insertBefore(tr, tbody.firstChild);
    });
    thead.remove();
  } else {
    const firstRow = rows[0];
    const thead = table.createTHead();
    Array.from(firstRow.cells).forEach((cell) => {
      const th = createTableCell('th', cell, ensureCellEditor(cell).innerHTML);
      if (cell.rowSpan > 1) th.rowSpan = cell.rowSpan;
      if (cell.colSpan > 1) th.colSpan = cell.colSpan;
      if (!th.style.backgroundColor) {
        th.style.backgroundColor = '#f8fafc';
      }
      firstRow.replaceChild(th, cell);
    });
    thead.appendChild(firstRow);
  }
}

/**
 * Toggles a `<caption>` element on the table.
 */
export function toggleTableCaption(table: HTMLTableElement, captionText?: string): void {
  let caption = table.querySelector(':scope > caption') as HTMLTableCaptionElement | null;
  if (caption && captionText === undefined) {
    caption.remove();
    return;
  }
  if (!caption) {
    caption = document.createElement('caption');
    caption.className = 'ql-tiny-table-caption';
    caption.setAttribute('contenteditable', '');
    caption.textContent = captionText || 'Table Caption — Click to edit';
    table.insertBefore(caption, table.firstChild);
  } else if (captionText !== undefined) {
    caption.textContent = captionText;
  }
}

/**
 * Generates initial HTML for a newly inserted table.
 */
export function createNewTableHTML(
  rows: number,
  cols: number,
  options?: {
    withHeader?: boolean;
    striped?: boolean;
    width?: string;
    height?: string;
  }
): string {
  const tableId = generateTableId();
  const withHeader = options?.withHeader ?? true;
  const striped = options?.striped ?? false;
  const width = options?.width || '100%';
  const heightStyle = options?.height ? `height: ${options.height};` : '';

  const colPct = `${(100 / cols).toFixed(2)}%`;
  const colgroupHTML = `<colgroup>${Array.from({ length: cols }, () => `<col style="width: ${colPct};">`).join('')}</colgroup>`;

  let theadHTML = '';
  const bodyRowsCount = withHeader ? Math.max(1, rows - 1) : rows;

  if (withHeader) {
    const headerCells = Array.from(
      { length: cols },
      (_, c) =>
        `<th style="background-color: #f8fafc; padding: 10px 12px; border: 1px solid #cbd5e1; text-align: left;"><div class="ql-tiny-cell-editor" contenteditable=""><p><strong>Header ${c + 1}</strong></p></div></th>`
    ).join('');
    theadHTML = `<thead><tr>${headerCells}</tr></thead>`;
  }

  const tbodyRows = Array.from({ length: bodyRowsCount }, () => {
    const cells = Array.from(
      { length: cols },
      () =>
        `<td style="padding: 10px 12px; border: 1px solid #cbd5e1;"><div class="ql-tiny-cell-editor" contenteditable=""><p><br></p></div></td>`
    ).join('');
    return `<tr>${cells}</tr>`;
  }).join('');

  const classes = ['ql-tiny-table', 'ql-tiny-table-hover'];
  if (striped) classes.push('ql-tiny-table-striped');

  return `<table data-table-id="${tableId}" class="${classes.join(' ')}" style="width: ${width}; ${heightStyle} border-collapse: collapse; border: 1px solid #cbd5e1;">${colgroupHTML}${theadHTML}<tbody>${tbodyRows}</tbody></table>`;
}

/**
 * Normalizes any external or raw HTML `<table>` into an interactive TinyQuill table DOM element.
 */
export function normalizeTableElement(table: HTMLTableElement): HTMLTableElement {
  if (table.dataset.tinyNormalized === 'true') {
    return table;
  }
  table.dataset.tinyNormalized = 'true';
  if (!table.dataset.tableId) {
    table.dataset.tableId = generateTableId();
  }
  table.classList.add('ql-tiny-table');
  if (!table.style.borderCollapse) {
    table.style.borderCollapse = 'collapse';
  }
  if (!table.style.width) {
    table.style.width = '100%';
  }

  const caption = table.querySelector(':scope > caption') as HTMLElement | null;
  if (caption) {
    caption.classList.add('ql-tiny-table-caption');
    caption.setAttribute('contenteditable', '');
  }

  const cells = Array.from(table.querySelectorAll('td, th')) as HTMLTableCellElement[];
  // ponytail: only eagerly wrap cells for small/medium tables (<= 150 cells); large tables
  // rely on CSS border/padding rules and lazily initialize .ql-tiny-cell-editor on cell click
  // to avoid mounting thousands of contenteditable roots simultaneously.
  if (cells.length <= 150) {
    cells.forEach((cell) => {
      if (!cell.style.border) {
        cell.style.border = '1px solid #cbd5e1';
      }
      if (!cell.style.padding) {
        cell.style.padding = '10px 12px';
      }
      ensureCellEditor(cell);
    });
  }

  ensureColGroup(table);
  return table;
}

/**
 * Exports a clean, standard semantic HTML string from the editor root,
 * stripping internal `.ql-tiny-cell-editor` wrappers and selection classes.
 */
export function exportCleanHTML(editorRoot: HTMLElement): string {
  const clone = editorRoot.cloneNode(true) as HTMLElement;

  const wrappers = Array.from(clone.querySelectorAll('.ql-tiny-table-wrapper'));
  wrappers.forEach((wrapper) => {
    const table = wrapper.querySelector('table');
    if (table) {
      table.classList.remove('ql-tiny-table-selected');
      delete table.dataset.tinyNormalized;
      Array.from(
        table.querySelectorAll('.ql-tiny-cell-selected, .ql-tiny-cell-active, [data-selected-cell]')
      ).forEach((cell) => {
        cell.classList.remove('ql-tiny-cell-selected', 'ql-tiny-cell-active');
        cell.removeAttribute('data-selected-cell');
      });
      Array.from(table.querySelectorAll('.ql-tiny-cell-editor')).forEach((cellEditor) => {
        const cell = cellEditor.parentElement;
        if (cell) {
          while (cellEditor.firstChild) {
            cell.insertBefore(cellEditor.firstChild, cellEditor);
          }
          cellEditor.remove();
        }
      });
      const caption = table.querySelector(':scope > caption');
      caption?.removeAttribute('contenteditable');
      wrapper.parentNode?.replaceChild(table, wrapper);
    } else {
      wrapper.remove();
    }
  });

  const cleaned = clone.innerHTML.replace(/\uFEFF/g, '');
  if (
    cleaned === '<p><br></p>' &&
    !clone.querySelector('table, img, hr, [data-chip-id]')
  ) {
    return '';
  }
  return cleaned;
}

/**
 * Removes all cell/table selection highlight classes within the given DOM container.
 */
export function clearCellSelectionClasses(scope?: ParentNode | null): void {
  const target = scope || (typeof document !== 'undefined' ? document : null);
  if (!target) return;
  Array.from(
    target.querySelectorAll(
      '.ql-tiny-cell-selected, .ql-tiny-cell-active, .ql-tiny-table-selected, [data-selected-cell]'
    )
  ).forEach((el) => {
    (el as HTMLElement).classList.remove(
      'ql-tiny-cell-selected',
      'ql-tiny-cell-active',
      'ql-tiny-table-selected'
    );
    (el as HTMLElement).removeAttribute('data-selected-cell');
  });
}
