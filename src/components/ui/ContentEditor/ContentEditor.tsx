import Quill from 'quill';
import 'quill/dist/quill.core.css';
import { useEffect, useRef, useState } from 'react';
import { createQuillAdapter } from './adapters/createQuillAdapter';
import {
  EditorBody,
  EditorContent,
  EditorWrapper,
  PreviewContent,
  PreviewWrapper,
} from './ContentEditor.styles';
import { CONTENT_EDITOR_IDS } from './ContentEditor.testids';
import type { ContentEditorInstance } from './ContentEditor.types';
import { CursorOverlay } from './components/CursorOverlay';
import { EditorRibbon } from './components/EditorRibbon';
import { RIBBON_MARKER_ATTR } from './components/EditorRibbon/EditorRibbon.constants';
import { TableEditBar } from './components/TableEditBar';
import { useContentEditorCollab } from './hooks/useContentEditorCollab';
import { usePreviewActivation } from './hooks/usePreviewActivation';
import { useQuillSetup } from './hooks/useQuillSetup';
import { runAfterFrame } from './utils/domCaret';

interface QuillEditorProps {
  value: string;
  disabled?: boolean;
  placeholder?: string;
  onChange: (v: string) => void;
  onInit: (editor: ContentEditorInstance) => void;
  setup: (editor: ContentEditorInstance) => void;
}

const QuillEditor = ({
  value,
  disabled,
  placeholder,
  onChange,
  onInit,
  setup,
}: QuillEditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const editorRef = useRef<ContentEditorInstance | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const onInitRef = useRef(onInit);
  onInitRef.current = onInit;
  const setupRef = useRef(setup);
  setupRef.current = setup;

  // biome-ignore lint/correctness/useExhaustiveDependencies: mount Quill only once
  useEffect(() => {
    if (!containerRef.current) return;
    const quill = new Quill(containerRef.current, {
      modules: {
        toolbar: false,
        table: true,
        history: {
          delay: 1000,
          maxStack: 100,
          userOnly: true,
        },
      },
      placeholder,
      readOnly: disabled,
    });
    quillRef.current = quill;
    quill.root.classList.add('mce-content-body');
    if (value) {
      quill.root.innerHTML = value;
    }

    const { editor, destroy } = createQuillAdapter(quill, {
      onChange: (v) => onChangeRef.current(v),
    });
    editorRef.current = editor;

    setupRef.current(editor);
    onInitRef.current(editor);

    return () => {
      destroy();
    };
  }, []);

  useEffect(() => {
    if (quillRef.current) {
      quillRef.current.enable(!disabled);
    }
  }, [disabled]);

  useEffect(() => {
    if (quillRef.current && editorRef.current) {
      const current = editorRef.current.getContent();
      if (value !== current) {
        editorRef.current.setContent(value);
      }
    }
  }, [value]);

  return <div ref={containerRef} />;
};

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
  // The editor this instance put into the context, so it can take that one
  // back out again without stepping on whoever replaced it.
  const ownedEditorRef = useRef<ContentEditorInstance | null>(null);

  const [editorReady, setEditorReady] = useState(false);
  const [localEditor, setLocalEditor] = useState<ContentEditorInstance | null>(null);
  const [activeEditorInstance, setActiveEditorInstance] = useState<ContentEditorInstance | null>(
    null,
  );

  const { ctx, collab, remoteCursor, broadcastChange } = useContentEditorCollab(
    id,
    onChangeRef,
    value,
  );

  const isActive = !ctx || ctx.activeId === myId.current;

  // Read inside effects that must not re-run when the context object changes
  // identity — which it does on every activation, anywhere in the document.
  const ctxRef = useRef(ctx);
  ctxRef.current = ctx;

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

  const handleEditorSetup = useQuillSetup(ctx, collab, id, onChangeRef);

  const handleEditorChange = (newValue: string) => {
    onChange(newValue);
    broadcastChange(newValue);
  };
  onChangeRef.current = handleEditorChange;

  const deactivate = () => {
    if (!ctx) return;
    ctx.setActive(null);
    ctx.setActiveEditor(null);
    ownedEditorRef.current = null;
    setActiveEditorInstance(null);
    setEditorReady(false);
  };

  useEffect(() => {
    if (isActive) return;

    setEditorReady(false);
    setActiveEditorInstance(null);
    const owned = ownedEditorRef.current;
    ownedEditorRef.current = null;
    if (owned && ctxRef.current?.activeEditor === owned) ctxRef.current.setActiveEditor(null);
  }, [isActive]);

  useEffect(
    () => () => {
      setActiveEditorInstance(null);
      const owned = ownedEditorRef.current;
      if (owned && ctxRef.current?.activeEditor === owned) ctxRef.current.setActiveEditor(null);
    },
    [],
  );

  const handleInit = (editor: ContentEditorInstance) => {
    setEditorReady(true);
    setActiveEditorInstance(editor);

    if (!ctx) {
      setLocalEditor(editor);
      return;
    }

    ownedEditorRef.current = editor;
    ctx.setActiveEditor(editor);

    ctx.getHistoryValue(id, value);

    editor.focus();
    runAfterFrame(() => applyPendingSelection(editor));
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (disableBlurDeactivate || !editorReady) return;

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
      {!ctx && (
        <>
          <EditorRibbon flush id={localToolbarId.current} editor={localEditor} />
          <TableEditBar editor={localEditor} />
        </>
      )}

      {isActive && (
        <EditorBody ref={editorBodyRef}>
          <EditorContent $minHeight={minHeight} data-testid={CONTENT_EDITOR_IDS.content}>
            <QuillEditor
              disabled={disabled}
              value={value}
              placeholder={placeholder}
              onChange={handleEditorChange}
              onInit={handleInit}
              setup={handleEditorSetup}
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

          {remoteCursor && (
            <CursorOverlay
              containerRef={editorBodyRef}
              contentRef={activeEditorInstance?.getBody() ?? null}
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
