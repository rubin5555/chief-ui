'use client';

import { useCallback } from 'react';
import { ensureCellEditor } from '../tableEngine';
import { focusCellEditor } from '../TinyTableBlot';

interface UseRichTextFormatParams {
  quillInstanceRef: React.MutableRefObject<any>;
  selectedCellsRef: React.MutableRefObject<HTMLTableCellElement[]>;
  resolveTargetTable: () => HTMLTableElement | null;
  resolveTargetCell: () => HTMLTableCellElement | null;
  pushHistorySnapshot: (immediate?: boolean) => void;
  onFormatApplied?: () => void;
}

export function useRichTextFormat({
  quillInstanceRef,
  selectedCellsRef,
  resolveTargetTable,
  resolveTargetCell,
  pushHistorySnapshot,
  onFormatApplied,
}: UseRichTextFormatParams) {
  const applyFormat = useCallback(
    (command: string, value?: string) => {
      const quill = quillInstanceRef.current;
      if (!quill) return;

      const table = resolveTargetTable();
      const cell = resolveTargetCell();
      const connectedCells = selectedCellsRef.current.filter((c) => c.isConnected);

      // Case 1: Multiple table cells are selected via rectangular drag selection
      if (connectedCells.length > 1 && table) {
        connectedCells.forEach((c) => {
          const ed = ensureCellEditor(c);
          if (command === 'justifyLeft') c.style.textAlign = 'left';
          else if (command === 'justifyCenter') c.style.textAlign = 'center';
          else if (command === 'justifyRight') c.style.textAlign = 'right';
          else if (command === 'justifyFull') c.style.textAlign = 'justify';
          else if (command === 'hiliteColor') {
            c.style.backgroundColor = value || '';
          } else {
            const sel = window.getSelection();
            if (sel) {
              const range = document.createRange();
              range.selectNodeContents(ed);
              sel.removeAllRanges();
              sel.addRange(range);
              document.execCommand(command, false, value);
            }
          }
        });
        window.getSelection()?.removeAllRanges();
        pushHistorySnapshot(true);
        return;
      }

      // Case 2: Cursor is inside a single table cell
      if (cell && table) {
        const ed = ensureCellEditor(cell);
        if (document.activeElement !== ed && !ed.contains(document.activeElement)) {
          focusCellEditor(ed, false);
        }
        if (command === 'justifyLeft') cell.style.textAlign = 'left';
        else if (command === 'justifyCenter') cell.style.textAlign = 'center';
        else if (command === 'justifyRight') cell.style.textAlign = 'right';
        else if (command === 'justifyFull') cell.style.textAlign = 'justify';
        else {
          document.execCommand(command, false, value);
        }
        pushHistorySnapshot(false);
        return;
      }

      // Case 3: Standard Quill document text outside tables
      quill.focus();
      switch (command) {
        case 'bold': {
          const fmt = quill.getFormat();
          quill.format('bold', !fmt.bold);
          break;
        }
        case 'italic': {
          const fmt = quill.getFormat();
          quill.format('italic', !fmt.italic);
          break;
        }
        case 'underline': {
          const fmt = quill.getFormat();
          quill.format('underline', !fmt.underline);
          break;
        }
        case 'strikeThrough': {
          const fmt = quill.getFormat();
          quill.format('strike', !fmt.strike);
          break;
        }
        case 'subscript': {
          const fmt = quill.getFormat();
          quill.format('script', fmt.script === 'sub' ? false : 'sub');
          break;
        }
        case 'superscript': {
          const fmt = quill.getFormat();
          quill.format('script', fmt.script === 'super' ? false : 'super');
          break;
        }
        case 'justifyLeft':
          quill.format('align', 'left');
          break;
        case 'justifyCenter':
          quill.format('align', 'center');
          break;
        case 'justifyRight':
          quill.format('align', 'right');
          break;
        case 'justifyFull':
          quill.format('align', 'justify');
          break;
        case 'insertUnorderedList': {
          const fmt = quill.getFormat();
          quill.format('list', fmt.list === 'bullet' ? false : 'bullet');
          break;
        }
        case 'insertOrderedList': {
          const fmt = quill.getFormat();
          quill.format('list', fmt.list === 'ordered' ? false : 'ordered');
          break;
        }
        case 'foreColor':
          quill.format('color', value || false);
          break;
        case 'hiliteColor':
          quill.format('background', value || false);
          break;
        case 'formatBlock': {
          if (value === 'P') {
            quill.format('header', false);
            quill.format('blockquote', false);
            quill.format('code-block', false);
          } else if (value?.startsWith('H')) {
            const level = parseInt(value.slice(1), 10);
            quill.format('header', level);
          } else if (value === 'BLOCKQUOTE') {
            const fmt = quill.getFormat();
            quill.format('blockquote', !fmt.blockquote);
          } else if (value === 'PRE') {
            const fmt = quill.getFormat();
            quill.format('code-block', !fmt['code-block']);
          }
          break;
        }
        case 'removeFormat': {
          const range = quill.getSelection();
          if (range) {
            quill.removeFormat(range.index, range.length);
          }
          break;
        }
        default:
          document.execCommand(command, false, value);
      }
      pushHistorySnapshot(true);
      onFormatApplied?.();
    },
    [
      onFormatApplied,
      pushHistorySnapshot,
      quillInstanceRef,
      resolveTargetCell,
      resolveTargetTable,
      selectedCellsRef,
    ]
  );

  return { applyFormat };
}
