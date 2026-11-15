'use client';

import React from 'react';
import { TableProperties } from '../types';
import { EditorTranslations } from '../i18n';
import { ColorSwatchPicker } from './ColorSwatchPicker';

interface TablePropsDialogProps {
  tab: 'general' | 'advanced';
  form: TableProperties;
  translations: EditorTranslations;
  onChange: (next: TableProperties) => void;
}

export const TablePropsDialog: React.FC<TablePropsDialogProps> = ({
  tab,
  form,
  translations,
  onChange,
}) => {
  const tMod = translations.modals;
  const tCommon = translations.common;

  if (tab === 'general') {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block font-semibold text-slate-700">
              {tCommon.width} (px / %)
            </label>
            <input
              type="text"
              data-testid="table-props-modal-table-width"
              value={form.width}
              onChange={(e) => onChange({ ...form, width: e.target.value })}
              placeholder="e.g. 100% or 720px"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block font-semibold text-slate-700">
              {tCommon.height}
            </label>
            <input
              type="text"
              data-testid="table-props-modal-table-height"
              value={form.height}
              onChange={(e) => onChange({ ...form, height: e.target.value })}
              placeholder="e.g. auto or 300px"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block font-semibold text-slate-700">
              {tMod.cellPadding}
            </label>
            <input
              type="text"
              data-testid="table-props-field-cell-padding"
              value={form.cellPadding}
              onChange={(e) => onChange({ ...form, cellPadding: e.target.value })}
              placeholder="e.g. 10px 12px"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block font-semibold text-slate-700">
              {tMod.tableAlignment}
            </label>
            <select
              data-testid="table-props-field-table-align"
              value={form.align}
              onChange={(e) =>
                onChange({
                  ...form,
                  align: e.target.value as TableProperties['align'],
                })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            >
              <option value="none">{tMod.alignNone}</option>
              <option value="left">{tMod.alignLeft}</option>
              <option value="center">{tMod.alignCenter}</option>
              <option value="right">{tMod.alignRight}</option>
            </select>
          </div>
        </div>

        <div className="space-y-2.5 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
          <label className="flex items-center gap-2.5 font-medium text-slate-800 cursor-pointer">
            <input
              type="checkbox"
              data-testid="table-props-modal-caption"
              checked={form.hasCaption}
              onChange={(e) => onChange({ ...form, hasCaption: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-blue-600"
            />
            <span>{tMod.enableCaption} (&lt;caption&gt;)</span>
          </label>

          {form.hasCaption && (
            <input
              type="text"
              value={form.captionText}
              onChange={(e) => onChange({ ...form, captionText: e.target.value })}
              placeholder={tMod.captionText}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 focus:border-blue-500 focus:outline-none"
            />
          )}

          <label className="flex items-center gap-2.5 font-medium text-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={form.stripedRows}
              onChange={(e) => onChange({ ...form, stripedRows: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-blue-600"
            />
            <span>{tMod.stripedRows}</span>
          </label>

          <label className="flex items-center gap-2.5 font-medium text-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={form.hoverHighlight}
              onChange={(e) => onChange({ ...form, hoverHighlight: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-blue-600"
            />
            <span>{tMod.hoverHighlight}</span>
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="mb-1 block font-semibold text-slate-700">
            {tMod.borderStyleLabel}
          </label>
          <select
            value={form.borderStyle}
            onChange={(e) =>
              onChange({
                ...form,
                borderStyle: e.target.value as TableProperties['borderStyle'],
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
            <option value="4px">4px</option>
            <option value="0px">0px</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block font-semibold text-slate-700">
            {tMod.borderCollapse}
          </label>
          <select
            value={form.borderCollapse}
            onChange={(e) =>
              onChange({
                ...form,
                borderCollapse: e.target.value as 'collapse' | 'separate',
              })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="collapse">{tMod.collapse}</option>
            <option value="separate">{tMod.separate}</option>
          </select>
        </div>
      </div>

      <ColorSwatchPicker
        label={tMod.borderColorLabel}
        value={form.borderColor}
        fallbackHex="#cbd5e1"
        onChange={(borderColor) => onChange({ ...form, borderColor })}
      />

      <ColorSwatchPicker
        label={tMod.backgroundColorLabel}
        value={form.backgroundColor}
        fallbackHex="#ffffff"
        placeholder="Transparent"
        allowClear
        onChange={(backgroundColor) => onChange({ ...form, backgroundColor })}
      />
    </div>
  );
};
