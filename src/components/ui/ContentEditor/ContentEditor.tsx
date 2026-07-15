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

import { TINYMCE_INIT, TINYMCE_LICENSE_KEY } from './ContentEditor.constants';
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
import type { TinyMceEditor } from './ContentEditor.types';
import { CursorOverlay } from './CursorOverlay';
import { runAfterFrame } from './domCaret';
import { useContentEditorCollab } from './useContentEditorCollab';
import { usePreviewActivation } from './usePreviewActivation';
import { useTinyMceSetup } from './useTinyMceSetup';

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
  const myId = useRef(`ce-${self.crypto.randomUUID()}`);
  const localToolbarId = useRef(`ce-tb-${myId.current}`);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChange);

  const [editorReady, setEditorReady] = useState(false);

  const { ctx, collab, remoteLock, isLockHolderRef, lockedByOther, remoteCursorPath } =
    useContentEditorCollab(id, onChangeRef);

  // Standalone: TinyMCE always mounted, always "active".
  // Shared: active only when this instance owns the context focus.
  const isActive = !ctx || ctx.activeId === myId.current;
  const toolbarContainerId = ctx ? ctx.toolbarId : localToolbarId.current;

  const {
    previewRef,
    isDragOver,
    handlePreviewPointerDown,
    handlePreviewPointerUp,
    handlePreviewDragOver,
    handlePreviewDragLeave,
    handlePreviewDrop,
    applyPendingSelection,
  } = usePreviewActivation(ctx, myId.current, id, disabled, lockedByOther);

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
    setEditorReady(false);
    collab?.releaseLock(id);
  };

  const handleInit = (_: unknown, editor: TinyMceEditor) => {
    setEditorReady(true);

    // Standalone: user clicks directly into the contenteditable — no auto-focus needed.
    if (!ctx) return;

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
