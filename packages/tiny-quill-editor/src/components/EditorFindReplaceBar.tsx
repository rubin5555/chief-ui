'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { EditorTranslations } from '../i18n';

interface EditorFindReplaceBarProps {
  findQuery: string;
  setFindQuery: (v: string) => void;
  replaceQuery: string;
  setReplaceQuery: (v: string) => void;
  translations: EditorTranslations;
  onReplaceAll: () => void;
  onClose: () => void;
}

export const EditorFindReplaceBar: React.FC<EditorFindReplaceBarProps> = ({
  findQuery,
  setFindQuery,
  replaceQuery,
  setReplaceQuery,
  translations: t,
  onReplaceAll,
  onClose,
}) => {
  return (
    <div
      dir="rtl"
      data-editor-ribbon=""
      data-editor-chrome="true"
      data-testid="editor-ribbon-find-replace-panel"
      className="tiny-quill-root flex flex-wrap items-center gap-2 border-t border-slate-200 bg-slate-50 px-3 py-1.5 text-xs"
    >
      <Search className="h-3.5 w-3.5 text-slate-400" />
      <input
        type="text"
        data-testid="editor-ribbon-find-query"
        value={findQuery}
        onChange={(e) => setFindQuery(e.target.value)}
        placeholder={t.findReplace.findPlaceholder}
        className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 focus:border-blue-500 focus:outline-none"
      />
      <button
        type="button"
        onClick={() => {}}
        className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 font-medium text-slate-700 hover:bg-slate-100"
      >
        חפש
      </button>
      <input
        type="text"
        data-testid="editor-ribbon-replace-value"
        value={replaceQuery}
        onChange={(e) => setReplaceQuery(e.target.value)}
        placeholder={t.findReplace.replacePlaceholder}
        className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 focus:border-blue-500 focus:outline-none"
      />
      <button
        type="button"
        data-testid="editor-ribbon-replace-all"
        onClick={onReplaceAll}
        className="rounded-lg bg-blue-600 px-3 py-1 font-semibold text-white hover:bg-blue-700"
      >
        {t.findReplace.replaceAll}
      </button>
      <button
        type="button"
        onClick={onClose}
        className="ltr:ml-auto rtl:mr-auto rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};
