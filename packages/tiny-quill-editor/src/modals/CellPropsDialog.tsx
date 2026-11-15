'use client';

import React, { useState } from 'react';
import { CellProperties } from '../types';
import { EditorTranslations } from '../i18n';
import { ColorSwatchPicker } from './ColorSwatchPicker';

interface CellPropsDialogProps {
  tab: 'general' | 'advanced';
  form: CellProperties;
  translations: EditorTranslations;
  onChange: (next: CellProperties) => void;
}

export const CellPropsDialog: React.FC<CellPropsDialogProps> = ({
  tab,
  form,
  translations,
  onChange,
}) => {
  const tMod = translations.modals;
  const tCommon = translations.common;
  const [cellTypeOpen, setCellTypeOpen] = useState(false);

  if (tab === 'general') {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block font-semibold text-slate-700">
              {tCommon.width}
            </label>
            <input
              type="text"
              data-testid="table-props-modal-cell-width"
              value={form.width}
              onChange={(e) => onChange({ ...form, width: e.target.value })}
              placeholder="e.g. 160px or 25%"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block font-semibold text-slate-700">
              {tCommon.height}
            </label>
            <input
              type="text"
              data-testid="table-props-modal-cell-height"
              value={form.height}
              onChange={(e) => onChange({ ...form, height: e.target.value })}
              placeholder="e.g. 48px"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <label className="mb-1 block font-semibold text-slate-700">
              {tMod.cellType}
            </label>
            <button
              type="button"
              data-testid="table-props-modal-cell-type"
              onClick={() => setCellTypeOpen((o) => !o)}
              className="flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-3 py-2 text-start text-sm text-slate-800"
            >
              <span>{form.cellType === 'th' ? tMod.cellHeader : tMod.cellData}</span>
              <span className="text-xs text-slate-400">▾</span>
            </button>
            {cellTypeOpen && (
              <div className="absolute top-full right-0 left-0 z-20 mt-1 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
                {(
                  [
                    ['td', tMod.cellData],
                    ['th', tMod.cellHeader],
                  ] as const
                ).map(([val, label]) => (
                  <button
                    key={val}
                    type="button"
                    data-testid={`select-option-${label}`}
                    onClick={() => {
                      onChange({ ...form, cellType: val });
                      setCellTypeOpen(false);
                    }}
                    className={`block w-full rounded px-2.5 py-1.5 text-start text-sm ${
                      form.cellType === val
                        ? 'bg-blue-50 font-semibold text-blue-700'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="mb-1 block font-semibold text-slate-700">{tMod.scope}</label>
            <select
              data-testid="table-props-field-cell-scope"
              value={form.scope}
              onChange={(e) =>
                onChange({
                  ...form,
                  scope: e.target.value as CellProperties['scope'],
                })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="">{tMod.scopeNone}</option>
              <option value="col">{tMod.scopeCol}</option>
              <option value="row">{tMod.scopeRow}</option>
              <option value="colgroup">colgroup</option>
              <option value="rowgroup">rowgroup</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block font-semibold text-slate-700">
              {tMod.horizontalAlign}
            </label>
            <select
              data-testid="table-props-field-cell-h-align"
              value={form.hAlign}
              onChange={(e) =>
                onChange({
                  ...form,
                  hAlign: e.target.value as CellProperties['hAlign'],
                })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="">{tMod.alignNone}</option>
              <option value="left">{tMod.alignLeft}</option>
              <option value="center">{tMod.alignCenter}</option>
              <option value="right">{tMod.alignRight}</option>
              <option value="justify">Justify</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block font-semibold text-slate-700">
              {tMod.verticalAlign}
            </label>
            <select
              data-testid="table-props-field-cell-v-align"
              value={form.vAlign}
              onChange={(e) =>
                onChange({
                  ...form,
                  vAlign: e.target.value as CellProperties['vAlign'],
                })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="top">{tMod.vTop}</option>
              <option value="middle">{tMod.vMiddle}</option>
              <option value="bottom">{tMod.vBottom}</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block font-semibold text-slate-700">
              {tMod.cellPadding}
            </label>
            <input
              type="text"
              value={form.padding}
              onChange={(e) => onChange({ ...form, padding: e.target.value })}
              placeholder="e.g. 10px 12px"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block font-semibold text-slate-700">
              {tMod.whiteSpace}
            </label>
            <select
              value={form.whiteSpace}
              onChange={(e) =>
                onChange({
                  ...form,
                  whiteSpace: e.target.value as 'normal' | 'nowrap',
                })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="normal">{tMod.wrapNormal}</option>
              <option value="nowrap">{tMod.noWrap}</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ColorSwatchPicker
        label={tMod.backgroundColorLabel}
        value={form.backgroundColor}
        fallbackHex="#ffffff"
        placeholder="None / Transparent"
        allowClear
        showFullPalette
        onChange={(backgroundColor) => onChange({ ...form, backgroundColor })}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block font-semibold text-slate-700">
            {tMod.borderStyleLabel}
          </label>
          <select
            value={form.borderStyle}
            onChange={(e) =>
              onChange({
                ...form,
                borderStyle: e.target.value as CellProperties['borderStyle'],
              })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="solid">Solid</option>
            <option value="dashed">Dashed</option>
            <option value="dotted">Dotted</option>
            <option value="double">Double</option>
            <option value="none">None</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block font-semibold text-slate-700">
            {tCommon.borderWidth}
          </label>
          <select
            value={form.borderWidth}
            onChange={(e) => onChange({ ...form, borderWidth: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="1px">1px</option>
            <option value="2px">2px</option>
            <option value="3px">3px</option>
            <option value="0px">0px</option>
          </select>
        </div>
      </div>

      <ColorSwatchPicker
        label={tMod.borderColorLabel}
        value={form.borderColor}
        fallbackHex="#cbd5e1"
        onChange={(borderColor) => onChange({ ...form, borderColor })}
      />
    </div>
  );
};
