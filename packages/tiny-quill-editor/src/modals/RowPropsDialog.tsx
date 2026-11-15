'use client';

import React from 'react';
import { RowProperties } from '../types';
import { EditorTranslations } from '../i18n';
import { ColorSwatchPicker } from './ColorSwatchPicker';

interface RowPropsDialogProps {
  form: RowProperties;
  translations: EditorTranslations;
  onChange: (next: RowProperties) => void;
}

export const RowPropsDialog: React.FC<RowPropsDialogProps> = ({
  form,
  translations,
  onChange,
}) => {
  const tMod = translations.modals;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block font-semibold text-slate-700">{tMod.rowType}</label>
          <select
            value={form.rowType}
            onChange={(e) =>
              onChange({
                ...form,
                rowType: e.target.value as RowProperties['rowType'],
              })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="thead">{tMod.rowHeader}</option>
            <option value="tbody">{tMod.rowBody}</option>
            <option value="tfoot">{tMod.rowFooter}</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block font-semibold text-slate-700">
            {tMod.rowHeight}
          </label>
          <input
            type="text"
            value={form.height}
            onChange={(e) => onChange({ ...form, height: e.target.value })}
            placeholder="e.g. 48px"
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block font-semibold text-slate-700">
            {tMod.horizontalAlign}
          </label>
          <select
            value={form.hAlign}
            onChange={(e) =>
              onChange({
                ...form,
                hAlign: e.target.value as RowProperties['hAlign'],
              })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="">{tMod.alignNone}</option>
            <option value="left">{tMod.alignLeft}</option>
            <option value="center">{tMod.alignCenter}</option>
            <option value="right">{tMod.alignRight}</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block font-semibold text-slate-700">
            {tMod.verticalAlign}
          </label>
          <select
            value={form.vAlign}
            onChange={(e) =>
              onChange({
                ...form,
                vAlign: e.target.value as RowProperties['vAlign'],
              })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="">{tMod.alignNone}</option>
            <option value="top">{tMod.vTop}</option>
            <option value="middle">{tMod.vMiddle}</option>
            <option value="bottom">{tMod.vBottom}</option>
          </select>
        </div>
      </div>

      <ColorSwatchPicker
        label={tMod.backgroundColorLabel}
        value={form.backgroundColor}
        fallbackHex="#ffffff"
        placeholder="Default"
        allowClear
        onChange={(backgroundColor) => onChange({ ...form, backgroundColor })}
      />
    </div>
  );
};
