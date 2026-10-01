import { useRef, useState } from 'react';
import type { CursorPath } from '@/collab/types';
import type { ContentEditorContextValue } from '@/context/ContentEditorContext';
import { CONTENT_CHIP_HTML_MIME, CONTENT_CHIP_MIME } from '../ContentEditor.constants';
import type { TinyMceEditor } from '../ContentEditor.types';
import { caretRangeAtPoint } from '../utils/domCaret';
import { clampOffset, getNodePath, resolveNodePath, serializeSelection } from '../utils/nodePath';

export const usePreviewActivation = (
  ctx: ContentEditorContextValue | null,
  myId: string,
  id: string,
  disabled: boolean,
  lockedByOther: boolean,
  selectionOnly: boolean,
) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const pendingSelectionRef = useRef<CursorPath | null>(null);

  const pendingInsertHtmlRef = useRef<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handlePreviewPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || selectionOnly) return;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePreviewPointerUp = () => {
    if (disabled || !ctx) return;

    if (selectionOnly) return;

    if (lockedByOther) return;

    pendingSelectionRef.current = null;
    const root = previewRef.current;
    const selection = window.getSelection();
    if (root && selection) {
      pendingSelectionRef.current = serializeSelection(root, selection);
    }

    ctx.requestActivate(id, myId);
  };

  // Enter starts editing, the way clicking does. Focus alone must not: tabbing
  // through a document would then take — and hold — the lock on every section
  // it passed.
  const handlePreviewKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Enter') return;
    if (disabled || !ctx || selectionOnly || lockedByOther) return;
    e.preventDefault();
    pendingSelectionRef.current = null;
    ctx.requestActivate(id, myId);
  };

  const handlePreviewDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (disabled || !e.dataTransfer.types.includes(CONTENT_CHIP_MIME)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  };

  const handlePreviewDragLeave = () => setIsDragOver(false);

  const handlePreviewDrop = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragOver(false);
    if (disabled || !ctx || lockedByOther) return;
    const chipHtml = e.dataTransfer.getData(CONTENT_CHIP_HTML_MIME);
    if (!chipHtml) return;
    e.preventDefault();

    pendingSelectionRef.current = null;
    const root = previewRef.current;
    const range = caretRangeAtPoint(e.clientX, e.clientY);
    if (root && range && root.contains(range.startContainer)) {
      const path = getNodePath(root, range.startContainer);
      if (path) {
        pendingSelectionRef.current = {
          startPath: path,
          startOffset: range.startOffset,
          endPath: path,
          endOffset: range.startOffset,
        };
      }
    }

    pendingInsertHtmlRef.current = chipHtml;
    ctx.requestActivate(id, myId);
  };

  const applyPendingSelection = (editor: TinyMceEditor) => {
    const pending = pendingSelectionRef.current;
    pendingSelectionRef.current = null;
    const pendingInsert = pendingInsertHtmlRef.current;
    pendingInsertHtmlRef.current = null;
    if (!pending && !pendingInsert) return;

    const body = editor.getBody();
    if (!body) return;

    if (pending) {
      const startNode = resolveNodePath(body, pending.startPath);
      const endNode = resolveNodePath(body, pending.endPath);
      if (startNode && endNode) {
        try {
          const range = document.createRange();
          range.setStart(startNode, clampOffset(startNode, pending.startOffset));
          range.setEnd(endNode, clampOffset(endNode, pending.endOffset));
          editor.selection.setRng(range);
          editor.nodeChanged();
        } catch {}
      }
    }

    if (pendingInsert) editor.insertContent(pendingInsert);
  };

  return {
    previewRef,
    isDragOver,
    handlePreviewPointerDown,
    handlePreviewPointerUp,
    handlePreviewKeyDown,
    handlePreviewDragOver,
    handlePreviewDragLeave,
    handlePreviewDrop,
    applyPendingSelection,
  };
};
