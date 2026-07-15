import { useRef, useState } from 'react';
import type { CursorPath } from '@/collab/types';
import type { ContentEditorContextValue } from '@/context/ContentEditorContext';
import { CONTENT_CHIP_HTML_MIME, CONTENT_CHIP_MIME } from './ContentEditor.constants';
import type { TinyMceEditor } from './ContentEditor.types';
import { caretRangeAtPoint } from './domCaret';
import { clampOffset, getNodePath, resolveNodePath, serializeSelection } from './nodePath';

// Owns the inactive-preview surface: capturing the real selection or a chip's drop
// point before swapping to TinyMCE, and re-applying it once the editor mounts
// (handleInit calls `applyPendingSelection` after TinyMCE re-normalises its body).
export const usePreviewActivation = (
  ctx: ContentEditorContextValue | null,
  myId: string,
  id: string,
  disabled: boolean,
  lockedByOther: boolean,
) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const pendingSelectionRef = useRef<CursorPath | null>(null);
  // Chip HTML dropped on the inactive preview, inserted once the editor mounts.
  const pendingInsertHtmlRef = useRef<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Capture the pointer so the eventual pointerup/click stays targeted at this
  // preview even if another editor deactivating mid-drag shifts the layout
  // (e.g. stacked table cells) and moves this element out from under the cursor.
  const handlePreviewPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  // Capture the real browser selection out of the preview DOM (still mounted at
  // this point) before swapping to TinyMCE, then activate. Reading the actual
  // Selection/Range — rather than re-deriving one from click coordinates — is
  // what makes this robust: it's already normalised start-before-end, and it
  // already reflects native double/triple-click word/paragraph selection.
  const handlePreviewPointerUp = () => {
    if (disabled || !ctx) return;
    // Known to be held by someone else — skip the request entirely rather
    // than optimistically activating and immediately rolling back.
    if (lockedByOther) return;

    pendingSelectionRef.current = null;
    const root = previewRef.current;
    const selection = window.getSelection();
    if (root && selection) {
      pendingSelectionRef.current = serializeSelection(root, selection);
    }

    ctx.requestActivate(id, myId);
  };

  const handlePreviewDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (disabled || !e.dataTransfer.types.includes(CONTENT_CHIP_MIME)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  };

  const handlePreviewDragLeave = () => setIsDragOver(false);

  // Dropping on an inactive preview: map the drop point to a node path (same mechanism
  // as click-to-activate above), stash the chip HTML, and activate — handleInit finishes
  // the insertion once TinyMCE has mounted at the equivalent caret.
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

  // Preview and editor are rendered from the same HTML string, so the captured
  // node path re-resolves to the equivalent position in the editor's body —
  // no dependency on visual layout matching between the two. Called from
  // handleInit's runAfterFrame: TinyMCE re-normalises its body on init/focus,
  // and resolving immediately can hit nodes that get replaced right after.
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
        } catch {
          // Structure didn't line up (TinyMCE normalised the content differently
          // than the preview) — leave the default focus caret rather than throwing.
        }
      }
    }

    // A chip dropped on the preview inserts at the caret resolved above (or the
    // default focus caret when the drop point couldn't be mapped).
    if (pendingInsert) editor.insertContent(pendingInsert);
  };

  return {
    previewRef,
    isDragOver,
    handlePreviewPointerDown,
    handlePreviewPointerUp,
    handlePreviewDragOver,
    handlePreviewDragLeave,
    handlePreviewDrop,
    applyPendingSelection,
  };
};
