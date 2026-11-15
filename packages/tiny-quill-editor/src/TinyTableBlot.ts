import {
  buildTableGrid,
  createNewTableHTML,
  ensureCellEditor,
  insertTableRow,
  normalizeTableElement,
} from './tableEngine';

let registered = false;
let nativeTableBlotsRegistered = false;

/**
 * Registers Quill 2 inline style attributors (color, background, align, direction),
 * extends Quill's native TableCell blot to support `<th>`, adds `TableCaption` (`<caption>`),
 * and upgrades `TableContainer.prototype.balanceCells` to use the 2D grid matrix (`buildTableGrid`)
 * so `colspan` and `rowspan` merges are preserved across `quill.update()`.
 */
export function registerQuillTableBlots(Quill: any): void {
  if (nativeTableBlotsRegistered) return;

  const ColorStyle = Quill.import('attributors/style/color');
  if (ColorStyle) Quill.register(ColorStyle, true);

  const BackgroundStyle = Quill.import('attributors/style/background');
  if (BackgroundStyle) Quill.register(BackgroundStyle, true);

  const AlignStyle = Quill.import('attributors/style/align');
  if (AlignStyle) {
    AlignStyle.whitelist = ['right', 'center', 'justify', 'left'];
    Quill.register(AlignStyle, true);
  }

  const DirectionStyle = Quill.import('attributors/style/direction');
  if (DirectionStyle) Quill.register(DirectionStyle, true);

  const TableCell = Quill.import('formats/table');
  const rowIdByTr = new WeakMap<Element, string>();
  let autoRowCounter = 1;
  if (TableCell) {
    TableCell.tagName = ['TD', 'TH'];
    const origFormats = TableCell.formats.bind(TableCell);
    TableCell.formats = function (domNode: HTMLElement) {
      const existing = origFormats(domNode);
      if (existing) return existing;
      // ponytail: deterministically assign a data-row ID per parent <tr> when raw HTML tables
      // omit data-row attributes; otherwise Quill's TableRow.checkMerge sees undefined === undefined
      // and merges all <tr> rows into a single multi-thousand-cell row.
      const tr = domNode.parentElement;
      if (tr && tr.tagName === 'TR') {
        let id = rowIdByTr.get(tr);
        if (!id) {
          id = `row-auto-${autoRowCounter++}`;
          rowIdByTr.set(tr, id);
        }
        domNode.setAttribute('data-row', id);
        return id;
      }
      const fallback = `row-auto-${autoRowCounter++}`;
      domNode.setAttribute('data-row', fallback);
      return fallback;
    };
    Quill.register(TableCell, true);
  }

  const Block = Quill.import('blots/block');
  const TableContainer = Quill.import('formats/table-container');
  const TableBody = Quill.import('formats/table-body');
  const TableRow = Quill.import('formats/table-row');

  if (TableBody) {
    TableBody.tagName = ['TBODY', 'THEAD', 'TFOOT'];
    Quill.register(TableBody, true);
  }

  if (Block && TableContainer && TableBody) {
    class TableCaption extends Block {
      static blotName = 'table-caption';
      static tagName = 'CAPTION';
    }
    (TableCaption as any).requiredContainer = TableContainer;
    TableContainer.allowedChildren = [TableCaption, TableBody];
    TableContainer.prototype.rows = function () {
      return this.descendants(TableRow);
    };
    if (TableRow) {
      TableContainer.prototype.balanceCells = function (this: any) {
        const tableEl = this.domNode as HTMLTableElement | undefined;
        if (tableEl && tableEl.tagName === 'TABLE') {
          const rows = this.descendants(TableRow);
          // ponytail: skip cell-padding pass on large tables (>50 rows) to avoid O(R*C) blot allocations on focus
          if (rows.length === 0 || rows.length > 50) return;
          const { grid, numCols } = buildTableGrid(tableEl);
          rows.forEach((r: any, rIdx: number) => {
            const occupied = (grid[rIdx] || []).filter(Boolean).length;
            const deficit = Math.max(0, numCols - occupied);
            if (deficit === 0) return;
            const headNode = r.children?.head?.domNode as HTMLElement | undefined;
            const rowValue =
              (headNode && TableCell.formats(headNode)) || `row-bal-${autoRowCounter++}`;
            for (let i = 0; i < deficit; i++) {
              const blot = this.scroll.create(TableCell.blotName, rowValue);
              r.appendChild(blot);
              blot.optimize();
            }
          });
        }
      };
    }
    Quill.register(TableCaption, true);
    Quill.register(TableContainer, true);
  }

  nativeTableBlotsRegistered = true;
}

export function registerTinyTableBlot(Quill: any): void {
  if (registered) return;

  const ColorStyle = Quill.import('attributors/style/color');
  if (ColorStyle) Quill.register(ColorStyle, true);

  const BackgroundStyle = Quill.import('attributors/style/background');
  if (BackgroundStyle) Quill.register(BackgroundStyle, true);

  const AlignStyle = Quill.import('attributors/style/align');
  if (AlignStyle) {
    AlignStyle.whitelist = ['right', 'center', 'justify', 'left'];
    Quill.register(AlignStyle, true);
  }

  const DirectionStyle = Quill.import('attributors/style/direction');
  if (DirectionStyle) Quill.register(DirectionStyle, true);

  const Inline = Quill.import('blots/inline');
  if (Inline) {
    class ChipButtonBlot extends Inline {
      static blotName = 'chip-button';
      static tagName = 'BUTTON';
    }
    Quill.register(ChipButtonBlot, true);
  }

  const BlockEmbed = Quill.import('blots/block/embed');

  class TinyTableBlot extends BlockEmbed {
    static blotName = 'tiny-table';
    static tagName = 'DIV';
    static className = 'ql-tiny-table-wrapper';

    static create(value: string | { html?: string }) {
      const node = super.create() as HTMLElement;
      node.setAttribute('contenteditable', 'false');
      node.setAttribute('tabindex', '-1');

      const rawHTML =
        typeof value === 'string'
          ? value
          : value && typeof value.html === 'string'
          ? value.html
          : createNewTableHTML(3, 3, { withHeader: true });

      const parser = new DOMParser();
      const doc = parser.parseFromString(rawHTML, 'text/html');
      let table = doc.querySelector('table') as HTMLTableElement | null;

      if (!table) {
        const fallbackDoc = parser.parseFromString(
          createNewTableHTML(3, 3, { withHeader: true }),
          'text/html'
        );
        table = fallbackDoc.querySelector('table') as HTMLTableElement;
      }

      normalizeTableElement(table);
      node.appendChild(table);

      attachTableWrapperListeners(node);
      return node;
    }

    static value(domNode: HTMLElement): { tableId: string } {
      const table = domNode.querySelector('table');
      return {
        // ponytail: return lightweight tableId token in Quill delta instead of cloning + serializing
        // thousands of <td> DOM nodes on every keystroke/selection update; full HTML is exported by exportCleanHTML.
        tableId: table?.dataset.tableId || '',
      };
    }

    /**
     * Defining `updateContent` marks this BlockEmbed as `isUpdatable(blot) === true` in Quill 2.x's Scroll!
     * That prevents Quill's MutationObserver from ever interfering with internal table DOM edits,
     * while supporting structured embed updates.
     */
    updateContent(change: { html?: string }) {
      if (change && typeof change.html === 'string') {
        const parser = new DOMParser();
        const doc = parser.parseFromString(change.html, 'text/html');
        const newTable = doc.querySelector('table');
        const oldTable = this.domNode.querySelector('table');
        if (newTable && oldTable) {
          normalizeTableElement(newTable);
          this.domNode.replaceChild(newTable, oldTable);
        }
      }
    }
  }

  Quill.register(TinyTableBlot, true);

  // Also register custom Horizontal Rule (Divider) BlockEmbed for TinyMCE parity
  class DividerBlot extends BlockEmbed {
    static blotName = 'divider';
    static tagName = 'HR';
    static className = 'ql-tiny-divider';
  }
  Quill.register(DividerBlot, true);

  // Also register Callout Box BlockEmbed
  class CalloutBlot extends BlockEmbed {
    static blotName = 'callout';
    static tagName = 'DIV';
    static className = 'ql-tiny-callout';

    static create(value: { type?: string; html?: string } | string) {
      const node = super.create() as HTMLElement;
      node.setAttribute('contenteditable', 'false');
      const tone = typeof value === 'object' && value?.type ? value.type : 'info';
      const innerHTML =
        typeof value === 'object' && value?.html
          ? value.html
          : '<p><strong>Note:</strong> Click here to edit this callout block.</p>';
      node.dataset.tone = tone;
      const body = document.createElement('div');
      body.className = 'ql-tiny-callout-body';
      body.setAttribute('contenteditable', 'true');
      body.innerHTML = innerHTML;
      body.addEventListener('keydown', (e) => e.stopPropagation());
      node.appendChild(body);
      return node;
    }

    static value(domNode: HTMLElement) {
      const body = domNode.querySelector('.ql-tiny-callout-body');
      return {
        type: domNode.dataset.tone || 'info',
        html: body ? body.innerHTML : '',
      };
    }

    updateContent(change: { html?: string; type?: string }) {
      const body = this.domNode.querySelector('.ql-tiny-callout-body');
      if (body && change?.html) body.innerHTML = change.html;
      if (change?.type) this.domNode.dataset.tone = change.type;
    }
  }
  Quill.register(CalloutBlot, true);

  registered = true;
}

/**
 * Registers a Clipboard matcher on a Quill instance so that any pasted or loaded `<table>`
 * is converted into our rich `tiny-table` BlockEmbed instead of Quill's broken default table blot.
 */
export function registerTableClipboardMatcher(quill: any, Quill: any): void {
  const Delta = Quill.import('delta');

  // Remove any built-in 'tr' or 'table' matchers that Quill 2 adds by default
  if (Array.isArray(quill.clipboard.matchers)) {
    quill.clipboard.matchers = quill.clipboard.matchers.filter(([selector]: [any, any]) => {
      if (typeof selector === 'string') {
        const lower = selector.toLowerCase();
        return lower !== 'tr' && lower !== 'table' && lower !== 'td' && lower !== 'th';
      }
      return true;
    });
  }

  quill.clipboard.addMatcher('TABLE', (node: Node) => {
    const tableEl = node.cloneNode(true) as HTMLTableElement;
    normalizeTableElement(tableEl);
    return new Delta().insert({
      'tiny-table': {
        html: tableEl.outerHTML,
        tableId: tableEl.dataset.tableId || '',
      },
    });
  });

  quill.clipboard.addMatcher('HR', () => {
    return new Delta().insert({ divider: true });
  });
}

/**
 * Attaches keyboard and editing event guards to `.ql-tiny-table-wrapper`
 * so Enter, Backspace, Delete, Tab, Shift+Tab, and shortcuts work natively inside cells
 * without triggering Quill's outer BlockEmbed deletion.
 */
export function attachTableWrapperListeners(wrapper: HTMLElement): void {
  if (wrapper.dataset.listenersAttached === 'true') return;
  wrapper.dataset.listenersAttached = 'true';

  wrapper.addEventListener('keydown', (e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    const isCellEditor = target.classList.contains('ql-tiny-cell-editor') || Boolean(target.closest('.ql-tiny-cell-editor'));
    const isCaption = target.classList.contains('ql-tiny-table-caption') || Boolean(target.closest('.ql-tiny-table-caption'));

    if (!isCellEditor && !isCaption) return;

    const table = wrapper.querySelector('table') as HTMLTableElement | null;
    if (!table) return;

    const cellEditor = (
      target.classList.contains('ql-tiny-cell-editor')
        ? target
        : target.closest('.ql-tiny-cell-editor')
    ) as HTMLElement | null;

    // 1. Handle Tab / Shift+Tab navigation across cells
    if (e.key === 'Tab' && cellEditor) {
      e.preventDefault();
      e.stopPropagation();

      const allEditors = Array.from(
        table.querySelectorAll('.ql-tiny-cell-editor')
      ) as HTMLElement[];
      const currentIdx = allEditors.indexOf(cellEditor);
      if (currentIdx === -1) return;

      if (!e.shiftKey) {
        if (currentIdx < allEditors.length - 1) {
          focusCellEditor(allEditors[currentIdx + 1], true);
        } else {
          // Last cell in the table: automatically insert a new row below and focus its first cell (TinyMCE behavior!)
          const { numRows } = buildTableGrid(table);
          const newTr = insertTableRow(table, numRows - 1, 'after');
          if (newTr) {
            const firstNewEditor = newTr.querySelector('.ql-tiny-cell-editor') as HTMLElement | null;
            if (firstNewEditor) {
              focusCellEditor(firstNewEditor, true);
            }
            wrapper.dispatchEvent(new CustomEvent('tiny-table-change', { bubbles: true }));
          }
        }
      } else {
        if (currentIdx > 0) {
          focusCellEditor(allEditors[currentIdx - 1], true);
        }
      }
      return;
    }

    // 2. Handle Backspace / Delete when multiple cells are selected
    if ((e.key === 'Backspace' || e.key === 'Delete') && cellEditor) {
      const selectedCells = Array.from(
        table.querySelectorAll('td.ql-tiny-cell-selected, th.ql-tiny-cell-selected')
      ) as HTMLTableCellElement[];

      if (selectedCells.length > 1) {
        e.preventDefault();
        e.stopPropagation();
        selectedCells.forEach((cell) => {
          const ed = ensureCellEditor(cell);
          ed.innerHTML = '<p><br></p>';
        });
        focusCellEditor(ensureCellEditor(selectedCells[0]), false);
        wrapper.dispatchEvent(new CustomEvent('tiny-table-change', { bubbles: true }));
        return;
      }

      // Prevent deleting the last <p><br></p> structure inside a cell
      e.stopPropagation();
      setTimeout(() => {
        if (cellEditor && !cellEditor.innerHTML.trim()) {
          cellEditor.innerHTML = '<p><br></p>';
          focusCellEditor(cellEditor, false);
        }
        wrapper.dispatchEvent(new CustomEvent('tiny-table-change', { bubbles: true }));
      }, 0);
      return;
    }

    // 3. Handle Enter key inside cell or caption
    if (e.key === 'Enter') {
      e.stopPropagation();
      if (isCaption) {
        e.preventDefault();
        const firstEditor = table.querySelector('.ql-tiny-cell-editor') as HTMLElement | null;
        if (firstEditor) focusCellEditor(firstEditor, false);
        return;
      }

      // Ctrl+Enter / Cmd+Enter exits the table into a paragraph below
      if ((e.ctrlKey || e.metaKey) && cellEditor) {
        e.preventDefault();
        wrapper.dispatchEvent(
          new CustomEvent('tiny-table-exit-below', { bubbles: true, detail: { wrapper } })
        );
        return;
      }

      setTimeout(() => {
        wrapper.dispatchEvent(new CustomEvent('tiny-table-change', { bubbles: true }));
      }, 0);
      return;
    }

    // 4. Handle Ctrl/Cmd + B, I, U, Z, Y inside cell
    if ((e.ctrlKey || e.metaKey) && !e.altKey) {
      const lower = e.key.toLowerCase();
      if (lower === 'z' || lower === 'y') {
        e.preventDefault();
        e.stopPropagation();
        wrapper.dispatchEvent(
          new CustomEvent(lower === 'z' && !e.shiftKey ? 'tiny-table-undo' : 'tiny-table-redo', {
            bubbles: true,
          })
        );
        return;
      }
      if (lower === 'b' || lower === 'i' || lower === 'u') {
        e.preventDefault();
        e.stopPropagation();
        const cmd = lower === 'b' ? 'bold' : lower === 'i' ? 'italic' : 'underline';
        document.execCommand(cmd, false);
        wrapper.dispatchEvent(new CustomEvent('tiny-table-change', { bubbles: true }));
        return;
      }
      if (lower === 'a' && cellEditor) {
        // Select all content inside the active cell
        e.preventDefault();
        e.stopPropagation();
        const sel = window.getSelection();
        if (sel) {
          const range = document.createRange();
          range.selectNodeContents(cellEditor);
          sel.removeAllRanges();
          sel.addRange(range);
        }
        return;
      }
    }

    // Stop propagation of other editing keys so Quill's outer Keyboard module doesn't interfere
    e.stopPropagation();
  });

  // Notify on input changes inside any cell
  wrapper.addEventListener('input', (e) => {
    e.stopPropagation();
    wrapper.dispatchEvent(new CustomEvent('tiny-table-change', { bubbles: true }));
  });

  // Handle paste inside a table cell (supports pasting TSV/Excel multi-cell grids or HTML tables!)
  wrapper.addEventListener('paste', (e: ClipboardEvent) => {
    const target = e.target as HTMLElement;
    const cell = target.closest('td, th') as HTMLTableCellElement | null;
    const table = wrapper.querySelector('table') as HTMLTableElement | null;
    if (!cell || !table) return;

    const html = e.clipboardData?.getData('text/html') || '';
    const text = e.clipboardData?.getData('text/plain') || '';

    // Check if clipboard contains an HTML table or multi-cell TSV from Excel/Sheets
    const hasTableHTML = /<table[\s>]/i.test(html);
    const isMultiCellTSV = text.includes('\t') && text.trim().split(/\r?\n/).length >= 1;

    if (hasTableHTML || isMultiCellTSV) {
      e.preventDefault();
      e.stopPropagation();

      let matrix: string[][] = [];
      if (hasTableHTML) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const pastedTable = doc.querySelector('table');
        if (pastedTable) {
          matrix = Array.from(pastedTable.rows).map((tr) =>
            Array.from(tr.cells).map((c) => c.innerHTML.trim() || '<p><br></p>')
          );
        }
      }
      if (matrix.length === 0 && isMultiCellTSV) {
        matrix = text
          .replace(/\r\n/g, '\n')
          .replace(/\r/g, '\n')
          .split('\n')
          .filter((line, idx, arr) => !(idx === arr.length - 1 && line === ''))
          .map((line) => line.split('\t').map((val) => `<p>${escapeHTML(val) || '<br>'}</p>`));
      }

      if (matrix.length > 0) {
        pasteMatrixIntoTableAtCell(table, cell, matrix);
        wrapper.dispatchEvent(new CustomEvent('tiny-table-change', { bubbles: true }));
        return;
      }
    }

    // Standard single-cell paste: stop Quill's outer clipboard from hijacking the cursor
    e.stopPropagation();
    setTimeout(() => {
      wrapper.dispatchEvent(new CustomEvent('tiny-table-change', { bubbles: true }));
    }, 0);
  });
}

function escapeHTML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Pastes a 2D array of cell HTML strings starting at `startCell`, automatically adding rows if needed.
 */
function pasteMatrixIntoTableAtCell(
  table: HTMLTableElement,
  startCell: HTMLTableCellElement,
  matrix: string[][]
): void {
  let gridInfo = buildTableGrid(table);
  let startR = 0;
  let startC = 0;

  for (let r = 0; r < gridInfo.numRows; r++) {
    for (let c = 0; c < gridInfo.numCols; c++) {
      if (gridInfo.grid[r]?.[c]?.cell === startCell && gridInfo.grid[r][c].isOrigin) {
        startR = r;
        startC = c;
      }
    }
  }

  // Expand rows if pasted matrix exceeds table rows
  while (startR + matrix.length > gridInfo.numRows) {
    insertTableRow(table, gridInfo.numRows - 1, 'after');
    gridInfo = buildTableGrid(table);
  }

  for (let dr = 0; dr < matrix.length; dr++) {
    for (let dc = 0; dc < matrix[dr].length; dc++) {
      const slot = gridInfo.grid[startR + dr]?.[startC + dc];
      if (slot && slot.isOrigin) {
        const editor = ensureCellEditor(slot.cell);
        const content = matrix[dr][dc];
        editor.innerHTML = content.startsWith('<p') ? content : `<p>${content}</p>`;
      }
    }
  }
}

export function focusCellEditor(editor: HTMLElement, selectAll = false): void {
  editor.focus();
  const sel = window.getSelection();
  if (!sel) return;
  const range = document.createRange();
  range.selectNodeContents(editor);
  if (!selectAll) {
    range.collapse(false);
  }
  sel.removeAllRanges();
  sel.addRange(range);
}
