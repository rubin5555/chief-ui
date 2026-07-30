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
// Naming a plugin in TINYMCE_PLUGINS is not enough to load one — TinyMCE is
// bundled here rather than served, so a plugin nobody imports is a name it looks
// for at a URL that doesn't exist, and fails to find without saying so.
import 'tinymce/plugins/searchreplace/plugin';
import 'tinymce/skins/ui/oxide/skin.min.css';
import 'tinymce/skins/ui/oxide/content.inline.min.css';

import { TINYMCE_INIT, TINYMCE_LICENSE_KEY } from './ContentEditor.constants';
import {
  EditorBody,
  EditorContent,
  EditorWrapper,
  LockBadge,
  PreviewContent,
  PreviewWrapper,
} from './ContentEditor.styles';
import { CONTENT_EDITOR_IDS } from './ContentEditor.testids';
import type { TinyMceEditor } from './ContentEditor.types';
import { CursorOverlay } from './components/CursorOverlay';
import { EditorRibbon } from './components/EditorRibbon';
import { RIBBON_MARKER_ATTR } from './components/EditorRibbon/EditorRibbon.constants';
import { TableEditBar } from './components/TableEditBar';
import { useContentEditorCollab } from './hooks/useContentEditorCollab';
import { usePreviewActivation } from './hooks/usePreviewActivation';
import { useTinyMceSetup } from './hooks/useTinyMceSetup';
import { runAfterFrame } from './utils/domCaret';

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
  /**
   * Clicking the field selects text instead of opening it for editing. For
   * surfaces that are momentarily being read rather than written — the document
   * page turns this on while a passage is being marked to quote in a comment.
   *
   * Distinct from `disabled`, which says the content may not be edited at all:
   * this field is editable, just not by this click.
   */
  selectionOnly?: boolean;
  /**
   * Draws the field as part of the surface it sits in — a tinted fill on a
   * hairline edge, no lift — instead of as a white card floating on one. The
   * document page's sections are inset: they are areas of the sheet, not cards
   * placed on it (see EditorWrapper).
   */
  inset?: boolean;
}

export const ContentEditor = ({
  id,
  value,
  onChange,
  placeholder,
  minHeight = 120,
  disabled = false,
  selectionOnly = false,
  inset = false,
}: ContentEditorProps) => {
  const myId = useRef(`ce-${self.crypto.randomUUID()}`);
  const localToolbarId = useRef(`ce-tb-${myId.current}`);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChange);

  const [editorReady, setEditorReady] = useState(false);
  // Standalone only: with no provider above, this field owns its own ribbon and so
  // has to hold its own editor handle. In shared mode the same handle goes into the
  // context instead, because the toolbar up there is the one that needs it.
  const [localEditor, setLocalEditor] = useState<TinyMceEditor | null>(null);

  const { ctx, collab, remoteLock, isLockHolderRef, lockedByOther, remoteCursorPath } =
    useContentEditorCollab(id, onChangeRef);

  // Standalone: TinyMCE always mounted, always "active".
  // Shared: active only when this instance owns the context focus.
  const isActive = !ctx || ctx.activeId === myId.current;

  const {
    previewRef,
    isDragOver,
    handlePreviewPointerDown,
    handlePreviewPointerUp,
    handlePreviewDragOver,
    handlePreviewDragLeave,
    handlePreviewDrop,
    applyPendingSelection,
  } = usePreviewActivation(ctx, myId.current, id, disabled, lockedByOther, selectionOnly);

  const handleEditorSetup = useTinyMceSetup(ctx, collab, id, isLockHolderRef, onChangeRef);

  // Pushes local edits into collab too, but only while this client actually
  // holds the field's lock — with no collab wired up, or while just viewing
  // a remote push (see useContentEditorCollab's remote-content effect), this
  // is identical to the original plain onChange.
  const handleEditorChange = (newValue: string) => {
    onChange(newValue);
    if (collab && isLockHolderRef.current) collab.sendContent(id, newValue);
  };
  onChangeRef.current = handleEditorChange;

  const deactivate = () => {
    if (!ctx) return;
    ctx.setActive(null);
    ctx.setActiveEditor(null);
    setEditorReady(false);
    collab?.releaseLock(id);
  };

  const handleInit = (_: unknown, editor: TinyMceEditor) => {
    setEditorReady(true);

    // Standalone: user clicks directly into the contenteditable — no auto-focus needed.
    if (!ctx) {
      setLocalEditor(editor);
      return;
    }

    // The ribbon above is pointed at this field from here on: it is the first
    // moment there is an editor to point it at.
    ctx.setActiveEditor(editor);

    // Seed this field's undo/redo history on first mount; a no-op if it already
    // exists from a prior mount (e.g. scrolling back into a virtualised list).
    ctx.getHistoryValue(id, value);

    editor.focus();
    runAfterFrame(() => applyPendingSelection(editor));
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    const next = e.relatedTarget as Element | null;
    if (next && wrapperRef.current?.contains(next)) return;
    if (next?.closest('.tox-tinymce-aux, .tox-dialog, .tox-pop')) return;
    // Using the toolbar is not leaving the field. That covers the ribbon itself
    // and everything it opens: its palettes and panels are portalled onto the
    // body, so they are nowhere near this element in the DOM and only the marker
    // identifies them.
    if (next?.closest(`[${RIBBON_MARKER_ATTR}]`)) return;
    // Ignore stale focusout events fired when TinyMCE's contenteditable is removed
    // from the DOM after another editor has already become active.
    if (ctx && ctx.activeId !== myId.current) return;
    deactivate();
  };

  return (
    <EditorWrapper
      ref={wrapperRef}
      $inset={inset}
      data-testid={CONTENT_EDITOR_IDS.root}
      onBlur={handleBlur}
    >
      {/* Standalone: the field brings its own ribbon, always visible. In shared
          mode the page renders one ContentEditorToolbar for all of them. */}
      {!ctx && (
        <>
          <EditorRibbon flush id={localToolbarId.current} editor={localEditor} />
          <TableEditBar editor={localEditor} />
        </>
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
