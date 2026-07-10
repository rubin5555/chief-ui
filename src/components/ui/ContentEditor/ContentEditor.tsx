import { Editor } from '@tinymce/tinymce-react';
import { useEffect, useRef, useState } from 'react';
import 'tinymce/tinymce';
import 'tinymce/icons/default';
import 'tinymce/themes/silver';
import 'tinymce/models/dom';
import 'tinymce/plugins/lists/plugin';
import 'tinymce/plugins/table/plugin';
import 'tinymce/plugins/directionality/plugin';
import 'tinymce/plugins/link/plugin';
import 'tinymce/plugins/image/plugin';
import 'tinymce/skins/ui/oxide/skin.min.css';
import 'tinymce/skins/ui/oxide/content.inline.min.css';

import type { CursorPath } from '@/collab/types';
import { useCollabContext } from '@/context/CollabContext';
import { useContentEditorContext } from '@/context/ContentEditorContext';
import {
  CONTENT_CHIP_HTML_MIME,
  CONTENT_CHIP_MIME,
  TINYMCE_INIT,
  TINYMCE_LICENSE_KEY,
} from './ContentEditor.constants';
import {
  EditorBody,
  EditorContent,
  EditorWrapper,
  LockBadge,
  PreviewContent,
  PreviewWrapper,
  ToolbarContainer,
} from './ContentEditor.styles';
import { CONTENT_EDITOR_IDS } from './ContentEditor.testids';
import { CursorOverlay } from './CursorOverlay';
import { clampOffset, getNodePath, resolveNodePath, serializeSelection } from './nodePath';

interface EditorDragEvent {
  clientX: number;
  clientY: number;
  dataTransfer: DataTransfer | null;
  preventDefault(): void;
}

interface EditorClickEvent {
  target: EventTarget | null;
}

interface TinyMceEditor {
  focus(): void;
  selection: {
    setRng(rng: Range): void;
    placeCaretAt(clientX: number, clientY: number): void;
    getRng(): Range;
  };
  nodeChanged(): void;
  getBody(): HTMLElement;
  getContent(): string;
  setContent(html: string): void;
  insertContent(html: string): void;
  on(event: 'dragover' | 'drop', callback: (e: EditorDragEvent) => void): void;
  on(event: 'click', callback: (e: EditorClickEvent) => void): void;
  on(event: string, callback: () => void): void;
  addCommand(name: string, callback: () => void): void;
  undoManager: { ignore(callback: () => void): void; add(): void };
}

// caretRangeFromPoint is Chromium/WebKit-only and caretPositionFromPoint is its Firefox
// counterpart — neither is guaranteed at runtime, so both are feature-detected.
const caretRangeAtPoint = (x: number, y: number): Range | null => {
  if (typeof document.caretRangeFromPoint === 'function') {
    return document.caretRangeFromPoint(x, y);
  }
  if (typeof document.caretPositionFromPoint === 'function') {
    const pos = document.caretPositionFromPoint(x, y);
    if (!pos) return null;
    const range = document.createRange();
    range.setStart(pos.offsetNode, pos.offset);
    range.collapse(true);
    return range;
  }
  return null;
};

// Prefers a paint frame (TinyMCE re-normalises its body on init/focus, and running after
// the next frame reliably lands past that), but rAF starves when the window isn't being
// painted (hidden/occluded tab) — the timeout keeps the callback from being lost there.
const AFTER_FRAME_FALLBACK_MS = 50;

const runAfterFrame = (callback: () => void) => {
  let hasRun = false;
  const runOnce = () => {
    if (hasRun) return;
    hasRun = true;
    callback();
  };
  requestAnimationFrame(runOnce);
  setTimeout(runOnce, AFTER_FRAME_FALLBACK_MS);
};

const CURSOR_SEND_DEBOUNCE_MS = 150;
const HEARTBEAT_INTERVAL_MS = 8000;

export interface ContentEditorProps {
  // Stable identity for the field's content (e.g. a section id), used to keep undo/redo
  // history alive across the TinyMCE instance being unmounted and remounted — such as
  // when this field scrolls out of and back into a virtualised list. Also the collab
  // layer's room id (plan §3): one lock, one set of remote cursors/content per id.
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  minHeight?: number;
  disabled?: boolean;
}

export const ContentEditor = ({
  id,
  value,
  onChange,
  placeholder,
  minHeight = 120,
  disabled = false,
}: ContentEditorProps) => {
  const ctx = useContentEditorContext();
  const collab = useCollabContext();
  const myId = useRef(`ce-${self.crypto.randomUUID()}`);
  const localToolbarId = useRef(`ce-tb-${myId.current}`);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const pendingSelectionRef = useRef<CursorPath | null>(null);
  // Chip HTML dropped on the inactive preview, inserted once the editor mounts.
  const pendingInsertHtmlRef = useRef<string | null>(null);
  const onChangeRef = useRef(onChange);
  const lastAppliedRemoteAtRef = useRef(0);

  const [editorReady, setEditorReady] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Standalone: TinyMCE always mounted, always "active".
  // Shared: active only when this instance owns the context focus.
  const isActive = !ctx || ctx.activeId === myId.current;
  const toolbarContainerId = ctx ? ctx.toolbarId : localToolbarId.current;

  const remoteLock = ctx?.lockState.get(id) ?? null;
  const isLockHolder = !!collab && remoteLock?.holderId === collab.userId;
  const lockedByOther = !!remoteLock && !isLockHolder;
  const remoteCursorPath = ctx?.remoteCursors.get(id) ?? null;

  const isLockHolderRef = useRef(isLockHolder);
  isLockHolderRef.current = isLockHolder;

  // CollabContext's value is a plain object recomputed whenever lockState/remoteCursors/
  // remoteContent change (i.e. on every incoming WS message) — its identity is not stable
  // across renders. Effects below need a `collab` reference but must NOT re-run every time
  // a message arrives (a join/leave effect keyed on the object itself would re-fire on
  // every message its own join triggers a response for, looping forever), so they read it
  // through this ref and key their dependency arrays on collab?.userId instead, which only
  // actually changes when the connection itself is torn down and rebuilt.
  const collabRef = useRef(collab);
  collabRef.current = collab;

  // Pushes local edits into collab too, but only while this client actually
  // holds the field's lock — with no collab wired up, or while just viewing
  // a remote push (see the remote-content effect below), this is identical
  // to the original plain onChange.
  const handleEditorChange = (newValue: string) => {
    onChange(newValue);
    if (collab && isLockHolderRef.current) collab.sendContent(id, newValue);
  };
  onChangeRef.current = handleEditorChange;

  // Every mounted field (active or previewing) joins its own collab room, so
  // remote content/cursor/lock updates reach the preview even when this
  // client never activates the field itself.
  useEffect(() => {
    if (!collabRef.current) return;
    collabRef.current.joinField(id);
    return () => collabRef.current?.leaveField(id);
  }, [id]);

  // A remote content push (only ever sent to non-holders — see RoomManager's
  // authorization check server-side) is applied the same way a local edit
  // is: through onChange, so it flows into the parent's document tree and
  // the preview re-renders from the updated `value` like any other change.
  const remoteUpdate = collab?.remoteContent.get(id);
  useEffect(() => {
    if (!remoteUpdate || remoteUpdate.receivedAt <= lastAppliedRemoteAtRef.current) return;
    lastAppliedRemoteAtRef.current = remoteUpdate.receivedAt;
    onChangeRef.current(remoteUpdate.html);
  }, [remoteUpdate]);

  // Keeps the server from auto-releasing this lock for silence (plan §3's
  // 30s timeout) while we're still the active holder.
  useEffect(() => {
    if (!collabRef.current || !isLockHolder) return;
    const interval = setInterval(() => collabRef.current?.sendHeartbeat(id), HEARTBEAT_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [isLockHolder, id]);

  const deactivate = () => {
    if (!ctx) return;
    ctx.setActive(null);
    setEditorReady(false);
    collab?.releaseLock(id);
  };

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

    ctx.requestActivate(id, myId.current);
  };

  const handleInit = (_: unknown, editor: TinyMceEditor) => {
    setEditorReady(true);

    // Standalone: user clicks directly into the contenteditable — no auto-focus needed.
    if (!ctx) return;

    // Seed this field's undo/redo history on first mount; a no-op if it already
    // exists from a prior mount (e.g. scrolling back into a virtualised list).
    ctx.getHistoryValue(id, value);

    editor.focus();

    const pending = pendingSelectionRef.current;
    pendingSelectionRef.current = null;
    const pendingInsert = pendingInsertHtmlRef.current;
    pendingInsertHtmlRef.current = null;
    if (!pending && !pendingInsert) return;

    // Preview and editor are rendered from the same HTML string, so the captured
    // node path re-resolves to the equivalent position in the editor's body —
    // no dependency on visual layout matching between the two. Deferred a frame
    // because TinyMCE re-normalises its body on init/focus; resolving immediately
    // can hit nodes that get replaced right after.
    runAfterFrame(() => {
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
    });
  };

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
    ctx.requestActivate(id, myId.current);
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    const next = e.relatedTarget as Element | null;
    if (next && wrapperRef.current?.contains(next)) return;
    if (next?.closest('.tox-tinymce-aux, .tox-dialog, .tox-pop')) return;
    if (ctx && next?.closest(`#${ctx.toolbarId}`)) return;
    // Ignore stale focusout events fired when TinyMCE's contenteditable is removed
    // from the DOM after another editor has already become active.
    if (ctx && ctx.activeId !== myId.current) return;
    deactivate();
  };

  return (
    <EditorWrapper ref={wrapperRef} data-testid={CONTENT_EDITOR_IDS.root} onBlur={handleBlur}>
      {/* Standalone: toolbar is always visible, not gated by active state */}
      {!ctx && (
        <ToolbarContainer id={localToolbarId.current} data-testid={CONTENT_EDITOR_IDS.toolbar} />
      )}

      {/* Editor body: always mounted in standalone, only when active in shared */}
      {isActive && (
        <EditorBody>
          <EditorContent $minHeight={minHeight} data-testid={CONTENT_EDITOR_IDS.content}>
            <Editor
              inline
              disabled={disabled}
              value={value}
              licenseKey={TINYMCE_LICENSE_KEY}
              onEditorChange={handleEditorChange}
              onInit={handleInit}
              init={{
                ...TINYMCE_INIT,
                placeholder,
                fixed_toolbar_container: `#${toolbarContainerId}`,
                setup: handleEditorSetup,
              }}
            />
          </EditorContent>
          {/* Overlay during TinyMCE initialisation — pointer-events:none so clicks pass through */}
          {!editorReady && (
            <PreviewContent
              $overlay
              $minHeight={minHeight}
              $isEmpty={!value}
              $disabled={disabled}
              data-placeholder={placeholder}
              dangerouslySetInnerHTML={{ __html: value }}
            />
          )}
        </EditorBody>
      )}

      {/* Shared mode inactive state */}
      {ctx && !isActive && (
        <PreviewWrapper>
          <PreviewContent
            ref={previewRef}
            $minHeight={minHeight}
            $isEmpty={!value}
            $disabled={disabled}
            $isDragOver={isDragOver}
            onPointerDown={handlePreviewPointerDown}
            onPointerUp={handlePreviewPointerUp}
            onDragOver={handlePreviewDragOver}
            onDragLeave={handlePreviewDragLeave}
            onDrop={handlePreviewDrop}
            data-testid={CONTENT_EDITOR_IDS.content}
            data-placeholder={placeholder}
            dangerouslySetInnerHTML={{ __html: value }}
          />
          {remoteLock && (
            <LockBadge data-testid={CONTENT_EDITOR_IDS.lockBadge}>
              בעריכה על ידי {remoteLock.holderId}
            </LockBadge>
          )}
          {remoteLock && remoteCursorPath && (
            <CursorOverlay
              containerRef={previewRef}
              path={remoteCursorPath}
              label={remoteLock.holderId}
            />
          )}
        </PreviewWrapper>
      )}
    </EditorWrapper>
  );
};
