'use client';

import React from 'react';
import { EditorTranslations } from '../i18n';

interface CustomTableDialogProps {
  rows: number;
  cols: number;
  width: string;
  height: string;
  withHeader: boolean;
  striped: boolean;
  translations: EditorTranslations;
  onChangeRows: (r: number) => void;
  onChangeCols: (c: number) => void;
  onChangeWidth: (w: string) => void;
  onChangeHeight: (h: string) => void;
  onChangeWithHeader: (v: boolean) => void;
  onChangeStriped: (v: boolean) => void;
}

export const CustomTableDialog: React.FC<CustomTableDialogProps> = ({
  rows,
  cols,
  width,
  height,
  withHeader,
  striped,
  translations,
  onChangeRows,
  onChangeCols,
  onChangeWidth,
  onChangeHeight,
  onChangeWithHeader,
  onChangeStriped,
}) => {
  const tMod = translations.modals;
  const tCommon = translations.common;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block font-semibold text-slate-700">
            {tMod.rowsCount}
          </label>
          <input
            type="number"
            min={1}
            max={50}
            value={rows}
            onChange={(e) =>
              onChangeRows(Math.max(1, Math.min(50, Number(e.target.value) || 1)))
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block font-semibold text-slate-700">
            {tMod.columnsCount}
          </label>
          <input
            type="number"
            min={1}
            max={20}
            value={cols}
            onChange={(e) =>
              onChangeCols(Math.max(1, Math.min(20, Number(e.target.value) || 1)))
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block font-semibold text-slate-700">
            {tCommon.width} (px / %)
          </label>
          <input
            type="text"
            data-testid="custom-table-dialog-width"
            value={width}
            onChange={(e) => onChangeWidth(e.target.value)}
            placeholder="e.g. 100% or 600px"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block font-semibold text-slate-700">
            {tCommon.height}
          </label>
          <input
            type="text"
            data-testid="custom-table-dialog-height"
            value={height}
            onChange={(e) => onChangeHeight(e.target.value)}
            placeholder="e.g. auto or 300px"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <label className="flex items-center gap-2 font-medium text-slate-800 cursor-pointer">
          <input
            type="checkbox"
            checked={withHeader}
            onChange={(e) => onChangeWithHeader(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-blue-600"
          />
          <span>{tMod.includeHeader}</span>
        </label>
        <label className="flex items-center gap-2 font-medium text-slate-800 cursor-pointer">
          <input
            type="checkbox"
            checked={striped}
            onChange={(e) => onChangeStriped(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-blue-600"
          />
          <span>{tMod.stripedStyle}</span>
        </label>
      </div>
    </div>
  );
};
