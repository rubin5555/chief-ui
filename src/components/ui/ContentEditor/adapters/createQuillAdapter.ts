import Quill from 'quill';
import type {
  ContentEditorInstance,
  EditorClickEvent,
  EditorDragEvent,
  SearchReplaceApi,
} from '../ContentEditor.types';

// Register style attributors for inline styling
// ponytail: global style registration for Quill inline CSS
const ColorStyle = Quill.import('attributors/style/color');
// biome-ignore lint/suspicious/noExplicitAny: register overload
if (ColorStyle) Quill.register(ColorStyle as any, true);

const BackgroundStyle = Quill.import('attributors/style/background');
// biome-ignore lint/suspicious/noExplicitAny: register overload
if (BackgroundStyle) Quill.register(BackgroundStyle as any, true);

const AlignStyle = Quill.import('attributors/style/align');
// biome-ignore lint/suspicious/noExplicitAny: register overload
if (AlignStyle) Quill.register(AlignStyle as any, true);

const DirectionStyle = Quill.import('attributors/style/direction');
// biome-ignore lint/suspicious/noExplicitAny: register overload
if (DirectionStyle) Quill.register(DirectionStyle as any, true);

// ponytail: register TH in table cell blot to support table header cells
// biome-ignore lint/suspicious/noExplicitAny: quill blot definition
const TableCell = Quill.import('formats/table') as any;
if (TableCell) {
  TableCell.tagName = ['TD', 'TH'];
  Quill.register(TableCell, true);
}

// ponytail: register TableCaption blot to support table captions
// biome-ignore lint/suspicious/noExplicitAny: quill blot definition
const Block = Quill.import('blots/block') as any;
// biome-ignore lint/suspicious/noExplicitAny: quill blot definition
const TableContainer = Quill.import('formats/table-container') as any;
// biome-ignore lint/suspicious/noExplicitAny: quill blot definition
const TableBody = Quill.import('formats/table-body') as any;

if (Block && TableContainer && TableBody) {
  class TableCaption extends Block {
    static blotName = 'table-caption';
    static tagName = 'CAPTION';
  }
  // biome-ignore lint/suspicious/noExplicitAny: blot relationship
  (TableCaption as any).requiredContainer = TableContainer;
  TableContainer.allowedChildren = [TableCaption, TableBody];
  TableContainer.prototype.rows = function () {
    const body = this.descendants(TableBody)[0] || this.children.head;
    if (body == null || !body.children) return [];
    return body.children.map((row: unknown) => row);
  };
  Quill.register(TableCaption, true);
  Quill.register(TableContainer, true);
}

export interface QuillAdapterOptions {
  onChange: (value: string) => void;
}

export interface QuillAdapterResult {
  editor: ContentEditorInstance;
  destroy: () => void;
}

// biome-ignore lint/suspicious/noExplicitAny: generic callback handler
type EditorListener = (...args: any[]) => void;

export const createQuillAdapter = (
  quill: Quill,
  options: QuillAdapterOptions,
): QuillAdapterResult => {
  const listeners = new Map<string, Set<EditorListener>>();
  const customCommands = new Map<string, () => void>();
  let isIgnoringUndo = false;
  let undoDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  let lastSelectedNode: Element | null = null;

  const emit = (event: string, ...args: unknown[]) => {
    const cbs = listeners.get(event);
    if (cbs) {
      for (const cb of cbs) {
        cb(...args);
      }
    }
  };

  const syncSelection = () => {
    try {
      // biome-ignore lint/suspicious/noExplicitAny: internal quill selection update
      (quill as any).selection?.update('user');
    } catch {}
  };

  const getSafeFormat = (): Record<string, unknown> => {
    try {
      syncSelection();
      const range = quill.getSelection();
      if (!range) return {};
      return (quill.getFormat(range) as Record<string, unknown>) || {};
    } catch {
      return {};
    }
  };

  const scheduleAddUndo = () => {
    if (isIgnoringUndo) return;
    if (undoDebounceTimer) clearTimeout(undoDebounceTimer);
    undoDebounceTimer = setTimeout(() => {
      emit('AddUndo');
    }, 500);
  };

  const immediateAddUndo = () => {
    if (isIgnoringUndo) return;
    if (undoDebounceTimer) clearTimeout(undoDebounceTimer);
    emit('AddUndo');
  };

  // DOM Event Listeners
  const handleClick = (e: MouseEvent) => {
    emit('click', { target: e.target } as EditorClickEvent);
    emit('NodeChange');
    emit('SelectionChange');
  };

  const handleMouseUp = (e: MouseEvent) => {
    emit('mouseup', e);
    emit('NodeChange');
    emit('SelectionChange');
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    emit('keyup', e);
    emit('NodeChange');
    emit('SelectionChange');
  };

  const handleDragOver = (e: DragEvent) => {
    const customEvent: EditorDragEvent = {
      clientX: e.clientX,
      clientY: e.clientY,
      dataTransfer: e.dataTransfer,
      preventDefault: () => e.preventDefault(),
    };
    emit('dragover', customEvent);
  };

  const handleDrop = (e: DragEvent) => {
    const customEvent: EditorDragEvent = {
      clientX: e.clientX,
      clientY: e.clientY,
      dataTransfer: e.dataTransfer,
      preventDefault: () => e.preventDefault(),
    };
    emit('drop', customEvent);
  };

  quill.root.addEventListener('click', handleClick);
  quill.root.addEventListener('mouseup', handleMouseUp);
  quill.root.addEventListener('keyup', handleKeyUp);
  quill.root.addEventListener('dragover', handleDragOver);
  quill.root.addEventListener('drop', handleDrop);

  const handleEditorChange = (eventName: string, ...args: unknown[]) => {
    emit('NodeChange');
    emit('SelectionChange');
    if (eventName === 'text-change') {
      const source = args[2];
      if (source === 'user') {
        scheduleAddUndo();
        options.onChange(editor.getContent());
      }
    }
  };
  quill.on('editor-change', handleEditorChange);

  // Search & Replace API
  let searchMatches: Array<{ index: number; length: number }> = [];
  let currentMatchIdx = -1;

  const searchreplace: SearchReplaceApi = {
    find(text: string, matchCase: boolean, wholeWord: boolean): number {
      searchMatches = [];
      currentMatchIdx = -1;
      if (!text) return 0;

      const content = quill.getText();
      const flags = matchCase ? 'g' : 'gi';
      const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(wholeWord ? `\\b${escaped}\\b` : escaped, flags);

      let m = regex.exec(content);
      while (m !== null) {
        searchMatches.push({ index: m.index, length: m[0].length });
        m = regex.exec(content);
      }

      if (searchMatches.length > 0) {
        currentMatchIdx = 0;
        quill.setSelection(searchMatches[0].index, searchMatches[0].length);
      }
      return searchMatches.length;
    },
    next(): void {
      if (searchMatches.length === 0) return;
      currentMatchIdx = (currentMatchIdx + 1) % searchMatches.length;
      quill.setSelection(
        searchMatches[currentMatchIdx].index,
        searchMatches[currentMatchIdx].length,
      );
    },
    prev(): void {
      if (searchMatches.length === 0) return;
      currentMatchIdx = (currentMatchIdx - 1 + searchMatches.length) % searchMatches.length;
      quill.setSelection(
        searchMatches[currentMatchIdx].index,
        searchMatches[currentMatchIdx].length,
      );
    },
    replace(replacement: string, _forward?: boolean, all?: boolean): boolean {
      if (searchMatches.length === 0) return false;
      if (all) {
        for (let i = searchMatches.length - 1; i >= 0; i--) {
          const m = searchMatches[i];
          quill.deleteText(m.index, m.length);
          quill.insertText(m.index, replacement);
        }
        searchMatches = [];
        currentMatchIdx = -1;
        editor.nodeChanged();
        immediateAddUndo();
        options.onChange(editor.getContent());
        return true;
      }
      if (currentMatchIdx >= 0 && currentMatchIdx < searchMatches.length) {
        const m = searchMatches[currentMatchIdx];
        quill.deleteText(m.index, m.length);
        quill.insertText(m.index, replacement);
        searchMatches.splice(currentMatchIdx, 1);
        editor.nodeChanged();
        immediateAddUndo();
        options.onChange(editor.getContent());
        if (searchMatches.length > 0) {
          if (currentMatchIdx >= searchMatches.length) currentMatchIdx = 0;
          quill.setSelection(
            searchMatches[currentMatchIdx].index,
            searchMatches[currentMatchIdx].length,
          );
        }
        return true;
      }
      return false;
    },
    done(): void {
      searchMatches = [];
      currentMatchIdx = -1;
    },
  };

  const editor: ContentEditorInstance = {
    focus(): void {
      quill.focus();
    },
    selection: {
      setRng(rng: Range): void {
        const sel = window.getSelection();
        if (sel) {
          sel.removeAllRanges();
          sel.addRange(rng);
        }
      },
      placeCaretAt(clientX: number, clientY: number): void {
        let range: Range | null = null;
        if (document.caretRangeFromPoint) {
          range = document.caretRangeFromPoint(clientX, clientY);
        } else if (
          (
            document as unknown as {
              caretPositionFromPoint?: (
                x: number,
                y: number,
              ) => { offsetNode: Node; offset: number };
            }
          ).caretPositionFromPoint
        ) {
          const pos = (
            document as unknown as {
              caretPositionFromPoint: (
                x: number,
                y: number,
              ) => { offsetNode: Node; offset: number };
            }
          ).caretPositionFromPoint(clientX, clientY);
          if (pos) {
            range = document.createRange();
            range.setStart(pos.offsetNode, pos.offset);
            range.collapse(true);
          }
        }
        if (range) {
          const sel = window.getSelection();
          sel?.removeAllRanges();
          sel?.addRange(range);
        }
      },
      getRng(): Range {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) return sel.getRangeAt(0);
        const rng = document.createRange();
        if (quill.root) {
          rng.selectNodeContents(quill.root);
          rng.collapse(true);
        }
        return rng;
      },
      getNode(): Element {
        const sel = window.getSelection();
        if (sel?.anchorNode && quill.root.contains(sel.anchorNode)) {
          const el =
            (sel.anchorNode instanceof Element ? sel.anchorNode : sel.anchorNode.parentElement) ??
            quill.root;
          lastSelectedNode = el;
          return el;
        }
        if (lastSelectedNode && quill.root.contains(lastSelectedNode)) {
          return lastSelectedNode;
        }
        return quill.root;
      },
    },
    nodeChanged(): void {
      quill.update();
      emit('NodeChange');
      emit('SelectionChange');
    },
    getBody(): HTMLElement {
      return quill.root;
    },
    getContent(): string {
      if (
        quill.root.innerHTML === '<p><br></p>' &&
        !quill.root.querySelector('table, img, [data-chip-id]')
      ) {
        return '';
      }
      return quill.root.innerHTML;
    },
    setContent(html: string): void {
      quill.root.innerHTML = html || '<p><br></p>';
      quill.update();
    },
    insertContent(html: string): void {
      quill.focus();
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0 && quill.root.contains(sel.anchorNode)) {
        const range = sel.getRangeAt(0);
        range.deleteContents();
        const tpl = document.createElement('template');
        tpl.innerHTML = html;
        const frag = tpl.content;
        const lastNode = frag.lastChild;
        range.insertNode(frag);
        if (lastNode) {
          range.setStartAfter(lastNode);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        }
        quill.update();
      } else {
        const selRange = quill.getSelection();
        const index = selRange ? selRange.index : quill.getLength();
        quill.clipboard.dangerouslyPasteHTML(index, html, 'user');
      }
      editor.nodeChanged();
      immediateAddUndo();
      options.onChange(editor.getContent());
    },
    // biome-ignore lint/suspicious/noExplicitAny: event overload compatibility
    on(event: string, callback: (...args: any[]) => void): void {
      for (const ev of event.split(/\s+/).filter(Boolean)) {
        if (!listeners.has(ev)) listeners.set(ev, new Set());
        listeners.get(ev)?.add(callback);
      }
    },
    // biome-ignore lint/suspicious/noExplicitAny: event overload compatibility
    off(event: string, callback: (...args: any[]) => void): void {
      for (const ev of event.split(/\s+/).filter(Boolean)) {
        listeners.get(ev)?.delete(callback);
      }
    },
    addCommand(name: string, callback: () => void): void {
      customCommands.set(name, callback);
    },
    execCommand(name: string, _ui?: boolean, value?: unknown): void {
      if (customCommands.has(name)) {
        customCommands.get(name)?.();
        return;
      }

      switch (name) {
        case 'Bold': {
          syncSelection();
          const isBold = !!getSafeFormat().bold;
          quill.format('bold', !isBold, 'user');
          editor.nodeChanged();
          break;
        }
        case 'Italic': {
          syncSelection();
          const isItalic = !!getSafeFormat().italic;
          quill.format('italic', !isItalic, 'user');
          editor.nodeChanged();
          break;
        }
        case 'Underline': {
          syncSelection();
          const isUnderline = !!getSafeFormat().underline;
          quill.format('underline', !isUnderline, 'user');
          editor.nodeChanged();
          break;
        }
        case 'Strikethrough': {
          syncSelection();
          const isStrike = !!getSafeFormat().strike;
          quill.format('strike', !isStrike, 'user');
          editor.nodeChanged();
          break;
        }
        case 'InsertOrderedList': {
          const isOrdered = getSafeFormat().list === 'ordered';
          quill.format('list', isOrdered ? false : 'ordered', 'user');
          editor.nodeChanged();
          break;
        }
        case 'InsertUnorderedList': {
          const isBullet = getSafeFormat().list === 'bullet';
          quill.format('list', isBullet ? false : 'bullet', 'user');
          editor.nodeChanged();
          break;
        }
        case 'JustifyRight':
          quill.format('align', 'right', 'user');
          editor.nodeChanged();
          break;
        case 'JustifyCenter':
          quill.format('align', 'center', 'user');
          editor.nodeChanged();
          break;
        case 'JustifyLeft':
          quill.format('align', 'left', 'user');
          editor.nodeChanged();
          break;
        case 'JustifyFull':
          quill.format('align', 'justify', 'user');
          editor.nodeChanged();
          break;
        case 'Indent':
          quill.format('indent', '+1', 'user');
          editor.nodeChanged();
          break;
        case 'Outdent':
          quill.format('indent', '-1', 'user');
          editor.nodeChanged();
          break;
        case 'RemoveFormat': {
          const range = quill.getSelection();
          if (range && range.length > 0) {
            quill.removeFormat(range.index, range.length, 'user');
          } else {
            document.execCommand('removeFormat', false);
          }
          editor.nodeChanged();
          break;
        }
        case 'ForeColor':
          syncSelection();
          quill.format('color', (value as string) || false, 'user');
          editor.nodeChanged();
          break;
        case 'HiliteColor':
          syncSelection();
          quill.format('background', (value as string) || false, 'user');
          editor.nodeChanged();
          break;
        case 'mceDirectionRTL': {
          quill.format('direction', 'rtl', 'user');
          const node = editor.selection.getNode();
          const block = editor.dom.isBlock(node)
            ? node
            : editor.dom.getParent(node, 'p,div,li,td,th');
          if (block) {
            (block as HTMLElement).style.direction = 'rtl';
            (block as HTMLElement).setAttribute('dir', 'rtl');
          }
          editor.nodeChanged();
          break;
        }
        case 'mceDirectionLTR': {
          quill.format('direction', false, 'user');
          const node = editor.selection.getNode();
          const block = editor.dom.isBlock(node)
            ? node
            : editor.dom.getParent(node, 'p,div,li,td,th');
          if (block) {
            (block as HTMLElement).style.direction = 'ltr';
            (block as HTMLElement).setAttribute('dir', 'ltr');
          }
          editor.nodeChanged();
          break;
        }
        case 'mceInsertTable': {
          const { rows = 2, columns = 2 } = (value as { rows?: number; columns?: number }) || {};
          const rowId = () => Math.random().toString(36).slice(2, 8);
          let tableHtml =
            '<table style="border-collapse: collapse; width: 100%;" border="1"><tbody>';
          for (let r = 0; r < rows; r++) {
            const id = rowId();
            tableHtml += '<tr>';
            for (let c = 0; c < columns; c++) {
              tableHtml += `<td data-row="${id}"><br></td>`;
            }
            tableHtml += '</tr>';
          }
          tableHtml += '</tbody></table><p><br></p>';
          editor.insertContent(tableHtml);

          const firstTd = quill.root.querySelector('table td');
          if (firstTd) {
            const rng = document.createRange();
            rng.selectNodeContents(firstTd);
            rng.collapse(true);
            const sel = window.getSelection();
            sel?.removeAllRanges();
            sel?.addRange(rng);
            syncSelection();
            editor.nodeChanged();
          }
          break;
        }
        case 'mceTableInsertRowBefore': {
          const tr = editor.dom.getParent(
            editor.selection.getNode(),
            'tr',
          ) as HTMLTableRowElement | null;
          if (tr?.parentElement) {
            const newTr = document.createElement('tr');
            const rowId = Math.random().toString(36).slice(2, 8);
            const cellCount = tr.children.length;
            for (let i = 0; i < cellCount; i++) {
              const td = document.createElement('td');
              td.setAttribute('data-row', rowId);
              td.innerHTML = '<br>';
              newTr.appendChild(td);
            }
            tr.parentElement.insertBefore(newTr, tr);
            quill.update();
            editor.undoManager.add();
            editor.nodeChanged();
            options.onChange(editor.getContent());
          }
          break;
        }
        case 'mceTableInsertRowAfter': {
          const tr = editor.dom.getParent(
            editor.selection.getNode(),
            'tr',
          ) as HTMLTableRowElement | null;
          if (tr?.parentElement) {
            const newTr = document.createElement('tr');
            const rowId = Math.random().toString(36).slice(2, 8);
            const cellCount = tr.children.length;
            for (let i = 0; i < cellCount; i++) {
              const td = document.createElement('td');
              td.setAttribute('data-row', rowId);
              td.innerHTML = '<br>';
              newTr.appendChild(td);
            }
            tr.parentElement.insertBefore(newTr, tr.nextElementSibling);
            const firstTd = newTr.querySelector('td');
            if (firstTd) {
              const rng = document.createRange();
              rng.selectNodeContents(firstTd);
              rng.collapse(true);
              const sel = window.getSelection();
              sel?.removeAllRanges();
              sel?.addRange(rng);
              syncSelection();
            }
            quill.update();
            editor.undoManager.add();
            editor.nodeChanged();
            options.onChange(editor.getContent());
          }
          break;
        }
        case 'mceTableDeleteRow': {
          const tr = editor.dom.getParent(
            editor.selection.getNode(),
            'tr',
          ) as HTMLTableRowElement | null;
          if (tr) {
            const table = tr.closest('table');
            const nextTr = tr.nextElementSibling || tr.previousElementSibling;
            tr.remove();
            if (table && table.querySelectorAll('tr').length === 0) {
              table.remove();
            } else if (nextTr) {
              const firstTd = nextTr.querySelector('td');
              if (firstTd) {
                const rng = document.createRange();
                rng.selectNodeContents(firstTd);
                rng.collapse(true);
                const sel = window.getSelection();
                sel?.removeAllRanges();
                sel?.addRange(rng);
                syncSelection();
              }
            }
            quill.update();
            editor.undoManager.add();
            editor.nodeChanged();
            options.onChange(editor.getContent());
          }
          break;
        }
        case 'mceTableInsertColBefore': {
          const cell = editor.dom.getParent(
            editor.selection.getNode(),
            'td,th',
          ) as HTMLTableCellElement | null;
          const table = cell?.closest('table');
          if (cell && table) {
            const colIndex = cell.cellIndex;
            table.querySelectorAll('tr').forEach((row) => {
              const target = row.children[colIndex];
              const rowId =
                row.querySelector('td')?.getAttribute('data-row') ||
                Math.random().toString(36).slice(2, 8);
              const newCell = document.createElement(target?.tagName || 'td');
              newCell.setAttribute('data-row', rowId);
              newCell.innerHTML = '<br>';
              row.insertBefore(newCell, target || null);
            });
            quill.update();
            editor.undoManager.add();
            editor.nodeChanged();
            options.onChange(editor.getContent());
          }
          break;
        }
        case 'mceTableInsertColAfter': {
          const cell = editor.dom.getParent(
            editor.selection.getNode(),
            'td,th',
          ) as HTMLTableCellElement | null;
          const table = cell?.closest('table');
          if (cell && table) {
            const colIndex = cell.cellIndex;
            table.querySelectorAll('tr').forEach((row) => {
              const target = row.children[colIndex];
              const rowId =
                row.querySelector('td')?.getAttribute('data-row') ||
                Math.random().toString(36).slice(2, 8);
              const newCell = document.createElement(target?.tagName || 'td');
              newCell.setAttribute('data-row', rowId);
              newCell.innerHTML = '<br>';
              row.insertBefore(newCell, target ? target.nextElementSibling : null);
            });
            quill.update();
            editor.undoManager.add();
            editor.nodeChanged();
            options.onChange(editor.getContent());
          }
          break;
        }
        case 'mceTableDeleteCol': {
          const cell = editor.dom.getParent(
            editor.selection.getNode(),
            'td,th',
          ) as HTMLTableCellElement | null;
          const table = cell?.closest('table');
          if (cell && table) {
            const colIndex = cell.cellIndex;
            table.querySelectorAll('tr').forEach((row) => {
              row.children[colIndex]?.remove();
            });
            quill.update();
            editor.undoManager.add();
            editor.nodeChanged();
            options.onChange(editor.getContent());
          }
          break;
        }
        case 'mceTableMergeCells': {
          const cell = editor.dom.getParent(
            editor.selection.getNode(),
            'td,th',
          ) as HTMLTableCellElement | null;
          if (cell) {
            const next = cell.nextElementSibling as HTMLTableCellElement | null;
            if (next) {
              cell.colSpan = (cell.colSpan || 1) + (next.colSpan || 1);
              cell.innerHTML = `${cell.innerHTML} ${next.innerHTML}`.trim();
              next.remove();
              quill.update();
              editor.undoManager.add();
              editor.nodeChanged();
              options.onChange(editor.getContent());
            }
          }
          break;
        }
        case 'mceTableSplitCells': {
          const cell = editor.dom.getParent(
            editor.selection.getNode(),
            'td,th',
          ) as HTMLTableCellElement | null;
          if (cell && (cell.colSpan > 1 || cell.rowSpan > 1)) {
            if (cell.colSpan > 1) {
              cell.colSpan -= 1;
              const newCell = document.createElement('td');
              const rowId = cell.getAttribute('data-row') || Math.random().toString(36).slice(2, 8);
              newCell.setAttribute('data-row', rowId);
              newCell.innerHTML = '<br>';
              cell.after(newCell);
            }
            quill.update();
            editor.undoManager.add();
            editor.nodeChanged();
            options.onChange(editor.getContent());
          }
          break;
        }
        case 'mceTableDelete': {
          const table = editor.dom.getParent(editor.selection.getNode(), 'table');
          if (table) {
            table.remove();
            quill.update();
            editor.undoManager.add();
            editor.nodeChanged();
            options.onChange(editor.getContent());
          }
          break;
        }
        case 'mceTableApplyCellStyle': {
          const cell = editor.dom.getParent(
            editor.selection.getNode(),
            'td,th',
          ) as HTMLElement | null;
          if (cell && typeof value === 'object' && value !== null) {
            Object.assign(cell.style, value);
            editor.undoManager.add();
            editor.nodeChanged();
            options.onChange(editor.getContent());
          }
          break;
        }
        case 'Undo':
          quill.history?.undo();
          editor.nodeChanged();
          break;
        case 'Redo':
          quill.history?.redo();
          editor.nodeChanged();
          break;
        default:
          break;
      }
    },
    queryCommandState(name: string): boolean {
      const formats = getSafeFormat();
      switch (name) {
        case 'Bold':
          return !!formats.bold;
        case 'Italic':
          return !!formats.italic;
        case 'Underline':
          return !!formats.underline;
        case 'Strikethrough':
          return !!formats.strike;
        case 'InsertOrderedList':
          return formats.list === 'ordered';
        case 'InsertUnorderedList':
          return formats.list === 'bullet';
        case 'JustifyRight':
          return formats.align === 'right';
        case 'JustifyCenter':
          return formats.align === 'center';
        case 'JustifyLeft':
          return formats.align === 'left';
        case 'JustifyFull':
          return formats.align === 'justify';
        case 'Outdent':
          return Number(formats.indent ?? 0) > 0;
        default:
          return false;
      }
    },
    queryCommandValue(name: string): string {
      const formats = getSafeFormat();
      switch (name) {
        case 'ForeColor':
          return (formats.color as string) || '';
        case 'HiliteColor':
          return (formats.background as string) || '';
        default:
          return '';
      }
    },
    undoManager: {
      ignore(callback: () => void): void {
        isIgnoringUndo = true;
        try {
          callback();
        } finally {
          isIgnoringUndo = false;
        }
      },
      add(): void {
        immediateAddUndo();
      },
    },
    dom: {
      getParent(node: Node | null, selector: string): HTMLElement | null {
        if (!node) return null;
        const el = node instanceof Element ? node : node.parentElement;
        return el ? (el.closest(selector) as HTMLElement | null) : null;
      },
      isBlock(node: Node): boolean {
        if (!(node instanceof HTMLElement)) return false;
        const display = window.getComputedStyle(node).display;
        return (
          display === 'block' ||
          display === 'list-item' ||
          display === 'table' ||
          display === 'table-row'
        );
      },
      getStyle(node: Element, name: string, computed?: boolean): string {
        if (!(node instanceof HTMLElement)) return '';
        if (computed) return window.getComputedStyle(node).getPropertyValue(name);
        return (
          (node.style as unknown as Record<string, string>)[name] ||
          node.style.getPropertyValue(name) ||
          ''
        );
      },
      getAttrib(node: Element, name: string): string {
        return node.getAttribute(name) || '';
      },
    },
    formatter: {
      apply(name: string): void {
        quill.format(name, true, 'user');
        editor.nodeChanged();
      },
      remove(name: string): void {
        quill.format(name, false, 'user');
        editor.nodeChanged();
      },
    },
    plugins: {
      searchreplace,
    },
  };

  // Bind keyboard shortcuts to execCommand
  quill.keyboard?.addBinding({ key: 'z', shortKey: true }, () => {
    editor.execCommand('Undo');
    return false;
  });
  quill.keyboard?.addBinding({ key: 'y', shortKey: true }, () => {
    editor.execCommand('Redo');
    return false;
  });
  quill.keyboard?.addBinding({ key: 'z', shortKey: true, shiftKey: true }, () => {
    editor.execCommand('Redo');
    return false;
  });

  const destroy = () => {
    if (undoDebounceTimer) clearTimeout(undoDebounceTimer);
    quill.root.removeEventListener('click', handleClick);
    quill.root.removeEventListener('mouseup', handleMouseUp);
    quill.root.removeEventListener('keyup', handleKeyUp);
    quill.root.removeEventListener('dragover', handleDragOver);
    quill.root.removeEventListener('drop', handleDrop);
    quill.off('editor-change', handleEditorChange);
  };

  return { editor, destroy };
};
