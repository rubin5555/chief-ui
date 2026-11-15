'use client';

import React from 'react';
import { ActiveModalType } from '../types';
import { EditorTranslations } from '../i18n';

interface EditorStatusBarProps {
  breadcrumb: string[];
  activeTable: HTMLTableElement | null;
  selectedCellsCount: number;
  stats: { words: number; chars: number; tables: number };
  isFullscreen: boolean;
  editorHeight: number;
  isDraggingHeight: boolean;
  translations: EditorTranslations;
  onStartDragHeight: (startY: number) => void;
  onOpenModal: (modal: ActiveModalType) => void;
}

export const EditorStatusBar: React.FC<EditorStatusBarProps> = ({
  breadcrumb,
  activeTable,
  selectedCellsCount,
  stats,
  isFullscreen,
  editorHeight,
  isDraggingHeight,
  translations: t,
  onStartDragHeight,
  onOpenModal,
}) => {
  return (
    <div
      data-editor-chrome="true"
      className="relative flex flex-wrap items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-1.5 text-[11px] text-slate-500 select-none rounded-b-2xl"
    >
      {/* Interactive Element Path Breadcrumb */}
      <div className="flex items-center gap-1 font-mono">
        <span className="font-sans font-semibold text-slate-400 mr-1">
          {t.statusbar.path}:
        </span>
        {breadcrumb.map((item, idx) => (
          <React.Fragment key={`${item}-${idx}`}>
            {idx > 0 && <span className="text-slate-300">›</span>}
            <button
              type="button"
              onClick={() => {
                if (item === 'table' && activeTable) onOpenModal('table');
                else if (item.startsWith('tr') && activeTable) onOpenModal('row');
                else if ((item.startsWith('td') || item.startsWith('th')) && activeTable)
                  onOpenModal('cell');
              }}
              className="rounded px-1.5 py-0.5 text-slate-700 hover:bg-blue-100 hover:text-blue-700"
            >
              {item}
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* Center Bottom Drag Handle Pill for Resizing Editor Height */}
      {!isFullscreen && (
        <div
          title={t.statusbar.dragHeight}
          onMouseDown={(e) => {
            e.preventDefault();
            onStartDragHeight(e.clientY);
          }}
          className="hidden sm:flex cursor-ns-resize items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-0.5 text-[10px] font-semibold text-slate-400 shadow-2xs transition hover:border-blue-400 hover:text-blue-600"
        >
          <span>═══</span>
          {isDraggingHeight && (
            <span className="text-blue-600 font-bold">{editorHeight}px</span>
          )}
        </div>
      )}

      {/* Selection & Word/Table Counts */}
      <div className="flex items-center gap-4 pr-3">
        {selectedCellsCount > 1 && (
          <span className="rounded-full bg-blue-100 px-2 py-0.5 font-semibold text-blue-700">
            {selectedCellsCount} {t.statusbar.cellsSelected}
          </span>
        )}
        <span>
          <strong>{stats.tables}</strong>{' '}
          {stats.tables === 1 ? t.statusbar.table : t.statusbar.tables}
        </span>
        <span>
          <strong>{stats.words}</strong> {t.statusbar.words}
        </span>
        <span>
          <strong>{stats.chars}</strong> {t.statusbar.characters}
        </span>
      </div>

      {/* Bottom-Right Corner Drag Resize Grip + Full Bottom Edge Resizer */}
      {!isFullscreen && (
        <>
          <div
            title={t.statusbar.dragHeight}
            onMouseDown={(e) => {
              e.preventDefault();
              onStartDragHeight(e.clientY);
            }}
            className="absolute inset-x-0 -bottom-1 h-2.5 cursor-ns-resize hover:bg-blue-500/30 rounded-b-2xl transition-colors"
          />
          <div
            title={t.statusbar.dragHeight}
            onMouseDown={(e) => {
              e.preventDefault();
              onStartDragHeight(e.clientY);
            }}
            className="absolute right-1 bottom-0.5 flex h-5 w-5 cursor-ns-resize items-center justify-center text-xs text-slate-400 hover:text-blue-600"
          >
            ◢
          </div>
        </>
      )}
    </div>
  );
};
