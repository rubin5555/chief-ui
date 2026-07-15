import type { CollabContextValue } from '@/context/CollabContext';
import type { ContentEditorContextValue } from '@/context/ContentEditorContext';
import { CONTENT_CHIP_HTML_MIME, CONTENT_CHIP_MIME } from '../ContentEditor.constants';
import type { EditorClickEvent, EditorDragEvent, TinyMceEditor } from '../ContentEditor.types';
import { serializeSelection } from '../utils/nodePath';

const CURSOR_SEND_DEBOUNCE_MS = 150;

// Wires the three TinyMCE `setup` concerns that only apply in shared (ContentEditorProvider)
// mode: per-id undo/redo bridging, content-chip drag/drop/remove, and cursor broadcast.
// Standalone mode (ctx/collab null) leaves TinyMCE's own UndoManager and native
// contenteditable behavior untouched.
export const useTinyMceSetup = (
  ctx: ContentEditorContextValue | null,
  collab: CollabContextValue | null,
  id: string,
  isLockHolderRef: React.RefObject<boolean>,
  onChangeRef: React.RefObject<(v: string) => void>,
) => {
  // Shared mode only: back Ctrl+Z/Ctrl+Y with our own per-id history (see
  // ContentEditorContext) instead of TinyMCE's built-in UndoManager, whose stack is
  // destroyed whenever this field's editor instance unmounts.
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

  // Chips are contenteditable="false" islands TinyMCE treats as atomic: dropping one
  // inserts it at the caret nearest the pointer, and clicking its × button removes it.
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
      if (!removeBtn) return;
      removeBtn.closest('[data-chip-id]')?.remove();
      // Manual DOM surgery bypasses TinyMCE's change events, so both the undo level
      // and the controlled value have to be pushed by hand.
      editor.undoManager.add();
      onChangeRef.current(editor.getContent());
    });
  };

  // Broadcasts this editor's own selection to the room, debounced, but only
  // while we're actually the lock holder — isLockHolderRef (not the plain
  // isLockHolder closed over at setup time) is what keeps this correct after
  // TinyMCE's `setup` callback has already run once at mount.
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
