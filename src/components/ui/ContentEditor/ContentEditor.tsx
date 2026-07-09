import { Editor } from '@tinymce/tinymce-react';
import { useRef, useState } from 'react';
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

import { useContentEditorContext } from '@/context/ContentEditorContext';
import { TINYMCE_INIT, TINYMCE_LICENSE_KEY } from './ContentEditor.constants';
import {
  EditorBody,
  EditorContent,
  EditorWrapper,
  PreviewContent,
  ToolbarContainer,
} from './ContentEditor.styles';
import { CONTENT_EDITOR_IDS } from './ContentEditor.testids';

interface TinyMceEditor {
  focus(): void;
  selection: { setRng(rng: Range): void };
  nodeChanged(): void;
  getBody(): HTMLElement;
  getContent(): string;
  setContent(html: string): void;
  on(event: string, callback: () => void): void;
  addCommand(name: string, callback: () => void): void;
  undoManager: { ignore(callback: () => void): void };
}

interface SerializedSelection {
  startPath: number[];
  startOffset: number;
  endPath: number[];
  endOffset: number;
}

// Whitespace-only text nodes (e.g. the newline TinyMCE's serializer pretty-prints
// between block elements on save) aren't guaranteed to exist in both trees a path is
// resolved against, so they're excluded from sibling indices on both ends.
const isInsignificantTextNode = (node: Node): boolean =>
  node.nodeType === Node.TEXT_NODE && !(node as Text).data.trim();

const significantChildren = (node: Node): Node[] =>
  Array.prototype.filter.call(node.childNodes, (child: Node) => !isInsignificantTextNode(child));

// Path of child indices from `root` down to `node`, so the same position can be
// re-located inside a *different* DOM tree that mirrors root's structure (e.g. the
// TinyMCE body mounted from the same HTML string as this preview).
const getNodePath = (root: Node, node: Node): number[] | null => {
  const path: number[] = [];
  let current: Node | null = node;
  while (current && current !== root) {
    const parent: Node | null = current.parentNode;
    if (!parent) return null;
    path.unshift(significantChildren(parent).indexOf(current));
    current = parent;
  }
  return current === root ? path : null;
};

const resolveNodePath = (root: Node, path: number[]): Node | null => {
  let current: Node = root;
  for (const index of path) {
    const child = significantChildren(current)[index];
    if (!child) return null;
    current = child;
  }
  return current;
};

const clampOffset = (node: Node, offset: number): number => {
  const max =
    node.nodeType === Node.TEXT_NODE ? (node as Text).data.length : node.childNodes.length;
  return Math.min(offset, max);
};

export interface ContentEditorProps {
  // Stable identity for the field's content (e.g. a section id), used to keep undo/redo
  // history alive across the TinyMCE instance being unmounted and remounted — such as
  // when this field scrolls out of and back into a virtualised list.
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
  const myId = useRef(`ce-${self.crypto.randomUUID()}`);
  const localToolbarId = useRef(`ce-tb-${myId.current}`);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const pendingSelectionRef = useRef<SerializedSelection | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const [editorReady, setEditorReady] = useState(false);

  // Standalone: TinyMCE always mounted, always "active".
  // Shared: active only when this instance owns the context focus.
  const isActive = !ctx || ctx.activeId === myId.current;
  const toolbarContainerId = ctx ? ctx.toolbarId : localToolbarId.current;

  const deactivate = () => {
    if (!ctx) return;
    ctx.setActive(null);
    setEditorReady(false);
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

    pendingSelectionRef.current = null;

    const root = previewRef.current;
    const selection = window.getSelection();
    if (root && selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (root.contains(range.startContainer) && root.contains(range.endContainer)) {
        const startPath = getNodePath(root, range.startContainer);
        const endPath = getNodePath(root, range.endContainer);
        if (startPath && endPath) {
          pendingSelectionRef.current = {
            startPath,
            startOffset: range.startOffset,
            endPath,
            endOffset: range.endOffset,
          };
        }
      }
    }

    ctx.setActive(myId.current);
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
    if (!pending) return;

    // Preview and editor are rendered from the same HTML string, so the captured
    // node path re-resolves to the equivalent position in the editor's body —
    // no dependency on visual layout matching between the two. Deferred a frame
    // because TinyMCE re-normalises its body on init/focus; resolving immediately
    // can hit nodes that get replaced right after.
    requestAnimationFrame(() => {
      const body = editor.getBody();
      if (!body) return;

      const startNode = resolveNodePath(body, pending.startPath);
      const endNode = resolveNodePath(body, pending.endPath);
      if (!startNode || !endNode) return;

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
              onEditorChange={onChange}
              onInit={handleInit}
              init={{
                ...TINYMCE_INIT,
                placeholder,
                fixed_toolbar_container: `#${toolbarContainerId}`,
                setup: handleUndoRedoSetup,
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
        <PreviewContent
          ref={previewRef}
          $minHeight={minHeight}
          $isEmpty={!value}
          $disabled={disabled}
          onPointerDown={handlePreviewPointerDown}
          onPointerUp={handlePreviewPointerUp}
          data-testid={CONTENT_EDITOR_IDS.content}
          data-placeholder={placeholder}
          dangerouslySetInnerHTML={{ __html: value }}
        />
      )}
    </EditorWrapper>
  );
};
