'use client';

import React from 'react';

interface HtmlSourceDialogProps {
  sourceCode: string;
  onChange: (html: string) => void;
}

export const HtmlSourceDialog: React.FC<HtmlSourceDialogProps> = ({
  sourceCode,
  onChange,
}) => {
  return (
    <div className="space-y-2">
      <p className="text-[11px] text-slate-500">
        Inspect or edit the semantic HTML below. Standard{' '}
        <code className="rounded bg-slate-100 px-1 py-0.5 text-slate-800">&lt;table&gt;</code>
        , <code className="rounded bg-slate-100 px-1 py-0.5 text-slate-800">colspan</code>,{' '}
        <code className="rounded bg-slate-100 px-1 py-0.5 text-slate-800">rowspan</code>, and
        inline styles are automatically preserved.
      </p>
      <textarea
        value={sourceCode}
        onChange={(e) => onChange(e.target.value)}
        rows={16}
        spellCheck={false}
        className="w-full rounded-xl border border-slate-300 bg-slate-950 p-3.5 font-mono text-xs leading-relaxed text-emerald-300 focus:border-blue-500 focus:outline-none"
      />
    </div>
  );
};

export function formatHTMLPretty(html: string): string {
  return html
    .replace(/></g, '>\n<')
    .replace(
      /(<\/?(?:table|thead|tbody|tfoot|tr|colgroup|p|ul|ol|div|h[1-6]|blockquote)[^>]*>)/gi,
      '\n$1\n'
    )
    .replace(/\n{2,}/g, '\n')
    .trim();
}
