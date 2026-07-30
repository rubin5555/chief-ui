import type { CollabContextValue } from '@/context/CollabContext';
import type { ContentEditorContextValue } from '@/context/ContentEditorContext';
import { CONTENT_CHIP_HTML_MIME, CONTENT_CHIP_MIME } from '../ContentEditor.constants';
import type { EditorClickEvent, EditorDragEvent, TinyMceEditor } from '../ContentEditor.types';
import { serializeSelection } from '../utils/nodePath';

const CURSOR_SEND_DEBOUNCE_MS = 150;

export const useTinyMceSetup = (
  ctx: ContentEditorContextValue | null,
  collab: CollabContextValue | null,
  id: string,
  isLockHolderRef: React.RefObject<boolean>,
  onChangeRef: React.RefObject<(v: string) => void>,
) => {
  const handleUndoRedoSetup = (editor: TinyMceEditor) => {
    if (!ctx) return;

    editor.on('AddUndo', () => {
      ctx.pushHistoryLevel(id, editor.getContent());
    });

    editor.addCommand('Undo', () => {
      const prev = ctx.undoHistory(id);
      if (prev === null) return;
      editor.undoManager.ignore(() => editor.setContent(prev));
      onChangeRef.current(prev);
      editor.nodeChanged();
    });

    editor.addCommand('Redo', () => {
      const next = ctx.redoHistory(id);
      if (next === null) return;
      editor.undoManager.ignore(() => editor.setContent(next));
      onChangeRef.current(next);
      editor.nodeChanged();
    });
  };

  const handleChipSetup = (editor: TinyMceEditor) => {
    editor.on('dragover', (e: EditorDragEvent) => {
      if (e.dataTransfer?.types.includes(CONTENT_CHIP_MIME)) e.preventDefault();
    });

    editor.on('drop', (e: EditorDragEvent) => {
      const chipHtml = e.dataTransfer?.getData(CONTENT_CHIP_HTML_MIME);
      if (!chipHtml) return;
      e.preventDefault();
      editor.selection.placeCaretAt(e.clientX, e.clientY);
      editor.insertContent(chipHtml);
    });

    editor.on('click', (e: EditorClickEvent) => {
      const target = e.target instanceof Element ? e.target : null;

      const removeBtn = target?.closest('[data-chip-remove]');
      if (removeBtn) {
        removeBtn.closest('[data-chip-id]')?.remove();

        editor.undoManager.add();
        onChangeRef.current(editor.getContent());
        return;
      }

      const listToggleBtn = target?.closest('[data-chip-list-toggle]');
      if (listToggleBtn) {
        const container = listToggleBtn.closest('[data-chip-shape="list"]');
        const listEl = container?.querySelector('ul, ol');
        if (!container || !listEl) return;
        const nextOrdered = listEl.tagName === 'UL';
        const replacement = document.createElement(nextOrdered ? 'ol' : 'ul');
        replacement.append(...Array.from(listEl.childNodes));
        listEl.replaceWith(replacement);
        container.setAttribute('data-chip-ordered', String(nextOrdered));
        editor.undoManager.add();
        onChangeRef.current(editor.getContent());
      }
    });
  };

  const handleCursorSetup = (editor: TinyMceEditor) => {
    if (!collab) return;
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    editor.on('SelectionChange', () => {
      if (!isLockHolderRef.current) return;
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const body = editor.getBody();
        const path = serializeSelection(body, window.getSelection());
        if (path) collab.sendCursor(id, path);
      }, CURSOR_SEND_DEBOUNCE_MS);
    });
  };

  const handleEditorSetup = (editor: TinyMceEditor) => {
    handleUndoRedoSetup(editor);
    handleChipSetup(editor);
    handleCursorSetup(editor);
  };

  return handleEditorSetup;
};
