import { useRef } from 'react';
import type { CollabContextValue } from '@/context/CollabContext';
import type { ContentEditorContextValue } from '@/context/ContentEditorContext';
import { CONTENT_CHIP_HTML_MIME, CONTENT_CHIP_MIME } from '../ContentEditor.constants';
import type {
  ContentEditorInstance,
  EditorClickEvent,
  EditorDragEvent,
} from '../ContentEditor.types';
import { serializeSelection } from '../utils/nodePath';

const CURSOR_SEND_DEBOUNCE_MS = 150;

export const useQuillSetup = (
  ctx: ContentEditorContextValue | null,
  collab: CollabContextValue | null,
  id: string,
  onChangeRef: React.RefObject<(v: string) => void>,
) => {
  const collabRef = useRef(collab);
  collabRef.current = collab;

  const handleUndoRedoSetup = (editor: ContentEditorInstance) => {
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

  const handleChipSetup = (editor: ContentEditorInstance) => {
    editor.on('dragover', (e: unknown) => {
      const dragEvent = e as EditorDragEvent;
      if (dragEvent.dataTransfer?.types.includes(CONTENT_CHIP_MIME)) dragEvent.preventDefault();
    });

    editor.on('drop', (e: unknown) => {
      const dragEvent = e as EditorDragEvent;
      const chipHtml = dragEvent.dataTransfer?.getData(CONTENT_CHIP_HTML_MIME);
      if (!chipHtml) return;
      dragEvent.preventDefault();
      editor.selection.placeCaretAt(dragEvent.clientX, dragEvent.clientY);
      editor.insertContent(chipHtml);
    });

    editor.on('click', (e: unknown) => {
      const clickEvent = e as EditorClickEvent;
      const target = clickEvent.target instanceof Element ? clickEvent.target : null;

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

  const handleCursorSetup = (editor: ContentEditorInstance) => {
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    const send = () => {
      const current = collabRef.current;
      if (!current) return;

      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const body = editor.getBody();
        if (!body) return;
        const rng = editor.selection?.getRng() ?? window.getSelection();
        const path = serializeSelection(body, rng);
        if (path) current.sendCursor(id, path);
      }, CURSOR_SEND_DEBOUNCE_MS);
    };

    editor.on('SelectionChange NodeChange keyup mouseup click', send);
  };

  const handleEditorSetup = (editor: ContentEditorInstance) => {
    handleUndoRedoSetup(editor);
    handleChipSetup(editor);
    handleCursorSetup(editor);
  };

  return handleEditorSetup;
};
