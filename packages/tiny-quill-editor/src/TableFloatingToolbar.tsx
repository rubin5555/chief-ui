'use client';

import React, { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Table,
  Plus,
  Trash2,
  Combine,
  SplitSquareHorizontal,
  SplitSquareVertical,
  PaintBucket,
  Grid,
  ArrowUpDown,
  Settings2,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  Columns,
  Rows,
  Heading,
  Captions,
  Sparkles,
  Paintbrush,
} from 'lucide-react';
import { ActiveModalType } from './types';
import { EditorTranslations, defaultTranslations } from './i18n';

interface TableFloatingToolbarProps {
  editorContainerRef: React.RefObject<HTMLDivElement | null>;
  activeTable: HTMLTableElement | null;
  activeCell: HTMLTableCellElement | null;
  selectedCells: HTMLTableCellElement[];
  translations?: EditorTranslations;
  isFormatPainterActive?: boolean;
  onTriggerFormatPainter?: (persistent: boolean) => void;
  onInsertRowAbove: () => void;
  onInsertRowBelow: () => void;
  onDeleteRow: () => void;
  onInsertColLeft: () => void;
  onInsertColRight: () => void;
  onDeleteCol: () => void;
  onMergeCells: () => void;
  onSplitCell: (mode: 'unmerge' | 'horizontal' | 'vertical') => void;
  onSetCellBackground: (color: string) => void;
  onSetBorderPreset: (preset: 'grid' | 'horizontal' | 'outer' | 'none', color?: string) => void;
  onSetVerticalAlign: (align: 'top' | 'middle' | 'bottom') => void;
  onToggleHeaderRow: () => void;
  onToggleCaption: () => void;
  onToggleStriped: () => void;
  onDistributeCols: () => void;
  onSortCol: (dir: 'asc' | 'desc') => void;
  onDeleteTable: () => void;
  onOpenModal: (modal: ActiveModalType) => void;
}

const CELL_BG_SWATCHES = [
  { label: 'None', color: '' },
  { label: 'Black', color: '#000000' },
  { label: 'Gray 700', color: '#374151' },
  { label: 'Red', color: '#dc2626' },
  { label: 'Orange', color: '#f97316' },
  { label: 'Amber', color: '#f59e0b' },
  { label: 'Green', color: '#16a34a' },
  { label: 'Blue', color: '#2563eb' },
  { label: 'Navy', color: '#1B3A6B' },
  { label: 'Purple', color: '#7c3aed' },
  { label: 'Pink', color: '#db2777' },
  { label: 'Gray 500', color: '#6b7280' },
  { label: 'White', color: '#ffffff' },
  { label: 'Blue 50', color: '#eff6ff' },
];

export const TableFloatingToolbar: React.FC<TableFloatingToolbarProps> = ({
  editorContainerRef: _editorContainerRef,
  activeTable,
  activeCell,
  selectedCells,
  translations = defaultTranslations,
  isFormatPainterActive,
  onTriggerFormatPainter,
  onInsertRowAbove,
  onInsertRowBelow,
  onDeleteRow,
  onInsertColLeft,
  onInsertColRight,
  onDeleteCol,
  onMergeCells,
  onSplitCell,
  onSetCellBackground,
  onSetBorderPreset,
  onSetVerticalAlign,
  onToggleHeaderRow,
  onToggleCaption,
  onToggleStriped,
  onDistributeCols,
  onSortCol,
  onDeleteTable,
  onOpenModal,
}) => {
  const tTable = translations.tableToolbar;
  const tCtx = translations.contextMenu;
  const tMod = translations.modals;
  const barRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{ top: number; right: number; placeBelow: boolean }>({
    top: 8,
    right: 8,
    placeBelow: true,
  });
  const [openDropdown, setOpenDropdown] = useState<'bg' | 'border' | 'split' | 'more' | null>(null);

  const updatePosition = useCallback(() => {
    if (!activeTable || !activeTable.isConnected || typeof window === 'undefined') {
      return;
    }

    const BAR_GAP = 6;
    const EDGE_MARGIN = 8;
    const tableRect = activeTable.getBoundingClientRect();
    const barEl = barRef.current;
    const barHeight = barEl?.offsetHeight ?? 36;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const underTop = tableRect.top + tableRect.height + BAR_GAP;
    const overTop = tableRect.top - barHeight - BAR_GAP;
    const placeBelow = underTop + barHeight <= vh;
    const top = placeBelow
      ? Math.max(0, underTop)
      : overTop >= 0
      ? overTop
      : Math.max(0, Math.min(vh - barHeight, underTop));

    const targetRight = Math.min(tableRect.left + tableRect.width, vw - EDGE_MARGIN);
    const right = Math.max(EDGE_MARGIN, vw - targetRight);

    setPos((prev) =>
      Math.abs(prev.top - top) < 0.25 &&
      Math.abs(prev.right - right) < 0.25 &&
      prev.placeBelow === placeBelow
        ? prev
        : { top, right, placeBelow }
    );
  }, [activeTable]);

  useLayoutEffect(() => {
    updatePosition();
    let rafId = 0;
    const loop = () => {
      updatePosition();
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [updatePosition, activeTable, activeCell, selectedCells]);

  useEffect(() => {
    setOpenDropdown(null);
  }, [activeTable, activeCell]);

  if (!activeTable || !activeTable.isConnected || typeof document === 'undefined') return null;

  const isCellMerged =
    Boolean(activeCell && ((activeCell.rowSpan || 1) > 1 || (activeCell.colSpan || 1) > 1));
  const canMerge = selectedCells.length >= 1 || Boolean(activeCell);

  return createPortal(
    <div
      ref={barRef}
      dir="rtl"
      data-editor-ribbon=""
      data-tiny-table-ui="true"
      data-testid="table-edit-bar"
      style={{
        position: 'fixed',
        top: pos.top,
        right: pos.right,
        left: 'auto',
        width: 'max-content',
        maxWidth: 'calc(100vw - 16px)',
        zIndex: 99990,
      }}
      onMouseDown={(e) => {
        // Keep focus inside the table cell and prevent container mousedown from clearing activeTable
        e.preventDefault();
        e.stopPropagation();
      }}
      className="pointer-events-auto z-50 flex flex-wrap items-center gap-0.5 rounded-lg border border-slate-200 bg-white/95 px-1.5 py-1 shadow-lg backdrop-blur-md"
    >
      {/* Properties Dialog Triggers */}
      <button
        type="button"
        data-testid="table-edit-bar-table-props"
        onClick={() => onOpenModal('table')}
        title={`${tMod.tablePropertiesTitle}...`}
        className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-blue-600"
      >
        <Table className="h-3.5 w-3.5 text-blue-600" />
        <span>{tTable.table}</span>
      </button>

      <button
        type="button"
        data-testid="table-edit-bar-cell-props"
        onClick={() => onOpenModal('cell')}
        title={`${tMod.cellPropertiesTitle}...`}
        className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-blue-600"
      >
        <Settings2 className="h-3.5 w-3.5 text-indigo-600" />
        <span>{tTable.cell}</span>
        {selectedCells.length > 1 && (
          <span className="rounded-full bg-indigo-100 px-1.5 text-[10px] font-bold text-indigo-700">
            {selectedCells.length}
          </span>
        )}
      </button>

      <button
        type="button"
        data-testid="table-edit-bar-row-props"
        onClick={() => onOpenModal('row')}
        title={`${tMod.rowPropertiesTitle}...`}
        className="flex items-center gap-1 rounded px-1.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-blue-600"
      >
        <Rows className="h-3.5 w-3.5 text-slate-600" />
        <span>{tTable.row}</span>
      </button>

      {/* Format Painter button */}
      <button
        type="button"
        onClick={() => onTriggerFormatPainter?.(false)}
        onDoubleClick={() => onTriggerFormatPainter?.(true)}
        title={translations.toolbar.formatPainterTitle}
        className={`relative flex items-center gap-1 rounded px-1.5 py-1 text-xs font-medium transition ${
          isFormatPainterActive
            ? 'bg-blue-600 text-white shadow-xs'
            : 'text-slate-700 hover:bg-slate-100 hover:text-blue-600'
        }`}
      >
        <Paintbrush className="h-3.5 w-3.5" />
        <span>{tTable.painter}</span>
        {isFormatPainterActive && (
          <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
        )}
      </button>

      <div className="mx-1 h-4 w-[1px] bg-slate-200" />

      {/* Row Operations */}
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          data-testid="table-edit-bar-row-before"
          onClick={onInsertRowAbove}
          title={tTable.rowAbove}
          className="flex items-center gap-0.5 rounded px-1.5 py-1 text-xs text-slate-700 hover:bg-slate-100"
        >
          <Plus className="h-3 w-3 text-emerald-600" />
          <span>{tTable.row} ↑</span>
        </button>
        <button
          type="button"
          data-testid="table-edit-bar-row-after"
          onClick={onInsertRowBelow}
          title={tTable.rowBelow}
          className="flex items-center gap-0.5 rounded px-1.5 py-1 text-xs text-slate-700 hover:bg-slate-100"
        >
          <Plus className="h-3 w-3 text-emerald-600" />
          <span>{tTable.row} ↓</span>
        </button>
        <button
          type="button"
          data-testid="table-edit-bar-row-delete"
          onClick={onDeleteRow}
          title={tTable.deleteRow}
          className="rounded px-1.5 py-1 text-xs text-rose-600 hover:bg-rose-50"
        >
          −{tTable.row}
        </button>
      </div>

      <div className="mx-1 h-4 w-[1px] bg-slate-200" />

      {/* Column Operations */}
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          data-testid="table-edit-bar-col-before"
          onClick={onInsertColLeft}
          title={tTable.colLeft}
          className="flex items-center gap-0.5 rounded px-1.5 py-1 text-xs text-slate-700 hover:bg-slate-100"
        >
          <Plus className="h-3 w-3 text-emerald-600" />
          <span>{tCtx.column} ←</span>
        </button>
        <button
          type="button"
          data-testid="table-edit-bar-col-after"
          onClick={onInsertColRight}
          title={tTable.colRight}
          className="flex items-center gap-0.5 rounded px-1.5 py-1 text-xs text-slate-700 hover:bg-slate-100"
        >
          <Plus className="h-3 w-3 text-emerald-600" />
          <span>{tCtx.column} →</span>
        </button>
        <button
          type="button"
          data-testid="table-edit-bar-col-delete"
          onClick={onDeleteCol}
          title={tTable.deleteCol}
          className="rounded px-1.5 py-1 text-xs text-rose-600 hover:bg-rose-50"
        >
          −{tCtx.column}
        </button>
      </div>

      <div className="mx-1 h-4 w-[1px] bg-slate-200" />

      {/* Merge & Split Cells */}
      <button
        type="button"
        data-testid="table-edit-bar-merge"
        onClick={onMergeCells}
        disabled={!canMerge}
        title={
          canMerge
            ? `${tTable.merge} (${selectedCells.length})`
            : tCtx.mergeCells
        }
        className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition ${
          canMerge
            ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
            : 'cursor-not-allowed text-slate-400'
        }`}
      >
        <Combine className="h-3.5 w-3.5" />
        <span>{tTable.merge}{canMerge ? ` (${selectedCells.length})` : ''}</span>
      </button>

      {/* Split Cell Button + Dropdown */}
      <div className="relative flex items-center">
        <button
          type="button"
          data-testid="table-edit-bar-split"
          onClick={() => onSplitCell(isCellMerged ? 'unmerge' : 'horizontal')}
          title={tCtx.splitHorizontal}
          className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition ${
            isCellMerged
              ? 'bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <SplitSquareHorizontal className="h-3.5 w-3.5" />
          <span>{isCellMerged ? `${tTable.unmerge}` : `${tTable.splitH}`}</span>
        </button>

        {openDropdown === 'split' && (
          <div style={{ zIndex: 99995 }} className="absolute top-full ltr:left-0 rtl:right-0 mt-1 w-48 rounded-lg border border-slate-200 bg-white p-1 shadow-xl z-40">
            {isCellMerged && (
              <button
                type="button"
                onClick={() => {
                  onSplitCell('unmerge');
                  setOpenDropdown(null);
                }}
                className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-xs font-medium text-amber-700 hover:bg-amber-50"
              >
                <Grid className="h-3.5 w-3.5" />
                <span>{tTable.unmerge}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                onSplitCell('horizontal');
                setOpenDropdown(null);
              }}
              className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-100"
            >
              <SplitSquareHorizontal className="h-3.5 w-3.5 text-blue-600" />
              <span>{tTable.splitH}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onSplitCell('vertical');
                setOpenDropdown(null);
              }}
              className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-100"
            >
              <SplitSquareVertical className="h-3.5 w-3.5 text-blue-600" />
              <span>{tTable.splitV}</span>
            </button>
          </div>
        )}
      </div>

      <div className="mx-1 h-4 w-[1px] bg-slate-200" />

      {/* Cell Shading / Background Color */}
      <div className="relative">
        <button
          type="button"
          data-testid="editor-ribbon-color-chevron-fill"
          onClick={() => setOpenDropdown(openDropdown === 'bg' ? null : 'bg')}
          title={tTable.cellBg}
          className="flex items-center gap-1 rounded px-1.5 py-1 text-xs text-slate-700 hover:bg-slate-100"
        >
          <PaintBucket className="h-3.5 w-3.5 text-purple-600" />
        </button>
        {openDropdown === 'bg' && (
          <div
            data-testid="editor-ribbon-color-menu-fill"
            style={{ zIndex: 99995 }}
            className="absolute top-full ltr:left-0 rtl:right-0 mt-1 w-48 rounded-lg border border-slate-200 bg-white p-2 shadow-xl z-40"
          >
            <div className="mb-1.5 text-[11px] font-semibold text-slate-500">
              {tTable.cellBg} ({selectedCells.length || 1})
            </div>
            <div className="grid grid-cols-7 gap-1">
              {CELL_BG_SWATCHES.map((swatch) => (
                <button
                  key={swatch.label}
                  type="button"
                  data-testid={`editor-ribbon-swatch-fill-${swatch.color || 'clear'}`}
                  title={swatch.label}
                  onClick={() => {
                    onSetCellBackground(swatch.color);
                    setOpenDropdown(null);
                  }}
                  style={{ backgroundColor: swatch.color || '#ffffff' }}
                  className="h-5 w-5 rounded border border-slate-300 transition hover:scale-110"
                >
                  {!swatch.color && (
                    <span className="block text-[9px] leading-none text-rose-500">✕</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Border Presets */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenDropdown(openDropdown === 'border' ? null : 'border')}
          title={tTable.tableBorder}
          className="flex items-center gap-1 rounded px-1.5 py-1 text-xs text-slate-700 hover:bg-slate-100"
        >
          <Grid className="h-3.5 w-3.5 text-slate-600" />
        </button>
        {openDropdown === 'border' && (
          <div style={{ zIndex: 99995 }} className="absolute top-full ltr:left-0 rtl:right-0 mt-1 w-44 rounded-lg border border-slate-200 bg-white p-1 shadow-xl z-40">
            <button
              type="button"
              onClick={() => {
                onSetBorderPreset('grid');
                setOpenDropdown(null);
              }}
              className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-100"
            >
              <span>{tCtx.borderGrid}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onSetBorderPreset('horizontal');
                setOpenDropdown(null);
              }}
              className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-100"
            >
              <span>{tCtx.borderHorizontal}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onSetBorderPreset('outer');
                setOpenDropdown(null);
              }}
              className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-100"
            >
              <span>{tCtx.borderOuter}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onSetBorderPreset('none');
                setOpenDropdown(null);
              }}
              className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-100"
            >
              <span>{tCtx.borderNone}</span>
            </button>
          </div>
        )}
      </div>

      {/* Vertical Alignment */}
      <button
        type="button"
        onClick={() => onSetVerticalAlign('top')}
        title={tTable.vAlignTop}
        className="rounded p-1 text-slate-600 hover:bg-slate-100"
      >
        <AlignVerticalJustifyStart className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={() => onSetVerticalAlign('middle')}
        title={tTable.vAlignMiddle}
        className="rounded p-1 text-slate-600 hover:bg-slate-100"
      >
        <AlignVerticalJustifyCenter className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={() => onSetVerticalAlign('bottom')}
        title={tTable.vAlignBottom}
        className="rounded p-1 text-slate-600 hover:bg-slate-100"
      >
        <AlignVerticalJustifyEnd className="h-3.5 w-3.5" />
      </button>

      {/* More Table Tools (Header, Caption, Striped, Distribute, Sort) */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenDropdown(openDropdown === 'more' ? null : 'more')}
          title={tCtx.tableStyle}
          className="flex items-center gap-1 rounded px-1.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>{translations.menubar.tools} ▾</span>
        </button>
        {openDropdown === 'more' && (
          <div style={{ zIndex: 99995 }} className="absolute top-full ltr:right-0 rtl:left-0 mt-1 w-56 rounded-lg border border-slate-200 bg-white p-1.5 shadow-xl z-40">
            <div className="px-2 py-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              {tMod.dimensions}
            </div>
            <div className="mb-1.5 grid grid-cols-3 gap-1 px-1">
              {(['100%', '75%', '50%'] as const).map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => {
                    activeTable.style.width = pct;
                    onDistributeCols();
                    setOpenDropdown(null);
                  }}
                  className="rounded border border-slate-200 bg-slate-50 py-1 text-center text-[11px] font-semibold text-slate-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
                >
                  {pct}
                </button>
              ))}
            </div>
            <div className="my-1 h-[1px] bg-slate-100" />
            <button
              type="button"
              onClick={() => {
                onToggleHeaderRow();
                setOpenDropdown(null);
              }}
              className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-100"
            >
              <Heading className="h-3.5 w-3.5 text-blue-600" />
              <span>{tTable.headerRow}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onToggleCaption();
                setOpenDropdown(null);
              }}
              className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-100"
            >
              <Captions className="h-3.5 w-3.5 text-indigo-600" />
              <span>{tCtx.toggleCaption}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onToggleStriped();
                setOpenDropdown(null);
              }}
              className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-100"
            >
              <Rows className="h-3.5 w-3.5 text-emerald-600" />
              <span>{tTable.striped}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onDistributeCols();
                setOpenDropdown(null);
              }}
              className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-100"
            >
              <Columns className="h-3.5 w-3.5 text-purple-600" />
              <span>{tTable.distributeCols}</span>
            </button>
            <div className="my-1 h-[1px] bg-slate-100" />
            <button
              type="button"
              onClick={() => {
                onSortCol('asc');
                setOpenDropdown(null);
              }}
              className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-100"
            >
              <ArrowUpDown className="h-3.5 w-3.5 text-slate-600" />
              <span>{tTable.sortAsc}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onSortCol('desc');
                setOpenDropdown(null);
              }}
              className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-100"
            >
              <ArrowUpDown className="h-3.5 w-3.5 text-slate-600" />
              <span>{tTable.sortDesc}</span>
            </button>
          </div>
        )}
      </div>

      <div className="mx-1 h-4 w-[1px] bg-slate-200" />

      {/* Delete Entire Table */}
      <button
        type="button"
        data-testid="table-edit-bar-table-delete"
        onClick={onDeleteTable}
        title={tTable.deleteTable}
        className="rounded p-1 text-rose-600 hover:bg-rose-50"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>,
    document.body
  );
};
