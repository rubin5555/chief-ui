'use client';

import React from 'react';
import {
  Table as TableIcon,
  Image as ImageIcon,
  Info,
  Minus,
  Paintbrush,
  Check,
} from 'lucide-react';
import { ActiveModalType } from '../types';
import { EditorTranslations } from '../i18n';

export type MenubarKey =
  | 'file'
  | 'edit'
  | 'view'
  | 'insert'
  | 'format'
  | 'table'
  | 'tools'
  | null;

interface EditorMenubarProps {
  activeMenubar: MenubarKey;
  setActiveMenubar: React.Dispatch<React.SetStateAction<MenubarKey>>;
  activeTable: HTMLTableElement | null;
  selectedCellsCount: number;
  isCellMerged: boolean;
  showVisualAids: boolean;
  translations: EditorTranslations;
  onNewDocument: () => void;
  onOpenModal: (modal: ActiveModalType) => void;
  onUndo: () => void;
  onRedo: () => void;
  onToggleFindReplace: () => void;
  onToggleVisualAids: () => void;
  onToggleFullscreen: () => void;
  onApplyFormat: (command: string, value?: string) => void;
  onInsertCallout: () => void;
  onInsertDivider: () => void;
  onTriggerFormatPainter: (persistent?: boolean) => void;
  onMergeCells: () => void;
  onSplitCell: (mode: 'unmerge' | 'horizontal' | 'vertical') => void;
  onInsertRow: (pos: 'before' | 'after') => void;
  onInsertCol: (pos: 'before' | 'after') => void;
  onDeleteTable: () => void;
}

export const EditorMenubar: React.FC<EditorMenubarProps> = ({
  activeMenubar,
  setActiveMenubar,
  activeTable,
  selectedCellsCount,
  isCellMerged,
  showVisualAids,
  translations: t,
  onNewDocument,
  onOpenModal,
  onUndo,
  onRedo,
  onToggleFindReplace,
  onToggleVisualAids,
  onToggleFullscreen,
  onApplyFormat,
  onInsertCallout,
  onInsertDivider,
  onTriggerFormatPainter,
  onMergeCells,
  onSplitCell,
  onInsertRow,
  onInsertCol,
  onDeleteTable,
}) => {
  return (
    <div
      data-editor-chrome="true"
      onMouseDown={(e) => e.preventDefault()}
      className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-1 text-xs select-none rounded-t-2xl"
    >
      <div className="flex items-center gap-1">
        {/* FILE MENU */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setActiveMenubar(activeMenubar === 'file' ? null : 'file')}
            className={`rounded px-2.5 py-1 font-medium ${
              activeMenubar === 'file'
                ? 'bg-blue-100 text-blue-700'
                : 'text-slate-700 hover:bg-slate-200/70'
            }`}
          >
            {t.menubar.file}
          </button>
          {activeMenubar === 'file' && (
            <div style={{ zIndex: 99999 }} className="absolute top-full ltr:left-0 rtl:right-0 mt-1 w-52 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl z-50">
              <button
                type="button"
                onClick={() => {
                  onNewDocument();
                  setActiveMenubar(null);
                }}
                className="flex w-full items-center justify-between px-3 py-1.5 text-left rtl:text-right hover:bg-blue-50"
              >
                <span>{t.menubar.newDocument}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onOpenModal('source');
                  setActiveMenubar(null);
                }}
                className="flex w-full items-center justify-between px-3 py-1.5 text-left rtl:text-right hover:bg-blue-50"
              >
                <span>{t.menubar.exportCleanHTML}...</span>
              </button>
              <div className="my-1 h-[1px] bg-slate-100" />
              <button
                type="button"
                onClick={() => {
                  setActiveMenubar(null);
                  window.print();
                }}
                className="flex w-full items-center justify-between px-3 py-1.5 text-left rtl:text-right hover:bg-blue-50"
              >
                <span>{t.menubar.print}...</span>
                <span className="text-[10px] text-slate-400">Ctrl+P</span>
              </button>
            </div>
          )}
        </div>

        {/* EDIT MENU */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setActiveMenubar(activeMenubar === 'edit' ? null : 'edit')}
            className={`rounded px-2.5 py-1 font-medium ${
              activeMenubar === 'edit'
                ? 'bg-blue-100 text-blue-700'
                : 'text-slate-700 hover:bg-slate-200/70'
            }`}
          >
            {t.menubar.edit}
          </button>
          {activeMenubar === 'edit' && (
            <div style={{ zIndex: 99999 }} className="absolute top-full ltr:left-0 rtl:right-0 mt-1 w-52 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl z-50">
              <button
                type="button"
                onClick={() => {
                  onUndo();
                  setActiveMenubar(null);
                }}
                className="flex w-full items-center justify-between px-3 py-1.5 text-left rtl:text-right hover:bg-blue-50"
              >
                <span>{t.menubar.undo}</span>
                <span className="text-[10px] text-slate-400">Ctrl+Z</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onRedo();
                  setActiveMenubar(null);
                }}
                className="flex w-full items-center justify-between px-3 py-1.5 text-left rtl:text-right hover:bg-blue-50"
              >
                <span>{t.menubar.redo}</span>
                <span className="text-[10px] text-slate-400">Ctrl+Y</span>
              </button>
              <div className="my-1 h-[1px] bg-slate-100" />
              <button
                type="button"
                onClick={() => {
                  onToggleFindReplace();
                  setActiveMenubar(null);
                }}
                className="flex w-full items-center justify-between px-3 py-1.5 text-left rtl:text-right hover:bg-blue-50"
              >
                <span>{t.menubar.findReplace}...</span>
                <span className="text-[10px] text-slate-400">Ctrl+F</span>
              </button>
            </div>
          )}
        </div>

        {/* VIEW MENU */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setActiveMenubar(activeMenubar === 'view' ? null : 'view')}
            className={`rounded px-2.5 py-1 font-medium ${
              activeMenubar === 'view'
                ? 'bg-blue-100 text-blue-700'
                : 'text-slate-700 hover:bg-slate-200/70'
            }`}
          >
            {t.menubar.view}
          </button>
          {activeMenubar === 'view' && (
            <div style={{ zIndex: 99999 }} className="absolute top-full ltr:left-0 rtl:right-0 mt-1 w-56 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl z-50">
              <button
                type="button"
                onClick={() => {
                  onToggleVisualAids();
                  setActiveMenubar(null);
                }}
                className="flex w-full items-center justify-between px-3 py-1.5 text-left rtl:text-right hover:bg-blue-50"
              >
                <span>{t.menubar.visualAids}</span>
                {showVisualAids && <Check className="h-3.5 w-3.5 text-blue-600" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  onOpenModal('source');
                  setActiveMenubar(null);
                }}
                className="flex w-full items-center justify-between px-3 py-1.5 text-left rtl:text-right hover:bg-blue-50"
              >
                <span>{t.menubar.sourceCode}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onToggleFullscreen();
                  setActiveMenubar(null);
                }}
                className="flex w-full items-center justify-between px-3 py-1.5 text-left rtl:text-right hover:bg-blue-50"
              >
                <span>{t.menubar.fullscreen}</span>
              </button>
            </div>
          )}
        </div>

        {/* INSERT MENU */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setActiveMenubar(activeMenubar === 'insert' ? null : 'insert')}
            className={`rounded px-2.5 py-1 font-medium ${
              activeMenubar === 'insert'
                ? 'bg-blue-100 text-blue-700'
                : 'text-slate-700 hover:bg-slate-200/70'
            }`}
          >
            {t.menubar.insert}
          </button>
          {activeMenubar === 'insert' && (
            <div style={{ zIndex: 99999 }} className="absolute top-full ltr:left-0 rtl:right-0 mt-1 w-60 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl z-50">
              <button
                type="button"
                onClick={() => {
                  onOpenModal('insert-custom-table');
                  setActiveMenubar(null);
                }}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left rtl:text-right hover:bg-blue-50"
              >
                <TableIcon className="h-3.5 w-3.5 text-blue-600" />
                <span>{t.menubar.insertCustomTable}...</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const url = window.prompt(
                    'Enter Image URL:',
                    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80'
                  );
                  if (url) onApplyFormat('insertImage', url);
                  setActiveMenubar(null);
                }}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left rtl:text-right hover:bg-blue-50"
              >
                <ImageIcon className="h-3.5 w-3.5 text-emerald-600" />
                <span>{t.menubar.insertImage}...</span>
              </button>
              <div className="my-1 h-[1px] bg-slate-100" />
              <button
                type="button"
                onClick={() => {
                  onInsertCallout();
                  setActiveMenubar(null);
                }}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left rtl:text-right hover:bg-blue-50"
              >
                <Info className="h-3.5 w-3.5 text-blue-600" />
                <span>{t.menubar.insertCallout}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onInsertDivider();
                  setActiveMenubar(null);
                }}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left rtl:text-right hover:bg-blue-50"
              >
                <Minus className="h-3.5 w-3.5 text-slate-600" />
                <span>{t.menubar.insertHorizontalLine}</span>
              </button>
            </div>
          )}
        </div>

        {/* FORMAT MENU */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setActiveMenubar(activeMenubar === 'format' ? null : 'format')}
            className={`rounded px-2.5 py-1 font-medium ${
              activeMenubar === 'format'
                ? 'bg-blue-100 text-blue-700'
                : 'text-slate-700 hover:bg-slate-200/70'
            }`}
          >
            {t.menubar.format}
          </button>
          {activeMenubar === 'format' && (
            <div style={{ zIndex: 99999 }} className="absolute top-full ltr:left-0 rtl:right-0 mt-1 w-52 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl z-50">
              <button
                type="button"
                onClick={() => {
                  onTriggerFormatPainter(false);
                  setActiveMenubar(null);
                }}
                className="flex w-full items-center justify-between px-3 py-1.5 text-left rtl:text-right hover:bg-blue-50"
              >
                <span className="flex items-center gap-2">
                  <Paintbrush className="h-3.5 w-3.5 text-blue-600" />
                  <span>{t.menubar.formatPainter}</span>
                </span>
                <span className="text-[10px] text-slate-400">Paint</span>
              </button>
              <div className="my-1 h-[1px] bg-slate-100" />
              <button
                type="button"
                onClick={() => {
                  onApplyFormat('bold');
                  setActiveMenubar(null);
                }}
                className="flex w-full items-center justify-between px-3 py-1.5 text-left rtl:text-right hover:bg-blue-50"
              >
                <span className="font-bold">{t.menubar.bold}</span>
                <span className="text-[10px] text-slate-400">Ctrl+B</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onApplyFormat('italic');
                  setActiveMenubar(null);
                }}
                className="flex w-full items-center justify-between px-3 py-1.5 text-left rtl:text-right hover:bg-blue-50"
              >
                <span className="italic">{t.menubar.italic}</span>
                <span className="text-[10px] text-slate-400">Ctrl+I</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onApplyFormat('underline');
                  setActiveMenubar(null);
                }}
                className="flex w-full items-center justify-between px-3 py-1.5 text-left rtl:text-right hover:bg-blue-50"
              >
                <span className="underline">{t.menubar.underline}</span>
                <span className="text-[10px] text-slate-400">Ctrl+U</span>
              </button>
              <div className="my-1 h-[1px] bg-slate-100" />
              <button
                type="button"
                onClick={() => {
                  onApplyFormat('removeFormat');
                  setActiveMenubar(null);
                }}
                className="flex w-full items-center justify-between px-3 py-1.5 text-left rtl:text-right text-rose-600 hover:bg-rose-50"
              >
                <span>{t.menubar.clearFormatting}</span>
              </button>
            </div>
          )}
        </div>

        {/* TABLE MENU */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setActiveMenubar(activeMenubar === 'table' ? null : 'table')}
            className={`rounded px-2.5 py-1 font-semibold ${
              activeMenubar === 'table'
                ? 'bg-blue-600 text-white'
                : activeTable
                ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                : 'text-slate-700 hover:bg-slate-200/70'
            }`}
          >
            {t.menubar.table}
          </button>
          {activeMenubar === 'table' && (
            <div style={{ zIndex: 99999 }} className="absolute top-full ltr:left-0 rtl:right-0 mt-1 w-60 rounded-xl border border-slate-200 bg-white py-1.5 shadow-2xl z-50">
              <button
                type="button"
                onClick={() => {
                  onOpenModal('insert-custom-table');
                  setActiveMenubar(null);
                }}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left rtl:text-right font-medium text-blue-600 hover:bg-blue-50"
              >
                <TableIcon className="h-3.5 w-3.5" />
                <span>{t.menubar.insertCustomTable}...</span>
              </button>
              <div className="my-1 h-[1px] bg-slate-100" />
              <button
                type="button"
                disabled={!activeTable}
                onClick={() => {
                  onMergeCells();
                  setActiveMenubar(null);
                }}
                className={`flex w-full items-center justify-between px-3 py-1.5 text-left rtl:text-right ${
                  activeTable ? 'hover:bg-blue-50' : 'cursor-not-allowed text-slate-300'
                }`}
              >
                <span>{t.menubar.mergeCells}</span>
                {selectedCellsCount > 1 && (
                  <span className="rounded bg-blue-100 px-1.5 text-[10px] font-bold text-blue-700">
                    {selectedCellsCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                disabled={!activeTable}
                onClick={() => {
                  onSplitCell(isCellMerged ? 'unmerge' : 'horizontal');
                  setActiveMenubar(null);
                }}
                className={`flex w-full items-center justify-between px-3 py-1.5 text-left rtl:text-right ${
                  activeTable ? 'hover:bg-blue-50' : 'cursor-not-allowed text-slate-300'
                }`}
              >
                <span>
                  {isCellMerged ? t.menubar.unmergeCell : t.menubar.splitCellHorizontal}
                </span>
              </button>
              <button
                type="button"
                disabled={!activeTable}
                onClick={() => {
                  onSplitCell('vertical');
                  setActiveMenubar(null);
                }}
                className={`flex w-full items-center justify-between px-3 py-1.5 text-left rtl:text-right ${
                  activeTable ? 'hover:bg-blue-50' : 'cursor-not-allowed text-slate-300'
                }`}
              >
                <span>{t.menubar.splitCellVertical}</span>
              </button>
              <div className="my-1 h-[1px] bg-slate-100" />
              <button
                type="button"
                disabled={!activeTable}
                onClick={() => {
                  onInsertRow('before');
                  setActiveMenubar(null);
                }}
                className={`flex w-full items-center px-3 py-1.5 text-left rtl:text-right ${
                  activeTable ? 'hover:bg-blue-50' : 'cursor-not-allowed text-slate-300'
                }`}
              >
                {t.menubar.insertRowBefore}
              </button>
              <button
                type="button"
                disabled={!activeTable}
                onClick={() => {
                  onInsertRow('after');
                  setActiveMenubar(null);
                }}
                className={`flex w-full items-center px-3 py-1.5 text-left rtl:text-right ${
                  activeTable ? 'hover:bg-blue-50' : 'cursor-not-allowed text-slate-300'
                }`}
              >
                {t.menubar.insertRowAfter}
              </button>
              <button
                type="button"
                disabled={!activeTable}
                onClick={() => {
                  onInsertCol('before');
                  setActiveMenubar(null);
                }}
                className={`flex w-full items-center px-3 py-1.5 text-left rtl:text-right ${
                  activeTable ? 'hover:bg-blue-50' : 'cursor-not-allowed text-slate-300'
                }`}
              >
                {t.menubar.insertColumnBefore}
              </button>
              <button
                type="button"
                disabled={!activeTable}
                onClick={() => {
                  onInsertCol('after');
                  setActiveMenubar(null);
                }}
                className={`flex w-full items-center px-3 py-1.5 text-left rtl:text-right ${
                  activeTable ? 'hover:bg-blue-50' : 'cursor-not-allowed text-slate-300'
                }`}
              >
                {t.menubar.insertColumnAfter}
              </button>
              <div className="my-1 h-[1px] bg-slate-100" />
              <button
                type="button"
                disabled={!activeTable}
                onClick={() => {
                  onOpenModal('table');
                  setActiveMenubar(null);
                }}
                className={`flex w-full items-center px-3 py-1.5 text-left rtl:text-right ${
                  activeTable ? 'hover:bg-blue-50' : 'cursor-not-allowed text-slate-300'
                }`}
              >
                {t.menubar.tableProperties}...
              </button>
              <button
                type="button"
                disabled={!activeTable}
                onClick={() => {
                  onOpenModal('cell');
                  setActiveMenubar(null);
                }}
                className={`flex w-full items-center px-3 py-1.5 text-left rtl:text-right ${
                  activeTable ? 'hover:bg-blue-50' : 'cursor-not-allowed text-slate-300'
                }`}
              >
                {t.menubar.cellProperties}...
              </button>
              <button
                type="button"
                disabled={!activeTable}
                onClick={() => {
                  onOpenModal('row');
                  setActiveMenubar(null);
                }}
                className={`flex w-full items-center px-3 py-1.5 text-left rtl:text-right ${
                  activeTable ? 'hover:bg-blue-50' : 'cursor-not-allowed text-slate-300'
                }`}
              >
                {t.menubar.rowProperties}...
              </button>
              <div className="my-1 h-[1px] bg-slate-100" />
              <button
                type="button"
                disabled={!activeTable}
                onClick={() => {
                  onDeleteTable();
                  setActiveMenubar(null);
                }}
                className={`flex w-full items-center px-3 py-1.5 text-left rtl:text-right ${
                  activeTable
                    ? 'text-rose-600 hover:bg-rose-50'
                    : 'cursor-not-allowed text-slate-300'
                }`}
              >
                {t.menubar.deleteTable}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Side Engine Status Pill */}
      <div className="hidden items-center gap-2 sm:flex">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {t.menubar.engineActive}
        </span>
      </div>
    </div>
  );
};
