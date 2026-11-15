import { exportCleanHTML } from '@workspace/tiny-quill-editor';
import { useRef } from 'react';
import type { CollabContextValue } from '@/context/CollabContext';
import { CONTENT_CHIP_HTML_MIME, CONTENT_CHIP_MIME } from '../ContentEditor.constants';
import { caretRangeAtPoint } from '../utils/domCaret';
import { serializeSelection } from '../utils/nodePath';

const CURSOR_SEND_DEBOUNCE_MS = 150;

export const useQuillSetup = (
  collab: CollabContextValue | null,
  id: string,
  onChangeRef: React.RefObject<(v: string) => void>,
) => {
  const collabRef = useRef(collab);
  collabRef.current = collab;

  const handleEditorSetup = (
    body: HTMLElement,
    // biome-ignore lint/suspicious/noExplicitAny: Quill instance
    quill: any,
    insertHTML: (html: string) => void,
  ) => {
    body.addEventListener('dragover', (e: DragEvent) => {
      if (e.dataTransfer?.types.includes(CONTENT_CHIP_MIME)) e.preventDefault();
    });

    body.addEventListener('drop', (e: DragEvent) => {
      const chipHtml = e.dataTransfer?.getData(CONTENT_CHIP_HTML_MIME);
      if (!chipHtml) return;
      e.preventDefault();
      const range = caretRangeAtPoint(e.clientX, e.clientY);
      if (range && body.contains(range.startContainer)) {
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
      insertHTML(chipHtml);
    });

    body.addEventListener('click', (e: MouseEvent) => {
      const target = e.target instanceof Element ? e.target : null;

      const removeBtn = target?.closest('[data-chip-remove]');
      if (removeBtn) {
        removeBtn.closest('[data-chip-id]')?.remove();
        quill?.update?.('silent');
        onChangeRef.current(exportCleanHTML(body));
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
        quill?.update?.('silent');
        onChangeRef.current(exportCleanHTML(body));
      }
    });

    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    let lastValidPath: ReturnType<typeof serializeSelection> = null;
    const sendCursor = () => {
      const current = collabRef.current;
      if (!current) return;
      const immediatePath = serializeSelection(body, window.getSelection());
      if (immediatePath) lastValidPath = immediatePath;
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const path = serializeSelection(body, window.getSelection()) ?? lastValidPath;
        if (path) current.sendCursor(id, path);
      }, CURSOR_SEND_DEBOUNCE_MS);
    };

    body.addEventListener('keyup', sendCursor);
    body.addEventListener('mouseup', sendCursor);
    body.addEventListener('click', sendCursor);
    quill?.on?.('editor-change', sendCursor);
  };

  return handleEditorSetup;
};
