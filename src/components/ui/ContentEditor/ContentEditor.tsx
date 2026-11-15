import { TinyQuillEditor, type TinyQuillToolbarState } from '@workspace/tiny-quill-editor';
import { useEffect, useRef, useState } from 'react';
import {
  EditorBody,
  EditorContent,
  EditorWrapper,
  PreviewContent,
  PreviewWrapper,
} from './ContentEditor.styles';
import { CONTENT_EDITOR_IDS } from './ContentEditor.testids';
import { CursorOverlay } from './components/CursorOverlay';
import { EditorRibbon } from './components/EditorRibbon';
import { RIBBON_MARKER_ATTR } from './components/EditorRibbon/EditorRibbon.constants';
import { useContentEditorCollab } from './hooks/useContentEditorCollab';
import { usePreviewActivation } from './hooks/usePreviewActivation';
import { useQuillSetup } from './hooks/useQuillSetup';

export interface ContentEditorProps {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  minHeight?: number;
  disabled?: boolean;
  selectionOnly?: boolean;
  inset?: boolean;
  disableBlurDeactivate?: boolean;
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
  disableBlurDeactivate = false,
}: ContentEditorProps) => {
  const myId = useRef(`ce-${self.crypto.randomUUID()}`);
  const localToolbarId = useRef(`ce-tb-${myId.current}`);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const editorBodyRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChange);

  const [localTinyToolbar, setLocalTinyToolbar] = useState<TinyQuillToolbarState | null>(null);
  const [editorBodyEl, setEditorBodyEl] = useState<HTMLElement | null>(null);

  const { ctx, collab, remoteCursor, broadcastChange } = useContentEditorCollab(
    id,
    onChangeRef,
    value,
  );

  const isActive = !ctx || ctx.activeId === myId.current;

  const {
    previewRef,
    isDragOver,
    handlePreviewPointerDown,
    handlePreviewPointerUp,
    handlePreviewKeyDown,
    handlePreviewDragOver,
    handlePreviewDragLeave,
    handlePreviewDrop,
    applyPendingSelection,
  } = usePreviewActivation(ctx, myId.current, id, disabled, selectionOnly);

  const handleEditorSetup = useQuillSetup(collab, id, onChangeRef);

  const handleEditorChange = (newValue: string) => {
    onChange(newValue);
    broadcastChange(newValue);
  };
  onChangeRef.current = handleEditorChange;

  const deactivate = () => {
    if (!ctx) return;
    ctx.setActive(null);
    ctx.setActiveTinyToolbar(null);
    setEditorBodyEl(null);
  };

  useEffect(() => {
    if (!isActive) {
      setEditorBodyEl(null);
    }
  }, [isActive]);

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (disableBlurDeactivate) return;
    if (document.querySelector('[data-modal-container="true"]')) return;

    const next = e.relatedTarget as Element | null;
    if (next && wrapperRef.current?.contains(next)) return;
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
      {!ctx && <EditorRibbon flush id={localToolbarId.current} tinyToolbar={localTinyToolbar} />}

      {isActive && (
        <EditorBody ref={editorBodyRef}>
          <EditorContent $minHeight={minHeight} data-testid={CONTENT_EDITOR_IDS.content}>
            <TinyQuillEditor
              embedded
              hideToolbar
              minHeight={Math.max(40, minHeight - 20)}
              locale="he"
              direction="rtl"
              value={value}
              initialValue={value}
              placeholder={placeholder}
              onChange={handleEditorChange}
              onToolbarStateChange={ctx ? ctx.setActiveTinyToolbar : setLocalTinyToolbar}
              onReady={(root, quill, insertHTML) => {
                root.classList.add('mce-content-body');
                if (disabled) quill.enable(false);
                setEditorBodyEl(root);
                handleEditorSetup(root, quill, insertHTML);
                if (ctx) {
                  quill.focus();
                  applyPendingSelection(root, insertHTML);
                }
              }}
            />
          </EditorContent>

          {remoteCursor && (
            <CursorOverlay
              containerRef={editorBodyRef}
              contentRef={editorBodyEl}
              path={remoteCursor.path}
              label={remoteCursor.userId}
            />
          )}
        </EditorBody>
      )}

      {ctx && !isActive && (
        <PreviewWrapper>
          <PreviewContent
            ref={previewRef}
            tabIndex={disabled ? -1 : 0}
            role="textbox"
            aria-readonly
            aria-label={placeholder}
            $minHeight={minHeight}
            $isEmpty={!value}
            $disabled={disabled}
            $isDragOver={isDragOver}
            onPointerDown={handlePreviewPointerDown}
            onPointerUp={handlePreviewPointerUp}
            onClick={handlePreviewPointerUp}
            onKeyDown={handlePreviewKeyDown}
            onDragOver={handlePreviewDragOver}
            onDragLeave={handlePreviewDragLeave}
            onDrop={handlePreviewDrop}
            data-testid={CONTENT_EDITOR_IDS.content}
            data-placeholder={placeholder}
            dangerouslySetInnerHTML={{ __html: value }}
          />
          {remoteCursor && (
            <CursorOverlay
              containerRef={previewRef}
              contentRef={previewRef}
              path={remoteCursor.path}
              label={remoteCursor.userId}
            />
          )}
        </PreviewWrapper>
      )}
    </EditorWrapper>
  );
};
