'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import {
  exportCleanHTML,
  readCellProperties,
  readRowProperties,
  readTableProperties,
} from './tableEngine';
import { TableResizeOverlay } from './TableResizeOverlay';
import { TableFloatingToolbar } from './TableFloatingToolbar';
import { TableContextMenu } from './TableContextMenu';
import { TablePropertiesModal } from './TablePropertiesModal';
import { ImageResizeOverlay } from './ImageResizeOverlay';
import {
  EditorLocale,
  EditorTranslations,
  TextDirection,
  getEditorTranslations,
} from './i18n';
import {
  useTableSelection,
  useEditorHistory,
  useTableActions,
  useFormatPainter,
  useRichTextFormat,
  useQuillInstance,
  useEditorViewport,
  useFindAndReplace,
  useEditorCanvasEvents,
} from './hooks';
import {
  EditorToolbar,
  EditorToolbarProps,
  EditorFindReplaceBar,
} from './components';

export interface TinyQuillToolbarState extends Omit<EditorToolbarProps, 'disabled' | 'inline'> {
  findQuery: string;
  setFindQuery: (v: string) => void;
  replaceQuery: string;
  setReplaceQuery: (v: string) => void;
  onReplaceAll: () => void;
  insertHTML: (html: string) => void;
}

export interface TinyQuillEditorProps {
  initialValue?: string;
  value?: string;
  onChange?: (cleanHTML: string) => void;
  placeholder?: string;
  locale?: EditorLocale;
  translations?: Partial<EditorTranslations>;
  direction?: TextDirection;
  minHeight?: number;
  embedded?: boolean;
  hideToolbar?: boolean;
  onToolbarStateChange?: (state: TinyQuillToolbarState | null) => void;
  onReady?: (root: HTMLElement, quill: any, insertHTML: (html: string) => void) => void;
}

export const TinyQuillEditor: React.FC<TinyQuillEditorProps> = ({
  initialValue = '',
  value,
  onChange,
  placeholder,
  locale = 'en',
  translations: customTranslations,
  direction,
  minHeight = 120,
  embedded = false,
  hideToolbar = false,
  onToolbarStateChange,
  onReady,
}) => {
  const t = useMemo(
    () => getEditorTranslations(locale, customTranslations),
    [locale, customTranslations]
  );
  const activeDir = direction || (locale === 'he' ? 'rtl' : 'ltr');

  const defaultPlaceholder =
    placeholder ??
    (locale === 'he'
      ? 'הזן תוכן...'
      : 'Start writing...');

  const editorRootWrapperRef = useRef<HTMLDivElement | null>(null);
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const quillInstanceRef = useRef<any>(null);
  const quillClassRef = useRef<any>(null);

  // 1. Viewport, Popovers, Modals & Toast State
  const {
    showTablePicker,
    setShowTablePicker,
    showTextColorPopover,
    setShowTextColorPopover,
    showBgColorPopover,
    setShowBgColorPopover,
    contextMenuPos,
    setContextMenuPos,
    activeModal,
    setActiveModal,
    showVisualAids,
    setShowVisualAids,
    toastMessage,
    showToast,
    closeAllPopovers,
  } = useEditorViewport(minHeight);

  // 2. Table Selection Hook (with synchronous refs to prevent stale closures)
  const {
    activeTable,
    activeCell,
    selectedCells,
    activeTableRef,
    activeCellRef,
    selectedCellsRef,
    selectionBoundsRef,
    clearTableSelection,
    applySelectionBoundsOnTable,
    syncTableAndCellState,
    resolveTargetTable,
    resolveTargetCell,
    selectSingleCell,
  } = useTableSelection({ quillInstanceRef });

  // 3. Editor History & Document Statistics Hook
  const {
    lastEmittedHtmlRef,
    pushHistorySnapshot,
    rebindAllTables,
    loadHTMLIntoEditor,
    handleUndo,
    handleRedo,
  } = useEditorHistory({
    quillInstanceRef,
    quillClassRef,
    initialValue: value ?? initialValue,
    onChange,
    showToast,
    onClearSelection: clearTableSelection,
  });

  const insertHTMLAtSelection = (html: string) => {
    const quill = quillInstanceRef.current;
    if (!quill || !quill.root) return;
    const root = quill.root as HTMLElement;
    quill.focus();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !root.contains(sel.anchorNode)) {
      const r = document.createRange();
      const lastBlock = root.lastElementChild || root;
      r.selectNodeContents(lastBlock);
      r.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(r);
    }
    if (sel && sel.rangeCount > 0 && root.contains(sel.anchorNode)) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const tpl = document.createElement('template');
      tpl.innerHTML = html;
      const frag = tpl.content;
      const lastNode = frag.lastChild;
      range.insertNode(frag);
      if (lastNode) {
        range.setStartAfter(lastNode);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
      if (typeof quill.update === 'function') {
        quill.update('silent');
      }
    }
    pushHistorySnapshot(true);
  };

  // 4. Quill 2.x Instance Lifecycle & Embeds Hook
  const {
    quillMountRef,
    activeFormats,
    refreshActiveFormats,
    handleInsertCallout,
    handleInsertDivider,
  } = useQuillInstance({
    quillInstanceRef,
    quillClassRef,
    initialValue: value ?? initialValue,
    placeholder: defaultPlaceholder,
    direction: activeDir,
    loadHTMLIntoEditor,
    pushHistorySnapshot,
    onUndo: () => handleUndo(),
    onRedo: () => handleRedo(),
    onReady: onReady
      ? (root, quill) => onReady(root, quill, insertHTMLAtSelection)
      : undefined,
  });

  const isMountedRef = useRef(false);
  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      return;
    }
    if (value !== undefined && quillInstanceRef.current && value !== lastEmittedHtmlRef.current) {
      loadHTMLIntoEditor(value, false);
    }
  }, [value, lastEmittedHtmlRef, loadHTMLIntoEditor]);

  // 5. Table Actions Hook
  const {
    copiedRowHTML,
    handleInsertTable,
    handleInsertRow,
    handleDeleteRow,
    handleInsertCol,
    handleDeleteCol,
    handleMergeCells,
    handleSplitCell,
    handleSetCellBackground,
    handleSetBorderPreset,
    handleSetVerticalAlign,
    handleDeleteTable,
    handleCopyRow,
    handlePasteRow,
    handleMoveRow,
    handleMoveCol,
    handleSortCol,
    handleDistributeCols,
    handleDistributeRows,
    handleToggleHeaderRow,
    handleToggleCaption,
    handleToggleStriped,
    handleClearSelectedCells,
    handleSaveTableProps,
    handleSaveCellProps,
    handleSaveRowProps,
  } = useTableActions({
    quillInstanceRef,
    selectedCellsRef,
    selectionBoundsRef,
    resolveTargetTable,
    resolveTargetCell,
    applySelectionBoundsOnTable,
    clearTableSelection,
    syncTableAndCellState,
    rebindAllTables,
    pushHistorySnapshot,
    showToast,
    translations: t,
  });

  // 6. Format Painter Hook
  const {
    formatPainterState,
    handleTriggerFormatPainter,
    applyFormatPainterOnMouseUp,
    cancelFormatPainter,
  } = useFormatPainter({
    quillInstanceRef,
    resolveTargetCell,
    pushHistorySnapshot,
    showToast,
    translations: t,
  });

  // 7. Rich Text Formatting Hook
  const { applyFormat } = useRichTextFormat({
    quillInstanceRef,
    selectedCellsRef,
    resolveTargetTable,
    resolveTargetCell,
    pushHistorySnapshot,
    onFormatApplied: refreshActiveFormats,
  });

  // 8. Find & Replace Hook
  const {
    showFindReplace,
    setShowFindReplace,
    findQuery,
    setFindQuery,
    replaceQuery,
    setReplaceQuery,
    handleReplaceAll,
  } = useFindAndReplace({
    quillInstanceRef,
    pushHistorySnapshot,
    showToast,
  });

  // 9. Canvas Mouse Drag, Blur Cleanup & Context Menu Events Hook
  const {
    activeImage,
    setActiveImage,
  } = useEditorCanvasEvents({
    editorRootWrapperRef,
    editorContainerRef,
    quillInstanceRef,
    activeTableRef,
    activeCellRef,
    selectSingleCell,
    applySelectionBoundsOnTable,
    syncTableAndCellState,
    clearTableSelection,
    applyFormatPainterOnMouseUp,
    cancelFormatPainter,
    pushHistorySnapshot,
    closeAllPopovers,
    onOpenContextMenu: setContextMenuPos,
    onUndo: handleUndo,
    onRedo: handleRedo,
  });

  const actionsRef = useRef({
    handleUndo,
    handleRedo,
    handleTriggerFormatPainter,
    applyFormat,
    handleSetCellBackground,
    handleInsertTable,
    handleInsertCallout,
    handleInsertDivider,
    setActiveModal,
    handleReplaceAll,
    pushHistorySnapshot,
    insertHTMLAtSelection,
  });
  actionsRef.current = {
    handleUndo,
    handleRedo,
    handleTriggerFormatPainter,
    applyFormat,
    handleSetCellBackground,
    handleInsertTable,
    handleInsertCallout,
    handleInsertDivider,
    setActiveModal,
    handleReplaceAll,
    pushHistorySnapshot,
    insertHTMLAtSelection,
  };

  const onToolbarStateChangeRef = useRef(onToolbarStateChange);
  onToolbarStateChangeRef.current = onToolbarStateChange;

  const isFormatPainterActive = Boolean(formatPainterState?.active);
  const selectedCellsCount = selectedCells.length;

  const toolbarState = useMemo<TinyQuillToolbarState>(
    () => ({
      activeFormats,
      activeTable,
      selectedCellsCount,
      isFormatPainterActive,
      showTablePicker,
      setShowTablePicker,
      showTextColorPopover,
      setShowTextColorPopover,
      showBgColorPopover,
      setShowBgColorPopover,
      showVisualAids,
      setShowVisualAids,
      showFindReplace,
      setShowFindReplace,
      findQuery,
      setFindQuery,
      replaceQuery,
      setReplaceQuery,
      translations: t,
      onUndo: () => actionsRef.current.handleUndo(),
      onRedo: () => actionsRef.current.handleRedo(),
      onTriggerFormatPainter: (p) => actionsRef.current.handleTriggerFormatPainter(p),
      onApplyFormat: (cmd, val) => actionsRef.current.applyFormat(cmd, val),
      onSetCellBackground: (color) => actionsRef.current.handleSetCellBackground(color),
      onInsertTable: (r, c, opts) => actionsRef.current.handleInsertTable(r, c, opts),
      onInsertCallout: () => actionsRef.current.handleInsertCallout(),
      onInsertDivider: () => actionsRef.current.handleInsertDivider(),
      onOpenModal: (m) => actionsRef.current.setActiveModal(m),
      onReplaceAll: () => actionsRef.current.handleReplaceAll(),
      insertHTML: (html: string) => actionsRef.current.insertHTMLAtSelection(html),
    }),
    [
      activeFormats,
      activeTable,
      selectedCellsCount,
      isFormatPainterActive,
      showTablePicker,
      setShowTablePicker,
      showTextColorPopover,
      setShowTextColorPopover,
      showBgColorPopover,
      setShowBgColorPopover,
      showVisualAids,
      setShowVisualAids,
      showFindReplace,
      setShowFindReplace,
      findQuery,
      setFindQuery,
      replaceQuery,
      setReplaceQuery,
      t,
    ]
  );

  useEffect(() => {
    onToolbarStateChangeRef.current?.(toolbarState);
  }, [toolbarState]);

  useEffect(
    () => () => {
      onToolbarStateChangeRef.current?.(null);
    },
    []
  );

  const targetCellForProps = resolveTargetCell();
  const isCellMerged = Boolean(
    activeCell && ((activeCell.rowSpan || 1) > 1 || (activeCell.colSpan || 1) > 1)
  );

  return (
    <div
      ref={editorRootWrapperRef}
      dir={activeDir}
      data-editor-ribbon=""
      data-testid="tiny-quill-editor-root"
      className={`tiny-quill-root flex flex-col bg-white transition-all ${
        embedded
          ? 'relative w-full'
          : 'relative rounded-xl border border-slate-200 shadow-xs'
      }`}
    >
      {/* 1. Optional Inline Toolbar & Find/Replace (when not hoisted into ContentEditorToolbar) */}
      {!hideToolbar && (
        <>
          <EditorToolbar {...toolbarState} />
          {showFindReplace && (
            <EditorFindReplaceBar
              findQuery={findQuery}
              setFindQuery={setFindQuery}
              replaceQuery={replaceQuery}
              setReplaceQuery={setReplaceQuery}
              translations={t}
              onReplaceAll={handleReplaceAll}
              onClose={() => setShowFindReplace(false)}
            />
          )}
        </>
      )}

      {/* 2. Main Editor Canvas + Floating Overlays */}
      <div
        ref={editorContainerRef}
        style={{ minHeight: `${minHeight}px` }}
        className={`relative bg-white ${showVisualAids ? 'ql-tiny-visual-aids' : ''} ${
          isFormatPainterActive ? 'format-painter-active' : ''
        }`}
      >
        <TableFloatingToolbar
          editorContainerRef={editorContainerRef}
          activeTable={activeTable}
          activeCell={activeCell}
          selectedCells={selectedCells}
          translations={t}
          isFormatPainterActive={isFormatPainterActive}
          onTriggerFormatPainter={handleTriggerFormatPainter}
          onInsertRowAbove={() => handleInsertRow('before')}
          onInsertRowBelow={() => handleInsertRow('after')}
          onDeleteRow={handleDeleteRow}
          onInsertColLeft={() => handleInsertCol('before')}
          onInsertColRight={() => handleInsertCol('after')}
          onDeleteCol={handleDeleteCol}
          onMergeCells={handleMergeCells}
          onSplitCell={handleSplitCell}
          onSetCellBackground={handleSetCellBackground}
          onSetBorderPreset={handleSetBorderPreset}
          onSetVerticalAlign={handleSetVerticalAlign}
          onToggleHeaderRow={handleToggleHeaderRow}
          onToggleCaption={handleToggleCaption}
          onToggleStriped={handleToggleStriped}
          onDistributeCols={handleDistributeCols}
          onSortCol={handleSortCol}
          onDeleteTable={handleDeleteTable}
          onOpenModal={setActiveModal}
        />

        <TableResizeOverlay
          editorContainerRef={editorContainerRef}
          activeTable={activeTable}
          onSelectBounds={(bounds) => {
            if (activeTable) {
              applySelectionBoundsOnTable(activeTable, bounds);
            }
          }}
          onTableMutated={() => pushHistorySnapshot(true)}
        />

        <ImageResizeOverlay
          editorContainerRef={editorContainerRef}
          activeImage={activeImage}
          translations={t}
          onImageMutated={() => pushHistorySnapshot(true)}
          onDeselect={() => setActiveImage(null)}
        />

        <div ref={quillMountRef} className="tiny-quill-surface" />

        {toastMessage && (
          <div style={{ zIndex: 99999 }} className="fixed bottom-12 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900/95 px-4 py-2.5 text-xs font-medium text-white shadow-xl">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>

      {/* 3. Right-Click Table Context Menu */}
      <TableContextMenu
        position={contextMenuPos}
        canMerge={selectedCells.length > 1}
        isCellMerged={isCellMerged}
        hasCopiedRow={Boolean(copiedRowHTML)}
        translations={t}
        onClose={() => setContextMenuPos(null)}
        onOpenModal={setActiveModal}
        onMergeCells={handleMergeCells}
        onSplitCell={handleSplitCell}
        onClearSelectedCells={handleClearSelectedCells}
        onInsertRowAbove={() => handleInsertRow('before')}
        onInsertRowBelow={() => handleInsertRow('after')}
        onDeleteRow={handleDeleteRow}
        onMoveRowUp={() => handleMoveRow('up')}
        onMoveRowDown={() => handleMoveRow('down')}
        onCopyRow={() => handleCopyRow(false)}
        onCutRow={() => handleCopyRow(true)}
        onPasteRowAbove={() => handlePasteRow('before')}
        onPasteRowBelow={() => handlePasteRow('after')}
        onInsertColLeft={() => handleInsertCol('before')}
        onInsertColRight={() => handleInsertCol('after')}
        onDeleteCol={handleDeleteCol}
        onMoveColLeft={() => handleMoveCol('left')}
        onMoveColRight={() => handleMoveCol('right')}
        onDistributeCols={handleDistributeCols}
        onDistributeRows={handleDistributeRows}
        onSortCol={handleSortCol}
        onToggleHeaderRow={handleToggleHeaderRow}
        onToggleCaption={handleToggleCaption}
        onToggleStriped={handleToggleStriped}
        onSetBorderPreset={(p) => handleSetBorderPreset(p)}
        onDeleteTable={handleDeleteTable}
      />

      {/* 4. Table / Cell / Row / Wizard Modals */}
      <TablePropertiesModal
        activeModal={activeModal}
        translations={t}
        selectedCellCount={selectedCells.length || (targetCellForProps ? 1 : 0)}
        initialTableProps={activeTable ? readTableProperties(activeTable) : null}
        initialCellProps={targetCellForProps ? readCellProperties(targetCellForProps) : null}
        initialRowProps={
          targetCellForProps?.parentElement
            ? readRowProperties(targetCellForProps.parentElement as HTMLTableRowElement)
            : null
        }
        initialSourceHTML={
          quillInstanceRef.current?.root
            ? exportCleanHTML(quillInstanceRef.current.root as HTMLElement)
            : ''
        }
        onClose={() => setActiveModal(null)}
        onSaveTableProps={handleSaveTableProps}
        onSaveCellProps={handleSaveCellProps}
        onSaveRowProps={handleSaveRowProps}
        onInsertCustomTable={handleInsertTable}
        onSaveSourceHTML={(html) => {
          loadHTMLIntoEditor(html);
          showToast(t.toasts.htmlSourceApplied);
        }}
      />
    </div>
  );
};
