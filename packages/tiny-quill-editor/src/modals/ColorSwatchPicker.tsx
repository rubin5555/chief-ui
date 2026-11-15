'use client';

import React from 'react';

export const QUICK_COLORS = [
  '#ffffff',
  '#f8fafc',
  '#f1f5f9',
  '#e2e8f0',
  '#cbd5e1',
  '#1e293b',
  '#eff6ff',
  '#dbeafe',
  '#3b82f6',
  '#ecfdf5',
  '#d1fae5',
  '#10b981',
  '#fffbeb',
  '#fef3c7',
  '#f59e0b',
  '#fff1f2',
  '#ffe4e6',
  '#f43f5e',
];

interface ColorSwatchPickerProps {
  label: string;
  value: string;
  fallbackHex?: string;
  placeholder?: string;
  allowClear?: boolean;
  showFullPalette?: boolean;
  onChange: (nextColor: string) => void;
}

export const ColorSwatchPicker: React.FC<ColorSwatchPickerProps> = ({
  label,
  value,
  fallbackHex = '#ffffff',
  placeholder = '',
  allowClear = false,
  showFullPalette = false,
  onChange,
}) => {
  return (
    <div>
      <label className="mb-1.5 block font-semibold text-slate-700">{label}</label>
      <div className="flex items-center gap-2 mb-2">
        <input
          type="color"
          value={value || fallbackHex}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-10 cursor-pointer rounded border border-slate-300"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-36 rounded-lg border border-slate-300 px-3 py-1.5"
        />
        {allowClear && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="rounded border border-slate-300 px-2.5 py-1.5 text-slate-600 hover:bg-slate-100"
          >
            Clear
          </button>
        )}
        {!showFullPalette && (
          <div className="flex flex-wrap gap-1">
            {QUICK_COLORS.slice(0, 8).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onChange(c)}
                style={{ backgroundColor: c }}
                className="h-5 w-5 rounded border border-slate-300"
              />
            ))}
          </div>
        )}
      </div>
      {showFullPalette && (
        <div className="flex flex-wrap gap-1.5">
          {QUICK_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onChange(c)}
              style={{ backgroundColor: c }}
              className="h-5 w-5 rounded border border-slate-300 transition hover:scale-110"
            />
          ))}
        </div>
      )}
    </div>
  );
};
