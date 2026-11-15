'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Table,
  Rows,
  Columns,
  Settings2,
  Combine,
  SplitSquareHorizontal,
  SplitSquareVertical,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Copy,
  Scissors,
  ClipboardPaste,
  ChevronRight,
  Sparkles,
  ArrowUpDown,
  Eraser,
} from 'lucide-react';
import { ActiveModalType } from './types';
import { EditorTranslations, defaultTranslations } from './i18n';

interface TableContextMenuProps {
  position: { x: number; y: number } | null;
  translations?: EditorTranslations;
  canMerge: boolean;
  isCellMerged: boolean;
  hasCopiedRow: boolean;
  onClose: () => void;
  onOpenModal: (modal: ActiveModalType) => void;
  onMergeCells: () => void;
  onSplitCell: (mode: 'unmerge' | 'horizontal' | 'vertical') => void;
  onClearSelectedCells: () => void;
  onInsertRowAbove: () => void;
  onInsertRowBelow: () => void;
  onDeleteRow: () => void;
  onMoveRowUp: () => void;
  onMoveRowDown: () => void;
  onCopyRow: () => void;
  onCutRow: () => void;
  onPasteRowAbove: () => void;
  onPasteRowBelow: () => void;
  onInsertColLeft: () => void;
  onInsertColRight: () => void;
  onDeleteCol: () => void;
  onMoveColLeft: () => void;
  onMoveColRight: () => void;
  onDistributeCols: () => void;
  onDistributeRows: () => void;
  onSortCol: (dir: 'asc' | 'desc') => void;
  onToggleHeaderRow: () => void;
  onToggleCaption: () => void;
  onToggleStriped: () => void;
  onSetBorderPreset: (preset: 'grid' | 'horizontal' | 'outer' | 'none') => void;
  onDeleteTable: () => void;
}

export const TableContextMenu: React.FC<TableContextMenuProps> = ({
  position,
  translations = defaultTranslations,
  canMerge,
  isCellMerged,
  hasCopiedRow,
  onClose,
  onOpenModal,
  onMergeCells,
  onSplitCell,
  onClearSelectedCells,
  onInsertRowAbove,
  onInsertRowBelow,
  onDeleteRow,
  onMoveRowUp,
  onMoveRowDown,
  onCopyRow,
  onCutRow,
  onPasteRowAbove,
  onPasteRowBelow,
  onInsertColLeft,
  onInsertColRight,
  onDeleteCol,
  onMoveColLeft,
  onMoveColRight,
  onDistributeCols,
  onDistributeRows,
  onSortCol,
  onToggleHeaderRow,
  onToggleCaption,
  onToggleStriped,
  onSetBorderPreset,
  onDeleteTable,
}) => {
  const tCtx = translations.contextMenu;
  const [activeSubmenu, setActiveSubmenu] = useState<'cell' | 'row' | 'col' | 'style' | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!position) return;
    const handleOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('mousedown', handleOutside);
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [position, onClose]);

  if (!position || typeof document === 'undefined') return null;

  // Keep menu inside viewport
  const top = Math.min(position.y, (typeof window !== 'undefined' ? window.innerHeight : 800) - 320);
  const left = Math.min(position.x, (typeof window !== 'undefined' ? window.innerWidth : 1200) - 240);

  const runAction = (fn: () => void) => {
    fn();
    onClose();
  };

  return createPortal(
    <div
      ref={menuRef}
      data-editor-ribbon=""
      style={{ position: 'fixed', top: Math.max(8, top), left: Math.max(8, left), zIndex: 99999 }}
      onContextMenu={(e) => e.preventDefault()}
      className="tiny-quill-root fixed z-50 w-56 rounded-xl border border-slate-200 bg-white py-1.5 text-xs text-slate-700 shadow-2xl select-none"
    >
      <div className="px-3 py-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
        {translations.menubar.table}
      </div>

      {/* CELL SUBMENU */}
      <div
        onMouseEnter={() => setActiveSubmenu('cell')}
        className="relative flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-blue-50 hover:text-blue-700"
      >
        <div className="flex items-center gap-2.5">
          <Settings2 className="h-4 w-4 text-indigo-600" />
          <span className="font-medium">{tCtx.cell}</span>
        </div>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />

        {activeSubmenu === 'cell' && (
          <div className="absolute top-0 left-full ml-1 w-56 rounded-xl border border-slate-200 bg-white py-1.5 text-slate-700 shadow-xl">
            <button
              type="button"
              onClick={() => runAction(() => onOpenModal('cell'))}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left hover:bg-blue-50 hover:text-blue-700"
            >
              <Settings2 className="h-3.5 w-3.5 text-indigo-600" />
              <span>{tCtx.cellProperties}...</span>
            </button>
            <div className="my-1 h-[1px] bg-slate-100" />
            <button
              type="button"
              disabled={!canMerge}
              onClick={() => canMerge && runAction(onMergeCells)}
              className={`flex w-full items-center gap-2.5 px-3 py-2 text-left ${
                canMerge
                  ? 'hover:bg-blue-50 hover:text-blue-700'
                  : 'cursor-not-allowed text-slate-300'
              }`}
            >
              <Combine className="h-3.5 w-3.5" />
              <span>{tCtx.mergeCells}</span>
            </button>
            {isCellMerged && (
              <button
                type="button"
                onClick={() => runAction(() => onSplitCell('unmerge'))}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-left font-medium text-amber-700 hover:bg-amber-50"
              >
                <SplitSquareHorizontal className="h-3.5 w-3.5" />
                <span>{tCtx.unmergeCells}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => runAction(() => onSplitCell('horizontal'))}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left hover:bg-blue-50 hover:text-blue-700"
            >
              <SplitSquareHorizontal className="h-3.5 w-3.5 text-blue-600" />
              <span>{tCtx.splitHorizontal}</span>
            </button>
            <button
              type="button"
              onClick={() => runAction(() => onSplitCell('vertical'))}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left hover:bg-blue-50 hover:text-blue-700"
            >
              <SplitSquareVertical className="h-3.5 w-3.5 text-blue-600" />
              <span>{tCtx.splitVertical}</span>
            </button>
            <div className="my-1 h-[1px] bg-slate-100" />
            <button
              type="button"
              onClick={() => runAction(onClearSelectedCells)}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-rose-600 hover:bg-rose-50"
            >
              <Eraser className="h-3.5 w-3.5" />
              <span>{tCtx.clearCellContent}</span>
            </button>
          </div>
        )}
      </div>

      {/* ROW SUBMENU */}
      <div
        onMouseEnter={() => setActiveSubmenu('row')}
        className="relative flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-blue-50 hover:text-blue-700"
      >
        <div className="flex items-center gap-2.5">
          <Rows className="h-4 w-4 text-emerald-600" />
          <span className="font-medium">{tCtx.row}</span>
        </div>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />

        {activeSubmenu === 'row' && (
          <div className="absolute top-0 left-full ml-1 w-56 rounded-xl border border-slate-200 bg-white py-1.5 text-slate-700 shadow-xl">
            <button
              type="button"
              onClick={() => runAction(onInsertRowAbove)}
              className="flex w-full items-center gap-2.5 px-3 py-1.5 text-left hover:bg-blue-50 hover:text-blue-700"
            >
              <Plus className="h-3.5 w-3.5 text-emerald-600" />
              <span>{tCtx.insertRowAbove}</span>
            </button>
            <button
              type="button"
              onClick={() => runAction(onInsertRowBelow)}
              className="flex w-full items-center gap-2.5 px-3 py-1.5 text-left hover:bg-blue-50 hover:text-blue-700"
            >
              <Plus className="h-3.5 w-3.5 text-emerald-600" />
              <span>{tCtx.insertRowBelow}</span>
            </button>
            <button
              type="button"
              onClick={() => runAction(onDeleteRow)}
              className="flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-rose-600 hover:bg-rose-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>{tCtx.deleteRow}</span>
            </button>
            <button
              type="button"
              onClick={() => runAction(() => onOpenModal('row'))}
              className="flex w-full items-center gap-2.5 px-3 py-1.5 text-left hover:bg-blue-50 hover:text-blue-700"
            >
              <Settings2 className="h-3.5 w-3.5 text-indigo-600" />
              <span>{tCtx.rowProperties}...</span>
            </button>
            <div className="my-1 h-[1px] bg-slate-100" />
            <button
              type="button"
              onClick={() => runAction(onMoveRowUp)}
              className="flex w-full items-center gap-2.5 px-3 py-1.5 text-left hover:bg-blue-50 hover:text-blue-700"
            >
              <ArrowUp className="h-3.5 w-3.5" />
              <span>{tCtx.moveRowUp}</span>
            </button>
            <button
              type="button"
              onClick={() => runAction(onMoveRowDown)}
              className="flex w-full items-center gap-2.5 px-3 py-1.5 text-left hover:bg-blue-50 hover:text-blue-700"
            >
              <ArrowDown className="h-3.5 w-3.5" />
              <span>{tCtx.moveRowDown}</span>
            </button>
            <div className="my-1 h-[1px] bg-slate-100" />
            <button
              type="button"
              onClick={() => runAction(onCutRow)}
              className="flex w-full items-center gap-2.5 px-3 py-1.5 text-left hover:bg-blue-50 hover:text-blue-700"
            >
              <Scissors className="h-3.5 w-3.5" />
              <span>{tCtx.cutRow}</span>
            </button>
            <button
              type="button"
              onClick={() => runAction(onCopyRow)}
              className="flex w-full items-center gap-2.5 px-3 py-1.5 text-left hover:bg-blue-50 hover:text-blue-700"
            >
              <Copy className="h-3.5 w-3.5" />
              <span>{tCtx.copyRow}</span>
            </button>
            <button
              type="button"
              disabled={!hasCopiedRow}
              onClick={() => hasCopiedRow && runAction(onPasteRowAbove)}
              className={`flex w-full items-center gap-2.5 px-3 py-1.5 text-left ${
                hasCopiedRow
                  ? 'hover:bg-blue-50 hover:text-blue-700'
                  : 'cursor-not-allowed text-slate-300'
              }`}
            >
              <ClipboardPaste className="h-3.5 w-3.5" />
              <span>{tCtx.pasteRowAbove}</span>
            </button>
            <button
              type="button"
              disabled={!hasCopiedRow}
              onClick={() => hasCopiedRow && runAction(onPasteRowBelow)}
              className={`flex w-full items-center gap-2.5 px-3 py-1.5 text-left ${
                hasCopiedRow
                  ? 'hover:bg-blue-50 hover:text-blue-700'
                  : 'cursor-not-allowed text-slate-300'
              }`}
            >
              <ClipboardPaste className="h-3.5 w-3.5" />
              <span>{tCtx.pasteRowBelow}</span>
            </button>
          </div>
        )}
      </div>

      {/* COLUMN SUBMENU */}
      <div
        onMouseEnter={() => setActiveSubmenu('col')}
        className="relative flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-blue-50 hover:text-blue-700"
      >
        <div className="flex items-center gap-2.5">
          <Columns className="h-4 w-4 text-blue-600" />
          <span className="font-medium">{tCtx.column}</span>
        </div>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />

        {activeSubmenu === 'col' && (
          <div className="absolute top-0 left-full ml-1 w-56 rounded-xl border border-slate-200 bg-white py-1.5 text-slate-700 shadow-xl">
            <button
              type="button"
              onClick={() => runAction(onInsertColLeft)}
              className="flex w-full items-center gap-2.5 px-3 py-1.5 text-left hover:bg-blue-50 hover:text-blue-700"
            >
              <Plus className="h-3.5 w-3.5 text-emerald-600" />
              <span>{tCtx.insertColLeft}</span>
            </button>
            <button
              type="button"
              onClick={() => runAction(onInsertColRight)}
              className="flex w-full items-center gap-2.5 px-3 py-1.5 text-left hover:bg-blue-50 hover:text-blue-700"
            >
              <Plus className="h-3.5 w-3.5 text-emerald-600" />
              <span>{tCtx.insertColRight}</span>
            </button>
            <button
              type="button"
              onClick={() => runAction(onDeleteCol)}
              className="flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-rose-600 hover:bg-rose-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>{tCtx.deleteColumn}</span>
            </button>
            <div className="my-1 h-[1px] bg-slate-100" />
            <button
              type="button"
              onClick={() => runAction(onMoveColLeft)}
              className="flex w-full items-center gap-2.5 px-3 py-1.5 text-left hover:bg-blue-50 hover:text-blue-700"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{tCtx.moveColLeft}</span>
            </button>
            <button
              type="button"
              onClick={() => runAction(onMoveColRight)}
              className="flex w-full items-center gap-2.5 px-3 py-1.5 text-left hover:bg-blue-50 hover:text-blue-700"
            >
              <ArrowRight className="h-3.5 w-3.5" />
              <span>{tCtx.moveColRight}</span>
            </button>
            <button
              type="button"
              onClick={() => runAction(onDistributeCols)}
              className="flex w-full items-center gap-2.5 px-3 py-1.5 text-left hover:bg-blue-50 hover:text-blue-700"
            >
              <Columns className="h-3.5 w-3.5 text-purple-600" />
              <span>{tCtx.distributeColsEvenly}</span>
            </button>
            <div className="my-1 h-[1px] bg-slate-100" />
            <button
              type="button"
              onClick={() => runAction(() => onSortCol('asc'))}
              className="flex w-full items-center gap-2.5 px-3 py-1.5 text-left hover:bg-blue-50 hover:text-blue-700"
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              <span>{tCtx.sortColAsc}</span>
            </button>
            <button
              type="button"
              onClick={() => runAction(() => onSortCol('desc'))}
              className="flex w-full items-center gap-2.5 px-3 py-1.5 text-left hover:bg-blue-50 hover:text-blue-700"
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              <span>{tCtx.sortColDesc}</span>
            </button>
          </div>
        )}
      </div>

      {/* TABLE STYLES & PRESETS SUBMENU */}
      <div
        onMouseEnter={() => setActiveSubmenu('style')}
        className="relative flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-blue-50 hover:text-blue-700"
      >
        <div className="flex items-center gap-2.5">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span className="font-medium">{tCtx.tableStyle}</span>
        </div>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />

        {activeSubmenu === 'style' && (
          <div className="absolute top-0 left-full ml-1 w-56 rounded-xl border border-slate-200 bg-white py-1.5 text-slate-700 shadow-xl">
            <button
              type="button"
              onClick={() => runAction(onToggleHeaderRow)}
              className="flex w-full items-center gap-2.5 px-3 py-1.5 text-left hover:bg-blue-50 hover:text-blue-700"
            >
              <span>{tCtx.toggleHeaderRow}</span>
            </button>
            <button
              type="button"
              onClick={() => runAction(onToggleCaption)}
              className="flex w-full items-center gap-2.5 px-3 py-1.5 text-left hover:bg-blue-50 hover:text-blue-700"
            >
              <span>{tCtx.toggleCaption}</span>
            </button>
            <button
              type="button"
              onClick={() => runAction(onToggleStriped)}
              className="flex w-full items-center gap-2.5 px-3 py-1.5 text-left hover:bg-blue-50 hover:text-blue-700"
            >
              <span>{tCtx.toggleStriped}</span>
            </button>
            <button
              type="button"
              onClick={() => runAction(onDistributeRows)}
              className="flex w-full items-center gap-2.5 px-3 py-1.5 text-left hover:bg-blue-50 hover:text-blue-700"
            >
              <span>{tCtx.distributeRowsEvenly}</span>
            </button>
            <div className="my-1 h-[1px] bg-slate-100" />
            <button
              type="button"
              onClick={() => runAction(() => onSetBorderPreset('grid'))}
              className="flex w-full items-center gap-2.5 px-3 py-1.5 text-left hover:bg-blue-50 hover:text-blue-700"
            >
              <span>{tCtx.borderGrid}</span>
            </button>
            <button
              type="button"
              onClick={() => runAction(() => onSetBorderPreset('horizontal'))}
              className="flex w-full items-center gap-2.5 px-3 py-1.5 text-left hover:bg-blue-50 hover:text-blue-700"
            >
              <span>{tCtx.borderHorizontal}</span>
            </button>
            <button
              type="button"
              onClick={() => runAction(() => onSetBorderPreset('none'))}
              className="flex w-full items-center gap-2.5 px-3 py-1.5 text-left hover:bg-blue-50 hover:text-blue-700"
            >
              <span>{tCtx.borderNone}</span>
            </button>
          </div>
        )}
      </div>

      <div className="my-1 h-[1px] bg-slate-100" />

      {/* Table Properties & Delete Table */}
      <button
        type="button"
        onMouseEnter={() => setActiveSubmenu(null)}
        onClick={() => runAction(() => onOpenModal('table'))}
        className="flex w-full items-center gap-2.5 px-3 py-2 text-left hover:bg-blue-50 hover:text-blue-700"
      >
        <Table className="h-4 w-4 text-blue-600" />
        <span className="font-medium">{tCtx.tableProperties}...</span>
      </button>

      <button
        type="button"
        onMouseEnter={() => setActiveSubmenu(null)}
        onClick={() => runAction(onDeleteTable)}
        className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-rose-600 hover:bg-rose-50"
      >
        <Trash2 className="h-4 w-4" />
        <span className="font-medium">{tCtx.deleteTable}</span>
      </button>
    </div>,
    document.body
  );
};
