// Shared UI that makes clear Chief only displays what source systems expose,
// and that requests for more data go to the system's own team (via chat).
import { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';

// Chat link per source system. Placeholder until real chat links are available.
const SYSTEM_CHAT_URLS: Record<string, string> = {};
export const systemChatUrl = (systemName: string) => SYSTEM_CHAT_URLS[systemName.trim().toLowerCase()] ?? '#';

export const SOURCE_RESPONSIBILITY_TITLE = "צ'יף אינו אחראי על המידע ממערכות המקור";

/** Chat button for a single source system. `icon` = square icon-only, `button` = small labelled button. */
export function SystemChatButton({ systemName, variant = 'button' }: { systemName: string; variant?: 'icon' | 'button' }) {
  const label = `צ'אט עם צוות ${systemName}`;
  if (variant === 'icon') {
    return (
      <a href={systemChatUrl(systemName)} target="_blank" rel="noreferrer"
        title={label} aria-label={label}
        onMouseDown={e => e.stopPropagation()}
        className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors">
        <MessageCircle className="w-3.5 h-3.5" />
      </a>
    );
  }
  return (
    <a href={systemChatUrl(systemName)} target="_blank" rel="noreferrer"
      title={label}
      className="flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#1B3A6B]/15 bg-white text-[11px] font-semibold text-[#1B3A6B] hover:bg-[#EEF4FF] transition-colors">
      <MessageCircle className="w-3.5 h-3.5" />
      צ'אט
    </a>
  );
}

/** Full amber notice — used at the top of the document's source-systems dialog. */
export function SourceResponsibilityNotice() {
  return (
    <div className="flex gap-2.5 px-3.5 py-3 rounded-xl bg-amber-50 border border-amber-200">
      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
      <div className="flex flex-col gap-0.5">
        <p className="text-xs font-bold text-amber-900">{SOURCE_RESPONSIBILITY_TITLE}</p>
        <p className="text-[11px] leading-relaxed text-amber-800">
          הנגשת המידע, דיוקו והיקפו באחריות כל מערכת. במידה ו<b>חסר מידע</b> או שאתה צריך <b>מידע נוסף</b> מאותה מערכת, יש ללחוץ על כפתור הצ'אט שלה.
        </p>
      </div>
    </div>
  );
}

/** Collapsible amber strip — used in the template's source-fields panel and the import dialog. Chat buttons sit next to each system name. */
export function SourceResponsibilityStrip({ defaultOpen = true }: { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="flex-shrink-0 border-b border-amber-200 bg-amber-50">
      <button type="button" onClick={() => setOpen(o => !o)} aria-expanded={open}
        className="w-full flex items-center gap-2 px-5 py-2 text-right">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
        <span className="flex-1 text-[11px] font-bold text-amber-900">המידע באחריות מערכות המקור</span>
        {open ? <ChevronUp className="w-3.5 h-3.5 text-amber-700" /> : <ChevronDown className="w-3.5 h-3.5 text-amber-700" />}
      </button>
      {open && (
        <div className="px-5 pb-3 pr-[42px] flex flex-col gap-1.5">
          <p className="text-[11px] leading-relaxed text-amber-800">
            צ'יף מציג רק את מה שהמערכות מנגישות ואינו אחראי על התוכן.
            במידה ו<b>חסר מידע</b> או שאתה צריך <b>מידע נוסף</b> מאותה מערכת, יש ללחוץ על{' '}
            <MessageCircle className="w-3.5 h-3.5 inline-block align-[-3px]" aria-label="אייקון הצ'אט" />{' '}
            ליד שם המערכת.
          </p>
        </div>
      )}
    </div>
  );
}
