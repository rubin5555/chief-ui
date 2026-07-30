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
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  minHeight?: number;
  disabled?: boolean;
  selectionOnly?: boolean;
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

  const [localEditor, setLocalEditor] = useState<TinyMceEditor | null>(null);

  const { ctx, collab, remoteLock, isLockHolderRef, lockedByOther, remoteCursorPath } =
    useContentEditorCollab(id, onChangeRef);

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

    if (!ctx) {
      setLocalEditor(editor);
      return;
    }

    ctx.setActiveEditor(editor);

    ctx.getHistoryValue(id, value);

    editor.focus();
    runAfterFrame(() => applyPendingSelection(editor));
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    const next = e.relatedTarget as Element | null;
    if (next && wrapperRef.current?.contains(next)) return;
    if (next?.closest('.tox-tinymce-aux, .tox-dialog, .tox-pop')) return;

    if (next?.closest(`[${RIBBON_MARKER_ATTR}]`)) return;

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
      {!ctx && (
        <>
          <EditorRibbon flush id={localToolbarId.current} editor={localEditor} />
          <TableEditBar editor={localEditor} />
        </>
      )}

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
