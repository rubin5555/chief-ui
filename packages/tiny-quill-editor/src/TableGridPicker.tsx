'use client';

import React, { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { EditorTranslations, defaultTranslations } from './i18n';

interface TableGridPickerProps {
  translations?: EditorTranslations;
  onSelectGrid: (rows: number, cols: number) => void;
  onOpenCustomWizard: () => void;
  onClose: () => void;
}

const MAX_ROWS = 10;
const MAX_COLS = 10;

export const TableGridPicker: React.FC<TableGridPickerProps> = ({
  translations = defaultTranslations,
  onSelectGrid,
  onOpenCustomWizard,
  onClose,
}) => {
  const [hoverRow, setHoverRow] = useState(3);
  const [hoverCol, setHoverCol] = useState(4);

  const tModals = translations.modals;
  const tToolbar = translations.toolbar;

  return (
    <div
      data-editor-ribbon=""
      data-testid="editor-ribbon-table-picker"
      style={{ zIndex: 99999 }}
      onMouseDown={(e) => e.preventDefault()}
      className="w-64 rounded-xl border border-slate-200 bg-white p-3 shadow-2xl select-none z-50"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700">{tToolbar.insertTable}</span>
        <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700">
          {hoverCol} × {hoverRow}
        </span>
      </div>

      {/* 10x10 Hover Grid */}
      <div
        className="grid grid-cols-10 gap-1 rounded-lg border border-slate-100 bg-slate-50/70 p-2"
        onMouseLeave={() => {
          setHoverRow(3);
          setHoverCol(4);
        }}
      >
        {Array.from({ length: MAX_ROWS }).map((_, rIdx) => {
          const r = rIdx + 1;
          return Array.from({ length: MAX_COLS }).map((__, cIdx) => {
            const c = cIdx + 1;
            const active = r <= hoverRow && c <= hoverCol;
            return (
              <button
                key={`${r}-${c}`}
                type="button"
                data-testid={`editor-ribbon-table-cell-${r}-${c}`}
                onMouseEnter={() => {
                  setHoverRow(r);
                  setHoverCol(c);
                }}
                onClick={() => {
                  onSelectGrid(r, c);
                  onClose();
                }}
                className={`h-4 w-4 rounded-[3px] border transition-all ${
                  active
                    ? 'scale-105 border-blue-500 bg-blue-500/85 shadow-2xs'
                    : 'border-slate-300 bg-white hover:border-blue-400'
                }`}
              />
            );
          });
        })}
      </div>

      {/* Custom Table Wizard Button */}
      <div className="mt-2.5 border-t border-slate-100 pt-2">
        <button
          type="button"
          onClick={() => {
            onOpenCustomWizard();
            onClose();
          }}
          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-semibold text-blue-600 hover:bg-blue-50"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>{tModals.insertCustomTableTitle}...</span>
        </button>
      </div>
    </div>
  );
};
