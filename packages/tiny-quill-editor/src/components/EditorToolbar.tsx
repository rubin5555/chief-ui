'use client';

import React from 'react';
import {
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Table as TableIcon,
  Search,
  Eye,
  Quote,
  Eraser,
  Subscript,
  Superscript,
  PaintBucket,
  Baseline,
  Paintbrush,
  Info,
  Minus,
} from 'lucide-react';
import { ActiveModalType } from '../types';
import { EditorTranslations } from '../i18n';
import { TableGridPicker } from '../TableGridPicker';

const TEXT_COLORS = [
  '#000000',
  '#374151',
  '#dc2626',
  '#f97316',
  '#f59e0b',
  '#16a34a',
  '#2563eb',
  '#1B3A6B',
  '#7c3aed',
  '#db2777',
  '#6b7280',
  '#ffffff',
];

const BG_HIGHLIGHT_COLORS = [
  '#fde047',
  '#86efac',
  '#fdba74',
  '#f9a8d4',
  '#93c5fd',
  '#c4b5fd',
  '#6ee7b7',
  '#fca5a5',
  '#e5e7eb',
  '#fef08a',
  '#bfdbfe',
  '#ffffff',
];

export interface EditorToolbarProps {
  disabled?: boolean;
  inline?: boolean;
  activeFormats?: Record<string, any>;
  activeTable: HTMLTableElement | null;
  selectedCellsCount: number;
  isFormatPainterActive: boolean;
  showTablePicker: boolean;
  setShowTablePicker: React.Dispatch<React.SetStateAction<boolean>>;
  showTextColorPopover: boolean;
  setShowTextColorPopover: React.Dispatch<React.SetStateAction<boolean>>;
  showBgColorPopover: boolean;
  setShowBgColorPopover: React.Dispatch<React.SetStateAction<boolean>>;
  showVisualAids: boolean;
  setShowVisualAids: React.Dispatch<React.SetStateAction<boolean>>;
  showFindReplace: boolean;
  setShowFindReplace: React.Dispatch<React.SetStateAction<boolean>>;
  translations: EditorTranslations;
  onUndo: () => void;
  onRedo: () => void;
  onTriggerFormatPainter: (persistent?: boolean) => void;
  onApplyFormat: (command: string, value?: string) => void;
  onSetCellBackground: (color: string) => void;
  onInsertTable: (
    rows: number,
    cols: number,
    options?: { withHeader?: boolean; striped?: boolean }
  ) => void;
  onInsertCallout?: () => void;
  onInsertDivider?: () => void;
  onOpenModal: (modal: ActiveModalType) => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  disabled = false,
  inline = false,
  activeFormats = {},
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
  translations: t,
  onUndo,
  onRedo,
  onTriggerFormatPainter,
  onApplyFormat,
  onSetCellBackground,
  onInsertTable,
  onInsertCallout,
  onInsertDivider,
  onOpenModal,
}) => {
  const btnClass =
    'rounded-md p-1.5 text-slate-700 hover:bg-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed';
  const activeBtnClass =
    'rounded-md p-1.5 bg-blue-50 text-blue-600 disabled:text-slate-300 disabled:cursor-not-allowed';

  return (
    <div
      data-editor-chrome="true"
      onMouseDown={(e) => {
        if ((e.target as HTMLElement).tagName !== 'SELECT') {
          e.preventDefault();
        }
      }}
      className={`tiny-quill-root flex flex-wrap items-center gap-0.5 select-none ${
        inline ? 'w-auto' : 'border-b border-slate-200 bg-white px-3 py-1'
      }`}
    >
      {/* Undo / Redo */}
      <button
        type="button"
        disabled={disabled}
        onClick={onUndo}
        title={`${t.menubar.undo} (Ctrl+Z)`}
        className={btnClass}
      >
        <Undo2 className="h-4 w-4" />
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={onRedo}
        title={`${t.menubar.redo} (Ctrl+Y)`}
        className={btnClass}
      >
        <Redo2 className="h-4 w-4" />
      </button>

      {/* Format Painter */}
      <button
        type="button"
        disabled={disabled}
        data-testid="editor-ribbon-format-painter"
        aria-pressed={isFormatPainterActive}
        onClick={() => onTriggerFormatPainter(false)}
        onDoubleClick={() => onTriggerFormatPainter(true)}
        title={t.toolbar.formatPainterTitle}
        className={`relative rounded-md p-1.5 transition disabled:text-slate-300 disabled:cursor-not-allowed ${
          isFormatPainterActive
            ? 'bg-blue-600 text-white shadow-xs'
            : 'text-slate-700 hover:bg-slate-100'
        }`}
      >
        <Paintbrush className="h-4 w-4" />
      </button>

      <div className="mx-1 h-4 w-[1px] bg-slate-200" />

      {/* Block Format Dropdown */}
      <select
        disabled={disabled}
        defaultValue="P"
        onChange={(e) => onApplyFormat('formatBlock', e.target.value)}
        className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700 hover:border-slate-300 focus:border-blue-500 focus:outline-none disabled:text-slate-300 disabled:cursor-not-allowed"
      >
        <option value="P">{t.toolbar.paragraph}</option>
        <option value="H1">{t.toolbar.heading1}</option>
        <option value="H2">{t.toolbar.heading2}</option>
        <option value="H3">{t.toolbar.heading3}</option>
        <option value="BLOCKQUOTE">{t.toolbar.blockquote}</option>
        <option value="PRE">{t.toolbar.codeBlock}</option>
      </select>

      <div className="mx-1 h-4 w-[1px] bg-slate-200" />

      {/* Inline Styles */}
      <button
        type="button"
        disabled={disabled}
        data-testid="editor-ribbon-toggle-bold"
        aria-pressed={Boolean(activeFormats.bold)}
        onClick={() => onApplyFormat('bold')}
        title={t.toolbar.bold}
        className={activeFormats.bold ? activeBtnClass : btnClass}
      >
        <Bold className="h-4 w-4" />
      </button>
      <button
        type="button"
        disabled={disabled}
        data-testid="editor-ribbon-toggle-italic"
        aria-pressed={Boolean(activeFormats.italic)}
        onClick={() => onApplyFormat('italic')}
        title={t.toolbar.italic}
        className={activeFormats.italic ? activeBtnClass : btnClass}
      >
        <Italic className="h-4 w-4" />
      </button>
      <button
        type="button"
        disabled={disabled}
        data-testid="editor-ribbon-toggle-underline"
        aria-pressed={Boolean(activeFormats.underline)}
        onClick={() => onApplyFormat('underline')}
        title={t.toolbar.underline}
        className={activeFormats.underline ? activeBtnClass : btnClass}
      >
        <Underline className="h-4 w-4" />
      </button>
      <button
        type="button"
        disabled={disabled}
        data-testid="editor-ribbon-toggle-strikethrough"
        aria-pressed={Boolean(activeFormats.strike)}
        onClick={() => onApplyFormat('strikeThrough')}
        title={t.toolbar.strikethrough}
        className={activeFormats.strike ? activeBtnClass : btnClass}
      >
        <Strikethrough className="h-4 w-4" />
      </button>
      <button
        type="button"
        disabled={disabled}
        data-testid="editor-ribbon-toggle-subscript"
        aria-pressed={activeFormats.script === 'sub'}
        onClick={() => onApplyFormat('subscript')}
        title={t.toolbar.subscript}
        className={activeFormats.script === 'sub' ? activeBtnClass : btnClass}
      >
        <Subscript className="h-4 w-4" />
      </button>
      <button
        type="button"
        disabled={disabled}
        data-testid="editor-ribbon-toggle-superscript"
        aria-pressed={activeFormats.script === 'super'}
        onClick={() => onApplyFormat('superscript')}
        title={t.toolbar.superscript}
        className={activeFormats.script === 'super' ? activeBtnClass : btnClass}
      >
        <Superscript className="h-4 w-4" />
      </button>

      {/* Text Color Picker */}
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          data-testid="editor-ribbon-color-chevron-text"
          onClick={() => {
            setShowTextColorPopover((v) => !v);
            setShowBgColorPopover(false);
          }}
          title={t.toolbar.textColor}
          className={`flex items-center ${btnClass}`}
        >
          <Baseline className={`h-4 w-4 ${disabled ? 'text-slate-300' : 'text-blue-600'}`} />
        </button>
        {showTextColorPopover && !disabled && (
          <div
            data-editor-ribbon=""
            data-testid="editor-ribbon-color-menu-text"
            style={{ zIndex: 99999 }}
            className="absolute top-full ltr:left-0 rtl:right-0 mt-1 w-44 rounded-xl border border-slate-200 bg-white p-2.5 shadow-xl z-50"
          >
            <div className="mb-1.5 text-[11px] font-semibold text-slate-500">
              {t.toolbar.textColor}
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {TEXT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  data-testid={`editor-ribbon-swatch-text-${c}`}
                  onClick={() => {
                    onApplyFormat('foreColor', c);
                    setShowTextColorPopover(false);
                  }}
                  style={{ backgroundColor: c }}
                  className="h-6 w-6 rounded border border-slate-300 transition hover:scale-110"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Background / Cell Highlight Color Picker */}
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          data-testid="editor-ribbon-color-chevron-highlight"
          onClick={() => {
            setShowBgColorPopover((v) => !v);
            setShowTextColorPopover(false);
          }}
          title={t.toolbar.highlightColor}
          className={`flex items-center ${btnClass}`}
        >
          <PaintBucket className={`h-4 w-4 ${disabled ? 'text-slate-300' : 'text-amber-500'}`} />
        </button>
        {showBgColorPopover && !disabled && (
          <div
            data-editor-ribbon=""
            data-testid="editor-ribbon-color-menu-highlight"
            style={{ zIndex: 99999 }}
            className="absolute top-full ltr:left-0 rtl:right-0 mt-1 w-44 rounded-xl border border-slate-200 bg-white p-2.5 shadow-xl z-50"
          >
            <div className="mb-1.5 text-[11px] font-semibold text-slate-500">
              {t.toolbar.highlightColor}
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {BG_HIGHLIGHT_COLORS.map((c, idx) => (
                <button
                  key={c || idx}
                  type="button"
                  data-testid={`editor-ribbon-swatch-highlight-${c || 'clear'}`}
                  onClick={() => {
                    if (selectedCellsCount > 1) {
                      onSetCellBackground(c);
                    } else {
                      onApplyFormat('hiliteColor', c);
                    }
                    setShowBgColorPopover(false);
                  }}
                  style={{ backgroundColor: c || '#ffffff' }}
                  className="h-6 w-6 rounded border border-slate-300 transition hover:scale-110 flex items-center justify-center"
                >
                  {!c && <span className="text-[10px] text-rose-500">✕</span>}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mx-1 h-4 w-[1px] bg-slate-200" />

      {/* Alignment */}
      <button
        type="button"
        disabled={disabled}
        data-testid="editor-ribbon-toggle-align-right"
        aria-pressed={activeFormats.align === 'right'}
        onClick={() => onApplyFormat('justifyRight')}
        title={t.toolbar.alignRight}
        className={activeFormats.align === 'right' ? activeBtnClass : btnClass}
      >
        <AlignRight className="h-4 w-4" />
      </button>
      <button
        type="button"
        disabled={disabled}
        data-testid="editor-ribbon-toggle-align-center"
        aria-pressed={activeFormats.align === 'center'}
        onClick={() => onApplyFormat('justifyCenter')}
        title={t.toolbar.alignCenter}
        className={activeFormats.align === 'center' ? activeBtnClass : btnClass}
      >
        <AlignCenter className="h-4 w-4" />
      </button>
      <button
        type="button"
        disabled={disabled}
        data-testid="editor-ribbon-toggle-align-left"
        aria-pressed={activeFormats.align === 'left'}
        onClick={() => onApplyFormat('justifyLeft')}
        title={t.toolbar.alignLeft}
        className={activeFormats.align === 'left' ? activeBtnClass : btnClass}
      >
        <AlignLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        disabled={disabled}
        data-testid="editor-ribbon-toggle-align-justify"
        aria-pressed={activeFormats.align === 'justify'}
        onClick={() => onApplyFormat('justifyFull')}
        title={t.toolbar.alignJustify}
        className={activeFormats.align === 'justify' ? activeBtnClass : btnClass}
      >
        <AlignJustify className="h-4 w-4" />
      </button>

      <div className="mx-1 h-4 w-[1px] bg-slate-200" />

      {/* Lists & Blocks */}
      <button
        type="button"
        disabled={disabled}
        data-testid="editor-ribbon-toggle-list-unordered"
        aria-pressed={activeFormats.list === 'bullet'}
        onClick={() => onApplyFormat('insertUnorderedList')}
        title={t.toolbar.bulletList}
        className={activeFormats.list === 'bullet' ? activeBtnClass : btnClass}
      >
        <List className="h-4 w-4" />
      </button>
      <button
        type="button"
        disabled={disabled}
        data-testid="editor-ribbon-toggle-list-ordered"
        aria-pressed={activeFormats.list === 'ordered'}
        onClick={() => onApplyFormat('insertOrderedList')}
        title={t.toolbar.numberedList}
        className={activeFormats.list === 'ordered' ? activeBtnClass : btnClass}
      >
        <ListOrdered className="h-4 w-4" />
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onApplyFormat('formatBlock', 'BLOCKQUOTE')}
        title={t.toolbar.blockquote}
        className={btnClass}
      >
        <Quote className="h-4 w-4" />
      </button>
      {onInsertCallout && (
        <button
          type="button"
          disabled={disabled}
          onClick={onInsertCallout}
          title={t.menubar.insertCallout}
          className={btnClass}
        >
          <Info className={`h-4 w-4 ${disabled ? 'text-slate-300' : 'text-blue-600'}`} />
        </button>
      )}
      {onInsertDivider && (
        <button
          type="button"
          disabled={disabled}
          onClick={onInsertDivider}
          title={t.menubar.insertHorizontalLine}
          className={btnClass}
        >
          <Minus className="h-4 w-4" />
        </button>
      )}

      <div className="mx-1 h-4 w-[1px] bg-slate-200" />

      {/* Insert Table Button with 10x10 Grid Picker */}
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          data-testid="editor-ribbon-table"
          onClick={() => setShowTablePicker((v) => !v)}
          title={t.toolbar.insertTable}
          className={`flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-semibold transition disabled:text-slate-300 disabled:cursor-not-allowed ${
            showTablePicker || activeTable
              ? 'border-blue-300 bg-blue-50 text-blue-700'
              : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <TableIcon className={`h-3.5 w-3.5 ${disabled ? 'text-slate-300' : 'text-blue-600'}`} />
          <span>{t.menubar.table} ▾</span>
        </button>

        {showTablePicker && !disabled && (
          <div
            data-editor-ribbon=""
            style={{ zIndex: 99999 }}
            className="absolute top-full ltr:left-0 rtl:right-0 mt-1.5 z-50"
          >
            <TableGridPicker
              translations={t}
              onSelectGrid={(r, c) => onInsertTable(r, c, { withHeader: false })}
              onOpenCustomWizard={() => onOpenModal('insert-custom-table')}
              onClose={() => setShowTablePicker(false)}
            />
          </div>
        )}
      </div>

      <button
        type="button"
        disabled={disabled}
        data-testid="editor-ribbon-clear-format"
        onClick={() => onApplyFormat('removeFormat')}
        title={t.toolbar.clearFormatting}
        className={btnClass}
      >
        <Eraser className="h-4 w-4" />
      </button>

      <div className="mx-1 h-4 w-[1px] bg-slate-200" />

      {/* Visual Aids Toggle */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setShowVisualAids((v) => !v)}
        title={t.menubar.visualAids}
        className={`rounded-md p-1.5 text-xs disabled:text-slate-300 disabled:cursor-not-allowed ${
          showVisualAids
            ? 'bg-blue-50 text-blue-600'
            : 'text-slate-500 hover:bg-slate-100'
        }`}
      >
        <Eye className="h-4 w-4" />
      </button>

      {/* Find & Replace Toggle */}
      <button
        type="button"
        disabled={disabled}
        data-testid="editor-ribbon-find-replace"
        onClick={() => setShowFindReplace((v) => !v)}
        title={t.menubar.findReplace}
        className={`rounded-md p-1.5 disabled:text-slate-300 disabled:cursor-not-allowed ${
          showFindReplace
            ? 'bg-blue-50 text-blue-600'
            : 'text-slate-600 hover:bg-slate-100'
        }`}
      >
        <Search className="h-4 w-4" />
      </button>
    </div>
  );
};
