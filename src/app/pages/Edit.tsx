import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TopNavbar } from '../components/TopNavbar';
import {
  ChevronLeft, ChevronRight, ChevronDown, Plus, RotateCcw,
  Undo2, Redo2,
  Bold, Italic, Underline, Strikethrough, Highlighter,
  AlignRight, AlignCenter, AlignLeft, AlignJustify,
  List, ListOrdered, Indent, Outdent,
  WrapText, Baseline,
  PilcrowRight, PilcrowLeft, Superscript, Paperclip,
  Table2, PaintBucket, PaintRoller, RemoveFormatting,
  MessageSquare, Send, X,
  MoreHorizontal, MoreVertical, UserCheck, Users, Eye, EyeOff, Lock, FileText, FileDown, FileSpreadsheet, BookOpen, Trash2, Pencil, Shield, Save,
  FolderPlus, FileInput, Lightbulb, Check,
  Search, SlidersHorizontal, ArrowRight, ArrowUp, ArrowDown, ArrowLeft,
  TableCellsMerge, TableCellsSplit, SplitSquareVertical, SplitSquareHorizontal, Settings, Settings2,
  Clock, CheckCircle2, AlertCircle, PenLine, Minus, GripHorizontal, Copy, MessageSquareOff, Loader2,
  CalendarDays,
} from 'lucide-react';
import type { EditDocInfo } from '../../App';

const CLASSIFIED_POOL = [
  { id: 'u1', name: 'אלון כהן',       idNumber: '123456789', env: 'סודי' },
  { id: 'u2', name: 'מיכל לוי',       idNumber: '234567890', env: 'סודי ביותר' },
  { id: 'u3', name: 'יוסי מזרחי',     idNumber: '345678901', env: 'סודי' },
  { id: 'u4', name: 'שרה גולדברג',    idNumber: '456789012', env: 'אמ"ן' },
  { id: 'u5', name: 'דוד פרץ',        idNumber: '567890123', env: 'סודי ביותר' },
  { id: 'u6', name: 'רות אברהם',      idNumber: '678901234', env: 'סודי' },
  { id: 'u7', name: 'נחום שפירא',     idNumber: '789012345', env: 'אמ"ן' },
  { id: 'u8', name: 'חנה כץ',         idNumber: '890123456', env: 'סודי ביותר' },
  { id: 'u9', name: 'אבי בן דוד',     idNumber: '901234567', env: 'סודי' },
  { id: 'u10', name: 'לילך רוזנברג',  idNumber: '012345678', env: 'אמ"ן' },
];

const SIGNATURE_TEMPLATES = [
  { id: 'sig-1', name: 'חתימת מאשר ראשי',      content: 'בברכה,\n\t\tשם מלא\n\t\tמאשר ראשי\n\t\tמדור' },
  { id: 'sig-2', name: 'חתימת מאשר משנה',       content: 'בברכה,\n\t\tשם מלא\n\t\tמאשר משנה\n\t\tענף' },
  { id: 'sig-3', name: 'חתימה להפצה כללית',    content: 'בברכה,\n\t\tשם מלא\n\t\tמדור\n\t\tענף' },
  { id: 'sig-4', name: 'חתימה אישית',           content: 'בברכה,\n\t\tשם מלא\n\t\tמדור\n\t\tענף' },
];

const SIG_PLACEHOLDER = 'בברכה,\n\t\tשם מלא\n\t\tמדור\n\t\tענף';

function Sep() {
  return <span style={{ width: 1, height: 18, background: '#d1d5db', margin: '0 4px', flexShrink: 0 }} />;
}

function TB({ title, children, active, onClick, disabled }: { title: string; children: React.ReactNode; active?: boolean; onClick?: () => void; disabled?: boolean }) {
  return (
    <button title={title} onClick={disabled ? undefined : onClick} disabled={disabled}
      className={`flex items-center justify-center rounded transition-colors flex-shrink-0 ${disabled ? 'text-gray-300 cursor-not-allowed' : active ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
      style={{ width: 26, height: 26, padding: 0 }}>
      {children}
    </button>
  );
}

function ColorSwatch({ title, color, textColor }: { title: string; color: string; textColor?: boolean }) {
  return (
    <button title={title}
      className="flex flex-col items-center justify-center rounded hover:bg-gray-100 transition-colors flex-shrink-0"
      style={{ width: 26, height: 26, padding: 0 }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: '#374151', lineHeight: 1 }}>{textColor ? 'A' : 'A'}</span>
      <span style={{ width: 14, height: 3, borderRadius: 1, background: color, marginTop: 1 }} />
    </button>
  );
}

type SectionAction = { label: string; Icon: React.ElementType; danger?: boolean } | { sep: true };
const SECTION_ACTIONS: SectionAction[] = [
  { label: 'מאשרי הסעיף',          Icon: UserCheck },
  { label: 'עורכי הסעיף',           Icon: Users },
  { sep: true },
  { label: 'הגדרה כסעיף ממודר',    Icon: Lock },
  { sep: true },
  { label: 'ייצוא ל-Word',          Icon: FileText },
  { label: 'ייצוא ל-Excel',         Icon: FileSpreadsheet },
  { sep: true },
  { label: 'מחיקת סעיף',            Icon: Trash2, danger: true },
];

const EMPHASIS_ACTIONS: SectionAction[] = [
  { label: 'מאשרי הסעיף',          Icon: UserCheck },
  { label: 'עורכי הסעיף',           Icon: Users },
  { sep: true },
  { label: 'הסתרת הדגשים',          Icon: EyeOff },
  { label: 'הגדרה כסעיף ממודר',    Icon: Lock },
  { sep: true },
  { label: 'ייצוא ל-Word',          Icon: FileText },
  { label: 'ייצוא ל-Excel',         Icon: FileSpreadsheet },
  { sep: true },
  { label: 'מחיקת סעיף',            Icon: Trash2, danger: true },
];

const EXPORT_LABELS = new Set(['ייצוא ל-Word', 'ייצוא ל-Excel']);

const SUPERSCRIPT_NUMS = ['¹','²','³','⁴','⁵','⁶','⁷','⁸','⁹','¹⁰','¹¹','¹²'];

const READ_ONLY_SECTION_ACTIONS: SectionAction[] = [
  { label: 'ייצוא ל-Word', Icon: FileText },
  { label: 'ייצוא ל-PDF',  Icon: FileDown },
];

function SectionMenu({ x, y, flipped, onClose, onAction, actions = SECTION_ACTIONS }: { x: number; y: number; flipped: boolean; onClose: () => void; onAction?: (label: string) => void; actions?: SectionAction[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [loadingExport, setLoadingExport] = useState<string | null>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [onClose]);

  return (
    <div ref={ref} className="fixed z-[99999]"
      style={flipped ? { bottom: y, left: x } : { top: y, left: x }}>
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 min-w-[200px]" dir="rtl">
        {actions.map((action, i) => {
          if ('sep' in action) return <div key={`sep-${i}`} className="my-1 border-t border-gray-100" />;
          const { label, Icon, danger } = action;
          const isExport = EXPORT_LABELS.has(label);
          const isLoading = loadingExport === label;
          return (
            <button key={label}
              onClick={() => {
                if (isExport) {
                  if (loadingExport) return;
                  setLoadingExport(label);
                  onAction?.(label);
                  setTimeout(() => { setLoadingExport(null); onClose(); }, 2000);
                } else {
                  onAction?.(label);
                  onClose();
                }
              }}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-right transition-colors hover:bg-gray-50 ${danger ? 'text-red-500' : 'text-gray-700'}`}>
              {isLoading
                ? <Loader2 className="w-4 h-4 flex-shrink-0 text-gray-400 animate-spin" />
                : <Icon className={`w-4 h-4 flex-shrink-0 ${danger ? 'text-red-400' : 'text-gray-400'}`} />}
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface DeletedSection {
  id: string;
  label: string;
  title: string;
  children?: { id: string; label: string; title: string }[];
}

const DELETED_SECTIONS: DeletedSection[] = [
  {
    id: 'p1', label: '3', title: 'נהלים ותהליכים',
    children: [
      { id: 'p1-1', label: '3.1', title: 'תהליך קבלת החלטות' },
      { id: 'p1-2', label: '3.2', title: 'אחריות ותפקידים' },
      { id: 'p1-3', label: '3.3', title: 'לוחות זמנים' },
    ],
  },
  { id: 'd1', label: '2.3', title: 'הגדרות נוספות' },
  { id: 'd3', label: '4.4', title: 'שלב ד׳ – סיום' },
  { id: 'd4', label: '1.3', title: 'הקשר היסטורי' },
];

function RestoreModal({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const countSelected = selected.size;

  const RestoreCircle = ({ checked }: { checked: boolean }) => (
    <div className={`flex-shrink-0 flex items-center justify-center rounded-full transition-all ${checked ? 'bg-[#1B3A6B]' : 'border-2 border-gray-300 bg-white'}`}
      style={{ width: 16, height: 16 }}>
      {checked && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[99998] flex items-center justify-center" style={{ background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(2px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{ width: '88vw', height: '82vh', maxWidth: 1200 }} dir="rtl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-base font-semibold text-gray-800">שחזור סעיפים</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden" dir="rtl">
          {/* Sidebar */}
          <div className="flex flex-col flex-shrink-0 overflow-hidden border-l border-gray-100" style={{ width: 260 }}>
            <div className="px-4 pt-4 pb-2 border-b border-gray-100 flex-shrink-0">
              <p className="text-sm font-semibold text-gray-800">סעיפים שנמחקו</p>
              <p className="text-xs text-gray-400 mt-0.5">לחץ לבחירה</p>
            </div>
            <div className="flex-1 overflow-y-auto py-1">
              {DELETED_SECTIONS.map(s => {
                const checked = selected.has(s.id);
                return (
                  <div key={s.id}>
                    <div onClick={() => toggleSelect(s.id)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 cursor-pointer transition-colors ${checked ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                      <RestoreCircle checked={checked} />
                      <div className="flex items-baseline gap-1.5 text-sm text-right flex-1">
                        <span className="font-bold text-gray-400 text-xs">{s.label}</span>
                        <span className={checked ? 'text-[#1B3A6B] font-medium' : 'text-gray-700'}>{s.title}</span>
                      </div>
                    </div>
                    {s.children?.map(child => {
                      const childChecked = selected.has(child.id);
                      return (
                        <div key={child.id} onClick={() => toggleSelect(child.id)}
                          className={`flex items-center gap-2.5 pr-8 pl-4 py-2 cursor-pointer transition-colors ${childChecked ? 'bg-blue-50' : checked ? 'bg-blue-50/40' : 'hover:bg-gray-50'}`}>
                          <RestoreCircle checked={childChecked} />
                          <div className="flex items-baseline gap-1.5 text-sm text-right flex-1">
                            <span className="font-semibold text-gray-400 text-xs">{child.label}</span>
                            <span className={childChecked ? 'text-[#1B3A6B] font-medium' : 'text-gray-500'}>{child.title}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
            <div className="px-4 py-3 border-t border-gray-100 flex-shrink-0">
              <button disabled={countSelected === 0} onClick={onClose}
                className="w-full py-2 rounded-full text-sm font-semibold transition-all"
                style={{ background: countSelected > 0 ? '#1B3A6B' : '#e5e7eb', color: countSelected > 0 ? '#fff' : '#9ca3af' }}>
                {countSelected > 1 ? `שחזר ${countSelected} סעיפים` : countSelected === 1 ? 'שחזר סעיף' : 'בחר סעיפים'}
              </button>
            </div>
          </div>

          {/* Preview content */}
          <div className="flex-1 overflow-y-auto px-10 py-8" dir="rtl"
            style={{ fontFamily: 'system-ui, sans-serif', color: '#1e293b', fontSize: 13, lineHeight: 1.7 }}>
            {DELETED_SECTIONS.map(s => {
              const checked = selected.has(s.id);
              return (
                <div key={s.id} className="group mb-6">
                  <div className={`rounded-xl transition-colors px-3 py-2 -mx-3 cursor-pointer ${checked ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                    onClick={() => toggleSelect(s.id)}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span style={{ color: '#1B3A6B', fontWeight: 700 }}>{s.label}.</span>
                      <span style={{ fontWeight: 600, color: '#374151', flex: 1 }}>{s.title}</span>
                      <div style={{ height: 1, background: '#e5e7eb', flex: 1 }} />
                      <div className={`flex-shrink-0 flex items-center justify-center rounded-full transition-all ${checked ? 'bg-[#1B3A6B]' : 'border-2 border-gray-300 bg-white opacity-0 group-hover:opacity-100'}`}
                        style={{ width: 16, height: 16 }}>
                        {checked && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                      </div>
                    </div>
                    {s.children?.map(child => (
                      <div key={child.id} style={{ paddingRight: 20, marginBottom: 4 }}>
                        <span style={{ color: '#1B3A6B', fontWeight: 600, marginLeft: 6 }}>{child.label}.</span>
                        <span style={{ color: '#6b7280' }}>{child.title}</span>
                      </div>
                    ))}
                    {!s.children && (
                      <p style={{ color: '#9ca3af', fontSize: 12, fontStyle: 'italic' }}>אין תוכן שמור לסעיף זה</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

const ADD_ACTIONS = [
  { label: 'יצירת נושא חדש',               Icon: FolderPlus },
  { label: 'הוספת נספחים',                  Icon: Paperclip },
  { label: 'יבוא סעיפים ממסמך אחר',         Icon: FileInput },
  { label: 'הוספת דגשים לכתיבת המסמך',     Icon: Lightbulb },
];

function AddMenu({ x, y, onClose, onAction }: {
  x: number; y: number; onClose: () => void; onAction: (label: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [onClose]);

  return (
    <div ref={ref} className="fixed z-[99999]" style={{ bottom: y, left: x }}>
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 min-w-[220px]" dir="rtl">
        {ADD_ACTIONS.map(({ label, Icon }) => (
          <button key={label} onClick={() => { onAction(label); onClose(); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-right text-gray-700 transition-colors hover:bg-gray-50">
            <Icon className="w-4 h-4 flex-shrink-0 text-gray-400" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function highlightTextInDoc(text: string) {
  if (!text) return;
  const sel = window.getSelection();
  if (!sel) return;
  sel.removeAllRanges();
  // Walk text nodes in the document body to find the text
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node: Text | null;
  while ((node = walker.nextNode() as Text | null)) {
    const idx = node.textContent?.indexOf(text) ?? -1;
    if (idx !== -1) {
      const range = document.createRange();
      range.setStart(node, idx);
      range.setEnd(node, idx + text.length);
      sel.addRange(range);
      node.parentElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      break;
    }
  }
}

type ChatMessage = { from: 'me' | 'them'; text: string; quote?: string };

function SectionChat({ title, anchorEl, onClose, messages, onSend, onMarkRead }: {
  title: string; anchorEl: HTMLElement; onClose: () => void;
  messages: ChatMessage[]; onSend: (msg: ChatMessage) => void; onMarkRead: () => void;
}) {
  const [msg, setMsg] = useState('');
  const [markerMode, setMarkerMode] = useState(false);
  const [quotedText, setQuotedText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { onMarkRead(); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // Capture text selection when marker mode is on
  useEffect(() => {
    if (!markerMode) return;
    const handleMouseUp = () => {
      const sel = window.getSelection();
      const text = sel?.toString().trim();
      if (text) {
        setQuotedText(text);
        setMarkerMode(false);
        sel?.removeAllRanges();
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    };
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [markerMode]);

  const send = () => {
    if (!msg.trim() && !quotedText) return;
    onSend({ from: 'me', text: msg.trim(), quote: quotedText || undefined });
    setMsg('');
    setQuotedText('');
  };

  // Arrow center is 19px from top of chat container (borderTop 10px + offset 9px)
  const ARROW_CENTER = 19;
  const getPos = () => {
    const r = anchorEl.getBoundingClientRect();
    const inView = r.bottom > 60 && r.top < window.innerHeight - 20;
    const arrowTarget = r.top + r.height / 2;
    const top = Math.max(ARROW_CENTER + 10, Math.min(arrowTarget - ARROW_CENTER, window.innerHeight - 320));
    return { top, inView };
  };
  const [pos, setPos] = useState(getPos);

  useEffect(() => {
    const update = () => setPos(getPos());
    const scrollEl = document.querySelector('main') ?? window;
    scrollEl.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    return () => {
      scrollEl.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [anchorEl]);

  if (!pos.inView) return null;

  return (
    <div style={{ position: 'fixed', left: 12, top: pos.top, width: 240, zIndex: 9999 }} dir="rtl">
      {/* Speech bubble tail — outer border */}
      <div style={{
        position: 'absolute', right: -11, top: 9,
        width: 0, height: 0,
        borderTop: '10px solid transparent',
        borderBottom: '10px solid transparent',
        borderLeft: '11px solid #e2e8f0',
        zIndex: 1,
      }} />
      {/* Speech bubble tail — inner fill matching header */}
      <div style={{
        position: 'absolute', right: -9, top: 10,
        width: 0, height: 0,
        borderTop: '9px solid transparent',
        borderBottom: '9px solid transparent',
        borderLeft: '10px solid #F8FAFC',
        zIndex: 2,
      }} />

      <div className="rounded-2xl border border-gray-200 bg-white flex flex-col overflow-hidden"
        style={{ maxHeight: 300, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', position: 'relative', zIndex: 3 }}>
      {/* Chat header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 flex-shrink-0"
        style={{ background: '#F8FAFC' }}>
        <span className="text-xs font-semibold text-gray-600 truncate max-w-[160px]">{title}</span>
        <button onClick={onClose} className="p-0.5 rounded hover:bg-gray-200 transition-colors text-gray-400">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5" style={{ minHeight: 80 }}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === 'me' ? 'justify-start' : 'justify-end'}`}>
            <div className={`text-xs rounded-xl max-w-[88%] overflow-hidden ${m.from === 'me' ? 'bg-[#1B3A6B] text-white' : 'bg-gray-100 text-gray-700'}`}>
              {m.quote && (
                <div
                  onClick={() => highlightTextInDoc(m.quote!)}
                  style={{
                    margin: '5px 5px 0 5px',
                    borderRadius: 7,
                    overflow: 'hidden',
                    background: '#ffffff',
                    borderRight: `3px solid ${m.from === 'me' ? '#93afd4' : '#1B3A6B'}`,
                    padding: '4px 7px 4px 7px',
                    cursor: 'pointer',
                  }}>
                  <div style={{ fontSize: 10, fontWeight: 700, marginBottom: 1,
                    color: m.from === 'me' ? '#1B3A6B' : '#1B3A6B' }}>
                    {m.from === 'me' ? 'את/ה' : 'שרי'}
                  </div>
                  <div style={{
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    overflow: 'hidden', fontSize: 10, lineHeight: 1.4,
                    color: '#374151',
                  }}>{m.quote}</div>
                </div>
              )}
              <div style={{ padding: m.quote ? '4px 10px 6px' : '6px 10px' }} className="whitespace-pre-wrap">{m.text}</div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Marker mode banner */}
      {markerMode && (
        <div className="flex items-center gap-2 px-3 py-1.5 border-t border-amber-100 flex-shrink-0"
          style={{ background: '#fffbeb' }}>
          <Highlighter className="w-3 h-3 text-amber-500 flex-shrink-0" />
          <span className="text-[10px] text-amber-700 flex-1">סמן טקסט במסמך...</span>
          <button onClick={() => setMarkerMode(false)} className="text-amber-400 hover:text-amber-600">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Quoted text strip */}
      {quotedText && (
        <div className="flex items-start gap-1.5 px-3 py-1.5 border-t border-gray-100 flex-shrink-0"
          style={{ background: '#f8fafc' }}>
          <div className="w-0.5 self-stretch rounded-full flex-shrink-0" style={{ background: '#1B3A6B' }} />
          <span className="text-[10px] text-gray-500 flex-1 line-clamp-2">{quotedText}</span>
          <button onClick={() => setQuotedText('')} className="text-gray-300 hover:text-gray-500 flex-shrink-0 mt-0.5">
            <X className="w-2.5 h-2.5" />
          </button>
        </div>
      )}

      {/* Input */}
      <div className="flex items-center gap-1.5 px-2 py-1.5 border-t border-gray-100 flex-shrink-0">
        <button onClick={send}
          className="p-1.5 rounded-lg transition-colors flex-shrink-0"
          style={{ background: '#1B3A6B', color: '#fff' }}>
          <Send className="w-3 h-3" style={{ transform: 'scaleX(-1)' }} />
        </button>
        <input ref={inputRef} value={msg} onChange={e => setMsg(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="הקלד הודעה..."
          className="flex-1 text-xs bg-transparent focus:outline-none text-right"
          dir="rtl" />
        <button
          onClick={() => { setMarkerMode(m => !m); setQuotedText(''); }}
          title="סמן טקסט"
          className={`p-1 rounded transition-colors flex-shrink-0 ${markerMode ? 'text-amber-500 bg-amber-50' : 'text-gray-300 hover:text-gray-500'}`}>
          <Highlighter className="w-3.5 h-3.5" />
        </button>
      </div>
      </div>
    </div>
  );
}

function DocHeaderField({
  label, value, onChange, placeholder, readOnly,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; readOnly?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', direction: 'rtl' }}>
      <span style={{ fontSize: 10, fontWeight: 700, color: '#1B3A6B', whiteSpace: 'nowrap', flexShrink: 0 }}>{label}</span>
      {readOnly ? (
        <span style={{ flex: 1, fontSize: 10, color: '#374151', padding: '1px 2px', minWidth: 0 }}>
          {value || placeholder || ''}
        </span>
      ) : (
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          dir="rtl"
          style={{
            flex: 1, fontSize: 10, color: '#374151', background: 'transparent',
            border: 'none', borderBottom: '1px solid #e5e7eb', outline: 'none',
            padding: '1px 2px', minWidth: 0,
          }}
          className="placeholder-gray-300 hover:border-gray-400 focus:border-[#1B3A6B] transition-colors"
        />
      )}
    </div>
  );
}

function DocHeader({ readOnly }: { readOnly?: boolean }) {
  const [from,     setFrom]     = useState('');
  const [tazach,   setTazach]   = useState('2026(06)221047');
  const [to,       setTo]       = useState('');
  const [location, setLocation] = useState('');
  const [ref,      setRef]      = useState('123456789098');

  return (
    <div style={{
      display: 'flex', alignItems: 'stretch',
      borderRadius: 12, border: '1px solid #e5e7eb',
      background: '#fafafa', padding: '22px 24px',
      marginBottom: '8mm', direction: 'rtl',
    }}>
      {/* Right — org logo */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 140 }}>
        <img src="/Chief.svg" alt="סמל הארגון" style={{ width: 130, height: 130, objectFit: 'contain' }} />
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Divider */}
      <div style={{ width: 1, background: '#e5e7eb', flexShrink: 0, marginLeft: 24 }} />

      {/* Left — single column of fields, pinned to left */}
      <div style={{ width: '55%', display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
        <DocHeaderField label="מאת :"            value={from}     onChange={setFrom}     placeholder="לוח הפצה"  readOnly={readOnly} />
        <DocHeaderField label='תז"ח :'           value={tazach}   onChange={setTazach}                            readOnly={readOnly} />
        <DocHeaderField label="אל :"             value={to}       onChange={setTo}       placeholder="לוח תפוצה"  readOnly={readOnly} />
        <DocHeaderField label="מיקום ההוצאה :"  value={location} onChange={setLocation} placeholder="לוח הפצה"  readOnly={readOnly} />
        <DocHeaderField label="מס׳ סימוכין :"   value={ref}      onChange={setRef}                               readOnly={readOnly} />
      </div>
    </div>
  );
}

// ── Color utilities ──────────────────────────────────────────────────
function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  s /= 100; v /= 100;
  const i = Math.floor(h / 60) % 6, f = h / 60 - Math.floor(h / 60);
  const p = v*(1-s), q = v*(1-f*s), t = v*(1-(1-f)*s);
  const m = [[v,t,p],[q,v,p],[p,v,t],[p,q,v],[t,p,v],[v,p,q]][i];
  return [Math.round(m[0]*255), Math.round(m[1]*255), Math.round(m[2]*255)];
}
function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b), d = max - min;
  let h = 0;
  if (d) { if (max===r) h=((g-b)/d+6)%6; else if (max===g) h=(b-r)/d+2; else h=(r-g)/d+4; h*=60; }
  return [h, max ? d/max*100 : 0, max*100];
}
function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r,g,b].map(x => x.toString(16).padStart(2,'0')).join('');
}
function hexToRgb(hex: string): [number,number,number] | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? [parseInt(m[1],16), parseInt(m[2],16), parseInt(m[3],16)] : null;
}

function CustomColorPicker({ initialColor, onConfirm, onCancel, pos }: {
  initialColor: string;
  onConfirm: (color: string) => void;
  onCancel: () => void;
  pos: { top: number; right: number };
}) {
  const initRgb = hexToRgb(initialColor) ?? [0, 0, 0];
  const [hue, setHue_] = useState(() => rgbToHsv(...initRgb as [number,number,number])[0]);
  const [sat, setSat_] = useState(() => rgbToHsv(...initRgb as [number,number,number])[1]);
  const [val, setVal_] = useState(() => rgbToHsv(...initRgb as [number,number,number])[2]);
  const [rgb, setRgb] = useState<[number,number,number]>(initRgb as [number,number,number]);
  const [hexInput, setHexInput] = useState(initialColor.replace('#',''));
  const canvasRef = useRef<HTMLDivElement>(null);
  const hueBarRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ hue, sat, val });
  stateRef.current = { hue, sat, val };

  const update = (h: number, s: number, v: number) => {
    setHue_(h); setSat_(s); setVal_(v);
    const [r,g,b] = hsvToRgb(h, s, v);
    setRgb([r,g,b]);
    setHexInput(rgbToHex(r,g,b).replace('#',''));
  };
  const updateFromRgb = (r: number, g: number, b: number) => {
    const [h,s,v] = rgbToHsv(r,g,b);
    setHue_(h); setSat_(s); setVal_(v); setRgb([r,g,b]);
    setHexInput(rgbToHex(r,g,b).replace('#',''));
  };

  const startCanvasDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    const move = (ev: MouseEvent | React.MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (ev.clientY - rect.top) / rect.height));
      update(stateRef.current.hue, x * 100, (1 - y) * 100);
    };
    move(e);
    const up = () => { document.removeEventListener('mousemove', move as EventListener); document.removeEventListener('mouseup', up); };
    document.addEventListener('mousemove', move as EventListener);
    document.addEventListener('mouseup', up);
  };

  const startHueDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    const move = (ev: MouseEvent | React.MouseEvent) => {
      if (!hueBarRef.current) return;
      const rect = hueBarRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
      update(x * 360, stateRef.current.sat, stateRef.current.val);
    };
    move(e);
    const up = () => { document.removeEventListener('mousemove', move as EventListener); document.removeEventListener('mouseup', up); };
    document.addEventListener('mousemove', move as EventListener);
    document.addEventListener('mouseup', up);
  };

  const pureHex = rgbToHex(...hsvToRgb(hue, 100, 100));
  const currentHex = '#' + hexInput;

  return (
    <div style={{
      position: 'fixed', top: pos.top, right: pos.right, zIndex: 99999,
      background: 'white', borderRadius: 16,
      boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
      border: '1px solid #e5e7eb', padding: 14,
      width: 272, direction: 'rtl',
    }}>
      {/* Gradient canvas */}
      <div ref={canvasRef} onMouseDown={startCanvasDrag}
        style={{
          width: '100%', height: 180, borderRadius: 8,
          background: `linear-gradient(to right, #fff, ${pureHex})`,
          position: 'relative', cursor: 'crosshair', marginBottom: 10, userSelect: 'none',
        }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 8, background: 'linear-gradient(to bottom, transparent, #000)' }} />
        <div style={{
          position: 'absolute', left: `${sat}%`, top: `${100 - val}%`,
          transform: 'translate(-50%, -50%)',
          width: 14, height: 14, borderRadius: '50%',
          border: '2.5px solid white', boxShadow: '0 0 0 1px rgba(0,0,0,0.3)',
          pointerEvents: 'none', background: currentHex,
        }} />
      </div>

      {/* Hue slider + preview */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, direction: 'ltr' }}>
        <div ref={hueBarRef} onMouseDown={startHueDrag}
          style={{
            flex: 1, height: 14, borderRadius: 8, cursor: 'pointer', position: 'relative', userSelect: 'none',
            background: 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)',
          }}>
          <div style={{
            position: 'absolute', left: `${hue / 360 * 100}%`, top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 18, height: 18, borderRadius: '50%',
            border: '2.5px solid white', boxShadow: '0 0 0 1px rgba(0,0,0,0.25)',
            background: pureHex, pointerEvents: 'none',
          }} />
        </div>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: currentHex, border: '1.5px solid #e5e7eb', flexShrink: 0 }} />
      </div>

      {/* Inputs */}
      <div style={{ display: 'flex', gap: 5, marginBottom: 12, direction: 'ltr' }}>
        <div style={{ flex: 2 }}>
          <div style={{ fontSize: 10, color: '#9ca3af', textAlign: 'center', marginBottom: 3 }}>הקסדצימלי</div>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: 6, paddingRight: 5 }}>
            <span style={{ fontSize: 11, color: '#9ca3af' }}>#</span>
            <input value={hexInput}
              onChange={e => {
                const v = e.target.value.replace(/[^a-fA-F0-9]/g,'').slice(0,6);
                setHexInput(v);
                if (v.length === 6) { const rgb = hexToRgb('#'+v); if (rgb) updateFromRgb(...rgb); }
              }}
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: 11, padding: '5px 3px', width: 0 }} />
          </div>
        </div>
        {([['א', 0], ['י', 1], ['B', 2]] as [string, number][]).map(([label, idx]) => (
          <div key={label} style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: '#9ca3af', textAlign: 'center', marginBottom: 3 }}>{label}</div>
            <input type="text" inputMode="numeric" value={rgb[idx]}
              onChange={e => { const v = Math.max(0,Math.min(255,+e.target.value.replace(/\D/g,'')||0)); const nr=[...rgb] as [number,number,number]; nr[idx]=v; updateFromRgb(...nr); }}
              style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 6, padding: '5px 3px', fontSize: 11, textAlign: 'center', outline: 'none' }} />
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onCancel}
          style={{ flex: 1, padding: '8px 0', borderRadius: 10, fontSize: 13, fontWeight: 600, background: 'white', border: '1px solid #e5e7eb', color: '#374151', cursor: 'pointer' }}>
          ביטול
        </button>
        <button onClick={() => onConfirm(currentHex)}
          style={{ flex: 1, padding: '8px 0', borderRadius: 10, fontSize: 13, fontWeight: 600, background: '#1B3A6B', color: 'white', border: 'none', cursor: 'pointer' }}>
          אישור
        </button>
      </div>
    </div>
  );
}

const TEXT_COLORS = [
  '#000000', '#374151', '#dc2626', '#f97316',
  '#f59e0b', '#16a34a', '#2563eb', '#1B3A6B',
  '#7c3aed', '#db2777', '#6b7280', '#ffffff',
];

const HIGHLIGHT_COLORS = [
  '#fde047', '#86efac', '#fdba74', '#f9a8d4',
  '#93c5fd', '#c4b5fd', '#6ee7b7', '#fca5a5',
  '#e5e7eb', '#fef08a', '#bfdbfe', '#ffffff',
];

// ── Table toolbar button helper ───────────────────────────────────────────
function TBT({ title, onClick, children, danger }: { title: string; onClick?: () => void; children: React.ReactNode; danger?: boolean }) {
  return (
    <button title={title} onClick={onClick}
      className={`flex items-center justify-center rounded transition-colors flex-shrink-0 ${danger ? 'text-red-400 hover:bg-red-50 hover:text-red-600' : 'text-gray-600 hover:bg-gray-100'}`}
      style={{ width: 26, height: 26, padding: 0 }}>
      {children}
    </button>
  );
}

function TSep() { return <div style={{ width: 1, height: 16, background: '#e5e7eb', flexShrink: 0, margin: '0 2px' }} />; }

type SectionTable = { rows: number; cols: number; cells: string[][] };

type CellProps = { width: string; height: string; type: string; scope: string; hAlign: string; vAlign: string };
type TableProps = { width: string; height: string; cellSpacing: string; cellPadding: string; borderWidth: string; showCaption: boolean; align: string };

const CELL_PROPS_DEFAULT: CellProps = { width: '', height: '', type: 'td', scope: '', hAlign: '', vAlign: '' };
const TABLE_PROPS_DEFAULT: TableProps = { width: '', height: '', cellSpacing: '0', cellPadding: '4', borderWidth: '1', showCaption: false, align: '' };

const INP = "w-full border border-gray-300 rounded-xl bg-white text-xs px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30 hover:border-gray-400 transition-colors text-right text-gray-700";
const SEL = INP + " cursor-pointer appearance-none";

function PF({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3" dir="rtl">
      <span className="text-xs text-gray-500 flex-shrink-0 text-right" style={{ minWidth: 120 }}>{label}</span>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function PropsPanel({ openPanel, cellDraft, setCellDraft, tableDraft, setTableDraft, onSave, onCancel }: {
  openPanel: 'cell' | 'table';
  cellDraft: CellProps; setCellDraft: React.Dispatch<React.SetStateAction<CellProps>>;
  tableDraft: TableProps; setTableDraft: React.Dispatch<React.SetStateAction<TableProps>>;
  onSave: () => void; onCancel: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xl flex flex-col gap-2.5 relative"
      style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 380, zIndex: 9991, padding: '20px', direction: 'rtl' }}>
      {/* X close button — top left */}
      <button onClick={onCancel}
        className="absolute top-3.5 left-4 text-gray-400 hover:text-gray-600 transition-colors"
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
        <X className="w-4 h-4" />
      </button>
      <p className="text-sm font-semibold text-gray-800 pb-2.5 border-b border-gray-100">
        {openPanel === 'cell' ? 'מאפייני תא' : 'מאפייני טבלה'}
      </p>

      {openPanel === 'cell' ? (
        <div className="flex flex-col gap-2.5">
          <PF label="רוחב"><input className={INP} value={cellDraft.width} onChange={e => setCellDraft(d => ({ ...d, width: e.target.value }))} dir="rtl" placeholder="px או %" /></PF>
          <PF label="גובה"><input className={INP} value={cellDraft.height} onChange={e => setCellDraft(d => ({ ...d, height: e.target.value }))} dir="rtl" placeholder="px" /></PF>
          <PF label="סוג תא">
            <select className={SEL} value={cellDraft.type} onChange={e => setCellDraft(d => ({ ...d, type: e.target.value }))} dir="rtl">
              <option value="td">תא</option>
              <option value="th">כותרת לתא</option>
            </select>
          </PF>
          <PF label="היקף">
            <select className={SEL} value={cellDraft.scope} onChange={e => setCellDraft(d => ({ ...d, scope: e.target.value }))} dir="rtl">
              <option value="">ללא</option>
              <option value="row">שורה</option>
              <option value="col">עמודה</option>
              <option value="rowgroup">קיבוץ שורות</option>
              <option value="colgroup">קיבוץ עמודות</option>
            </select>
          </PF>
          <PF label="יישור אופקי">
            <select className={SEL} value={cellDraft.hAlign} onChange={e => setCellDraft(d => ({ ...d, hAlign: e.target.value }))} dir="rtl">
              <option value="">ללא</option>
              <option value="right">ימין</option>
              <option value="left">שמאל</option>
              <option value="center">מרכז</option>
            </select>
          </PF>
          <PF label="יישור אנכי">
            <select className={SEL} value={cellDraft.vAlign} onChange={e => setCellDraft(d => ({ ...d, vAlign: e.target.value }))} dir="rtl">
              <option value="">ללא</option>
              <option value="top">עליון</option>
              <option value="middle">אמצע</option>
              <option value="bottom">תחתון</option>
            </select>
          </PF>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          <PF label="רוחב"><input className={INP} value={tableDraft.width} onChange={e => setTableDraft(d => ({ ...d, width: e.target.value }))} dir="rtl" placeholder="px או %" /></PF>
          <PF label="גובה"><input className={INP} value={tableDraft.height} onChange={e => setTableDraft(d => ({ ...d, height: e.target.value }))} dir="rtl" placeholder="px" /></PF>
          <PF label="שוליים חיצוניים לתא"><input className={INP} value={tableDraft.cellSpacing} onChange={e => setTableDraft(d => ({ ...d, cellSpacing: e.target.value }))} dir="rtl" placeholder="px" /></PF>
          <PF label="שוליים פנימיים לתא"><input className={INP} value={tableDraft.cellPadding} onChange={e => setTableDraft(d => ({ ...d, cellPadding: e.target.value }))} dir="rtl" placeholder="px" /></PF>
          <PF label="רוחב גבול"><input className={INP} value={tableDraft.borderWidth} onChange={e => setTableDraft(d => ({ ...d, borderWidth: e.target.value }))} dir="rtl" placeholder="px" /></PF>
          <PF label="הצג כתוביות">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTableDraft(d => ({ ...d, showCaption: !d.showCaption }))}
                style={{
                  width: 36, height: 20, borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: tableDraft.showCaption ? '#1B3A6B' : '#d1d5db',
                  position: 'relative', flexShrink: 0, transition: 'background 0.2s',
                }}>
                <div style={{
                  position: 'absolute', top: 2, width: 16, height: 16, borderRadius: 8, background: 'white',
                  transition: 'right 0.2s, left 0.2s',
                  right: tableDraft.showCaption ? 2 : undefined,
                  left: tableDraft.showCaption ? undefined : 2,
                }} />
              </button>
              <span className="text-xs text-gray-500">{tableDraft.showCaption ? 'מופעל' : 'כבוי'}</span>
            </div>
          </PF>
          <PF label="יישור">
            <select className={SEL} value={tableDraft.align} onChange={e => setTableDraft(d => ({ ...d, align: e.target.value }))} dir="rtl">
              <option value="">ללא</option>
              <option value="right">ימין</option>
              <option value="left">שמאל</option>
              <option value="center">מרכז</option>
            </select>
          </PF>
        </div>
      )}

      <div className="flex items-center pt-2.5 border-t border-gray-100 mt-1" style={{ justifyContent: 'space-between' }}>
        <button onClick={onCancel}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
          ביטול
        </button>
        <button onClick={onSave}
          className="px-5 py-1.5 rounded-xl text-xs font-semibold bg-[#1B3A6B] text-white hover:bg-[#152e54] transition-colors">
          שמור
        </button>
      </div>
    </div>
  );
}


function SectionTableView({
  sectionId, table, activeCell,
  onFocusCell, onBlurCell, onCellChange,
  onInsertRowBefore, onInsertRowAfter, onDeleteRow,
  onInsertColBefore, onInsertColAfter, onDeleteCol,
  onDeleteTable,
}: {
  sectionId: string;
  table: SectionTable;
  activeCell: { sectionId: string; row: number; col: number } | null;
  onFocusCell: (r: number, c: number) => void;
  onBlurCell: () => void;
  onCellChange: (r: number, c: number, v: string) => void;
  onInsertRowBefore: (r: number) => void;
  onInsertRowAfter: (r: number) => void;
  onDeleteRow: (r: number) => void;
  onInsertColBefore: (c: number) => void;
  onInsertColAfter: (c: number) => void;
  onDeleteCol: (c: number) => void;
  onDeleteTable: () => void;
}) {
  const tableRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [toolbarPos, setToolbarPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const [openPanel, setOpenPanel] = useState<'cell' | 'table' | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [cellDraft, setCellDraft] = useState<CellProps>(CELL_PROPS_DEFAULT);
  const [tableDraft, setTableDraft] = useState<TableProps>(TABLE_PROPS_DEFAULT);
  const [cellProps, setCellProps] = useState<CellProps>(CELL_PROPS_DEFAULT);
  const [tableProps, setTableProps] = useState<TableProps>(TABLE_PROPS_DEFAULT);
  const r = activeCell?.row ?? 0;
  const c = activeCell?.col ?? 0;

  useEffect(() => {
    if (!activeCell || !tableRef.current) { setToolbarPos(null); return; }
    const updatePos = () => {
      if (!tableRef.current) return;
      const rect = tableRef.current.getBoundingClientRect();
      setToolbarPos({ top: rect.bottom + 6, left: rect.left, width: rect.width });
    };
    updatePos();
    window.addEventListener('scroll', updatePos, true);
    window.addEventListener('resize', updatePos);
    return () => { window.removeEventListener('scroll', updatePos, true); window.removeEventListener('resize', updatePos); };
  }, [activeCell]);

  return (
    <div>
      <div ref={tableRef} style={{ overflowX: 'auto', direction: 'rtl', padding: '0 8px 8px' }}>
        <table style={{ borderCollapse: 'collapse', minWidth: '100%', fontSize: 11, direction: 'rtl' }}>
          <tbody>
            {table.cells.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci}
                    style={{
                      border: `1px solid ${activeCell?.row === ri && activeCell?.col === ci ? '#3b82f6' : '#d1d5db'}`,
                      padding: 0,
                      minWidth: 60,
                      background: activeCell?.row === ri && activeCell?.col === ci ? '#eff6ff' : 'white',
                    }}>
                    <textarea
                      value={cell}
                      onChange={e => onCellChange(ri, ci, e.target.value)}
                      onFocus={() => onFocusCell(ri, ci)}
                      dir="rtl"
                      rows={1}
                      style={{
                        width: '100%', minWidth: 60, padding: '4px 6px', fontSize: 11,
                        border: 'none', outline: 'none', resize: 'none', background: 'transparent',
                        fontFamily: 'inherit', lineHeight: 1.6, overflow: 'hidden', display: 'block',
                      }}
                      ref={el => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }}
                      onInput={e => { const t = e.target as HTMLTextAreaElement; t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table toolbar — fixed below the table, visible even for large tables */}
      {activeCell && toolbarPos && typeof document !== 'undefined' && (
        <div
          ref={toolbarRef}
          onMouseDown={e => e.preventDefault()}
          style={{
            position: 'fixed',
            top: Math.min(toolbarPos.top, window.innerHeight - 50),
            left: toolbarPos.left,
            width: toolbarPos.width,
            zIndex: 9990,
            background: 'white',
            borderRadius: 10,
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            border: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            padding: '2px 6px',
            gap: 1,
            flexWrap: 'wrap',
            direction: 'rtl',
          }}>
          {/* Arrow pointing up to table */}
          <div style={{ position: 'absolute', top: -6, right: 16, width: 10, height: 6, overflow: 'hidden' }}>
            <div style={{ width: 10, height: 10, background: 'white', border: '1px solid #e5e7eb', transform: 'rotate(45deg)', transformOrigin: 'bottom left', marginTop: 3 }} />
          </div>

          {/* Row operations */}
          <TBT title="הוסף שורה מעל" onClick={() => onInsertRowBefore(r)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeLinecap="round">
              <line x1="7" y1="1" x2="7" y2="4.5" strokeWidth="1.4"/><line x1="5" y1="2.75" x2="9" y2="2.75" strokeWidth="1.4"/>
              <rect x="1.5" y="6" width="11" height="7.5" rx="0.5" strokeWidth="1.1"/>
              <line x1="1.5" y1="9.75" x2="12.5" y2="9.75" strokeWidth="1"/>
              <line x1="7" y1="6" x2="7" y2="13.5" strokeWidth="0.9"/>
            </svg>
          </TBT>
          <TBT title="הוסף שורה מתחת" onClick={() => onInsertRowAfter(r)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeLinecap="round">
              <rect x="1.5" y="0.5" width="11" height="7.5" rx="0.5" strokeWidth="1.1"/>
              <line x1="1.5" y1="4.25" x2="12.5" y2="4.25" strokeWidth="1"/>
              <line x1="7" y1="0.5" x2="7" y2="8" strokeWidth="0.9"/>
              <line x1="7" y1="9.5" x2="7" y2="13" strokeWidth="1.4"/><line x1="5" y1="11.25" x2="9" y2="11.25" strokeWidth="1.4"/>
            </svg>
          </TBT>
          <TBT title="מחק שורה" danger onClick={() => onDeleteRow(r)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeLinecap="round">
              <rect x="1.5" y="1" width="11" height="12" rx="0.5" strokeWidth="1.1"/>
              <line x1="1.5" y1="5" x2="12.5" y2="5" strokeWidth="1"/>
              <line x1="1.5" y1="9" x2="12.5" y2="9" strokeWidth="1"/>
              <line x1="4.5" y1="5.8" x2="9.5" y2="8.2" strokeWidth="1.3"/><line x1="9.5" y1="5.8" x2="4.5" y2="8.2" strokeWidth="1.3"/>
            </svg>
          </TBT>
          <TSep />
          {/* Column operations */}
          <TBT title="הוסף עמודה לפני" onClick={() => onInsertColBefore(c)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeLinecap="round">
              <line x1="10.25" y1="7" x2="13.5" y2="7" strokeWidth="1.4"/><line x1="11.875" y1="5.2" x2="11.875" y2="8.8" strokeWidth="1.4"/>
              <rect x="0.5" y="1.5" width="7.5" height="11" rx="0.5" strokeWidth="1.1"/>
              <line x1="4.25" y1="1.5" x2="4.25" y2="12.5" strokeWidth="1"/>
              <line x1="0.5" y1="7" x2="8" y2="7" strokeWidth="0.9"/>
            </svg>
          </TBT>
          <TBT title="הוסף עמודה אחרי" onClick={() => onInsertColAfter(c)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeLinecap="round">
              <rect x="6" y="1.5" width="7.5" height="11" rx="0.5" strokeWidth="1.1"/>
              <line x1="9.75" y1="1.5" x2="9.75" y2="12.5" strokeWidth="1"/>
              <line x1="6" y1="7" x2="13.5" y2="7" strokeWidth="0.9"/>
              <line x1="0.5" y1="7" x2="3.8" y2="7" strokeWidth="1.4"/><line x1="2.15" y1="5.2" x2="2.15" y2="8.8" strokeWidth="1.4"/>
            </svg>
          </TBT>
          <TBT title="מחק עמודה" danger onClick={() => onDeleteCol(c)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeLinecap="round">
              <rect x="1" y="1.5" width="12" height="11" rx="0.5" strokeWidth="1.1"/>
              <line x1="5" y1="1.5" x2="5" y2="12.5" strokeWidth="1"/>
              <line x1="9" y1="1.5" x2="9" y2="12.5" strokeWidth="1"/>
              <line x1="5.8" y1="4.5" x2="8.2" y2="9.5" strokeWidth="1.3"/><line x1="8.2" y1="4.5" x2="5.8" y2="9.5" strokeWidth="1.3"/>
            </svg>
          </TBT>
          <TSep />
          <TBT title="מזג תאים"><TableCellsMerge className="w-3.5 h-3.5" /></TBT>
          <TBT title="פצל תא"><TableCellsSplit className="w-3.5 h-3.5" /></TBT>
          <TBT title="פצל תא אנכית"><SplitSquareVertical className="w-3.5 h-3.5" /></TBT>
          <TBT title="פצל תא אופקית"><SplitSquareHorizontal className="w-3.5 h-3.5" /></TBT>
          <TSep />
          <TBT title="שבירת מילים בטבלה"><WrapText className="w-3.5 h-3.5" /></TBT>
          <TBT title="מאפייני תא" onClick={() => { setCellDraft(cellProps); setOpenPanel(p => p === 'cell' ? null : 'cell'); }}><Settings className="w-3.5 h-3.5" /></TBT>
          <TBT title="מאפייני טבלה" onClick={() => { setTableDraft(tableProps); setOpenPanel(p => p === 'table' ? null : 'table'); }}><Settings2 className="w-3.5 h-3.5" /></TBT>
          <TSep />
          <TBT title="מחק טבלה" danger onClick={() => setConfirmDeleteOpen(true)}><Trash2 className="w-3.5 h-3.5" /></TBT>
        </div>
      )}

      {/* Backdrop */}
      {activeCell && openPanel && (
        <div onClick={() => setOpenPanel(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 9990, background: 'rgba(0,0,0,0.18)' }} />
      )}

      {/* Cell / Table properties modal */}
      {activeCell && openPanel && <PropsPanel
        openPanel={openPanel}
        cellDraft={cellDraft} setCellDraft={setCellDraft}
        tableDraft={tableDraft} setTableDraft={setTableDraft}
        onSave={() => {
          if (openPanel === 'cell') setCellProps(cellDraft);
          else setTableProps(tableDraft);
          setOpenPanel(null);
        }}
        onCancel={() => setOpenPanel(null)}
      />}

      {/* Delete table confirmation */}
      {confirmDeleteOpen && (
        <div onClick={() => setConfirmDeleteOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 9990, background: 'rgba(0,0,0,0.18)' }} />
      )}
      {confirmDeleteOpen && (
        <div className="bg-white rounded-2xl shadow-xl flex flex-col items-center gap-3"
          style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 320, zIndex: 9991, padding: '28px 24px', direction: 'rtl' }}>
          <p className="text-sm font-semibold text-gray-800 text-center">האם אתה בטוח שברצונך למחוק?</p>
          <p className="text-xs text-gray-400 text-center">פעולה זו אינה ניתנת לביטול</p>
          <div className="flex gap-3 w-full mt-1">
            <button onClick={() => setConfirmDeleteOpen(false)}
              className="flex-1 py-2 rounded-2xl text-sm font-semibold border border-gray-200 text-gray-700 hover:border-gray-300 transition-colors bg-white">
              ביטול
            </button>
            <button
              onClick={() => { onDeleteTable(); setConfirmDeleteOpen(false); }}
              className="flex-1 py-2 rounded-2xl text-sm font-semibold bg-[#1B3A6B] text-white hover:bg-[#152e54] transition-colors">
              אישור
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DocToolbar() {
  const [indentLevel, setIndentLevel] = useState(0);
  const [tablePickerOpen, setTablePickerOpen] = useState(false);
  const [tablePickerPos, setTablePickerPos] = useState<{ top: number; left: number } | null>(null);
  const [tableHover, setTableHover] = useState<{ cols: number; rows: number } | null>(null);
  const tableBtnRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  const [textColor, setTextColor] = useState('#000000');
  const [colorPickerPos, setColorPickerPos] = useState<{ top: number; right: number } | null>(null);
  const [customPickerPos, setCustomPickerPos] = useState<{ top: number; right: number } | null>(null);
  const colorRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<HTMLButtonElement>(null);

  const [highlightColor, setHighlightColor] = useState('#fde047');
  const [hlPickerPos, setHlPickerPos] = useState<{ top: number; right: number } | null>(null);
  const [customHlPickerPos, setCustomHlPickerPos] = useState<{ top: number; right: number } | null>(null);
  const hlRef = useRef<HTMLDivElement>(null);
  const hlChevronRef = useRef<HTMLButtonElement>(null);

  const [brushActive, setBrushActive] = useState(false);
  const [findReplaceOpen, setFindReplaceOpen] = useState(false);
  const [findReplacePos, setFindReplacePos] = useState<{ top: number; left: number } | null>(null);
  const findReplaceBtnRef = useRef<HTMLButtonElement>(null);
  const [findQuery, setFindQuery]   = useState('');
  const [replaceText, setReplaceText] = useState('');
  const findReplaceRef = useRef<HTMLDivElement>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarPos, setCalendarPos] = useState<{ top: number; left: number } | null>(null);
  const calendarBtnRef = useRef<HTMLButtonElement>(null);
  const [calendarValue, setCalendarValue] = useState('');
  // calendar view state
  const today = new Date();
  const [calViewYear,  setCalViewYear]  = useState(today.getFullYear());
  const [calViewMonth, setCalViewMonth] = useState(today.getMonth());
  const [calSelYear,   setCalSelYear]   = useState<number|null>(null);
  const [calSelMonth,  setCalSelMonth]  = useState<number|null>(null);
  const [calSelDay,    setCalSelDay]    = useState<number|null>(null);
  const [calTime,      setCalTime]      = useState(() => { const n = new Date(); return `${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`; });
  const HE_MONTHS_CAL = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
  const HE_DAYS_CAL   = ['א׳','ב׳','ג׳','ד׳','ה׳','ו׳','ש׳'];

  const [fillColor, setFillColor] = useState('#ffffff');
  const [fillPickerPos, setFillPickerPos] = useState<{ top: number; right: number } | null>(null);
  const [customFillPickerPos, setCustomFillPickerPos] = useState<{ top: number; right: number } | null>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const fillChevronRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (colorRef.current && !colorRef.current.contains(e.target as Node) &&
          chevronRef.current && !chevronRef.current.contains(e.target as Node)) {
        setColorPickerPos(null);
        setCustomPickerPos(null);
      }
      if (hlRef.current && !hlRef.current.contains(e.target as Node) &&
          hlChevronRef.current && !hlChevronRef.current.contains(e.target as Node)) {
        setHlPickerPos(null);
        setCustomHlPickerPos(null);
      }
      if (fillRef.current && !fillRef.current.contains(e.target as Node) &&
          fillChevronRef.current && !fillChevronRef.current.contains(e.target as Node)) {
        setFillPickerPos(null);
        setCustomFillPickerPos(null);
      }
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const EXCLUSIVE_GROUPS = [
    ['align-right', 'align-center', 'align-left', 'align-justify'],
    ['list-ordered', 'list-unordered'],
  ];

  const toggle = (fmt: string) => setActiveFormats(prev => {
    const n = new Set(prev);
    const group = EXCLUSIVE_GROUPS.find(g => g.includes(fmt));
    if (group) {
      group.forEach(f => n.delete(f));
      if (!prev.has(fmt)) n.add(fmt);
    } else {
      if (n.has(fmt)) n.delete(fmt); else n.add(fmt);
    }
    return n;
  });

  return (
    <div className="flex items-center px-2 py-1"
      style={{
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        borderTop: '1px solid #e5e7eb',
        direction: 'rtl',
        boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
        flexWrap: 'nowrap',
        gap: 1,
        overflow: 'visible',
      }}>
      {/* Text formatting — toggleable */}
      <TB title="מודגש (Ctrl+B)" active={activeFormats.has('bold')} onClick={() => toggle('bold')}><Bold className="w-3.5 h-3.5" /></TB>
      <TB title="נטוי (Ctrl+I)" active={activeFormats.has('italic')} onClick={() => toggle('italic')}><Italic className="w-3.5 h-3.5" /></TB>
      <TB title="קו תחתון (Ctrl+U)" active={activeFormats.has('underline')} onClick={() => toggle('underline')}><Underline className="w-3.5 h-3.5" /></TB>
      <TB title="קו חוצה" active={activeFormats.has('strikethrough')} onClick={() => toggle('strikethrough')}><Strikethrough className="w-3.5 h-3.5" /></TB>
      <Sep />

      {/* Text color with dropdown arrow */}
      <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <button title="צבע טקסט"
          className="flex flex-col items-center justify-center rounded hover:bg-gray-100 transition-colors flex-shrink-0"
          style={{ width: 26, height: 26, padding: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 700, lineHeight: 1, color: textColor === '#ffffff' ? '#374151' : textColor }}>A</span>
          <span style={{ width: 14, height: 3, borderRadius: 1, background: textColor, marginTop: 1, border: textColor === '#ffffff' ? '1px solid #d1d5db' : 'none' }} />
        </button>
        <button ref={chevronRef} title="בחר צבע טקסט"
          onClick={() => {
            if (colorPickerPos) { setColorPickerPos(null); return; }
            const rect = chevronRef.current!.getBoundingClientRect();
            setColorPickerPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
          }}
          className="flex items-center justify-center rounded hover:bg-gray-100 transition-colors flex-shrink-0"
          style={{ width: 14, height: 26, padding: 0 }}>
          <ChevronDown className="w-2.5 h-2.5 text-gray-500" />
        </button>
      </div>

      {/* Color picker — fixed so it escapes any overflow:hidden ancestor */}
      {colorPickerPos && (
        <div ref={colorRef} style={{
          position: 'fixed', top: colorPickerPos.top, right: colorPickerPos.right, zIndex: 99999,
          background: 'white', borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.14)',
          border: '1px solid #e5e7eb', padding: '10px 12px',
          minWidth: 170, direction: 'rtl',
        }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: '#9ca3af', marginBottom: 8 }}>צבע טקסט</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6, marginBottom: 10 }}>
            {TEXT_COLORS.map(c => (
              <button key={c} onClick={() => { setTextColor(c); setColorPickerPos(null); }}
                style={{
                  width: 22, height: 22, borderRadius: 6, background: c,
                  border: c === textColor ? '2px solid #1B3A6B' : '1px solid #e5e7eb',
                  cursor: 'pointer',
                }} />
            ))}
          </div>
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 8 }}>
            <button
              onClick={() => {
                const rect = chevronRef.current!.getBoundingClientRect();
                setColorPickerPos(null);
                setCustomPickerPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
              }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0',
              }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: textColor, border: '1px solid #e5e7eb', flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: '#374151' }}>התאמה אישית</span>
            </button>
          </div>
        </div>
      )}
      {customPickerPos && (
        <CustomColorPicker
          initialColor={textColor}
          pos={customPickerPos}
          onConfirm={c => { setTextColor(c); setCustomPickerPos(null); }}
          onCancel={() => setCustomPickerPos(null)}
        />
      )}

      {/* Highlighter with color picker */}
      <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <button title="צבע מרקר"
          className="flex flex-col items-center justify-center rounded hover:bg-gray-100 transition-colors flex-shrink-0"
          style={{ width: 26, height: 26, padding: 0 }}>
          <Highlighter className="w-3.5 h-3.5" style={{ color: '#374151' }} />
          <span style={{ width: 14, height: 3, borderRadius: 1, background: highlightColor, marginTop: 1 }} />
        </button>
        <button ref={hlChevronRef} title="בחר צבע מרקר"
          onClick={() => {
            if (hlPickerPos) { setHlPickerPos(null); return; }
            const rect = hlChevronRef.current!.getBoundingClientRect();
            setHlPickerPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
          }}
          className="flex items-center justify-center rounded hover:bg-gray-100 transition-colors flex-shrink-0"
          style={{ width: 14, height: 26, padding: 0 }}>
          <ChevronDown className="w-2.5 h-2.5 text-gray-500" />
        </button>
      </div>

      {/* Highlight color picker */}
      {hlPickerPos && (
        <div ref={hlRef} style={{
          position: 'fixed', top: hlPickerPos.top, right: hlPickerPos.right, zIndex: 99999,
          background: 'white', borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.14)',
          border: '1px solid #e5e7eb', padding: '10px 12px',
          minWidth: 170, direction: 'rtl',
        }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: '#9ca3af', marginBottom: 8 }}>צבע מרקר</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6, marginBottom: 10 }}>
            {HIGHLIGHT_COLORS.map(c => (
              <button key={c} onClick={() => { setHighlightColor(c); setHlPickerPos(null); }}
                style={{
                  width: 22, height: 22, borderRadius: 6, background: c,
                  border: c === highlightColor ? '2px solid #1B3A6B' : '1px solid #e5e7eb',
                  cursor: 'pointer',
                }} />
            ))}
          </div>
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 8 }}>
            <button
              onClick={() => {
                const rect = hlChevronRef.current!.getBoundingClientRect();
                setHlPickerPos(null);
                setCustomHlPickerPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
              }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0',
              }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: highlightColor, border: '1px solid #e5e7eb', flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: '#374151' }}>התאמה אישית</span>
            </button>
          </div>
        </div>
      )}
      {customHlPickerPos && (
        <CustomColorPicker
          initialColor={highlightColor}
          pos={customHlPickerPos}
          onConfirm={c => { setHighlightColor(c); setCustomHlPickerPos(null); }}
          onCancel={() => setCustomHlPickerPos(null)}
        />
      )}
      <Sep />

      {/* Lists */}
      <TB title="רשימה ממוספרת (1 2 3)" active={activeFormats.has('list-ordered')} onClick={() => toggle('list-ordered')}><ListOrdered className="w-3.5 h-3.5" /></TB>
      <TB title="רשימת תבליטים" active={activeFormats.has('list-unordered')} onClick={() => toggle('list-unordered')}>
        <List className="w-3.5 h-3.5" />
      </TB>
      <Sep />

      {/* Alignment */}
      <TB title="יישור לימין" active={activeFormats.has('align-right')} onClick={() => toggle('align-right')}><AlignRight className="w-3.5 h-3.5" /></TB>
      <TB title="מרכוז" active={activeFormats.has('align-center')} onClick={() => toggle('align-center')}><AlignCenter className="w-3.5 h-3.5" /></TB>
      <TB title="יישור לשמאל" active={activeFormats.has('align-left')} onClick={() => toggle('align-left')}><AlignLeft className="w-3.5 h-3.5" /></TB>
      <TB title="יישור לשני הצדדים" active={activeFormats.has('align-justify')} onClick={() => toggle('align-justify')}><AlignJustify className="w-3.5 h-3.5" /></TB>
      <Sep />

      {/* Indent & wrap */}
      <TB title="הקטן הזחה" disabled={indentLevel === 0} onClick={() => setIndentLevel(l => Math.max(0, l - 1))}><Indent className="w-3.5 h-3.5" /></TB>
      <TB title="הגדל הזחה" onClick={() => setIndentLevel(l => l + 1)}><Outdent className="w-3.5 h-3.5" /></TB>
      <Sep />

      {/* Text direction */}
      <TB title="כיוון טקסט מימין לשמאל" active={activeFormats.has('dir-rtl')} onClick={() => toggle('dir-rtl')}><PilcrowRight className="w-3.5 h-3.5" /></TB>
      <TB title="כיוון טקסט משמאל לימין" active={activeFormats.has('dir-ltr')} onClick={() => toggle('dir-ltr')}><PilcrowLeft className="w-3.5 h-3.5" /></TB>
      <Sep />

      {/* References & attachments */}
      <TB title="הוסף הערת שוליים" onClick={() => window.dispatchEvent(new CustomEvent('insert-footnote'))}>
        <span style={{ fontSize: 9, fontWeight: 700, lineHeight: 1, display: 'inline-flex', alignItems: 'flex-end', gap: 0 }}>
          AB<sup style={{ fontSize: 6, fontWeight: 600, lineHeight: 1 }}>1</sup>
        </span>
      </TB>
      <Sep />

      {/* Table, fill, brush, clear */}
      <div ref={tableBtnRef} style={{ position: 'relative', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <button
          title="הוספת טבלה"
          onClick={() => {
            if (tablePickerOpen) { setTablePickerOpen(false); return; }
            const rect = tableBtnRef.current?.getBoundingClientRect();
            if (rect) setTablePickerPos({ top: rect.bottom + 4, left: rect.left + rect.width / 2 });
            setTablePickerOpen(true);
          }}
          className={`flex items-center justify-center rounded transition-colors flex-shrink-0 gap-0.5 ${tablePickerOpen ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
          style={{ height: 26, padding: '0 3px' }}>
          <Table2 className="w-3.5 h-3.5" />
          <ChevronDown className="w-2.5 h-2.5" style={{ opacity: 0.6 }} />
        </button>
        {tablePickerOpen && (
          <>
            <div className="fixed inset-0 z-[99998]" onClick={() => { setTablePickerOpen(false); setTableHover(null); }} />
            <div className="z-[99999] bg-white rounded-xl shadow-lg border border-gray-100 p-2" style={{ position: 'fixed', top: tablePickerPos?.top ?? 0, left: tablePickerPos?.left ?? 0, transform: 'translateX(-50%)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 18px)', gap: 2, marginBottom: 6 }}>
                {Array.from({ length: 8 * 8 }).map((_, i) => {
                  const col = (i % 8) + 1;
                  const row = Math.floor(i / 8) + 1;
                  const active = tableHover && col <= tableHover.cols && row <= tableHover.rows;
                  return (
                    <div
                      key={i}
                      onMouseEnter={() => setTableHover({ cols: col, rows: row })}
                      onMouseLeave={() => setTableHover(null)}
                      onClick={(e) => { e.stopPropagation(); setTablePickerOpen(false); setTableHover(null); window.dispatchEvent(new CustomEvent('insert-table', { detail: { rows: row, cols: col } })); }}
                      style={{
                        width: 18, height: 18, borderRadius: 3, cursor: 'pointer',
                        background: active ? '#dbeafe' : '#f3f4f6',
                        border: `1px solid ${active ? '#93c5fd' : '#e5e7eb'}`,
                        transition: 'background 0.1s, border-color 0.1s',
                      }}
                    />
                  );
                })}
              </div>
              <div style={{ textAlign: 'center', fontSize: 11, color: '#6b7280', fontWeight: 500 }}>
                {tableHover ? `${tableHover.rows} × ${tableHover.cols}` : 'בחר גודל טבלה'}
              </div>
            </div>
          </>
        )}
      </div>
      {/* Fill color with chevron */}
      <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <button title="מילוי רקע"
          className="flex flex-col items-center justify-center rounded hover:bg-gray-100 transition-colors flex-shrink-0"
          style={{ width: 26, height: 26, padding: 0 }}>
          <PaintBucket className="w-3.5 h-3.5" style={{ color: '#374151' }} />
          <span style={{ width: 14, height: 3, borderRadius: 1, background: fillColor, marginTop: 1, border: fillColor === '#ffffff' ? '1px solid #d1d5db' : 'none' }} />
        </button>
        <button ref={fillChevronRef} title="בחר צבע מילוי"
          onClick={() => {
            if (fillPickerPos) { setFillPickerPos(null); return; }
            const rect = fillChevronRef.current!.getBoundingClientRect();
            setFillPickerPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
          }}
          className="flex items-center justify-center rounded hover:bg-gray-100 transition-colors flex-shrink-0"
          style={{ width: 14, height: 26, padding: 0 }}>
          <ChevronDown className="w-2.5 h-2.5 text-gray-500" />
        </button>
      </div>

      {fillPickerPos && (
        <div ref={fillRef} style={{
          position: 'fixed', top: fillPickerPos.top, right: fillPickerPos.right, zIndex: 99999,
          background: 'white', borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.14)',
          border: '1px solid #e5e7eb', padding: '10px 12px',
          minWidth: 170, direction: 'rtl',
        }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: '#9ca3af', marginBottom: 8 }}>צבע מילוי</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6, marginBottom: 10 }}>
            {TEXT_COLORS.map(c => (
              <button key={c} onClick={() => { setFillColor(c); setFillPickerPos(null); }}
                style={{
                  width: 22, height: 22, borderRadius: 6, background: c,
                  border: c === fillColor ? '2px solid #1B3A6B' : '1px solid #e5e7eb',
                  cursor: 'pointer',
                }} />
            ))}
          </div>
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 8 }}>
            <button
              onClick={() => {
                const rect = fillChevronRef.current!.getBoundingClientRect();
                setFillPickerPos(null);
                setCustomFillPickerPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
              }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0',
              }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: fillColor, border: '1px solid #e5e7eb', flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: '#374151' }}>התאמה אישית</span>
            </button>
          </div>
        </div>
      )}
      {customFillPickerPos && (
        <CustomColorPicker
          initialColor={fillColor}
          pos={customFillPickerPos}
          onConfirm={c => { setFillColor(c); setCustomFillPickerPos(null); }}
          onCancel={() => setCustomFillPickerPos(null)}
        />
      )}

      <TB title="מברשת עיצוב" active={brushActive} onClick={() => setBrushActive(a => !a)}><PaintRoller className="w-3.5 h-3.5" /></TB>
      <TB title="נקה עיצוב"><RemoveFormatting className="w-3.5 h-3.5" /></TB>
      <Sep />

      {/* Find & Replace */}
      <button
        ref={findReplaceBtnRef}
        title="חפש והחלף"
        onClick={() => {
          if (!findReplaceOpen && findReplaceBtnRef.current) {
            const r = findReplaceBtnRef.current.getBoundingClientRect();
            setFindReplacePos({ top: r.bottom + 4, left: Math.max(8, r.right - 320) });
          }
          setFindReplaceOpen(o => !o);
        }}
        className={`flex items-center justify-center rounded transition-colors flex-shrink-0 ${findReplaceOpen ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
        style={{ width: 26, height: 26 }}>
        <Search className="w-3.5 h-3.5" />
      </button>

      {findReplaceOpen && findReplacePos && (
        <>
          <div className="fixed inset-0 z-[99997]" onClick={() => setFindReplaceOpen(false)} />
          <div ref={findReplaceRef}
            className="fixed z-[99998] bg-white rounded-2xl shadow-2xl border border-gray-100"
            style={{ top: findReplacePos.top, left: findReplacePos.left, width: 320 }}
            dir="rtl"
            onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-3.5 pb-2 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-800">חפש והחלף</span>
              <button onClick={() => setFindReplaceOpen(false)} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                <X className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>

            <div className="px-4 py-3 flex flex-col gap-2.5">
              {/* Search row */}
              <div className="flex items-center gap-1.5">
                <div className="flex-1 flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-[#1B3A6B] focus-within:ring-1 focus-within:ring-[#1B3A6B]/20 transition-colors bg-white">
                  <Search className="w-3.5 h-3.5 text-gray-300 mx-2 flex-shrink-0" />
                  <input
                    type="text"
                    value={findQuery}
                    onChange={e => setFindQuery(e.target.value)}
                    placeholder="חפש..."
                    dir="rtl"
                    className="flex-1 py-2 pr-1 pl-2 text-xs text-gray-700 focus:outline-none bg-transparent"
                  />
                </div>
                <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600" title="תוצאה קודמת">
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600" title="תוצאה הבאה">
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Replace row */}
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-[#1B3A6B] focus-within:ring-1 focus-within:ring-[#1B3A6B]/20 transition-colors bg-white">
                <span className="text-[11px] text-gray-400 px-2.5 flex-shrink-0 border-l border-gray-100 py-2 bg-gray-50/60 select-none">החלף ב</span>
                <input
                  type="text"
                  value={replaceText}
                  onChange={e => setReplaceText(e.target.value)}
                  placeholder="טקסט חלופי..."
                  dir="rtl"
                  className="flex-1 py-2 px-2.5 text-xs text-gray-700 focus:outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 px-4 pb-3.5 pt-0.5 border-t border-gray-50">
              <button className="flex-1 py-2 rounded-xl text-xs font-semibold transition-colors hover:opacity-90 text-white" style={{ background: '#1B3A6B' }}>
                חפש
              </button>
              <button className="flex-1 py-2 rounded-xl text-xs font-semibold transition-colors border border-gray-200 text-gray-700 hover:bg-gray-50">
                החלף
              </button>
              <button className="flex-1 py-2 rounded-xl text-xs font-semibold transition-colors border border-gray-200 text-gray-700 hover:bg-gray-50">
                החלף הכל
              </button>
            </div>
          </div>
        </>
      )}

      {/* Calendar / date-time */}
      <button
        ref={calendarBtnRef}
        title="הוסף תאריך ושעה"
        onClick={() => {
          if (!calendarOpen && calendarBtnRef.current) {
            const r = calendarBtnRef.current.getBoundingClientRect();
            setCalendarPos({ top: r.bottom + 4, left: Math.max(8, r.right - 260) });
          }
          setCalendarOpen(o => !o);
        }}
        className={`flex items-center justify-center rounded transition-colors flex-shrink-0 ${calendarOpen ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
        style={{ width: 26, height: 26 }}>
        <CalendarDays className="w-3.5 h-3.5" />
      </button>

      {/* Calendar panel — below icon */}
      {calendarOpen && calendarPos && (() => {
        const firstDow  = new Date(calViewYear, calViewMonth, 1).getDay();
        const daysInMon = new Date(calViewYear, calViewMonth + 1, 0).getDate();
        const cells: (number|null)[] = [...Array(firstDow).fill(null), ...Array.from({ length: daysInMon }, (_, i) => i + 1)];
        const isSelected = (d: number) => calSelYear === calViewYear && calSelMonth === calViewMonth && calSelDay === d;
        const isToday    = (d: number) => today.getDate() === d && today.getMonth() === calViewMonth && today.getFullYear() === calViewYear;
        const prevMonth  = () => { if (calViewMonth === 0) { setCalViewMonth(11); setCalViewYear(y => y-1); } else setCalViewMonth(m => m-1); };
        const nextMonth  = () => { if (calViewMonth === 11) { setCalViewMonth(0); setCalViewYear(y => y+1); } else setCalViewMonth(m => m+1); };
        const selectDay  = (d: number) => { setCalSelYear(calViewYear); setCalSelMonth(calViewMonth); setCalSelDay(d); };
        const displayVal = calSelYear !== null && calSelMonth !== null && calSelDay !== null
          ? `${String(calSelDay).padStart(2,'0')}.${String(calSelMonth+1).padStart(2,'0')}.${calSelYear}  ${calTime}`
          : '';
        return (
          <>
            <div className="fixed inset-0 z-[99998]" onClick={() => setCalendarOpen(false)} />
            <div className="fixed z-[99999] bg-white rounded-2xl shadow-2xl border border-gray-100"
              style={{ top: calendarPos!.top, left: calendarPos!.left, width: 260 }}
              dir="rtl"
              onClick={e => e.stopPropagation()}>
              {/* Header */}
              <div className="flex items-center justify-between px-3 pt-3 pb-1">
                <button type="button" onClick={nextMonth} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                </button>
                <span className="text-xs font-semibold text-gray-800 select-none">{HE_MONTHS_CAL[calViewMonth]} {calViewYear}</span>
                <button type="button" onClick={prevMonth} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                  <ChevronLeft className="w-3.5 h-3.5 text-gray-500" />
                </button>
              </div>
              {/* Day headers */}
              <div className="grid grid-cols-7 px-3 mb-1">
                {HE_DAYS_CAL.map(d => <span key={d} className="text-center text-[10px] text-gray-400 py-0.5 select-none">{d}</span>)}
              </div>
              {/* Day cells */}
              <div className="grid grid-cols-7 gap-0.5 px-3 pb-2">
                {cells.map((day, i) => day === null ? <span key={`e-${i}`} /> : (
                  <button key={day} type="button" onClick={() => selectDay(day)}
                    className={['aspect-square flex items-center justify-center text-[11px] rounded-full transition-colors',
                      isSelected(day) ? 'border-2 border-[#1B3A6B] text-[#1B3A6B] font-semibold bg-white'
                      : isToday(day)  ? 'border border-dashed border-[#1B3A6B]/40 text-[#1B3A6B] font-medium hover:bg-blue-50'
                      : 'text-gray-700 hover:bg-blue-50',
                    ].join(' ')}>{day}</button>
                ))}
              </div>
              {/* Time */}
              <div className="border-t border-gray-100 mx-3" />
              <div className="px-3 py-2.5 flex items-center gap-2">
                <span className="text-[11px] text-gray-500 flex-shrink-0">שעה</span>
                <input type="text" inputMode="numeric" value={calTime}
                  onChange={e => setCalTime(e.target.value.replace(/[^\d:]/g,'').slice(0,5))}
                  dir="ltr"
                  className="flex-1 text-center text-sm font-medium text-gray-700 px-2 py-1 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#1B3A6B] focus:ring-1 focus:ring-[#1B3A6B]/20 transition-colors" />
              </div>
              {/* Footer */}
              {displayVal && (
                <>
                  <div className="border-t border-gray-100 mx-3" />
                  <div className="px-3 py-2.5 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-gray-500 select-all" dir="ltr">{displayVal}</span>
                    <button type="button" onClick={() => { setCalendarOpen(false); setCalendarValue(displayVal); }}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white transition-colors hover:opacity-90"
                      style={{ background: '#1B3A6B' }}>אישור</button>
                  </div>
                </>
              )}
              {calSelDay !== null && (
                <>
                  <div className="border-t border-gray-100 mx-3" />
                  <button type="button" onClick={() => { setCalSelYear(null); setCalSelMonth(null); setCalSelDay(null); }}
                    className="w-full text-[10px] text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-b-2xl py-2 transition-colors">
                    נקה
                  </button>
                </>
              )}
            </div>
          </>
        );
      })()}

    </div>
  );
}

interface EditProps {
  navigate: (path: string) => void;
  doc?: EditDocInfo | null;
}

const HE_ALPHA = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת'];

const STATUS_FLOW = ['טיוטה פנימית', 'בהכנה', 'בסבב אישורים', 'ממתין להפצה'];

const STATUS_COLOR: Record<string, string> = {
  'טיוטה פנימית': '#94a3b8',
  'בהכנה':        '#f59e0b',
  'בסבב אישורים':'#3b82f6',
  'ממתין להפצה':  '#10b981',
};

type SectionStatus = 'editing' | 'pending' | 'approved' | 'fix' | 'idle';

const SECTION_STATUS_COLOR: Record<SectionStatus, string> = {
  editing:  '#1B3A6B',
  pending:  '#d97706',
  approved: '#16a34a',
  fix:      '#dc2626',
  idle:     '#9ca3af',
};

const SECTION_STATUS_BG: Record<SectionStatus, string> = {
  editing:  '#1B3A6B14',
  pending:  '#d9770614',
  approved: '#16a34a14',
  fix:      '#dc262614',
  idle:     '#9ca3af14',
};

function SectionStatusIcon({ status, className }: { status: SectionStatus; className?: string }) {
  const color = SECTION_STATUS_COLOR[status];
  const cls = `w-3 h-3 flex-shrink-0 ${className ?? ''}`;
  if (status === 'approved') return <CheckCircle2 className={cls} style={{ color }} strokeWidth={2.5} />;
  if (status === 'pending')  return <Clock        className={cls} style={{ color }} strokeWidth={2.5} />;
  if (status === 'fix')      return <AlertCircle  className={cls} style={{ color }} strokeWidth={2.5} />;
  if (status === 'idle')     return <Minus        className={cls} style={{ color }} strokeWidth={2.5} />;
  return <PenLine className={cls} style={{ color }} strokeWidth={2.5} />;
}

interface Section {
  id: string;
  title: string;
  content?: string;
  status?: SectionStatus;
  children?: Section[];
}

const MOCK_SECTIONS: Section[] = [
  {
    id: 's1', title: 'מטרה ורקע', status: 'approved',
    children: [
      { id: 's1-1', title: 'מטרת המסמך' },
      { id: 's1-2', title: 'היסטוריית גרסאות' },
    ],
  },
  {
    id: 's2', title: 'הגדרות ומונחים', status: 'approved',
    children: [
      { id: 's2-1', title: 'מונחים כלליים' },
      { id: 's2-2', title: 'קיצורים' },
    ],
  },
  {
    id: 's3', title: 'נהלים ותהליכים', status: 'fix',
    children: [
      { id: 's3-1', title: 'תהליך קבלת החלטות' },
      { id: 's3-2', title: 'אחריות ותפקידים' },
      { id: 's3-3', title: 'לוחות זמנים' },
    ],
  },
  {
    id: 's4', title: 'הוראות ביצוע', status: 'pending',
    children: [
      { id: 's4-1', title: 'שלב א׳ – הכנה' },
      { id: 's4-2', title: 'שלב ב׳ – ביצוע' },
      { id: 's4-3', title: 'שלב ג׳ – בקרה' },
    ],
  },
  {
    id: 's5', title: 'נספחים', status: 'editing',
  },
  {
    id: 's6', title: 'חתימות', status: 'editing',
  },
];

type ImportDocItem = { id: string; name: string; org: string; date: string; status: string };
const IMPORT_DOCS: Record<string, ImportDocItem[]> = {
  drafts: [
    { id: 'id1', name: 'נוהל בטיחות 2026',       org: 'ארגון א׳', date: '10/05/2026', status: 'טיוטה' },
    { id: 'id2', name: 'נוהל גיוס עובדים',        org: 'ארגון ב׳', date: '08/05/2026', status: 'בהכנה' },
    { id: 'id3', name: 'תקנון משמעת',              org: 'ארגון א׳', date: '05/05/2026', status: 'טיוטה' },
    { id: 'id4', name: 'נוהל רכש ואספקה',          org: 'ארגון ג׳', date: '03/05/2026', status: 'טיוטה' },
  ],
  distributed: [
    { id: 'pd1', name: 'פקודה 42/2025 – נהלי בטיחות', org: 'ארגון א׳', date: '01/03/2026', status: 'הופץ' },
    { id: 'pd2', name: 'פקודה 38/2025 – גיוס ושיבוץ', org: 'ארגון ב׳', date: '15/02/2026', status: 'הופץ' },
    { id: 'pd3', name: 'פקודה 31/2025 – תקנון',        org: 'ארגון א׳', date: '10/01/2026', status: 'הופץ' },
  ],
  recent: [
    { id: 'rd1', name: 'נהלי עבודה',          org: 'ארגון א׳', date: '09/05/2026', status: 'בהכנה' },
    { id: 'rd2', name: 'דוחות שנתיים',         org: 'ארגון ב׳', date: '07/05/2026', status: 'הופץ'  },
    { id: 'rd3', name: 'מסמכי תקציב 2026',    org: 'ארגון א׳', date: '06/05/2026', status: 'טיוטה' },
    { id: 'rd4', name: 'נהלי בטיחות',          org: 'ארגון ג׳', date: '04/05/2026', status: 'הופץ'  },
  ],
};

const IMPORT_DOC_SECTIONS = [
  { id: 'is1', label: '1', title: 'מטרה ורקע', body: ['נוהל זה מגדיר את נהלי הבטיחות בארגון ומוודא שכל העובדים פועלים בהתאם לתקנות הרלוונטיות.'] },
  { id: 'is2', label: '2', title: 'הגדרות ומונחים', body: ['בטיחות – מכלול הפעולות לשמירה על שלמות גוף העובד ורכוש הארגון.', 'ציוד מגן אישי – ציוד הנדרש לשמירה על בריאות ובטיחות העובדים.'] },
  { id: 'is3', label: '3', title: 'נהלים ותהליכים', body: ['כל עובד יעבור הדרכת בטיחות לפני תחילת עבודתו. תדירות ההדרכות – אחת לשנה לפחות.'] },
  { id: 'is4', label: '4', title: 'הוראות ביצוע', body: ['א. עובד חדש יקבל הדרכת בטיחות ביום הראשון לעבודתו.', 'ב. כל תקלה בטיחותית תדווח למנהל הישיר תוך שעה מגילויה.'] },
  { id: 'is5', label: '5', title: 'נספחים', body: ['נספח א׳ – טופס דיווח תאונת עבודה.'] },
];

const IMPORT_STATUS_DOT: Record<string, string> = {
  'טיוטה': '#94a3b8',
  'בהכנה': '#0284c7',
  'הופץ':  '#16a34a',
};

function ImportDocModal({ onClose, onImport }: {
  onClose: () => void;
  onImport: (sections: string[]) => void;
}) {
  const [tab, setTab]               = useState<'drafts' | 'distributed'>('drafts');
  const [search, setSearch]         = useState('');
  const [selectedDoc, setSelectedDoc] = useState<ImportDocItem | null>(null);
  const [checkedSections, setCheckedSections] = useState<Set<string>>(new Set());

  const tabLabels: { key: 'drafts' | 'distributed'; label: string }[] = [
    { key: 'drafts',      label: 'טיוטות' },
    { key: 'distributed', label: 'פקודות שהופצו' },
  ];

  const docs = IMPORT_DOCS[tab].filter(d =>
    !search || d.name.includes(search) || d.org.includes(search)
  );

  const toggleSection = (id: string) => {
    setCheckedSections(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const ImportCheckbox = ({ checked }: { checked: boolean }) => (
    <div className={`flex-shrink-0 flex items-center justify-center rounded-md transition-all ${checked ? 'bg-[#1B3A6B]' : 'border-2 border-gray-300 bg-white'}`}
      style={{ width: 16, height: 16 }}>
      {checked && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[99998] flex items-center justify-center" style={{ background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(2px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{ width: '88vw', height: '82vh', maxWidth: 1200 }} dir="rtl">

        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          {selectedDoc ? (
            <div className="flex items-center gap-3">
              <button onClick={() => { setSelectedDoc(null); setCheckedSections(new Set()); }}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
                <ArrowRight className="w-4 h-4" />
                <span>חזרה</span>
              </button>
              <span className="text-gray-300">|</span>
              <span className="text-sm font-semibold text-gray-800">{selectedDoc.name}</span>
              <span className="text-xs text-gray-400">{selectedDoc.org} · {selectedDoc.date}</span>
            </div>
          ) : (
            <h2 className="text-base font-semibold text-gray-800">ייבוא סעיפים ממסמך אחר</h2>
          )}
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List view */}
        {!selectedDoc && (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Tabs row — underline style like catalog */}
            <div className="flex-shrink-0 flex items-center gap-1 px-6 pt-2 border-b border-gray-100">
              {tabLabels.map(t => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  className="relative px-4 py-2 text-sm transition-colors focus:outline-none"
                  style={{ color: tab === t.key ? '#111827' : '#9ca3af', fontWeight: tab === t.key ? 600 : 400 }}>
                  {t.label}
                  {tab === t.key && (
                    <span className="absolute bottom-0 right-4 left-4 h-[2px] rounded-full" style={{ background: '#111827' }} />
                  )}
                </button>
              ))}
            </div>
            {/* Search row — full-width pill like catalog */}
            <div className="flex-shrink-0 px-6 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2 px-3 py-2 rounded-full"
                style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.05)' }}>
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="חיפוש לפי שם, מספר פקודה..."
                    className="w-full pr-9 pl-3 py-1 text-sm text-right focus:outline-none bg-transparent"
                    dir="rtl" />
                </div>
                <div className="w-px h-5 bg-gray-200 flex-shrink-0" />
                <button className="flex items-center p-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document table */}
            <div className="flex-1 flex flex-col overflow-hidden px-6 py-4">
              <div className="flex-1 flex flex-col rounded-2xl overflow-hidden bg-white"
                style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)' }}>
                {/* Table header */}
                <div className="flex-shrink-0 grid items-center px-6 py-3 text-xs font-semibold"
                  style={{ background: '#EBEBEB', color: '#6b7280', gridTemplateColumns: '3fr 1fr 1fr 1fr', columnGap: '1rem' }}>
                  <span className="text-right">שם המסמך</span>
                  <span className="text-center">ארגון</span>
                  <span className="text-center">תאריך</span>
                  <span className="text-right">סטטוס</span>
                </div>
                {/* Rows */}
                <div className="flex-1 overflow-y-auto px-2">
                  {docs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                      <Search className="w-6 h-6 mb-2 opacity-40" />
                      <p className="text-sm">לא נמצאו מסמכים</p>
                    </div>
                  ) : docs.map(d => {
                    const dotColor = IMPORT_STATUS_DOT[d.status] ?? '#94a3b8';
                    return (
                      <div key={d.id} onClick={() => setSelectedDoc(d)}
                        className="group grid items-center px-4 py-3 rounded-xl cursor-pointer transition-colors hover:bg-gray-50"
                        style={{ borderBottom: '1px solid #f5f5f5', gridTemplateColumns: '3fr 1fr 1fr 1fr', columnGap: '1rem' }}>
                        <span className="text-right text-sm font-medium text-gray-800 truncate">{d.name}</span>
                        <span className="text-center text-xs text-gray-500">{d.org}</span>
                        <span className="text-center text-xs text-gray-500">{d.date}</span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: dotColor }} />
                          <span className="text-sm text-gray-700">{d.status}</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Document split view */}
        {selectedDoc && (
          <div className="flex flex-1 overflow-hidden" dir="rtl">
            {/* Section sidebar — right side in RTL */}
            <div className="flex flex-col flex-shrink-0 overflow-hidden border-l border-gray-100" style={{ width: 260 }}>
              <div className="px-4 pt-4 pb-2 border-b border-gray-100 flex-shrink-0">
                <p className="text-sm font-semibold text-gray-800">בחר סעיפים לייבוא</p>
                <p className="text-xs text-gray-400 mt-0.5">לחץ לבחירה</p>
              </div>
              <div className="flex-1 overflow-y-auto py-1">
                {IMPORT_DOC_SECTIONS.map(s => {
                  const checked = checkedSections.has(s.id);
                  return (
                    <div key={s.id} onClick={() => toggleSection(s.id)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 cursor-pointer transition-colors ${checked ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                      <ImportCheckbox checked={checked} />
                      <div className="flex items-baseline gap-1.5 text-sm text-right flex-1">
                        <span className="font-bold text-gray-400 text-xs">{s.label}</span>
                        <span className={checked ? 'text-[#1B3A6B] font-medium' : 'text-gray-700'}>{s.title}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="px-4 py-3 border-t border-gray-100 flex-shrink-0">
                <button
                  disabled={checkedSections.size === 0}
                  onClick={() => { onImport(Array.from(checkedSections)); onClose(); }}
                  className="w-full py-2 rounded-full text-sm font-semibold transition-all"
                  style={{ background: checkedSections.size > 0 ? '#1B3A6B' : '#e5e7eb', color: checkedSections.size > 0 ? '#fff' : '#9ca3af' }}>
                  {checkedSections.size > 1 ? `ייבא ${checkedSections.size} סעיפים` : checkedSections.size === 1 ? 'ייבא סעיף' : 'בחר סעיפים'}
                </button>
              </div>
            </div>

            {/* Document view — left side, React-rendered with inline section selection */}
            <div className="flex-1 overflow-y-auto px-10 py-8" dir="rtl"
              style={{ fontFamily: 'system-ui, sans-serif', color: '#1e293b', fontSize: 13, lineHeight: 1.7 }}>
              <h1 style={{ fontSize: 16, fontWeight: 700, color: '#1B3A6B', borderBottom: '2px solid #e5e7eb', paddingBottom: 10, marginBottom: 20 }}>
                {selectedDoc.name}
              </h1>
              {IMPORT_DOC_SECTIONS.map(s => {
                const checked = checkedSections.has(s.id);
                return (
                  <div key={s.id} className="group mb-6">
                    <div className={`rounded-xl transition-colors px-3 py-2 -mx-3 cursor-pointer ${checked ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                      onClick={() => toggleSection(s.id)}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span style={{ color: '#1B3A6B', fontWeight: 700 }}>{s.label}.</span>
                        <span style={{ fontWeight: 600, color: '#374151', flex: 1 }}>{s.title}</span>
                        <div style={{ height: 1, background: '#e5e7eb', flex: 1 }} />
                        <div className={`flex-shrink-0 flex items-center justify-center rounded-md transition-all ${checked ? 'bg-[#1B3A6B]' : 'border-2 border-gray-300 bg-white opacity-0 group-hover:opacity-100'}`}
                          style={{ width: 16, height: 16 }}>
                          {checked && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                        </div>
                      </div>
                      {s.body.map((line, i) => (
                        <p key={i} style={{ color: '#6b7280', marginBottom: 4, paddingRight: 16 }}>{line}</p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionItem({
  section, depth = 0, isEditing = false, onSave,
}: {
  section: Section; depth?: number; isEditing?: boolean; onSave?: (title: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(section.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasChildren = !!(section.children?.length);

  useEffect(() => { if (isEditing) inputRef.current?.focus(); }, [isEditing]);

  const commit = () => onSave?.(draft.trim());

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-1.5 px-2 rounded-lg cursor-pointer transition-colors hover:bg-white/60 text-right ${depth > 0 ? 'text-xs text-gray-500' : 'text-sm text-gray-700'}`}
        style={{ paddingRight: depth * 12 + 8 }}
        onClick={() => !isEditing && hasChildren && setOpen(o => !o)}
      >
        {hasChildren ? (
          <ChevronLeft className={`w-3 h-3 flex-shrink-0 text-gray-400 transition-transform ${open ? '-rotate-90' : ''}`} />
        ) : (
          <span className="w-3 h-3 flex-shrink-0" />
        )}
        {isEditing ? (
          <input
            ref={inputRef}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); commit(); } if (e.key === 'Escape') onSave?.(''); }}
            className="flex-1 bg-transparent border-b border-[#1B3A6B] outline-none text-sm text-gray-800 text-right"
            placeholder="שם הנושא..."
            dir="rtl"
          />
        ) : (
          <span className="flex-1">{section.title}</span>
        )}
      </div>
      {hasChildren && open && (
        <div>
          {section.children!.map(child => (
            <SectionItem key={child.id} section={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange}
      className="relative flex-shrink-0 transition-colors duration-200 rounded-full"
      style={{ width: 36, height: 20, background: checked ? '#1B3A6B' : '#d1d5db' }}>
      <span className="absolute top-0.5 transition-all duration-200 rounded-full bg-white"
        style={{ width: 16, height: 16, right: checked ? 2 : 18 }} />
    </button>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-gray-400 font-medium">{label}</span>
      <div className="text-sm text-gray-400 rounded-lg px-3 py-1.5 border border-gray-100 bg-gray-50 select-none cursor-default text-right">{value}</div>
    </div>
  );
}

function EditableField({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-gray-500 font-medium">{label}</span>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} dir="rtl"
        className="text-sm text-gray-800 rounded-lg px-3 py-1.5 border border-gray-200 bg-white focus:outline-none focus:border-[#1B3A6B] transition-colors" />
    </div>
  );
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-gray-500 font-medium">{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)} dir="rtl"
        className="text-sm text-gray-800 rounded-lg px-3 py-1.5 border border-gray-200 bg-white focus:outline-none focus:border-[#1B3A6B] transition-colors appearance-none">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

const EDIT_AMAZON_ENTITIES: Record<string, string[]> = {
  'פרויקט': ['פרויקט הגנה 2026', 'פרויקט לוגיסטיקה', 'פרויקט תשתיות', 'פרויקט חינוך', 'פרויקט אלפא'],
  'מבנה':   ['בניין מרכזי', 'בניין A', 'בניין B', 'בניין C', 'מבנה הנהלה', 'מבנה תפעול'],
  'קומה':   ['קומה 1', 'קומה 2', 'קומה 3', 'קומה 4', 'קומה 5'],
  'חדר':    ['חדר 101', 'חדר 102', 'חדר 201', 'חדר 202', 'חדר ישיבות א׳', 'חדר מפקד'],
};

function AmazonSelector({ entityType, entityName, onChangeType, onChangeName }: {
  entityType: string; entityName: string;
  onChangeType: (v: string) => void; onChangeName: (v: string) => void;
}) {
  const [openType, setOpenType] = useState(false);
  const [openName, setOpenName] = useState(false);
  const typeRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openType) return;
    const h = (e: MouseEvent) => { if (typeRef.current && !typeRef.current.contains(e.target as Node)) setOpenType(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [openType]);

  useEffect(() => {
    if (!openName) return;
    const h = (e: MouseEvent) => { if (nameRef.current && !nameRef.current.contains(e.target as Node)) setOpenName(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [openName]);

  const names = entityType ? (EDIT_AMAZON_ENTITIES[entityType] ?? []) : [];

  const DropBtn = ({ label, open, onClick }: { label: string; open: boolean; onClick: () => void }) => (
    <button type="button" onClick={onClick}
      className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white hover:border-gray-300 focus:outline-none transition-colors"
      style={{ color: label ? '#374151' : '#9ca3af' }}>
      <ChevronLeft className="w-4 h-4 text-gray-400 flex-shrink-0" style={{ transform: open ? 'rotate(-90deg)' : 'rotate(90deg)', transition: 'transform 0.15s' }} />
      <span>{label || 'בחר'}</span>
    </button>
  );

  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-gray-500 font-medium">שיוך לאמזונס</span>
      <div className="flex gap-2">
        {/* Type selector */}
        <div ref={typeRef} className="relative flex-1">
          <DropBtn label={entityType || 'פרויקט'} open={openType} onClick={() => { setOpenType(o => !o); setOpenName(false); }} />
          {openType && (
            <div className="absolute top-full mt-1 right-0 left-0 bg-white rounded-xl shadow-lg border border-gray-100 z-10 py-1">
              {Object.keys(EDIT_AMAZON_ENTITIES).map(opt => (
                <button key={opt} type="button"
                  onClick={() => { onChangeType(opt); onChangeName(''); setOpenType(false); }}
                  className="w-full text-right px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                  style={{ color: entityType === opt ? '#1B3A6B' : '#374151', fontWeight: entityType === opt ? 600 : 400 }}>
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Name selector */}
        <div ref={nameRef} className="relative flex-1">
          <DropBtn label={entityName || 'בחר שם'} open={openName} onClick={() => { setOpenName(o => !o); setOpenType(false); }} />
          {openName && (
            <div className="absolute top-full mt-1 right-0 left-0 bg-white rounded-xl shadow-lg border border-gray-100 z-10 py-1 max-h-48 overflow-y-auto">
              {names.map(opt => (
                <button key={opt} type="button"
                  onClick={() => { onChangeName(opt); setOpenName(false); }}
                  className="w-full text-right px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                  style={{ color: entityName === opt ? '#1B3A6B' : '#374151', fontWeight: entityName === opt ? 600 : 400 }}>
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EditDocDetailsModal({ doc, onClose, mode = 'edit', readOnly = false, onContinue, onConfirmIssue }: { doc?: { name?: string; orderNum?: string; status?: string } | null; onClose: () => void; mode?: 'edit' | 'duplicate' | 'approval' | 'issue-update' | 'issue-new'; readOnly?: boolean; onContinue?: (dirty: boolean) => void; onConfirmIssue?: () => void }) {
  const isDuplicate = mode === 'duplicate';
  const isApproval = mode === 'approval';
  const isIssueUpdate = mode === 'issue-update';
  const isIssueNew = mode === 'issue-new';
  const [name,      setName]      = useState(isDuplicate ? (doc?.name ?? 'שם הפקודה') : (doc?.name ?? 'שם הפקודה'));
  const [nameTouched, setNameTouched] = useState(false);
  const [dept,      setDept]      = useState('משאבי אנוש');
  const [docType,   setDocType]   = useState('פקודה');
  const [folder,    setFolder]    = useState('תיקיית מבצעים 2026');
  const [amazonType, setAmazonType] = useState('פרויקט');
  const [amazonName, setAmazonName] = useState('פרויקט הגנה 2026');
  const [entryDate, setEntryDate] = useState('2026-06-01');
  const [exitDate,  setExitDate]  = useState('');
  const [pdfAccess, setPdfAccess] = useState<'authorized' | 'all'>('authorized');
  const [cancelApproval, setCancelApproval] = useState(false);
  const [watermark, setWatermark] = useState(false);
  const [distributeNatzura, setDistributeNatzura] = useState(false);
  const [isDirty,   setIsDirty]   = useState(false);
  const dirty = () => setIsDirty(true);

  return (
    <div className="fixed inset-0 z-[99998] flex items-center justify-center"
      style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(2px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden" dir="rtl"
        style={{ width: 620, maxHeight: '88vh' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-base font-semibold text-gray-800">{isDuplicate ? 'שכפול מסמך' : isApproval ? 'העברה לסבב אישורים' : isIssueUpdate ? 'הוצאת עדכון למסמך' : isIssueNew ? 'הוצאת מספר פקודה חדש' : 'פרטי המסמך'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6">

          {/* Read-only section */}
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-3">
              <ReadOnlyField label="סיווג"       value="בלמ״ס" />
              <ReadOnlyField label="תבנית"       value="מסמך בטיחות" />
              <ReadOnlyField label="ארגון"       value="ארגון א׳" />
              <ReadOnlyField label="מס׳ פקודה"  value={isIssueNew ? String(parseInt(doc?.orderNum ?? '1') + 1).padStart(3, '0') : (doc?.orderNum ?? '001')} />
              <ReadOnlyField label="מס׳ עדכון"  value={isIssueUpdate ? '2' : '1'} />
            </div>
          </div>

          {/* Editable / read-only fields */}
          {readOnly ? (
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <ReadOnlyField label="שם המסמך"                value={name} />
                <ReadOnlyField label="מחלקה"                   value={dept} />
                <ReadOnlyField label="סוג מסמך"               value={docType} />
                <ReadOnlyField label="שיוך לתיקייה מבצעית"   value={folder} />
                <ReadOnlyField label="ישות"                    value={`${amazonType} — ${amazonName}`} />
                <ReadOnlyField label="כניסה לתוקף"            value={entryDate} />
                <ReadOnlyField label="יציאה מתוקף"            value={exitDate || '—'} />
                <ReadOnlyField label="ייצוא לPDF"              value={pdfAccess === 'authorized' ? 'למורשים בלבד' : 'לאפשר לכולם'} />
                <ReadOnlyField label="ביטול סבב האישורים"      value={cancelApproval ? 'כן' : 'לא'} />
                <ReadOnlyField label="סימן מים"               value={watermark ? 'כן' : 'לא'} />
                <ReadOnlyField label="פקודה נצורה"             value={distributeNatzura ? 'כן' : 'לא'} />
              </div>
            </div>
          ) : (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                {isDuplicate ? (
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold flex items-center gap-1.5" style={{ color: '#374151' }}>
                      שם המסמך
                      {!nameTouched && <span className="text-[10px] font-normal" style={{ color: '#dc2626' }}>חובה לשנות שם</span>}
                    </label>
                    <input
                      value={name}
                      onChange={e => { setName(e.target.value); setNameTouched(true); dirty(); }}
                      dir="rtl"
                      style={{
                        width: '100%', fontSize: 13, color: '#374151',
                        background: 'white',
                        border: `1.5px solid ${nameTouched ? '#e5e7eb' : '#fca5a5'}`,
                        borderRadius: 8, outline: 'none', padding: '8px 12px',
                        transition: 'all 0.15s',
                      }}
                      className="focus:border-[#1B3A6B]"
                    />
                  </div>
                ) : (
                  <EditableField label="שם המסמך" value={name} onChange={v => { setName(v); dirty(); }} />
                )}
              </div>
              <SelectField label="מחלקה" value={dept} onChange={v => { setDept(v); dirty(); }}
                options={['משאבי אנוש', 'מבצעים', 'לוגיסטיקה', 'כספים', 'טכנולוגיה']} />
              <SelectField label="סוג מסמך" value={docType} onChange={v => { setDocType(v); dirty(); }}
                options={['פקודה', 'נוהל', 'הוראה', 'הנחיה', 'נספח']} />
              <div className="col-span-2">
                <EditableField label="שיוך לתיקייה מבצעית" value={folder} onChange={v => { setFolder(v); dirty(); }} />
              </div>
              <div className="col-span-2">
                <AmazonSelector entityType={amazonType} entityName={amazonName}
                  onChangeType={v => { setAmazonType(v); setAmazonName(''); dirty(); }}
                  onChangeName={v => { setAmazonName(v); dirty(); }} />
              </div>
              <EditableField label="כניסה לתוקף" value={entryDate} onChange={v => { setEntryDate(v); dirty(); }} type="date" />
              <EditableField label="יציאה מתוקף" value={exitDate} onChange={v => { setExitDate(v); dirty(); }} type="date" />
            </div>

            {/* Toggles & controls */}
            <div className="flex flex-col gap-0 rounded-xl overflow-hidden border border-gray-100">
              <div className="flex items-center justify-between px-4 py-3 bg-white">
                <span className="text-sm text-gray-700">ייצוא לPDF</span>
                <div className="flex rounded-lg overflow-hidden border border-gray-200" style={{ fontSize: 12 }}>
                  {(['authorized', 'all'] as const).map((opt, i) => (
                    <button key={opt} onClick={() => { setPdfAccess(opt); dirty(); }}
                      className="px-3 py-1.5 transition-colors text-xs font-medium"
                      style={{
                        background: pdfAccess === opt ? '#1B3A6B' : '#fff',
                        color: pdfAccess === opt ? '#fff' : '#6b7280',
                        borderRight: i === 0 ? '1px solid #e5e7eb' : undefined,
                      }}>
                      {opt === 'authorized' ? 'למורשים בלבד' : 'לאפשר לכולם'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors"
                style={{ borderTop: '1px solid #f3f4f6' }}>
                <span className="text-sm text-gray-700">ביטול סבב האישורים</span>
                <Toggle checked={cancelApproval} onChange={() => { setCancelApproval(p => !p); dirty(); }} />
              </div>
              <div className="flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors"
                style={{ borderTop: '1px solid #f3f4f6' }}>
                <span className="text-sm text-gray-700">הצגת סימן מים</span>
                <Toggle checked={watermark} onChange={() => { setWatermark(p => !p); dirty(); }} />
              </div>
              <div className="flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors"
                style={{ borderTop: '1px solid #f3f4f6' }}>
                <span className="text-sm text-gray-700">האם תרצה להפיץ את הפקודה כפקודה נצורה?</span>
                <Toggle checked={distributeNatzura} onChange={() => { setDistributeNatzura(p => !p); dirty(); }} />
              </div>
            </div>
          </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 flex-shrink-0">
          {readOnly ? (
            <button onClick={onClose}
              className="px-5 py-2 rounded-full text-sm font-medium text-white transition-all hover:opacity-90"
              style={{ background: '#1B3A6B' }}>
              סגור
            </button>
          ) : (isIssueUpdate || isIssueNew) ? (<>
            <button onClick={onClose}
              className="px-5 py-2 rounded-full text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
              ביטול
            </button>
            <button onClick={() => { onClose(); onConfirmIssue?.(); }}
              className="px-5 py-2 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: '#1B3A6B' }}>
              אישור
            </button>
          </>) : isApproval ? (<>
            <button onClick={onClose}
              className="px-5 py-2 rounded-full text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
              ביטול
            </button>
            <button onClick={() => { onClose(); onContinue?.(isDirty); }}
              className="px-5 py-2 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: '#1B3A6B' }}>
              המשך
            </button>
          </>) : (<>
            <button onClick={onClose}
              className="px-5 py-2 rounded-full text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
              ביטול
            </button>
            {(() => {
              const isDisabled = isDuplicate ? !nameTouched : !isDirty;
              return (
                <button onClick={onClose} disabled={isDisabled}
                  className="px-5 py-2 rounded-full text-sm font-semibold transition-all"
                  style={{ background: isDisabled ? '#e5e7eb' : '#1B3A6B', color: isDisabled ? '#9ca3af' : '#fff' }}>
                  {isDuplicate ? 'שכפל' : 'שמור שינויים'}
                </button>
              );
            })()}
          </>)}
        </div>
      </div>
    </div>
  );
}

const FILTER_STATUSES = [
  { id: 'editing',   label: 'בעריכה',            color: '#1B3A6B' },
  { id: 'pending',   label: 'ממתין לאישור',      color: '#d97706' },
  { id: 'approved',  label: 'מאושר',             color: '#16a34a' },
  { id: 'fix',       label: 'לתיקון',            color: '#dc2626' },
  { id: 'idle',      label: 'לא בעבודה',         color: '#9ca3af' },
];

function FilterPanel({ onClose, appliedFilters, onApply }: { onClose: () => void; appliedFilters: Set<string>; onApply: (f: Set<string>) => void }) {
  const [active, setActive] = useState<Set<string>>(new Set(appliedFilters));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const t = setTimeout(() => document.addEventListener('mousedown', h), 200);
    return () => { clearTimeout(t); document.removeEventListener('mousedown', h); };
  }, [onClose]);

  const toggle = (id: string) => setActive(prev => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  const clearAll = () => setActive(new Set());

  return (
    <div ref={ref} className="fixed z-[9999] flex flex-col bg-white rounded-2xl shadow-xl"
      style={{ top: 52, right: 12, width: 240, border: '1px solid #e5e7eb' }} dir="rtl">
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-800">סינון סעיפים לפי סטטוס</span>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="py-2">
        {FILTER_STATUSES.map(s => {
          const checked = active.has(s.id);
          return (
            <button key={s.id} onClick={() => toggle(s.id)}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-right">
              <div className={`flex-shrink-0 flex items-center justify-center rounded-md transition-all ${checked ? 'bg-[#1B3A6B]' : 'border-2 border-gray-300 bg-white'}`}
                style={{ width: 16, height: 16 }}>
                {checked && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
              </div>
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
              <span className="text-sm text-gray-700">{s.label}</span>
            </button>
          );
        })}
      </div>
      <div className="px-4 pb-4 pt-2 border-t border-gray-100 flex items-center gap-2">
        <button
          onClick={() => { onApply(new Set(active)); onClose(); }}
          className="flex-1 py-1.5 rounded-full text-sm font-semibold transition-all"
          style={{ background: active.size > 0 ? '#1B3A6B' : '#e5e7eb', color: active.size > 0 ? '#fff' : '#9ca3af' }}>
          {active.size > 0 ? `סנן (${active.size})` : 'סנן'}
        </button>
        {active.size > 0 && (
          <button onClick={clearAll} className="text-xs text-gray-400 hover:text-gray-600 transition-colors px-1">
            נקה
          </button>
        )}
      </div>
    </div>
  );
}

const APPROVAL_RANKS = ['סא״ל', 'אל״ם', 'תא״ל', 'אלוף', 'רא״ל'];

const MOCK_ROUND_STAGES = [
  { rank: 'סא״ל', users: ['כהן א.', 'לוי מ.'], status: 'pending' as const, type: 'approver' as const },
  { rank: 'אל״ם', users: ['גולן ד.'], status: 'waiting' as const, type: 'approver' as const },
  { rank: 'חמ״ל צפון', users: ['רנ"ג כהן א.', 'סמ"ר לוי מ.'], status: 'waiting' as const, type: 'hml' as const },
  { rank: 'חמ״ל דרום', users: ['סמ"ר גולן ד.', 'רנ"ג פרץ י.'], status: 'waiting' as const, type: 'hml' as const },
];

const MOCK_DOC_SECTIONS = ['מטרה ורקע', 'הגדרות ומונחים', 'נהלים ותהליכים', 'הוראות ביצוע', 'נספחים'];

function ApprovalRoundModal({ onClose, onApprove, onReject, docName, onDistribute }: {
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  docName: string;
  onDistribute: () => void;
}) {
  const stages = MOCK_ROUND_STAGES;
  const approverStages = stages.filter(s => s.type === 'approver');
  const hmlStages = stages.filter(s => s.type === 'hml');
  const firstHmlIdx = stages.findIndex(s => s.type === 'hml');
  const activeStageIndex = approverStages.findIndex(s => s.status === 'pending');

  // Timeline shows approver dots + one "חמ״ל" dot
  const timelineItems = [
    ...approverStages.map((s, i) => ({ label: s.rank, stagesIdx: i })),
    ...(hmlStages.length > 0 ? [{ label: 'חמ״ל', stagesIdx: firstHmlIdx }] : []),
  ];

  const [selectedStageIdx, setSelectedStageIdx] = useState(activeStageIndex >= 0 ? activeStageIndex : 0);
  const [userInStage, setUserInStage] = useState(0);
  const [userNotes, setUserNotes] = useState<Record<string, string>>({});
  const [approvedIdxs, setApprovedIdxs] = useState<Set<number>>(new Set());
  const [currentActiveIdx, setCurrentActiveIdx] = useState(activeStageIndex >= 0 ? activeStageIndex : 0);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showDistributePrompt, setShowDistributePrompt] = useState(false);

  const isHmlSelected = stages[selectedStageIdx]?.type === 'hml';
  const currentStage = stages[selectedStageIdx];
  const noteKey = `${selectedStageIdx}-${userInStage}`;

  // For HML: arrows navigate between HML stages; for approvers: navigate between users
  const canPrev = isHmlSelected ? selectedStageIdx > firstHmlIdx : userInStage > 0;
  const canNext = isHmlSelected ? selectedStageIdx < stages.length - 1 : userInStage < currentStage.users.length - 1;
  const goPrev = () => isHmlSelected ? (setSelectedStageIdx(p => p - 1), setUserInStage(0)) : setUserInStage(p => p - 1);
  const goNext = () => isHmlSelected ? (setSelectedStageIdx(p => p + 1), setUserInStage(0)) : setUserInStage(p => p + 1);

  const isApproved = (stageIdx: number) => approvedIdxs.has(stageIdx);
  const isActive = (stageIdx: number) => stageIdx === currentActiveIdx;

  const tlDotBg = (stageIdx: number) =>
    isApproved(stageIdx) ? '#16a34a' : isActive(stageIdx) ? '#1B3A6B' : '#d1d5db';
  const tlLabelColor = (stageIdx: number) =>
    isApproved(stageIdx) ? '#16a34a' : isActive(stageIdx) ? '#1B3A6B' : '#9ca3af';
  const tlSelected = (stagesIdx: number) =>
    stagesIdx === selectedStageIdx || (isHmlSelected && stages[stagesIdx]?.type === 'hml');

  const selectTimeline = (stagesIdx: number) => { setSelectedStageIdx(stagesIdx); setUserInStage(0); };

  const carouselDots = isHmlSelected ? hmlStages.map((_, i) => firstHmlIdx + i) : currentStage.users.map((_, i) => i);
  const carouselActive = isHmlSelected ? selectedStageIdx - firstHmlIdx : userInStage;
  const carouselLabel = isHmlSelected ? currentStage.rank : currentStage.users[userInStage];

  const handleApprove = () => {
    const next = new Set(approvedIdxs);
    next.add(currentActiveIdx);
    setApprovedIdxs(next);
    const nextActive = currentActiveIdx + 1;
    if (nextActive < approverStages.length) {
      setCurrentActiveIdx(nextActive);
      setSelectedStageIdx(nextActive);
      setUserInStage(0);
    } else {
      setShowDistributePrompt(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center"
      style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(2px)' }}>
      <div dir="rtl" className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden relative" style={{ width: 580, maxHeight: '90vh' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-base font-semibold text-gray-800">סבב אישורים</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          {/* Clickable timeline — approver dots + one חמ״ל dot */}
          <div className="flex items-center">
            {timelineItems.map((item, ti) => (
              <React.Fragment key={item.label}>
                <button onClick={() => selectTimeline(item.stagesIdx)}
                  className="flex flex-col items-center gap-1 group" style={{ minWidth: 64 }}>
                  <div className="w-4 h-4 rounded-full transition-all group-hover:scale-110 flex items-center justify-center flex-shrink-0"
                    style={{ background: tlSelected(item.stagesIdx) ? '#1B3A6B' : tlDotBg(item.stagesIdx) }}>
                    {isApproved(item.stagesIdx) && !tlSelected(item.stagesIdx) && (
                      <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                    )}
                  </div>
                  <span className="text-[10px] font-semibold whitespace-nowrap transition-colors"
                    style={{ color: tlSelected(item.stagesIdx) ? '#1B3A6B' : tlLabelColor(item.stagesIdx) }}>{item.label}</span>
                </button>
                {ti < timelineItems.length - 1 && <div className="flex-1 h-px" style={{ background: '#d1d5db', minWidth: 20 }} />}
              </React.Fragment>
            ))}
          </div>

          {/* Notes carousel */}
          <div className="border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <button onClick={goNext} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors disabled:opacity-30" disabled={!canNext}>
                <ChevronLeft className="w-4 h-4 rotate-180" />
              </button>
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-sm font-semibold text-gray-800">{currentStage.rank}</span>
                {!isHmlSelected && <span className="text-[10px] text-gray-400">{carouselLabel}</span>}
              </div>
              <button onClick={goPrev} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors disabled:opacity-30" disabled={!canPrev}>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
            {carouselDots.length > 1 && (
              <div className="flex justify-center gap-1.5 -mt-1">
                {carouselDots.map((_, i) => (
                  <button key={i}
                    onClick={() => isHmlSelected ? (setSelectedStageIdx(firstHmlIdx + i), setUserInStage(0)) : setUserInStage(i)}
                    className="rounded-full transition-all"
                    style={{ width: i === carouselActive ? 16 : 6, height: 6, background: i === carouselActive ? '#1B3A6B' : '#d1d5db' }} />
                ))}
              </div>
            )}
            <textarea value={userNotes[noteKey] ?? ''} onChange={e => setUserNotes(prev => ({ ...prev, [noteKey]: e.target.value }))}
              placeholder={`הערות ${carouselLabel}...`} dir="rtl" rows={3}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 resize-none outline-none focus:border-gray-300 transition-colors placeholder-gray-300" />
          </div>

          {/* Section comment — right aligned, closes modal */}
          <button onClick={onClose} className="flex items-center gap-1.5 text-sm font-semibold text-[#1B3A6B] hover:underline self-start">
            <Plus className="w-4 h-4" /> הוספת הערה לתיקון סעיף
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <button onClick={onClose} className="px-5 py-2 rounded-full text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
            ביטול
          </button>
          <div className="flex gap-3">
            <button onClick={() => setShowRejectForm(true)}
              className="px-5 py-2 rounded-full text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
              דחה
            </button>
            <button onClick={handleApprove}
              className="px-6 py-2 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: '#1B3A6B' }}>
              אשר
            </button>
          </div>
        </div>

        {/* Reject reason overlay */}
        {showRejectForm && (
          <div className="absolute inset-0 z-10 flex flex-col justify-end rounded-2xl overflow-hidden"
            style={{ background: 'rgba(15,23,42,0.35)' }}>
            <div dir="rtl" className="bg-white rounded-t-2xl px-6 py-5 flex flex-col gap-4 shadow-2xl">
              <h3 className="text-sm font-semibold text-gray-800">סיבת הדחייה</h3>
              <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                placeholder="פרט את סיבת הדחייה..."
                dir="rtl" rows={4} autoFocus
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 resize-none outline-none focus:border-gray-300 transition-colors placeholder-gray-300" />
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowRejectForm(false)}
                  className="px-5 py-2 rounded-full text-sm font-medium text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors">
                  ביטול
                </button>
                <button onClick={() => { setShowRejectForm(false); onReject(); }}
                  className="px-6 py-2 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: '#dc2626' }}>
                  דחייה
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Distribute prompt overlay */}
        {showDistributePrompt && (
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl overflow-hidden"
            style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(2px)' }}>
            <div dir="rtl" className="bg-white rounded-3xl px-8 py-7 flex flex-col gap-4 shadow-2xl mx-6" style={{ maxWidth: 400 }}>
              <p className="text-base font-bold text-gray-900 text-center">הפצת המסמך</p>
              <p className="text-sm text-gray-600 text-center leading-relaxed">
                האם ברצונך להפיץ את המסמך <span className="font-semibold">״{docName}״</span>?
              </p>
              <p className="text-xs text-gray-400 text-center -mt-2">
                הפצת המסמך יעביר את המסמך מטיוטות למסמכים שהופצו
              </p>
              <div className="flex gap-3 justify-center w-full">
                <button onClick={() => { setShowDistributePrompt(false); onApprove(); }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors">
                  לא כרגע
                </button>
                <button onClick={onDistribute}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: '#1B3A6B' }}>
                  הפצת המסמך
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
const MOCK_HML_LIST = [
  { id: 'north', name: 'חמ״ל צפון', users: ['רנ"ג כהן א.', 'סמ"ר לוי מ.'] },
  { id: 'south', name: 'חמ״ל דרום', users: ['סמ"ר גולן ד.', 'רנ"ג פרץ י.'] },
  { id: 'center', name: 'חמ״ל מרכז', users: ['רנ"ג ישראלי ש.', 'סמ"ר רוזן ה.'] },
];
const MOCK_APPROVER_USERS = ['כהן א.', 'לוי מ.', 'גולן ד.', 'פרץ י.', 'ישראלי ש.', 'רוזן ה.', 'מלמד ר.', 'דוד נ.'];

function ApprovalDetailsModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: () => void }) {
  const [selectedRank, setSelectedRank] = useState('');
  const [rankOpen, setRankOpen] = useState(false);
  const [stageUsers, setStageUsers] = useState<Record<string, string[]>>({});
  const [addingUserFor, setAddingUserFor] = useState<string | null>(null);
  const [userSearch, setUserSearch] = useState('');
  const [selectedHmls, setSelectedHmls] = useState<string[]>([]);
  const [hmlOpen, setHmlOpen] = useState(false);
  const [expandedHmls, setExpandedHmls] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState('');

  const rankIndex = APPROVAL_RANKS.indexOf(selectedRank);
  const activeRanks = rankIndex >= 0 ? APPROVAL_RANKS.slice(0, rankIndex + 1) : [];

  const addUser = (rank: string, user: string) => {
    setStageUsers(prev => ({ ...prev, [rank]: [...(prev[rank] ?? []), user] }));
    setAddingUserFor(null);
    setUserSearch('');
  };
  const removeUser = (rank: string, i: number) => {
    setStageUsers(prev => ({ ...prev, [rank]: prev[rank].filter((_, j) => j !== i) }));
  };
  const toggleHml = (id: string) => setSelectedHmls(prev => prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]);
  const toggleExpandHml = (id: string) => setExpandedHmls(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center"
      style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(2px)' }}>
      <div dir="rtl" className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{ width: 580, maxHeight: '90vh' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-base font-semibold text-gray-800">אישור המסמך</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6">

          {/* גורם מאשר */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700">גורם מאשר</label>
            <div className="relative">
              <button onClick={() => setRankOpen(p => !p)}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors">
                <span>{selectedRank || 'בחר גורם מאשר'}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" style={{ transform: rankOpen ? 'rotate(180deg)' : undefined }} />
              </button>
              {rankOpen && (
                <div className="absolute z-10 top-full right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-1 w-full">
                  {APPROVAL_RANKS.map(r => (
                    <button key={r} onClick={() => { setSelectedRank(r); setRankOpen(false); }}
                      className="w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Timeline with inline add */}
          {activeRanks.length > 0 && (
            <div className="flex items-start px-2">
              {activeRanks.map((rank, i) => (
                <React.Fragment key={rank}>
                  <div className="flex flex-col items-center gap-1 relative" style={{ minWidth: 72 }}>
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: '#1B3A6B' }} />
                    <span className="text-[10px] font-semibold text-gray-600 whitespace-nowrap">{rank}</span>
                    {(stageUsers[rank] ?? []).map((u, idx) => (
                      <div key={idx} className="flex items-center gap-1 bg-gray-100 rounded px-1.5 py-0.5 text-[10px] text-gray-700 w-full justify-between mt-0.5">
                        <button onClick={() => removeUser(rank, idx)} className="text-gray-400 hover:text-gray-600 text-xs leading-none flex-shrink-0">×</button>
                        <span className="truncate">{u}</span>
                      </div>
                    ))}
                    {(stageUsers[rank]?.length ?? 0) < 2 && (
                      <button onClick={() => { setAddingUserFor(addingUserFor === rank ? null : rank); setUserSearch(''); }}
                        className="text-[10px] font-semibold text-[#1B3A6B] hover:underline flex items-center gap-0.5 whitespace-nowrap mt-0.5">
                        <Plus className="w-2.5 h-2.5" /> גורם מאשר
                      </button>
                    )}
                    {addingUserFor === rank && (
                      <div className="absolute top-full mt-1 z-20 bg-white border border-gray-200 rounded-xl shadow-lg p-3 flex flex-col gap-2"
                        style={{ minWidth: 200, right: 0 }}>
                        <input type="text" value={userSearch} onChange={e => setUserSearch(e.target.value)}
                          placeholder="חפש מאשר..."
                          dir="rtl"
                          autoFocus
                          className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 outline-none focus:border-gray-300 placeholder-gray-300"
                        />
                        <div className="border border-gray-200 rounded-lg overflow-hidden" style={{ maxHeight: 160, overflowY: 'auto' }}>
                          {MOCK_APPROVER_USERS
                            .filter(u => !(stageUsers[rank] ?? []).includes(u) && (!userSearch || u.includes(userSearch)))
                            .map(u => (
                              <button key={u} onClick={() => addUser(rank, u)}
                                className="w-full text-right px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-0">
                                {u}
                              </button>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {i < activeRanks.length - 1 && (
                    <div className="flex-1 h-px mt-1.5" style={{ background: '#d1d5db', minWidth: 20 }} />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* חמ״לים */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700">חמ״לים שנדרש מולם וידוא קבלה</label>
            <div className="relative">
              <button onClick={() => setHmlOpen(p => !p)}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors">
                <span>{selectedHmls.length > 0 ? `נבחרו ${selectedHmls.length} חמ״לים` : 'בחר חמ״לים'}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" style={{ transform: hmlOpen ? 'rotate(180deg)' : undefined }} />
              </button>
              {hmlOpen && (
                <div className="absolute z-10 top-full right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-1 w-full">
                  {MOCK_HML_LIST.map(hml => (
                    <div key={hml.id}>
                      <div className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50">
                        <button onClick={() => toggleHml(hml.id)}
                          className={`flex-shrink-0 flex items-center justify-center rounded-sm transition-all ${selectedHmls.includes(hml.id) ? 'bg-[#1B3A6B]' : 'border-2 border-gray-300 bg-white'}`}
                          style={{ width: 16, height: 16 }}>
                          {selectedHmls.includes(hml.id) && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                        </button>
                        <span className="flex-1 text-sm text-gray-700">{hml.name}</span>
                        <button onClick={() => toggleExpandHml(hml.id)} className="text-gray-400 hover:text-gray-600 transition-colors">
                          <ChevronDown className="w-3.5 h-3.5" style={{ transform: expandedHmls.has(hml.id) ? 'rotate(180deg)' : undefined }} />
                        </button>
                      </div>
                      {expandedHmls.has(hml.id) && (
                        <div className="pr-10 pb-1">
                          {hml.users.map(u => (
                            <div key={u} className="px-4 py-1 text-xs text-gray-500">{u}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="border-t border-gray-100 mt-1 pt-2 px-4 pb-2 flex justify-end">
                    <button onClick={() => setHmlOpen(false)} className="px-4 py-1.5 rounded-full text-xs font-semibold text-white transition-all hover:opacity-90" style={{ background: '#1B3A6B' }}>
                      הוסף
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* הערות */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700">הערות</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="הוסף הערות לסבב האישורים..."
              dir="rtl" rows={3}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 resize-none outline-none focus:border-gray-300 transition-colors placeholder-gray-300"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <button onClick={onClose}
            className="px-5 py-2 rounded-full text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
            ביטול
          </button>
          <button onClick={onSubmit}
            className="px-6 py-2 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: '#1B3A6B' }}>
            שליחה לאישור
          </button>
        </div>
      </div>
    </div>
  );
}

function ShareDocModal({ docName, onClose, onSend }: { docName: string; onClose: () => void; onSend: () => void }) {
  const emailBody = `מכותבים שלום,\nמצ״ב פקודה ״${docName}״ :\nלחצו כאן למעבר לפקודה\nעיונכם.\nבברכה,`;
  const [body, setBody] = useState(emailBody);

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center"
      style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(2px)' }}>
      <div dir="rtl" className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{ width: 640, maxHeight: '88vh' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-sm font-bold text-gray-800">שיתוף המסמך ב-OUTLOOK ובצאט</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar */}
        <DocToolbar />

        {/* Body */}
        <div className="flex flex-1 overflow-hidden" style={{ minHeight: 260 }}>
          {/* Logo column */}
          <div className="flex flex-col items-center justify-center px-5 py-4 flex-shrink-0" style={{ width: 110 }}>
            <img src="/Chief.svg" alt="לוגו המערכת" style={{ width: 72, height: 72, objectFit: 'contain' }} />
          </div>
          {/* Vertical separator */}
          <div className="w-px self-stretch bg-gray-200 flex-shrink-0" />
          {/* Email text */}
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            dir="rtl"
            className="flex-1 px-5 py-4 text-sm text-gray-700 resize-none outline-none leading-relaxed"
            style={{ fontFamily: 'inherit' }}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 flex-shrink-0">
          <button onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-50 transition-colors">
            סגור
          </button>
          <button onClick={() => { onSend(); onClose(); }}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-colors hover:opacity-90"
            style={{ background: '#1B3A6B' }}>
            שלח
          </button>
        </div>
      </div>
    </div>
  );
}

export function Edit({ navigate, doc }: EditProps) {
  const [docStatus, setDocStatus] = useState(doc?.status ?? 'בסבב אישורים');
  const isReadOnly = ['מבצעית', 'נצורה', 'הסתיימה', 'התבטלה', 'בסבב אישורים', 'ממתין להפצה'].includes(docStatus);
  const isDistributedDoc = ['מבצעית', 'נצורה', 'הסתיימה', 'התבטלה'].includes(docStatus);
  const statusIdx = STATUS_FLOW.indexOf(docStatus);
  const prevStatus = statusIdx > 0 ? STATUS_FLOW[statusIdx - 1] : null;
  const nextStatus = statusIdx < STATUS_FLOW.length - 1 ? STATUS_FLOW[statusIdx + 1] : null;

  const dotColor = STATUS_COLOR[docStatus] ?? '#6b7280';
  const [statusTipPos, setStatusTipPos] = useState<{ x: number; y: number } | null>(null);
  const [openChat, setOpenChat] = useState<{ id: string; title: string; anchorEl: HTMLElement } | null>(null);
  const [unreadChats, setUnreadChats] = useState<Set<string>>(new Set());
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({});
  const [childSectionStatuses, setChildSectionStatuses] = useState<Record<string, 'editing' | 'pending' | 'approved' | 'fix'>>({});
  const [sectionsAwaitingFix, setSectionsAwaitingFix] = useState<Set<string>>(new Set());
  const getChildStatus = (id: string) => childSectionStatuses[id] ?? 'editing';
  const setChildStatus = (id: string, st: 'editing' | 'pending' | 'approved' | 'fix') =>
    setChildSectionStatuses(prev => ({ ...prev, [id]: st }));
  const openChatRef = useRef<typeof openChat>(null);
  useEffect(() => { openChatRef.current = openChat; }, [openChat]);
  const pendingRepliesRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const CHAT_INIT: ChatMessage = { from: 'them', text: 'איך אפשר לעזור בסעיף זה?' };
  const getChatMessages = (id: string): ChatMessage[] => chatMessages[id] ?? [CHAT_INIT];

  const sendChatMsg = (sectionId: string, m: ChatMessage) => {
    setChatMessages(prev => ({ ...prev, [sectionId]: [...(prev[sectionId] ?? [CHAT_INIT]), m] }));
    if (m.from === 'me' && sectionsAwaitingFix.has(sectionId)) {
      setChildStatus(sectionId, 'fix');
      setSectionsAwaitingFix(prev => { const n = new Set(prev); n.delete(sectionId); return n; });
    }
    if (m.from === 'me') {
      const timer = setTimeout(() => {
        pendingRepliesRef.current.delete(sectionId);
        const reply: ChatMessage = { from: 'them', text: 'תודה, נבדוק ונחזור אליך בהקדם.' };
        setChatMessages(prev => ({ ...prev, [sectionId]: [...(prev[sectionId] ?? [CHAT_INIT]), reply] }));
        if (openChatRef.current?.id !== sectionId) {
          setUnreadChats(prev => new Set([...prev, sectionId]));
        }
      }, 1500);
      pendingRepliesRef.current.set(sectionId, timer);
    }
  };

  const markChatRead = (id: string) => setUnreadChats(prev => { const n = new Set(prev); n.delete(id); return n; });

  const toggleChat = (id: string, title: string, el: HTMLElement) => {
    markChatRead(id);
    setOpenChat(openChat?.id === id ? null : { id, title, anchorEl: el });
  };
  const [sectionMenu, setSectionMenu] = useState<{ x: number; y: number; flipped: boolean; actions?: SectionAction[] } | null>(null);
  const [emphasisMenu, setEmphasisMenu] = useState<{ x: number; y: number; flipped: boolean } | null>(null);
  const [permTrigger, setPermTrigger] = useState<{ tab: number } | null>(null);
  const [sectionMenuId, setSectionMenuId] = useState<string | null>(null);
  const [hiddenSections, setHiddenSections] = useState<Set<string>>(new Set());
  const [classifiedSections, setClassifiedSections] = useState<Set<string>>(new Set());
  const [classifiedViewersModal, setClassifiedViewersModal] = useState<string | null>(null); // sectionId
  const [classifiedViewers, setClassifiedViewers] = useState<Record<string, Set<string>>>({}); // sectionId → user ids
  const [classifiedSearch, setClassifiedSearch] = useState('');
  const [sectionInstructions, setSectionInstructions] = useState<Record<string, string>>({}); // sectionId → text
  const [instructionsModal, setInstructionsModal] = useState<{ id: string; title: string } | null>(null);
  const [instructionsDraft, setInstructionsDraft] = useState('');
  const [addMenu, setAddMenu] = useState<{ x: number; y: number } | null>(null);
  const [restoreOpen, setRestoreOpen] = useState(false);
  const [sections, setSections] = useState<Section[]>(MOCK_SECTIONS);
  const [signatures, setSignatures] = useState<string[]>(['']);
  const [showSignatureTemplates, setShowSignatureTemplates] = useState(false);
  const [docZoom, setDocZoom] = useState(100);
  const [docSearchQuery, setDocSearchQuery] = useState('');
  const [showEmphasis, setShowEmphasis] = useState(false);
  const [emphasisText, setEmphasisText] = useState('');
  const [contentHistory, setContentHistory] = useState<Record<string, { stack: string[]; idx: number }>>({});
  const [saveVersionConfirm, setSaveVersionConfirm] = useState<string | null>(null);
  const [sectionFootnotes, setSectionFootnotes] = useState<Record<string, { id: string; text: string }[]>>({});
  const activeTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const setActiveContentRef = useRef<((v: string) => void) | null>(null);

  // File attachments per section child
  const [sectionFiles, setSectionFiles]     = useState<Record<string, File[]>>({});
  const [fileModal,    setFileModal]        = useState<string | null>(null); // childId
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileTargetRef = useRef<string | null>(null);

  const openFilePicker = (childId: string) => {
    fileTargetRef.current = childId;
    fileInputRef.current?.click();
  };
  const onFilesChosen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosen = Array.from(e.target.files ?? []);
    if (!chosen.length || !fileTargetRef.current) return;
    const id = fileTargetRef.current;
    setSectionFiles(prev => ({ ...prev, [id]: [...(prev[id] ?? []), ...chosen] }));
    setFileModal(id);
    e.target.value = '';
  };
  const addMoreFiles = (childId: string) => {
    fileTargetRef.current = childId;
    fileInputRef.current?.click();
  };
  const removeFile = (childId: string, idx: number) =>
    setSectionFiles(prev => {
      const next = [...(prev[childId] ?? [])];
      next.splice(idx, 1);
      return { ...prev, [childId]: next };
    });
  const downloadFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url; a.download = file.name; a.click();
    URL.revokeObjectURL(url);
  };

  // Drag-to-reorder — topics
  const [dragIdx,     setDragIdx]     = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, idx: number) => {
    setDragIdx(idx); e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault(); e.dataTransfer.dropEffect = 'move';
    if (idx !== dragOverIdx) setDragOverIdx(idx);
  };
  const handleDrop = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) { setDragIdx(null); setDragOverIdx(null); return; }
    setSections(prev => { const n = [...prev]; const [m] = n.splice(dragIdx, 1); n.splice(idx, 0, m); return n; });
    setDragIdx(null); setDragOverIdx(null);
  };
  const handleDragEnd = () => { setDragIdx(null); setDragOverIdx(null); };

  // Drag-to-reorder — sections (children of a topic)
  const [dragChildKey,     setDragChildKey]     = useState<{ topicId: string; idx: number } | null>(null);
  const [dragChildOverIdx, setDragChildOverIdx] = useState<number | null>(null);

  const handleChildDragStart = (e: React.DragEvent, topicId: string, idx: number) => {
    e.stopPropagation(); setDragChildKey({ topicId, idx }); e.dataTransfer.effectAllowed = 'move';
  };
  const handleChildDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = 'move';
    if (idx !== dragChildOverIdx) setDragChildOverIdx(idx);
  };
  const handleChildDrop = (e: React.DragEvent, topicId: string, idx: number) => {
    e.preventDefault(); e.stopPropagation();
    if (!dragChildKey || dragChildKey.topicId !== topicId || dragChildKey.idx === idx) { setDragChildKey(null); setDragChildOverIdx(null); return; }
    setSections(prev => prev.map(s => {
      if (s.id !== topicId) return s;
      const n = [...(s.children ?? [])]; const [m] = n.splice(dragChildKey.idx, 1); n.splice(idx, 0, m);
      return { ...s, children: n };
    }));
    setDragChildKey(null); setDragChildOverIdx(null);
  };
  const handleChildDragEnd = () => { setDragChildKey(null); setDragChildOverIdx(null); };

  // Drag-to-reorder — sub-sections (children of a section)
  const [dragSubKey,     setDragSubKey]     = useState<{ topicId: string; childId: string; idx: number } | null>(null);
  const [dragSubOverIdx, setDragSubOverIdx] = useState<number | null>(null);

  const handleSubDragStart = (e: React.DragEvent, topicId: string, childId: string, idx: number) => {
    e.stopPropagation(); setDragSubKey({ topicId, childId, idx }); e.dataTransfer.effectAllowed = 'move';
  };
  const handleSubDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = 'move';
    if (idx !== dragSubOverIdx) setDragSubOverIdx(idx);
  };
  const handleSubDrop = (e: React.DragEvent, topicId: string, childId: string, idx: number) => {
    e.preventDefault(); e.stopPropagation();
    if (!dragSubKey || dragSubKey.topicId !== topicId || dragSubKey.childId !== childId || dragSubKey.idx === idx) { setDragSubKey(null); setDragSubOverIdx(null); return; }
    setSections(prev => prev.map(s => {
      if (s.id !== topicId) return s;
      return { ...s, children: s.children!.map(c => {
        if (c.id !== childId) return c;
        const n = [...(c.children ?? [])]; const [m] = n.splice(dragSubKey.idx, 1); n.splice(idx, 0, m);
        return { ...c, children: n };
      })};
    }));
    setDragSubKey(null); setDragSubOverIdx(null);
  };
  const handleSubDragEnd = () => { setDragSubKey(null); setDragSubOverIdx(null); };

  // Helpers for inline editing in the document body
  const updateTopicTitle = (id: string, title: string) =>
    setSections(prev => prev.map(s => s.id === id ? { ...s, title } : s));
  const updateTopicContent = (id: string, content: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, content } : s));
    pushToHistory(id, content);
  };
  const updateSectionTitle = (topicId: string, childId: string, title: string) =>
    setSections(prev => prev.map(s => s.id === topicId ? { ...s, children: s.children!.map(c => c.id === childId ? { ...c, title } : c) } : s));
  const updateSectionContent = (topicId: string, childId: string, content: string) => {
    setSections(prev => prev.map(s => s.id === topicId ? { ...s, children: s.children!.map(c => c.id === childId ? { ...c, content } : c) } : s));
    pushToHistory(childId, content);
  };
  const updateSubTitle = (topicId: string, childId: string, subId: string, title: string) =>
    setSections(prev => prev.map(s => s.id === topicId ? { ...s, children: s.children!.map(c => c.id === childId ? { ...c, children: c.children!.map(sb => sb.id === subId ? { ...sb, title } : sb) } : c) } : s));
  const updateSubContent = (topicId: string, childId: string, subId: string, content: string) => {
    setSections(prev => prev.map(s => s.id === topicId ? { ...s, children: s.children!.map(c => c.id === childId ? { ...c, children: c.children!.map(sb => sb.id === subId ? { ...sb, content } : sb) } : c) } : s));
    pushToHistory(subId, content);
  };

  const pushToHistory = (id: string, content: string) => {
    setContentHistory(prev => {
      const h = prev[id] ?? { stack: [], idx: -1 };
      if (h.stack[h.idx] === content) return prev;
      const newStack = [...h.stack.slice(0, h.idx + 1), content];
      return { ...prev, [id]: { stack: newStack, idx: newStack.length - 1 } };
    });
  };

  const setContentById = (id: string, content: string) => {
    setSections(prev => prev.map(s => {
      if (s.id === id) return { ...s, content };
      if (!s.children) return s;
      return { ...s, children: s.children.map(c => {
        if (c.id === id) return { ...c, content };
        if (!c.children) return c;
        return { ...c, children: c.children.map(sb => sb.id === id ? { ...sb, content } : sb) };
      })};
    }));
  };

  const handleUndo = (id: string) => {
    setContentHistory(prev => {
      const h = prev[id];
      if (!h || h.idx <= 0) return prev;
      const newIdx = h.idx - 1;
      setContentById(id, h.stack[newIdx]);
      return { ...prev, [id]: { ...h, idx: newIdx } };
    });
  };

  const handleRedo = (id: string) => {
    setContentHistory(prev => {
      const h = prev[id];
      if (!h || h.idx >= h.stack.length - 1) return prev;
      const newIdx = h.idx + 1;
      setContentById(id, h.stack[newIdx]);
      return { ...prev, [id]: { ...h, idx: newIdx } };
    });
  };

  const getHistoryState = (id: string) => {
    const h = contentHistory[id];
    if (!h || h.stack.length === 0) return { canUndo: false, canRedo: false, isInPast: false };
    return { canUndo: h.idx > 0, canRedo: h.idx < h.stack.length - 1, isInPast: h.idx < h.stack.length - 1 };
  };

  const confirmSaveVersion = (id: string) => {
    setContentHistory(prev => {
      const h = prev[id];
      if (!h) return prev;
      return { ...prev, [id]: { stack: h.stack.slice(0, h.idx + 1), idx: h.idx } };
    });
    setSaveVersionConfirm(null);
  };

  // ── Table state ──────────────────────────────────────────────────────────
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [sectionTables, setSectionTables] = useState<Record<string, SectionTable>>({});
  const [activeTableCell, setActiveTableCell] = useState<{ sectionId: string; row: number; col: number } | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const { rows, cols } = (e as CustomEvent<{ rows: number; cols: number }>).detail;
      const sid = activeSectionId;
      if (!sid) return;
      setSectionTables(prev => ({
        ...prev,
        [sid]: { rows, cols, cells: Array.from({ length: rows }, () => Array(cols).fill('')) },
      }));
    };
    window.addEventListener('insert-table', handler);
    return () => window.removeEventListener('insert-table', handler);
  }, [activeSectionId]);

  useEffect(() => {
    const handler = () => {
      const ta = activeTextareaRef.current;
      const sid = activeSectionId;
      const setContent = setActiveContentRef.current;
      if (!ta || !sid || !setContent) return;
      const pos = ta.selectionStart ?? ta.value.length;
      setSectionFootnotes(prev => {
        const existing = prev[sid] ?? [];
        const num = existing.length + 1;
        const marker = SUPERSCRIPT_NUMS[num - 1] ?? `^${num}`;
        const newContent = ta.value.slice(0, pos) + marker + ta.value.slice(pos);
        setContent(newContent);
        setTimeout(() => { ta.focus(); ta.setSelectionRange(pos + marker.length, pos + marker.length); }, 0);
        return { ...prev, [sid]: [...existing, { id: `fn-${Date.now()}`, text: '' }] };
      });
    };
    window.addEventListener('insert-footnote', handler);
    return () => window.removeEventListener('insert-footnote', handler);
  }, [activeSectionId]);

  const [showDistributeProgress, setShowDistributeProgress] = useState(false);
  const [distributeProgress, setDistributeProgress] = useState(0);
  const [distributeComplete, setDistributeComplete] = useState(false);

  useEffect(() => {
    if (!showDistributeProgress || distributeComplete) return;
    const timer = setInterval(() => {
      setDistributeProgress(p => {
        if (p >= 100) { clearInterval(timer); setDistributeComplete(true); return 100; }
        return p + 2;
      });
    }, 60);
    return () => clearInterval(timer);
  }, [showDistributeProgress, distributeComplete]);

  const tblUpdate = (sectionId: string, fn: (t: SectionTable) => SectionTable) =>
    setSectionTables(prev => prev[sectionId] ? { ...prev, [sectionId]: fn(prev[sectionId]) } : prev);

  const tblInsertRowAfter = (sectionId: string, row: number) => tblUpdate(sectionId, t => {
    const empty = Array(t.cols).fill('');
    const cells = [...t.cells.slice(0, row + 1), [...empty], ...t.cells.slice(row + 1)];
    return { ...t, rows: t.rows + 1, cells };
  });
  const tblInsertRowBefore = (sectionId: string, row: number) => tblUpdate(sectionId, t => {
    const empty = Array(t.cols).fill('');
    const cells = [...t.cells.slice(0, row), [...empty], ...t.cells.slice(row)];
    return { ...t, rows: t.rows + 1, cells };
  });
  const tblDeleteRow = (sectionId: string, row: number) => tblUpdate(sectionId, t => {
    if (t.rows <= 1) { setSectionTables(prev => { const n = { ...prev }; delete n[sectionId]; return n; }); return t; }
    const cells = t.cells.filter((_, i) => i !== row);
    return { ...t, rows: t.rows - 1, cells };
  });
  const tblInsertColAfter = (sectionId: string, col: number) => tblUpdate(sectionId, t => ({
    ...t, cols: t.cols + 1,
    cells: t.cells.map(r => [...r.slice(0, col + 1), '', ...r.slice(col + 1)]),
  }));
  const tblInsertColBefore = (sectionId: string, col: number) => tblUpdate(sectionId, t => ({
    ...t, cols: t.cols + 1,
    cells: t.cells.map(r => [...r.slice(0, col), '', ...r.slice(col)]),
  }));
  const tblDeleteCol = (sectionId: string, col: number) => tblUpdate(sectionId, t => {
    if (t.cols <= 1) { setSectionTables(prev => { const n = { ...prev }; delete n[sectionId]; return n; }); return t; }
    return { ...t, cols: t.cols - 1, cells: t.cells.map(r => r.filter((_, i) => i !== col)) };
  });
  const tblDeleteTable = (sectionId: string) =>
    setSectionTables(prev => { const n = { ...prev }; delete n[sectionId]; return n; });
  const tblUpdateCell = (sectionId: string, row: number, col: number, value: string) =>
    tblUpdate(sectionId, t => ({
      ...t, cells: t.cells.map((r, ri) => ri === row ? r.map((c, ci) => ci === col ? value : c) : r),
    }));
  // ─────────────────────────────────────────────────────────────────────────

  const [editingNewId, setEditingNewId] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const closeFilterPanel = useCallback(() => setShowFilterPanel(false), []);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [showEditDocModal, setShowEditDocModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [showApprovalFlow, setShowApprovalFlow] = useState(false);
  const [showApprovalChangedWarning, setShowApprovalChangedWarning] = useState(false);
  const [showApprovalDetails, setShowApprovalDetails] = useState(false);
  const [showApprovalRound, setShowApprovalRound] = useState(false);
  const [showDistributeModal, setShowDistributeModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showIssueUpdateModal, setShowIssueUpdateModal] = useState(false);
  const [showIssueNewModal, setShowIssueNewModal] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const toggleTopic = (id: string) => setExpandedTopics(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  // Context menu for section/child items (3-dots)
  const [itemMenu, setItemMenu] = useState<{ id: string; type: 'topic' | 'section' | 'subsection'; x: number; y: number; onDelete: () => void; onRename: () => void } | null>(null);
  const itemMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!itemMenu) return;
    const h = (e: MouseEvent) => { if (itemMenuRef.current && !itemMenuRef.current.contains(e.target as Node)) setItemMenu(null); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [itemMenu]);

  // Delete confirmation from 3-dots menu
  const [pendingDelete, setPendingDelete] = useState<{ label: string; onConfirm: () => void } | null>(null);

  const [renamingId, setRenamingId] = useState<string | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; x: number; y: number } | null>(null);
  const deleteConfirmRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!deleteConfirm) return;
    const h = (e: MouseEvent) => {
      if (deleteConfirmRef.current && !deleteConfirmRef.current.contains(e.target as Node))
        setDeleteConfirm(null);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [deleteConfirm]);

  const openDeleteConfirm = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDeleteConfirm({ id, x: rect.right + 6, y: rect.top });
  };

  const confirmDelete = () => {
    if (!deleteConfirm) return;
    setSections(prev => prev.filter(s => s.id !== deleteConfirm.id));
    setDeleteConfirm(null);
  };

  const openRestorePanel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRestoreOpen(true);
  };

  const openAddMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setAddMenu({ x: rect.left, y: window.innerHeight - rect.top + 8 });
  };

  const handleAddAction = (label: string) => {
    if (label === 'יצירת נושא חדש') {
      const id = `new-${Date.now()}`;
      setSections(prev => [...prev, { id, title: '' }]);
      setEditingNewId(id);
    } else if (label === 'הוספת נספחים') {
      const appendixCount = sections.filter(s => s.title.startsWith('נספח')).length;
      const heLetters = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳'];
      const label2 = heLetters[appendixCount] ?? `${appendixCount + 1}`;
      setSections(prev => [...prev, { id: `appendix-${Date.now()}`, title: `נספח ${label2}` }]);
    } else if (label === 'יבוא סעיפים ממסמך אחר') {
      setShowImportModal(true);
    } else if (label === 'הוספת דגשים לכתיבת המסמך') {
      setShowEmphasis(true);
    }
  };

  const saveNewSection = (id: string, title: string) => {
    if (!title) {
      setSections(prev => prev.filter(s => s.id !== id));
    } else {
      setSections(prev => prev.map(s => s.id === id ? { ...s, title } : s));
    }
    setEditingNewId(null);
  };
  const paperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // rAF ensures the browser has fully painted and all CSS (min-height, sticky, etc.)
    // is resolved before we measure and adjust box positions.
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => {
      const paper = paperRef.current;
      if (!paper) return;

      const probe = document.createElement('div');
      probe.style.cssText = 'position:fixed;top:0;left:0;width:297mm;height:0;visibility:hidden;pointer-events:none;';
      document.body.appendChild(probe);
      const pageHeightPx = probe.getBoundingClientRect().width;
      document.body.removeChild(probe);

      const boxes = Array.from(paper.querySelectorAll<HTMLElement>('[data-page-box]'));
      boxes.forEach(box => { box.style.marginTop = ''; });

      const topPadPx = pageHeightPx / 297 * 16; // 16 mm — matches the document's top margin

      // Pass 1 — push boxes that cross a break: land them topPadPx below the break.
      // The previous sibling's marginBottom collapses with our marginTop, so we add
      // it back so the element moves by exactly (breakY - relTop + topPadPx).
      for (const box of boxes) {
        const paperTop = paper.getBoundingClientRect().top;
        const rect = box.getBoundingClientRect();
        const relTop = rect.top - paperTop;
        const relBottom = relTop + rect.height;
        const breakY = (Math.floor(relTop / pageHeightPx) + 1) * pageHeightPx;
        if (relTop < breakY && relBottom > breakY) {
          const prev = box.previousElementSibling as HTMLElement | null;
          const collapsedAbove = prev ? parseFloat(window.getComputedStyle(prev).marginBottom) : 0;
          box.style.marginTop = `${breakY - relTop + topPadPx + collapsedAbove}px`;
        }
      }

      // Pass 2 — clear any residual crossing (no extra topPad)
      for (const box of boxes) {
        const paperTop = paper.getBoundingClientRect().top;
        const rect = box.getBoundingClientRect();
        const relTop = rect.top - paperTop;
        const relBottom = relTop + rect.height;
        const breakY = (Math.floor(relTop / pageHeightPx) + 1) * pageHeightPx;
        if (relTop < breakY && relBottom > breakY) {
          const cur = parseFloat(box.style.marginTop || '0');
          box.style.marginTop = `${cur + (breakY - relTop) + 2}px`;
        }
      }
    }));
    return () => cancelAnimationFrame(raf);
  }, []);

  const openSectionMenu = (e: React.MouseEvent, id?: string, actions?: SectionAction[]) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const flipped = rect.bottom > window.innerHeight * 0.6;
    setSectionMenuId(id ?? null);
    setSectionMenu({ x: rect.left, y: flipped ? window.innerHeight - rect.top + 4 : rect.bottom + 4, flipped, actions });
  };

  const openEmphasisMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const flipped = rect.bottom > window.innerHeight * 0.6;
    setEmphasisMenu({ x: rect.left, y: flipped ? window.innerHeight - rect.top + 4 : rect.bottom + 4, flipped });
  };

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #F6F9FC 0%, #F8FAFB 20%, #FAF8FA 35%, #FBF7F9 50%, #FAF5F1 65%, #F9F3ED 85%, #F9F3ED 100%)',
      backgroundAttachment: 'fixed',
    }} dir="rtl">
      <TopNavbar showBackArrow={true} isPersonalAreaActive={false} navigate={navigate} showDocActions={true}
        onFilterClick={() => setShowFilterPanel(p => !p)}
        onEditDocClick={() => setShowEditDocModal(true)}
        onDuplicateClick={() => setShowDuplicateModal(true)}
        onZoomChange={setDocZoom}
        onDocSearch={setDocSearchQuery}
        permTrigger={permTrigger}
        onPermTriggerUsed={() => setPermTrigger(null)}
        docStatus={docStatus}
        onIssueUpdate={() => setShowIssueUpdateModal(true)}
        onIssueNew={() => setShowIssueNewModal(true)} />
      {showFilterPanel && <FilterPanel onClose={closeFilterPanel} appliedFilters={activeFilters} onApply={setActiveFilters} />}

      {/* Doc metadata pill — 1cm wider than A4 on each side */}
      <div style={{ width: '100%', flexShrink: 0, zIndex: 21, paddingBottom: 6, paddingTop: 6, paddingRight: 256, display: 'flex', justifyContent: 'center' }}>
        <div className="flex items-center gap-0 rounded-2xl px-4 py-2"
          style={{ width: '230mm', background: '#EBEBEB', direction: 'rtl' }}>
          {[
            <span key="name" className="text-xs font-bold text-gray-800 whitespace-nowrap">
              {doc?.name ?? 'שם הפקודה'}&nbsp;<span className="font-normal text-gray-500">(ארגון א׳)</span>
            </span>,
            <span key="template"  className="text-xs text-gray-600 whitespace-nowrap">מסמך בטיחות</span>,
            <span key="orderNum"  className="text-xs text-gray-600 whitespace-nowrap">מס׳ {doc?.orderNum ?? '001'}</span>,
            <span key="dept"      className="text-xs text-gray-600 whitespace-nowrap">משאבי אנוש</span>,
            <span key="effective" className="text-xs text-gray-600 whitespace-nowrap">כניסה לתוקף 01/06/2026</span>,
            <span key="class"     className="text-xs text-gray-600 whitespace-nowrap">בלמ״ס</span>,
            <span key="ref"       className="text-xs text-gray-600 whitespace-nowrap">סימוכין פ.מ. 12/2025</span>,
          ].map((item, i) => (
            <div key={i} className="flex items-center">
              {i > 0 && <span className="text-gray-400 mx-2.5 text-xs">|</span>}
              {item}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Right sidebar */}
        <aside className="w-64 flex-shrink-0 flex flex-col overflow-visible z-10 relative px-4 py-5 before:content-[''] before:absolute before:left-0 before:top-6 before:bottom-6 before:w-[1px] before:bg-[#E5E5E5]">

          {/* Status header */}
          <div className="mb-4" dir="rtl">
            {/* Title — no background, no border */}
            <div className="flex items-center gap-2 px-1 mb-2">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: dotColor }} />
              <span className="text-base font-bold" style={{ color: '#1B3A6B' }}>מסמך {docStatus}</span>
              {(docStatus === 'טיוטה פנימית' || docStatus === 'בהכנה') && (() => {
                const tip = docStatus === 'טיוטה פנימית'
                  ? "רק בעלי פקודה יכולים לצפות במסמך זה. כדי שכלל העורכים יראו את המסמך, הפץ את המסמך לסטטוס ׳בהכנה׳"
                  : "כל העורכים יכולים לראות מסמך זה";
                return (
                  <>
                    <div className="flex-shrink-0">
                      <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center cursor-default"
                        style={{ fontSize: 10, color: '#6b7280', fontWeight: 700, lineHeight: 1 }}
                        onMouseEnter={e => { const r = (e.currentTarget as HTMLElement).getBoundingClientRect(); setStatusTipPos({ x: r.right, y: r.top }); }}
                        onMouseLeave={() => setStatusTipPos(null)}>
                        !
                      </div>
                    </div>
                    {statusTipPos && (
                      <div className="fixed z-[9999]"
                        style={{ background: '#EBEBEB', color: '#1f2937', fontSize: 12, fontWeight: 400, borderRadius: 6, padding: '5px 9px', lineHeight: 1.5, boxShadow: '0 2px 6px rgba(0,0,0,0.10)', direction: 'rtl', textAlign: 'right', width: 220, right: window.innerWidth - statusTipPos.x, top: statusTipPos.y - 48, pointerEvents: 'none' }}>
                        {tip}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
            {/* Progress stats — shown only for draft statuses */}
            {(docStatus === 'בהכנה' || docStatus === 'טיוטה פנימית') && (
              <div className="flex flex-col gap-1 px-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-500 whitespace-nowrap">0/3 סעיפים בהכנה</span>
                  <div className="flex-1 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                    <div className="h-full rounded-full bg-amber-400" style={{ width: '0%' }} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-500 whitespace-nowrap">2/5 סעיפים אושרו</span>
                  <div className="flex-1 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: '40%', background: '#1B3A6B' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Status navigation */}
          <div className="flex flex-col gap-2 mb-5">
            {docStatus === 'ממתין להפצה' ? (
              <>
                <button onClick={() => setShowDistributeModal(true)}
                  className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-sm font-semibold w-full transition-all hover:opacity-90 active:scale-95"
                  style={{ background: '#1B3A6B', color: '#fff', boxShadow: '0 2px 8px rgba(27,58,107,0.3)' }}>
                  <span className="flex-1 text-right">הפץ מסמך</span>
                  <ChevronLeft className="w-3.5 h-3.5 flex-shrink-0" />
                </button>
                <button onClick={() => setDocStatus('בהכנה')}
                  className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl text-xs text-gray-500 w-full transition-all hover:bg-white/70 border border-gray-200">
                  <span className="flex-1 text-right">החזר לעריכה</span>
                  <ChevronLeft className="w-3 h-3 flex-shrink-0 rotate-180 text-gray-400" />
                </button>
              </>
            ) : (
              <>
                {nextStatus && (!isReadOnly || docStatus === 'בסבב אישורים') && (
                  <button onClick={() => docStatus === 'בסבב אישורים' ? setShowApprovalRound(true) : nextStatus === 'בסבב אישורים' ? setShowApprovalFlow(true) : setDocStatus(nextStatus)}
                    className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-sm font-semibold w-full transition-all hover:opacity-90 active:scale-95"
                    style={{ background: '#1B3A6B', color: '#fff', boxShadow: '0 2px 8px rgba(27,58,107,0.3)' }}>
                    <span className="flex-1 text-right">{docStatus === 'בסבב אישורים' ? 'אישור/דחיית המסמך' : nextStatus === 'בסבב אישורים' ? 'העבר לסבב אישורים' : `העבר ל${nextStatus}`}</span>
                    <ChevronLeft className="w-3.5 h-3.5 flex-shrink-0" />
                  </button>
                )}
                {prevStatus && (!isReadOnly || docStatus === 'בסבב אישורים') && (
                  <button onClick={() => setDocStatus(prevStatus)}
                    className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl text-xs text-gray-500 w-full transition-all hover:bg-white/70 border border-gray-200">
                    <span className="flex-1 text-right">{docStatus === 'בסבב אישורים' ? 'החזר לעריכה' : `החזר למסמך ${prevStatus}`}</span>
                    <ChevronLeft className="w-3 h-3 flex-shrink-0 rotate-180 text-gray-400" />
                  </button>
                )}
              </>
            )}
          </div>

          <div className="h-px bg-gray-200 mb-4" />

          {/* Template-creation style section tree */}
          <div className="flex-1 overflow-y-auto min-h-0 flex flex-col gap-0 pb-1">


            {/* Topic list */}
            <div className="flex flex-col gap-1">
              {sections.map((section, sIdx) => (
                <div key={section.id}
                  onDragOver={e => handleDragOver(e, sIdx)}
                  onDrop={e => handleDrop(e, sIdx)}
                  style={{
                    borderTop: dragOverIdx === sIdx && dragIdx !== null && dragIdx > sIdx
                      ? '2px solid #1B3A6B' : '2px solid transparent',
                    borderBottom: dragOverIdx === sIdx && dragIdx !== null && dragIdx < sIdx
                      ? '2px solid #1B3A6B' : '2px solid transparent',
                    borderRadius: 10,
                    transition: 'border-color 0.12s',
                    opacity: dragIdx === sIdx ? 0.4 : 1,
                  }}>

                  {/* Topic row */}
                  <div
                    className="flex items-center gap-1.5 px-2 py-2 rounded-xl group transition-colors cursor-pointer hover:bg-white"
                    dir="rtl"
                    draggable
                    onDragStart={e => handleDragStart(e, sIdx)}
                    onDragEnd={handleDragEnd}
                    onClick={() => editingNewId !== section.id && toggleTopic(section.id)}>
                    {!isReadOnly && <GripHorizontal
                      className="w-3.5 h-3.5 flex-shrink-0 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                      onMouseDown={e => e.stopPropagation()}
                    />}
                    <ChevronLeft
                      className="w-3.5 h-3.5 flex-shrink-0 text-[#1B3A6B]/50 transition-transform duration-200"
                      style={{ transform: expandedTopics.has(section.id) ? 'rotate(-90deg)' : 'rotate(0deg)' }}
                    />
                    {editingNewId === section.id ? (
                      <input
                        autoFocus
                        defaultValue={section.title}
                        onClick={e => e.stopPropagation()}
                        onBlur={e => saveNewSection(section.id, e.target.value.trim())}
                        onKeyDown={e => {
                          if (e.key === 'Enter') { e.preventDefault(); saveNewSection(section.id, (e.target as HTMLInputElement).value.trim()); }
                          if (e.key === 'Escape') saveNewSection(section.id, '');
                        }}
                        className="flex-1 bg-transparent border-b border-[#1B3A6B] outline-none text-sm font-semibold text-gray-800 text-right min-w-0"
                        placeholder="שם הנושא..." dir="rtl"
                      />
                    ) : renamingId === section.id ? (
                      <input
                        autoFocus
                        defaultValue={section.title}
                        onClick={e => e.stopPropagation()}
                        onBlur={e => { setSections(prev => prev.map(s => s.id === section.id ? { ...s, title: e.target.value || s.title } : s)); setRenamingId(null); }}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Escape') (e.target as HTMLInputElement).blur(); }}
                        className="flex-1 bg-transparent border-b border-[#1B3A6B] outline-none text-sm font-semibold text-gray-800 text-right min-w-0"
                        dir="rtl"
                      />
                    ) : (
                      <span className="flex-1 text-sm font-semibold truncate" style={{ color: '#1B3A6B' }}>{section.title}</span>
                    )}
                    <button
                      title="אפשרויות"
                      onClick={e => { e.stopPropagation(); const rect = (e.currentTarget as HTMLElement).getBoundingClientRect(); setItemMenu({ id: section.id, type: 'topic', x: window.innerWidth - rect.left + 4, y: rect.top, onDelete: () => { setItemMenu(null); setPendingDelete({ label: 'נושא זה', onConfirm: () => { setSections(prev => prev.filter(s => s.id !== section.id)); setPendingDelete(null); } }); }, onRename: () => { setRenamingId(section.id); setItemMenu(null); } }); }}
                      className={`p-1 rounded-full text-[#1B3A6B] hover:bg-gray-200/70 transition-all flex-shrink-0 ${isReadOnly ? 'hidden' : 'opacity-0 group-hover:opacity-100'}`}>
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Section children — aligned with title start */}
                  {section.children && expandedTopics.has(section.id) && (
                    <div className="flex flex-col gap-1 mb-1" style={{ paddingRight: 30 }}>
                      {section.children.map((child, ci) => (
                        <div key={child.id} dir="rtl"
                          onDragOver={e => handleChildDragOver(e, ci)}
                          onDrop={e => handleChildDrop(e, section.id, ci)}
                          style={{
                            borderTop: dragChildOverIdx === ci && dragChildKey?.topicId === section.id && dragChildKey.idx > ci ? '2px solid #1B3A6B' : '2px solid transparent',
                            borderBottom: dragChildOverIdx === ci && dragChildKey?.topicId === section.id && dragChildKey.idx < ci ? '2px solid #1B3A6B' : '2px solid transparent',
                            borderRadius: 8, transition: 'border-color 0.12s',
                            opacity: dragChildKey?.topicId === section.id && dragChildKey.idx === ci ? 0.4 : 1,
                          }}>
                          {/* Child row */}
                          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl group transition-colors cursor-pointer hover:bg-white" dir="rtl"
                            draggable
                            onDragStart={e => handleChildDragStart(e, section.id, ci)}
                            onDragEnd={handleChildDragEnd}>
                            {!isReadOnly && <GripHorizontal
                              className="w-3 h-3 flex-shrink-0 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                              onMouseDown={e => e.stopPropagation()}
                            />}
                            <span className="text-xs font-bold text-gray-500 flex-shrink-0 w-4 text-right">{ci + 1}.</span>
                            {renamingId === child.id ? (
                              <input
                                autoFocus
                                defaultValue={child.title}
                                onClick={e => e.stopPropagation()}
                                onBlur={e => { setSections(prev => prev.map(s => s.id === section.id ? { ...s, children: s.children!.map(c => c.id === child.id ? { ...c, title: e.target.value || c.title } : c) } : s)); setRenamingId(null); }}
                                onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Escape') (e.target as HTMLInputElement).blur(); }}
                                className="flex-1 bg-transparent border-b border-[#1B3A6B] outline-none text-xs text-gray-800 text-right min-w-0"
                                dir="rtl"
                              />
                            ) : (
                              <span className="flex-1 text-xs text-gray-700 truncate">{child.title}</span>
                            )}
                            {!isDistributedDoc && section.status && (
                              <span style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, background: SECTION_STATUS_COLOR[section.status] }} />
                            )}
                            <button
                              title="אפשרויות"
                              onClick={e => { e.stopPropagation(); const rect = (e.currentTarget as HTMLElement).getBoundingClientRect(); setItemMenu({ id: child.id, type: 'section', x: window.innerWidth - rect.left + 4, y: rect.top, onDelete: () => { setItemMenu(null); setPendingDelete({ label: 'סעיף זה', onConfirm: () => { setSections(prev => prev.map(s => s.id === section.id ? { ...s, children: s.children!.filter(c => c.id !== child.id) } : s)); setPendingDelete(null); } }); }, onRename: () => { setRenamingId(child.id); setItemMenu(null); } }); }}
                              className={`p-1 rounded-full text-[#1B3A6B] hover:bg-gray-200/70 transition-colors flex-shrink-0 ${isReadOnly ? 'hidden' : ''}`}>
                              <MoreVertical className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Sub-children */}
                          {child.children && child.children.map((sub, si) => (
                            <div key={sub.id}
                              onDragOver={e => handleSubDragOver(e, si)}
                              onDrop={e => handleSubDrop(e, section.id, child.id, si)}
                              style={{
                                borderTop: dragSubOverIdx === si && dragSubKey?.topicId === section.id && dragSubKey.childId === child.id && dragSubKey.idx > si ? '2px solid #1B3A6B' : '2px solid transparent',
                                borderBottom: dragSubOverIdx === si && dragSubKey?.topicId === section.id && dragSubKey.childId === child.id && dragSubKey.idx < si ? '2px solid #1B3A6B' : '2px solid transparent',
                                borderRadius: 6, transition: 'border-color 0.12s',
                                opacity: dragSubKey?.topicId === section.id && dragSubKey.childId === child.id && dragSubKey.idx === si ? 0.4 : 1,
                              }}>
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl group transition-colors cursor-pointer hover:bg-white" style={{ paddingRight: 28 }} dir="rtl"
                              draggable
                              onDragStart={e => handleSubDragStart(e, section.id, child.id, si)}
                              onDragEnd={handleSubDragEnd}>
                              {!isReadOnly && <GripHorizontal
                                className="w-3 h-3 flex-shrink-0 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                                onMouseDown={e => e.stopPropagation()}
                              />}
                              <span className="text-[10px] text-gray-400 flex-shrink-0 w-5 text-right">{HE_ALPHA[si]}.</span>
                              {renamingId === sub.id ? (
                                <input
                                  autoFocus
                                  defaultValue={sub.title}
                                  onClick={e => e.stopPropagation()}
                                  onBlur={e => { setSections(prev => prev.map(s => s.id === section.id ? { ...s, children: s.children!.map(c => c.id === child.id ? { ...c, children: c.children!.map(sb => sb.id === sub.id ? { ...sb, title: e.target.value || sb.title } : sb) } : c) } : s)); setRenamingId(null); }}
                                  onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Escape') (e.target as HTMLInputElement).blur(); }}
                                  className="flex-1 bg-transparent border-b border-[#1B3A6B] outline-none text-xs text-gray-700 text-right min-w-0"
                                  dir="rtl"
                                />
                              ) : (
                                <span className="flex-1 text-xs text-gray-500 truncate">{sub.title}</span>
                              )}
                              <button
                                title="אפשרויות"
                                onClick={e => { e.stopPropagation(); const rect = (e.currentTarget as HTMLElement).getBoundingClientRect(); setItemMenu({ id: sub.id, type: 'subsection', x: window.innerWidth - rect.left + 4, y: rect.top, onDelete: () => { setItemMenu(null); setPendingDelete({ label: 'תת סעיף זה', onConfirm: () => { setSections(prev => prev.map(s => s.id === section.id ? { ...s, children: s.children!.map(c => c.id === child.id ? { ...c, children: c.children!.filter(sb => sb.id !== sub.id) } : c) } : s)); setPendingDelete(null); } }); }, onRename: () => { setRenamingId(sub.id); setItemMenu(null); } }); }}
                                className={`p-1 rounded-full text-[#1B3A6B] hover:bg-gray-200/70 transition-colors flex-shrink-0 ${isReadOnly ? 'hidden' : ''}`}>
                                <MoreVertical className="w-3 h-3" />
                              </button>
                            </div>
                            </div>
                          ))}

                          {/* Add sub-section */}
                          {!isReadOnly && <div style={{ paddingRight: 28 }} dir="rtl">
                            <button
                              className="text-right text-[11px] text-gray-400 hover:text-gray-600 transition-colors"
                              onClick={e => { e.stopPropagation(); const id = `sub-${Date.now()}`; setSections(prev => prev.map(s => s.id === section.id ? { ...s, children: s.children!.map(c => c.id === child.id ? { ...c, children: [...(c.children ?? []), { id, title: `תת סעיף ${HE_ALPHA[(c.children?.length ?? 0)]}` }] } : c) } : s)); }}>
                              + תת סעיף
                            </button>
                          </div>}
                        </div>
                      ))}

                      {/* Add section */}
                      {!isReadOnly && <div className="pb-1" dir="rtl">
                        <button
                          className="text-right text-xs font-semibold text-[#1B3A6B] hover:text-[#152e54] transition-colors"
                          onClick={e => { e.stopPropagation(); const id = `child-${Date.now()}`; setSections(prev => prev.map(s => s.id === section.id ? { ...s, children: [...(s.children ?? []), { id, title: `סעיף ${(s.children?.length ?? 0) + 1}` }] } : s)); }}>
                          + הוספת סעיף
                        </button>
                      </div>}
                    </div>
                  )}

                  {/* No children — show add section link only when expanded */}
                  {!section.children && expandedTopics.has(section.id) && !isReadOnly && (
                    <div className="pb-1.5" style={{ paddingRight: 30 }} dir="rtl">
                      <button
                        className="text-right text-xs font-semibold text-[#1B3A6B] hover:text-[#152e54] transition-colors"
                        onClick={e => { e.stopPropagation(); const id = `child-${Date.now()}`; setSections(prev => prev.map(s => s.id === section.id ? { ...s, children: [{ id, title: 'סעיף 1' }] } : s)); }}>
                        + הוספת סעיף
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>

          {/* Bottom icons */}
          <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-2 mt-2">
            {!isReadOnly && <button
              title="שחזר סעיף שנמחק"
              onClick={openRestorePanel}
              className="p-2 rounded-full text-white transition-colors hover:opacity-90"
              style={{ background: '#1B3A6B', boxShadow: '0 2px 8px rgba(27,58,107,0.3)' }}>
              <RotateCcw className="w-4 h-4" />
            </button>}
            {!isReadOnly && <button
              title="הוסף סעיף / נושא"
              onClick={openAddMenu}
              className="p-2 rounded-full text-white transition-colors hover:opacity-90"
              style={{ background: '#1B3A6B', boxShadow: '0 2px 8px rgba(27,58,107,0.3)' }}>
              <Plus className="w-4 h-4" />
            </button>}
          </div>
        </aside>

        {/* Main editor area — Docs/Word style */}
        <main className="flex-1 overflow-y-auto">
          <div className="flex flex-col items-center pt-6 gap-0">

            {/* Toolbar — sticky at top of scroll area */}
            <div style={{ width: '210mm', position: 'sticky', top: 0, zIndex: 20, overflow: 'hidden' }}>
              {/* Active filter chips — between metadata pill and Word toolbar */}
              {activeFilters.size > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap px-3 py-1.5 border-b border-gray-100" style={{ background: 'white', direction: 'rtl' }}>
                  <span className="text-[10px] text-gray-400 flex-shrink-0">מסונן:</span>
                  {FILTER_STATUSES.filter(s => activeFilters.has(s.id)).map(s => (
                    <span key={s.id} className="inline-flex items-center gap-1 pl-1 pr-2 py-0.5 rounded-full text-[10px] font-medium"
                      style={{ background: s.color + '18', color: s.color, border: `1px solid ${s.color}40` }}>
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                      {s.label}
                      <button onClick={() => setActiveFilters(prev => { const n = new Set(prev); n.delete(s.id); return n; })}
                        className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity mr-0.5">
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                  <button onClick={() => setActiveFilters(new Set())}
                    className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors mr-1">
                    נקה הכל
                  </button>
                </div>
              )}
              {!isReadOnly && <DocToolbar />}
            </div>

            {/* Continuous document — sections as white boxes, A4 page-break lines in background */}
            <div ref={paperRef} style={{
              width: '210mm',
              minHeight: '297mm',
              backgroundColor: 'white',
              boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
              direction: 'rtl',
              position: 'relative',
              zoom: docZoom / 100,
              /* subtle dashed line every A4 page */
              backgroundImage: [
                'repeating-linear-gradient(',
                '  to bottom,',
                '  transparent 0,',
                '  transparent calc(297mm - 1.5px),',
                '  #cbd5e1 calc(297mm - 1.5px),',
                '  #cbd5e1 297mm',
                ')',
              ].join(''),
            }}>
              <div style={{ padding: '16mm 20mm 20mm 20mm' }}>

                {/* ── Document header block ── */}
                <DocHeader readOnly={isReadOnly} />

                {/* ── Writing emphasis block ── */}
                {showEmphasis && (
                  <div style={{
                    background: '#fffbeb', border: '1px solid #fcd34d',
                    borderRadius: 12, padding: '14px 16px', marginBottom: '8mm',
                    direction: 'rtl',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35em', marginBottom: 10, direction: 'rtl' }}>
                      <Lightbulb style={{ width: 14, height: 14, color: '#b45309', flexShrink: 0 }} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#92400e', flex: 1 }}>דגשים לכתיבה</span>
                      {/* Action row — same as section headings */}
                      <div className="flex items-center gap-0.5" style={{ flexShrink: 0 }}>
                        {!isReadOnly && <span style={{ fontSize: 9, color: '#b0b7c3', marginLeft: 6, marginRight: 2, whiteSpace: 'nowrap' }}>
                          עודכן ב‏25-06-2026 11:18 ע״י s2345678
                        </span>}
                        <button title="העתק" className="p-1 rounded hover:bg-amber-100 transition-colors text-gray-400 hover:text-gray-600">
                          <Copy className="w-3 h-3" />
                        </button>
                        {!isReadOnly && <>
                          <button title="הוספת קבצים" className="p-1 rounded hover:bg-amber-100 transition-colors text-gray-400 hover:text-gray-600">
                            <Paperclip className="w-3 h-3" />
                          </button>
                          <button title="צאט" className="p-1 rounded hover:bg-amber-100 transition-colors text-gray-400 hover:text-gray-600">
                            <MessageSquare className="w-3 h-3" />
                          </button>
                        </>}
                        <button title="אפשרויות" onClick={openEmphasisMenu}
                          className="p-1 rounded hover:bg-amber-100 transition-colors text-gray-400 hover:text-gray-600">
                          <MoreHorizontal className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={emphasisText}
                      onChange={e => { setEmphasisText(e.target.value); e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                      ref={el => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }}
                      placeholder="הזן דגשים לכתיבת המסמך..."
                      dir="rtl"
                      rows={3}
                      style={{
                        width: '100%', background: 'transparent', border: 'none', outline: 'none',
                        fontSize: 11, color: '#374151', resize: 'none', overflow: 'hidden',
                        fontFamily: 'inherit', lineHeight: 1.7, textAlign: 'right',
                      }}
                      className="placeholder-amber-300"
                    />
                  </div>
                )}

                {(() => {
                  let secCounter = 0; // global section counter across topics
                  const sq = docSearchQuery.trim().toLowerCase();
                  return sections.map((section) => {
                  const topicMatch = sq && (section.title?.toLowerCase().includes(sq) || section.content?.toLowerCase().includes(sq));
                  return (
                  <div key={section.id} {...(!section.children ? { 'data-page-box': '' } : {})} style={{ marginBottom: '10mm', borderRadius: 8, outline: topicMatch ? '2px solid #fbbf24' : 'none', outlineOffset: 4 }}>

                    {/* Topic heading — editable, syncs to sidebar */}
                    <div style={{ marginBottom: '4mm', paddingBottom: '1.5mm', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', direction: 'rtl' }}>
                      <input
                        value={section.title}
                        onChange={e => updateTopicTitle(section.id, e.target.value)}
                        placeholder="שם הנושא"
                        dir="rtl"
                        style={{
                          flex: 1, fontSize: 14, fontWeight: 700, color: '#1e293b',
                          background: 'transparent', border: 'none', outline: 'none',
                          textAlign: 'right', padding: '2px 4px', borderRadius: 4,
                        }}
                        className="hover:bg-gray-50 focus:bg-gray-50 transition-colors rounded"
                      />
                      {/* Action buttons for signatures section */}
                      {!section.children && section.title === 'חתימות' && !isReadOnly && (
                        <div className="flex items-center gap-1.5" style={{ flexShrink: 0 }}>
                          <button
                            onClick={() => setShowSignatureTemplates(true)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 4,
                              fontSize: 11, fontWeight: 600, color: '#1B3A6B',
                              background: '#EEF4FF', border: '1px solid #c7d7f5',
                              borderRadius: 8, padding: '4px 10px', cursor: 'pointer',
                            }}>
                            <FileText style={{ width: 12, height: 12 }} />
                            התבניות שלי
                          </button>
                          <button
                            onClick={() => setSignatures(prev => [...prev, ''])}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 4,
                              fontSize: 11, fontWeight: 600, color: '#374151',
                              background: '#f9fafb', border: '1px solid #e5e7eb',
                              borderRadius: 8, padding: '4px 10px', cursor: 'pointer',
                            }}>
                            <Plus style={{ width: 12, height: 12 }} />
                            הוספת חתימה נוספת
                          </button>
                        </div>
                      )}
                      {/* Action icons row — only for leaf topics (appendices etc.), not signatures */}
                      {!section.children && section.title !== 'חתימות' && (
                        <div className="flex items-center gap-0.5" style={{ flexShrink: 0 }}>
                          {!isReadOnly && <span style={{ fontSize: 9, color: '#b0b7c3', marginLeft: 4, marginRight: 2, whiteSpace: 'nowrap' }}>
                            עודכן ב‏25-06-2026 11:18 ע״י s2345678
                          </span>}
                          <button title="העתק" className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
                            <Copy className="w-3 h-3" />
                          </button>
                          {!isReadOnly && <>
                            <button title="הוספת קבצים"
                              onClick={e => { e.stopPropagation(); openFilePicker(section.id); }}
                              className={`p-1 rounded hover:bg-gray-100 transition-colors hover:text-gray-600 ${(sectionFiles[section.id]?.length ?? 0) > 0 ? 'text-[#1B3A6B]' : 'text-gray-400'}`}>
                              <Paperclip className="w-3 h-3" />
                            </button>
                            <button title="צאט"
                              onClick={e => toggleChat(section.id, section.title, e.currentTarget as HTMLElement)}
                              className={`relative p-1 rounded hover:bg-gray-100 transition-colors ${openChat?.id === section.id ? 'text-[#1B3A6B]' : 'text-gray-400'}`}>
                              <MessageSquare className="w-3 h-3" />
                              {unreadChats.has(section.id) && (
                                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-blue-500 border border-white pointer-events-none" />
                              )}
                            </button>
                          </>}
                          <button title="אפשרויות" onClick={e => openSectionMenu(e, undefined, isReadOnly ? READ_ONLY_SECTION_ACTIONS : undefined)}
                            className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Content box for leaf topics (no children) */}
                    {!section.children && (section.title === 'חתימות' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, direction: 'rtl' }}>
                        {signatures.map((sig, idx) => (
                          <textarea
                            key={idx}
                            value={sig}
                            onChange={e => { const v = e.target.value; setSignatures(prev => prev.map((s, i) => i === idx ? v : s)); e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                            ref={el => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }}
                            placeholder={SIG_PLACEHOLDER}
                            dir="rtl"
                            style={{
                              width: '100%', minHeight: '80px', borderRadius: 12,
                              background: '#f9fafb', border: '1px solid #f1f5f9',
                              padding: '10px 14px', fontSize: 11, textAlign: 'right',
                              color: '#374151', resize: 'none', outline: 'none', overflow: 'hidden',
                              fontFamily: 'inherit', lineHeight: 1.9,
                            }}
                            className="focus:border-gray-300 transition-colors placeholder-gray-300"
                          />
                        ))}
                      </div>
                    ) : (
                      <>
                      <textarea
                        value={section.content ?? ''}
                        ref={el => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }}
                        onChange={e => { updateTopicContent(section.id, e.target.value); e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                        onFocus={e => { setActiveSectionId(section.id); activeTextareaRef.current = e.target; setActiveContentRef.current = (v: string) => updateTopicContent(section.id, v); }}
                        placeholder="מלל קבוע לנושא (אופציונלי)..."
                        dir="rtl"
                        style={{
                          width: '100%', minHeight: '44px', borderRadius: 12,
                          background: '#f9fafb', border: '1px solid #f1f5f9',
                          padding: '10px 14px', fontSize: 11, textAlign: 'right',
                          color: '#374151', resize: 'none', outline: 'none', overflow: 'hidden',
                          fontFamily: 'inherit', lineHeight: 1.7,
                        }}
                        className="focus:border-gray-300 transition-colors placeholder-gray-300"
                      />
                      {(sectionFootnotes[section.id] ?? []).length > 0 && (
                        <div style={{ marginTop: 6, paddingRight: 14, paddingLeft: 14, paddingBottom: 4 }}><div style={{ width: '33%', height: 1, background: '#9ca3af', marginBottom: 6, marginRight: 0 }} />
                          {(sectionFootnotes[section.id] ?? []).map((fn, i) => (
                            <div key={fn.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 3, direction: 'rtl' }}>
                              <span style={{ fontSize: 11, fontWeight: 700, color: '#374151', flexShrink: 0, verticalAlign: 'super', lineHeight: 1 }}>{SUPERSCRIPT_NUMS[i]}</span>
                              <textarea value={fn.text} onChange={e => { const v = e.target.value; setSectionFootnotes(prev => ({ ...prev, [section.id]: prev[section.id].map((f, j) => j === i ? { ...f, text: v } : f) })); e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }} ref={el => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }} placeholder="הזן את תוכן ההערה..." dir="rtl" rows={1} style={{ flex: 1, fontSize: 10, color: '#374151', resize: 'none', border: 'none', outline: 'none', background: 'transparent', fontFamily: 'inherit', lineHeight: 1.6, overflow: 'hidden' }} className="placeholder-gray-300" />
                              <button onClick={() => setSectionFootnotes(prev => ({ ...prev, [section.id]: prev[section.id].filter((_, j) => j !== i) }))} style={{ color: '#9ca3af', cursor: 'pointer', background: 'none', border: 'none', padding: 2, flexShrink: 0, marginTop: 2 }}>
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      </>
                    ))}

                    {/* Sections (children of topic) */}
                    {section.children?.map((child, ci) => {
                      secCounter++;
                      const secNum = secCounter;
                      const childMatch = sq && (child.title?.toLowerCase().includes(sq) || child.content?.toLowerCase().includes(sq));
                      return (
                      <div key={child.id} data-page-box="" style={{ marginBottom: '5mm', borderRadius: 8, outline: childMatch ? '2px solid #fbbf24' : 'none', outlineOffset: 2 }}>

                        {/* Section header row: number + title + action icons */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35em', marginBottom: '5px', direction: 'rtl' }}>
                          <span style={{ flexShrink: 0, fontSize: 12, fontWeight: 700, color: '#1B3A6B', lineHeight: 1.5 }}>
                            {secNum}.
                          </span>
                          <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', direction: 'rtl' }}>
                            {/* Auto-sizing input: ghost span sets width, input overlays it */}
                            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', maxWidth: '100%', minWidth: 20 }}>
                              <span aria-hidden style={{
                                visibility: 'hidden', whiteSpace: 'pre', display: 'inline-block',
                                fontSize: 12, fontWeight: 600, padding: '2px 4px',
                                maxWidth: '100%', overflow: 'hidden',
                              }}>
                                {child.title || 'שם הסעיף'}
                              </span>
                              <input
                                value={child.title}
                                onChange={e => updateSectionTitle(section.id, child.id, e.target.value)}
                                placeholder="שם הסעיף"
                                dir="rtl"
                                style={{
                                  position: 'absolute', inset: 0, width: '100%',
                                  fontSize: 12, fontWeight: 600,
                                  color: child.title ? '#374151' : '#c4c9d4',
                                  background: 'transparent', border: 'none', outline: 'none',
                                  textAlign: 'right', padding: '2px 4px', borderRadius: 4,
                                }}
                                className="hover:bg-gray-50 focus:bg-gray-50 transition-colors rounded"
                              />
                            </div>
                            {sectionInstructions[child.id] && (
                              <div style={{ position: 'relative', flexShrink: 0, marginRight: 3 }} className="group">
                                <AlertCircle className="w-3.5 h-3.5 text-amber-400 cursor-default" />
                                <div style={{
                                  position: 'absolute', bottom: '120%', right: '50%', transform: 'translateX(50%)',
                                  background: '#1e293b', color: '#f8fafc', fontSize: 11, fontWeight: 400,
                                  borderRadius: 8, padding: '6px 10px', whiteSpace: 'pre-wrap', maxWidth: 220,
                                  lineHeight: 1.5, zIndex: 99999, pointerEvents: 'none', direction: 'rtl', textAlign: 'right',
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
                                }} className="hidden group-hover:block">
                                  {sectionInstructions[child.id]}
                                  <div style={{
                                    position: 'absolute', top: '100%', right: '50%', transform: 'translateX(50%)',
                                    width: 0, height: 0,
                                    borderLeft: '6px solid transparent', borderRight: '6px solid transparent',
                                    borderTop: '6px solid #1e293b',
                                  }} />
                                </div>
                              </div>
                            )}
                          </div>
                          {hiddenSections.has(child.id) ? (
                            <span style={{ flexShrink: 0, fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap', color: '#9ca3af' }}>סעיף מוסתר</span>
                          ) : !isDistributedDoc && getChildStatus(child.id) !== 'editing' && (
                            <span style={{
                              flexShrink: 0, fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap',
                              color: getChildStatus(child.id) === 'approved' ? '#16a34a' : getChildStatus(child.id) === 'fix' ? '#dc2626' : '#d97706',
                            }}>
                              {getChildStatus(child.id) === 'approved' ? 'מאושר' : getChildStatus(child.id) === 'fix' ? 'דרוש תיקון' : 'ממתין לאישור'}
                            </span>
                          )}
                          <div className="flex items-center gap-0.5" style={{ flexShrink: 0 }}>
                            {!isReadOnly && <span style={{ fontSize: 9, color: '#b0b7c3', marginLeft: 6, marginRight: 2, whiteSpace: 'nowrap', letterSpacing: 0 }}>
                              עודכן ב‏25-06-2026 11:18 ע״י s2345678
                            </span>}
                            <button title="העתק סעיף" className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
                              <Copy className="w-3 h-3" />
                            </button>
                            {!isReadOnly && <>
                              <button title="הוספת קבצים"
                                onClick={e => { e.stopPropagation(); openFilePicker(child.id); }}
                                className={`p-1 rounded hover:bg-gray-100 transition-colors hover:text-gray-600 ${(sectionFiles[child.id]?.length ?? 0) > 0 ? 'text-[#1B3A6B]' : 'text-gray-400'}`}>
                                <Paperclip className="w-3 h-3" />
                              </button>
                              <button title="צאט"
                                onClick={e => toggleChat(child.id, `${secNum}. ${child.title}`, e.currentTarget as HTMLElement)}
                                className={`relative p-1 rounded hover:bg-gray-100 transition-colors ${openChat?.id === child.id ? 'text-[#1B3A6B]' : 'text-gray-400'}`}>
                                <MessageSquare className="w-3 h-3" />
                                {unreadChats.has(child.id) && (
                                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-blue-500 border border-white pointer-events-none" />
                                )}
                              </button>
                            </>}
                            <button title="אפשרויות" onClick={e => openSectionMenu(e, child.id, isReadOnly ? READ_ONLY_SECTION_ACTIONS : undefined)}
                              className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
                              <MoreHorizontal className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Section content box — hidden when section is hidden */}
                        {!hiddenSections.has(child.id) && <div style={{ marginBottom: child.children?.length ? '6px' : 0 }}>
                          {classifiedSections.has(child.id) ? (
                            <div style={{
                              position: 'relative', borderRadius: 12, background: '#f9fafb',
                              border: '1px solid #f1f5f9', overflow: 'hidden',
                            }} className="focus-within:border-gray-300 transition-colors">
                              <textarea
                                value={child.content ?? ''}
                                ref={el => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }}
                                onChange={e => { updateSectionContent(section.id, child.id, e.target.value); e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                                onFocus={() => setActiveSectionId(child.id)}
                                placeholder="מלל קבוע לסעיף (אופציונלי)..."
                                dir="rtl"
                                style={{
                                  width: '100%', minHeight: '52px',
                                  background: 'transparent', border: 'none',
                                  padding: '8px 12px', fontSize: 11, textAlign: 'right',
                                  color: '#374151', resize: 'none', outline: 'none', overflow: 'hidden',
                                  fontFamily: 'inherit', lineHeight: 1.7,
                                }}
                                className="placeholder-gray-300"
                              />
                              <div style={{
                                position: 'absolute', inset: 0,
                                pointerEvents: 'none', userSelect: 'none',
                                overflow: 'hidden',
                              }}>
                                <span style={{
                                  position: 'absolute', top: '50%', left: '50%',
                                  transform: 'translate(-50%, -50%) rotate(-15deg)',
                                  fontSize: 15, fontWeight: 900,
                                  color: 'rgba(156, 163, 175, 0.45)',
                                  letterSpacing: '0.3em',
                                  fontFamily: 'inherit', whiteSpace: 'nowrap',
                                }}>ממודר</span>
                              </div>
                            </div>
                          ) : (
                          <div style={{
                            borderRadius: 12, background: '#f9fafb',
                            border: '1px solid #f1f5f9', overflow: 'hidden',
                          }} className="focus-within:border-gray-300 transition-colors">
                            <textarea
                              value={child.content ?? ''}
                              ref={el => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }}
                              onChange={e => { updateSectionContent(section.id, child.id, e.target.value); e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                              onFocus={e => { setActiveSectionId(child.id); activeTextareaRef.current = e.target; setActiveContentRef.current = (v: string) => updateSectionContent(section.id, child.id, v); }}
                              placeholder="מלל קבוע לסעיף (אופציונלי)..."
                              dir="rtl"
                              style={{
                                width: '100%', minHeight: '36px',
                                background: 'transparent', border: 'none',
                                padding: '8px 12px', fontSize: 11, textAlign: 'right',
                                color: '#374151', resize: 'none', outline: 'none', overflow: 'hidden',
                                fontFamily: 'inherit', lineHeight: 1.7,
                              }}
                              className="placeholder-gray-300"
                            />
                            {(sectionFootnotes[child.id] ?? []).length > 0 && (
                              <div style={{ marginTop: 4, paddingRight: 12, paddingLeft: 12, paddingBottom: 4 }}><div style={{ width: '33%', height: 1, background: '#9ca3af', marginBottom: 6 }} />
                                {(sectionFootnotes[child.id] ?? []).map((fn, i) => (
                                  <div key={fn.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 3, direction: 'rtl' }}>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: '#374151', flexShrink: 0, verticalAlign: 'super', lineHeight: 1 }}>{SUPERSCRIPT_NUMS[i]}</span>
                                    <textarea value={fn.text} onChange={e => { const v = e.target.value; setSectionFootnotes(prev => ({ ...prev, [child.id]: prev[child.id].map((f, j) => j === i ? { ...f, text: v } : f) })); e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }} ref={el => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }} placeholder="הזן את תוכן ההערה..." dir="rtl" rows={1} style={{ flex: 1, fontSize: 10, color: '#374151', resize: 'none', border: 'none', outline: 'none', background: 'transparent', fontFamily: 'inherit', lineHeight: 1.6, overflow: 'hidden' }} className="placeholder-gray-300" />
                                    <button onClick={() => setSectionFootnotes(prev => ({ ...prev, [child.id]: prev[child.id].filter((_, j) => j !== i) }))} style={{ color: '#9ca3af', cursor: 'pointer', background: 'none', border: 'none', padding: 2, flexShrink: 0, marginTop: 2 }}>
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                            {sectionTables[child.id] && (
                              <SectionTableView
                                sectionId={child.id}
                                table={sectionTables[child.id]}
                                activeCell={activeTableCell?.sectionId === child.id ? activeTableCell : null}
                                onFocusCell={(r, c) => setActiveTableCell({ sectionId: child.id, row: r, col: c })}
                                onBlurCell={() => setActiveTableCell(null)}
                                onCellChange={(r, c, v) => tblUpdateCell(child.id, r, c, v)}
                                onInsertRowBefore={r => tblInsertRowBefore(child.id, r)}
                                onInsertRowAfter={r => tblInsertRowAfter(child.id, r)}
                                onDeleteRow={r => tblDeleteRow(child.id, r)}
                                onInsertColBefore={c => tblInsertColBefore(child.id, c)}
                                onInsertColAfter={c => tblInsertColAfter(child.id, c)}
                                onDeleteCol={c => tblDeleteCol(child.id, c)}
                                onDeleteTable={() => tblDeleteTable(child.id)}
                              />
                            )}
                          </div>
                          )}
                          {/* Attached files — below content box, left-aligned */}
                          {(sectionFiles[child.id]?.length ?? 0) > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 5 }}>
                              {sectionFiles[child.id].map((file, fi) => (
                                <button key={fi} onClick={() => setFileModal(child.id)}
                                  style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', borderRadius: 6, width: 'fit-content' }}
                                  className="hover:bg-[#EEF4FF] transition-colors">
                                  <Paperclip style={{ width: 11, height: 11, color: '#1B3A6B', flexShrink: 0 }} />
                                  <span style={{ fontSize: 10, color: '#1B3A6B', fontWeight: 500 }}>{file.name}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>}

                        {/* Section approval — bottom of section */}
                        {!hiddenSections.has(child.id) && !isDistributedDoc && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, marginBottom: 4, direction: 'rtl', justifyContent: 'flex-end' }}>
                            {(() => {
                              const st = getChildStatus(child.id);
                              if (st === 'editing') return (
                                <button onClick={() => setChildStatus(child.id, 'pending')}
                                  style={{ fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 4, background: '#1B3A6B', color: '#fff', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                  העברה לאישור
                                </button>
                              );
                              if (st === 'pending') return (
                                <div style={{ display: 'flex', gap: 4 }}>
                                  <button onClick={e => {
                                    setSectionsAwaitingFix(prev => new Set([...prev, child.id]));
                                    toggleChat(child.id, `${secNum}. ${child.title}`, e.currentTarget as HTMLElement);
                                  }}
                                    style={{ fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 4, background: 'transparent', color: '#374151', border: '1px solid #d1d5db', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                    לתיקון
                                  </button>
                                  <button onClick={() => setChildStatus(child.id, 'approved')}
                                    style={{ fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 4, background: '#1B3A6B', color: '#fff', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                    לאישור
                                  </button>
                                </div>
                              );
                              return (
                                <button onClick={() => setChildStatus(child.id, 'editing')}
                                  style={{ fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 4, background: 'transparent', color: '#374151', border: '1px solid #d1d5db', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                  החזר לעריכה
                                </button>
                              );
                            })()}
                          </div>
                        )}

                        {/* Sub-sections */}
                        {!hiddenSections.has(child.id) && child.children?.map((sub, si) => (
                          <div key={sub.id} style={{ marginBottom: '5px', paddingRight: '14px' }}>
                            {/* Sub-section header */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3em', marginBottom: '4px', direction: 'rtl' }}>
                              <span style={{ flexShrink: 0, fontSize: 11, fontWeight: 700, color: '#6b7280', lineHeight: 1.5 }}>{HE_ALPHA[si]}.</span>
                              <input
                                value={sub.title}
                                onChange={e => updateSubTitle(section.id, child.id, sub.id, e.target.value)}
                                placeholder="שם תת הסעיף"
                                dir="rtl"
                                style={{
                                  flex: 1, fontSize: 11, fontWeight: 600,
                                  color: sub.title ? '#6b7280' : '#c4c9d4',
                                  background: 'transparent', border: 'none', outline: 'none',
                                  textAlign: 'right', padding: '2px 4px', borderRadius: 4,
                                }}
                                className="hover:bg-gray-50 focus:bg-gray-50 transition-colors rounded"
                              />
                              {/* Sub-section action row */}
                              <div className="flex items-center gap-0.5" style={{ flexShrink: 0 }}>
                                {!isReadOnly && <span style={{ fontSize: 9, color: '#b0b7c3', marginLeft: 4, marginRight: 2, whiteSpace: 'nowrap' }}>
                                  עודכן ב‏25-06-2026 11:18 ע״י s2345678
                                </span>}
                                <button title="העתק תת-סעיף" className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
                                  <Copy className="w-3 h-3" />
                                </button>
                                {!isReadOnly && <>
                                  <button title="הוספת קבצים"
                                    onClick={e => { e.stopPropagation(); openFilePicker(sub.id); }}
                                    className={`p-1 rounded hover:bg-gray-100 transition-colors hover:text-gray-600 ${(sectionFiles[sub.id]?.length ?? 0) > 0 ? 'text-[#1B3A6B]' : 'text-gray-400'}`}>
                                    <Paperclip className="w-3 h-3" />
                                  </button>
                                  <button title="צאט"
                                    onClick={e => toggleChat(sub.id, `${HE_ALPHA[si]}. ${sub.title}`, e.currentTarget as HTMLElement)}
                                    className={`relative p-1 rounded hover:bg-gray-100 transition-colors ${openChat?.id === sub.id ? 'text-[#1B3A6B]' : 'text-gray-400'}`}>
                                    <MessageSquare className="w-3 h-3" />
                                    {unreadChats.has(sub.id) && (
                                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-blue-500 border border-white pointer-events-none" />
                                    )}
                                  </button>
                                </>}
                                <button title="אפשרויות" onClick={e => openSectionMenu(e, sub.id, isReadOnly ? READ_ONLY_SECTION_ACTIONS : undefined)}
                                  className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
                                  <MoreHorizontal className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            {/* Sub-section content box */}
                            <div>
                              <textarea
                                value={sub.content ?? ''}
                                ref={el => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }}
                                onChange={e => { updateSubContent(section.id, child.id, sub.id, e.target.value); e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                                onFocus={e => { setActiveSectionId(sub.id); activeTextareaRef.current = e.target; setActiveContentRef.current = (v: string) => updateSubContent(section.id, child.id, sub.id, v); }}
                                placeholder="מלל קבוע (אופציונלי)..."
                                dir="rtl"
                                style={{
                                  width: '100%', minHeight: '32px', borderRadius: 10,
                                  background: '#f9fafb', border: '1px solid #f1f5f9',
                                  padding: '7px 12px', fontSize: 11, textAlign: 'right',
                                  color: '#374151', resize: 'none', outline: 'none', overflow: 'hidden',
                                  fontFamily: 'inherit', lineHeight: 1.7,
                                }}
                                className="focus:border-gray-300 transition-colors placeholder-gray-300"
                              />
                              {/* Table for sub-section */}
                              {sectionTables[sub.id] && (
                                <SectionTableView
                                  sectionId={sub.id}
                                  table={sectionTables[sub.id]}
                                  activeCell={activeTableCell?.sectionId === sub.id ? activeTableCell : null}
                                  onFocusCell={(r, c) => setActiveTableCell({ sectionId: sub.id, row: r, col: c })}
                                  onBlurCell={() => setActiveTableCell(null)}
                                  onCellChange={(r, c, v) => tblUpdateCell(sub.id, r, c, v)}
                                  onInsertRowBefore={r => tblInsertRowBefore(sub.id, r)}
                                  onInsertRowAfter={r => tblInsertRowAfter(sub.id, r)}
                                  onDeleteRow={r => tblDeleteRow(sub.id, r)}
                                  onInsertColBefore={c => tblInsertColBefore(sub.id, c)}
                                  onInsertColAfter={c => tblInsertColAfter(sub.id, c)}
                                  onDeleteCol={c => tblDeleteCol(sub.id, c)}
                                  onDeleteTable={() => tblDeleteTable(sub.id)}
                                />
                              )}
                              {(sectionFootnotes[sub.id] ?? []).length > 0 && (
                                <div style={{ marginTop: 4, paddingRight: 12, paddingLeft: 12, paddingBottom: 4 }}><div style={{ width: '33%', height: 1, background: '#9ca3af', marginBottom: 6 }} />
                                  {(sectionFootnotes[sub.id] ?? []).map((fn, i) => (
                                    <div key={fn.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 3, direction: 'rtl' }}>
                                      <span style={{ fontSize: 11, fontWeight: 700, color: '#374151', flexShrink: 0, verticalAlign: 'super', lineHeight: 1 }}>{SUPERSCRIPT_NUMS[i]}</span>
                                      <textarea value={fn.text} onChange={e => { const v = e.target.value; setSectionFootnotes(prev => ({ ...prev, [sub.id]: prev[sub.id].map((f, j) => j === i ? { ...f, text: v } : f) })); e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }} ref={el => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }} placeholder="הזן את תוכן ההערה..." dir="rtl" rows={1} style={{ flex: 1, fontSize: 10, color: '#374151', resize: 'none', border: 'none', outline: 'none', background: 'transparent', fontFamily: 'inherit', lineHeight: 1.6, overflow: 'hidden' }} className="placeholder-gray-300" />
                                      <button onClick={() => setSectionFootnotes(prev => ({ ...prev, [sub.id]: prev[sub.id].filter((_, j) => j !== i) }))} style={{ color: '#9ca3af', cursor: 'pointer', background: 'none', border: 'none', padding: 2, flexShrink: 0, marginTop: 2 }}>
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {/* Attached files — below content box, left-aligned */}
                              {(sectionFiles[sub.id]?.length ?? 0) > 0 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 5 }}>
                                  {sectionFiles[sub.id].map((file, fi) => (
                                    <button key={fi} onClick={() => setFileModal(sub.id)}
                                      style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', borderRadius: 6, width: 'fit-content' }}
                                      className="hover:bg-[#EEF4FF] transition-colors">
                                      <Paperclip style={{ width: 11, height: 11, color: '#1B3A6B', flexShrink: 0 }} />
                                      <span style={{ fontSize: 10, color: '#1B3A6B', fontWeight: 500 }}>{file.name}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      );
                    })}
                  </div>
                  );
                  });
                })()}
              </div>
            </div>
          </div>
        </main>

      </div>

      {openChat && (
        <SectionChat
          title={openChat.title}
          anchorEl={openChat.anchorEl}
          onClose={() => setOpenChat(null)}
          messages={getChatMessages(openChat.id)}
          onSend={m => sendChatMsg(openChat.id, m)}
          onMarkRead={() => markChatRead(openChat.id)}
        />
      )}
      {sectionMenu && (
        <SectionMenu x={sectionMenu.x} y={sectionMenu.y} flipped={sectionMenu.flipped} onClose={() => setSectionMenu(null)}
          actions={(sectionMenu.actions ?? SECTION_ACTIONS).flatMap(a => {
            if (!('label' in a)) return [a];
            if (a.label === 'הסתרת סעיף' && sectionMenuId && hiddenSections.has(sectionMenuId))
              return [{ label: 'הצגת סעיף', Icon: Eye }];
            if (a.label === 'הגדרה כסעיף ממודר' && sectionMenuId && classifiedSections.has(sectionMenuId)) {
              const extras: SectionAction[] = [
                { label: 'ביטול סיווג ממודר', Icon: Lock },
                { sep: true },
                { label: 'רשימת צופים ממודרת', Icon: Shield },
              ];
              return extras;
            }
            return [a];
          })}
          onAction={label => {
            if (label === 'מאשרי הסעיף') setPermTrigger({ tab: 4 });
            else if (label === 'עורכי הסעיף') setPermTrigger({ tab: 3 });
            else if (label === 'הסתרת סעיף' && sectionMenuId)
              setHiddenSections(prev => new Set([...prev, sectionMenuId]));
            else if (label === 'הצגת סעיף' && sectionMenuId)
              setHiddenSections(prev => { const n = new Set(prev); n.delete(sectionMenuId); return n; });
            else if (label === 'הגדרה כסעיף ממודר' && sectionMenuId)
              setClassifiedSections(prev => new Set([...prev, sectionMenuId]));
            else if (label === 'ביטול סיווג ממודר' && sectionMenuId)
              setClassifiedSections(prev => { const n = new Set(prev); n.delete(sectionMenuId); return n; });
            else if (label === 'רשימת צופים ממודרת')
              setClassifiedViewersModal(sectionMenuId);
            else if (label === 'הנחיות לסעיף' && sectionMenuId) {
              const child = sections.flatMap(s => s.children ?? []).find(c => c.id === sectionMenuId);
              setInstructionsDraft(sectionInstructions[sectionMenuId] ?? '');
              setInstructionsModal({ id: sectionMenuId, title: child?.title ?? '' });
            }
            else if (label === 'מחיקת סעיף' && sectionMenuId) {
              const sid = sectionMenuId;
              const child = sections.flatMap(s => s.children ?? []).find(c => c.id === sid);
              setPendingDelete({
                label: child?.title ? `״${child.title}״` : 'סעיף זה',
                onConfirm: () => {
                  setSections(prev => prev.map(s => ({ ...s, children: s.children?.filter(c => c.id !== sid) ?? [] })));
                  setPendingDelete(null);
                },
              });
            }
          }} />
      )}
      {emphasisMenu && (
        <SectionMenu x={emphasisMenu.x} y={emphasisMenu.y} flipped={emphasisMenu.flipped} onClose={() => setEmphasisMenu(null)} actions={EMPHASIS_ACTIONS}
          onAction={label => {
            if (label === 'מאשרי הסעיף') setPermTrigger({ tab: 4 });
            else if (label === 'עורכי הסעיף') setPermTrigger({ tab: 3 });
          }} />
      )}
      {addMenu && (
        <AddMenu x={addMenu.x} y={addMenu.y} onClose={() => setAddMenu(null)} onAction={handleAddAction} />
      )}
      {restoreOpen && (
        <RestoreModal onClose={() => setRestoreOpen(false)} />
      )}
      {showImportModal && (
        <ImportDocModal onClose={() => setShowImportModal(false)} onImport={() => setShowImportModal(false)} />
      )}

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" multiple className="hidden" onChange={onFilesChosen} />

      {/* File attachment modal */}
      {fileModal && (
        <div className="fixed inset-0 z-[99998] flex items-center justify-center" style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(2px)' }}>
          <div className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{ width: 480, maxHeight: '70vh' }} dir="rtl">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-sm font-bold text-gray-800">קבצים מצורפים</h2>
              <button onClick={() => setFileModal(null)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* File list + add more */}
            <div className="flex-1 overflow-y-auto px-5 py-3 flex flex-col gap-2">
              {(sectionFiles[fileModal] ?? []).length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">אין קבצים מצורפים</p>
              ) : (sectionFiles[fileModal] ?? []).map((file, fi) => (
                <div key={fi} className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border border-gray-100 bg-gray-50 group">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-4 h-4 text-[#1B3A6B] flex-shrink-0" />
                    <span className="text-sm text-gray-700 truncate">{file.name}</span>
                    <span className="text-xs text-gray-400 flex-shrink-0">{(file.size / 1024).toFixed(0)} KB</span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => downloadFile(file)} title="הורדה"
                      className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm transition-all text-gray-400 hover:text-[#1B3A6B]">
                      <FileDown className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => removeFile(fileModal, fi)} title="מחיקה"
                      className="p-1.5 rounded-lg hover:bg-red-50 transition-all text-gray-400 hover:text-red-500">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Add more files — sits below the list */}
              <button
                onClick={() => addMoreFiles(fileModal)}
                className="flex items-center gap-1.5 px-4 py-2.5 mt-1 rounded-xl text-sm font-medium border border-dashed border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-colors justify-center">
                <Paperclip className="w-3.5 h-3.5" />
                הוסף קבצים נוספים
              </button>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 flex-shrink-0">
              <button
                onClick={() => setFileModal(null)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-50 transition-colors">
                ביטול
              </button>
              <button
                onClick={() => setFileModal(null)}
                className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-colors"
                style={{ background: '#1B3A6B' }}>
                סיום
              </button>
            </div>

          </div>
        </div>
      )}
      {showEditDocModal && (
        <EditDocDetailsModal doc={doc} onClose={() => setShowEditDocModal(false)} readOnly={isDistributedDoc} />
      )}
      {showDuplicateModal && (
        <EditDocDetailsModal doc={doc} onClose={() => setShowDuplicateModal(false)} mode="duplicate" />
      )}
      {showApprovalFlow && (
        <EditDocDetailsModal doc={doc} mode="approval" onClose={() => setShowApprovalFlow(false)}
          onContinue={dirty => {
            if (dirty) { setShowApprovalChangedWarning(true); }
            else { setShowApprovalDetails(true); }
          }} />
      )}
      {showApprovalDetails && (
        <ApprovalDetailsModal
          onClose={() => setShowApprovalDetails(false)}
          onSubmit={() => { setShowApprovalDetails(false); setDocStatus('בסבב אישורים'); }}
        />
      )}
      {showApprovalRound && (
        <ApprovalRoundModal
          onClose={() => setShowApprovalRound(false)}
          onApprove={() => { setShowApprovalRound(false); setDocStatus('ממתין להפצה'); }}
          onReject={() => { setShowApprovalRound(false); setDocStatus('בהכנה'); }}
          onDistribute={() => { setShowApprovalRound(false); setDocStatus('מבצעית'); setShowShareModal(true); }}
          docName={name}
        />
      )}
      {showDistributeModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center"
          style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(2px)' }}>
          <div dir="rtl" className="bg-white rounded-3xl shadow-2xl px-8 py-7 flex flex-col gap-4" style={{ width: 400 }}>
            <p className="text-base font-bold text-gray-900 text-center">הפצת המסמך</p>
            <p className="text-sm text-gray-600 text-center leading-relaxed">
              האם ברצונך להפיץ את המסמך <span className="font-semibold">״{name}״</span>?
            </p>
            <p className="text-xs text-gray-400 text-center -mt-2">
              הפצת המסמך יעביר את המסמך מטיוטות למסמכים שהופצו
            </p>
            <div className="flex gap-3 justify-center w-full">
              <button onClick={() => setShowDistributeModal(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors">
                לא כרגע
              </button>
              <button onClick={() => { setShowDistributeModal(false); setDocStatus('מבצעית'); setShowShareModal(true); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: '#1B3A6B' }}>
                הפצת המסמך
              </button>
            </div>
          </div>
        </div>
      )}
      {showIssueUpdateModal && (
        <EditDocDetailsModal doc={doc} mode="issue-update" onClose={() => setShowIssueUpdateModal(false)}
          onConfirmIssue={() => { setShowIssueUpdateModal(false); setDocStatus('טיוטה פנימית'); }} />
      )}
      {showIssueNewModal && (
        <EditDocDetailsModal doc={doc} mode="issue-new" onClose={() => setShowIssueNewModal(false)}
          onConfirmIssue={() => { setShowIssueNewModal(false); setDocStatus('טיוטה פנימית'); }} />
      )}
      {showShareModal && (
        <ShareDocModal
          docName={name}
          onClose={() => setShowShareModal(false)}
          onSend={() => { setDistributeProgress(0); setDistributeComplete(false); setShowDistributeProgress(true); }}
        />
      )}
      {showDistributeProgress && (
        <div className="fixed bottom-5 left-5 z-[99998] bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col gap-3 overflow-hidden"
          dir="rtl" style={{ width: 300 }}>
          {/* Header bar */}
          <div className="flex items-center justify-between px-4 pt-4">
            <span className="text-xs font-bold text-gray-800">
              {distributeComplete ? 'המסמך הופץ בהצלחה' : 'הפצת המסמך מתבצעת'}
            </span>
            {distributeComplete && (
              <button onClick={() => { setShowDistributeProgress(false); setDistributeProgress(0); setDistributeComplete(false); }}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Progress row */}
          <div className="flex items-center gap-2 px-4">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#e5e7eb' }}>
              <div className="h-full rounded-full transition-all duration-75"
                style={{ width: `${distributeProgress}%`, background: distributeComplete ? '#16a34a' : '#1B3A6B' }} />
            </div>
            <span className="text-[11px] font-semibold tabular-nums"
              style={{ color: distributeComplete ? '#16a34a' : '#1B3A6B', minWidth: 36, textAlign: 'left' }}>
              {distributeProgress}%
            </span>
          </div>

          {/* Success details */}
          {distributeComplete && (
            <div className="px-4 pb-4">
              <span className="text-xs text-gray-500">הופץ לכ- 156 משתמשים</span>
            </div>
          )}
          {!distributeComplete && <div className="pb-1" />}
        </div>
      )}
      {showApprovalChangedWarning && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.45)' }}
          onClick={() => setShowApprovalChangedWarning(false)}>
          <div dir="rtl" className="bg-white rounded-3xl shadow-2xl px-8 py-7 flex flex-col gap-4" style={{ width: 380 }} onClick={e => e.stopPropagation()}>
            <p className="text-base font-bold text-gray-900 text-center">שים לב</p>
            <p className="text-sm text-gray-600 text-center leading-relaxed">שינוי ערכי המסמך יעודכנו רק במסמך הנוכחי ולא בשאר הגרסאות הקודמות שלו</p>
            <div className="flex gap-3 w-full">
              <button onClick={() => { setShowApprovalChangedWarning(false); setShowApprovalFlow(true); }}
                className="flex-1 py-2.5 rounded-2xl text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
                ביטול
              </button>
              <button onClick={() => { setShowApprovalChangedWarning(false); setShowApprovalDetails(true); }}
                className="flex-1 py-2.5 rounded-2xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: '#1B3A6B' }}>
                אישור
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3-dots context menu for section / sub-section items */}
      {itemMenu && (
        <div ref={itemMenuRef} className="fixed z-[99999] bg-white rounded-xl shadow-xl border border-gray-100 py-1 min-w-[130px]"
          style={{ top: itemMenu.y, right: itemMenu.x }} dir="rtl">
          <button onClick={itemMenu.onRename}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-right">
            <Pencil className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            שינוי שם
          </button>
          <button onClick={itemMenu.onDelete}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#1B3A6B] hover:bg-[#EEF4FF] transition-colors text-right">
            <Trash2 className="w-3.5 h-3.5 flex-shrink-0" />
            מחיקה
          </button>
        </div>
      )}

      {/* 3-dots delete confirmation modal */}
      {pendingDelete && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.45)' }} onClick={() => setPendingDelete(null)}>
          <div dir="rtl" className="bg-white rounded-3xl shadow-2xl px-8 py-7 flex flex-col items-center gap-3" style={{ width: 340 }} onClick={e => e.stopPropagation()}>
            <p className="text-base font-bold text-gray-900 text-center">בטוח שתרצה למחוק {pendingDelete.label}?</p>
            {pendingDelete.label === 'נושא זה' && (
              <p className="text-sm text-gray-500 text-center -mt-1">מחיקת הנושא תמחק את כל הסעיפים תחתיו</p>
            )}
            {pendingDelete.label === 'סעיף זה' && (
              <p className="text-sm text-gray-500 text-center -mt-1">מחיקת הסעיף תמחק את כל תתי הסעיפים תחתיו</p>
            )}
            <div className="flex gap-3 w-full mt-1">
              <button onClick={() => setPendingDelete(null)}
                className="flex-1 py-2.5 rounded-2xl text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
                ביטול
              </button>
              <button onClick={pendingDelete.onConfirm}
                className="flex-1 py-2.5 rounded-2xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: '#1B3A6B' }}>
                מחיקה
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Signature templates modal */}
      {showSignatureTemplates && (
        <div className="fixed inset-0 z-[99998] flex items-center justify-center" style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(2px)' }} onClick={() => setShowSignatureTemplates(false)}>
          <div className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{ width: 420 }} dir="rtl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-sm font-bold text-gray-800">התבניות שלי — חתימות</h2>
              <button onClick={() => setShowSignatureTemplates(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-col py-2 overflow-y-auto" style={{ maxHeight: 360 }}>
              {SIGNATURE_TEMPLATES.map(tpl => (
                <button
                  key={tpl.id}
                  onClick={() => {
                    setSignatures(prev => {
                      const emptyIdx = prev.findIndex(s => s === '');
                      if (emptyIdx !== -1) return prev.map((s, i) => i === emptyIdx ? tpl.content : s);
                      return [...prev, tpl.content];
                    });
                    setShowSignatureTemplates(false);
                  }}
                  className="flex items-center gap-3 px-5 py-3.5 text-right hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#EEF4FF' }}>
                    <PenLine className="w-4 h-4 text-[#1B3A6B]" />
                  </div>
                  <span className="text-sm font-medium text-gray-800">{tpl.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Section instructions modal */}
      {instructionsModal && (
        <div className="fixed inset-0 z-[99998] flex items-center justify-center" style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(2px)' }} onClick={() => setInstructionsModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{ width: 500 }} dir="rtl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-sm font-bold text-gray-800">
                יצירת הנחיות לסעיף{instructionsModal.title ? ` ״${instructionsModal.title}״` : ''}
              </h2>
              <button onClick={() => setInstructionsModal(null)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-5 py-4 flex-1">
              <textarea
                value={instructionsDraft}
                onChange={e => setInstructionsDraft(e.target.value)}
                placeholder="הכנס הנחיות לסעיף..."
                rows={6}
                dir="rtl"
                className="w-full text-sm rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-blue-300 resize-none text-right text-gray-700 leading-relaxed"
              />
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 flex-shrink-0">
              <button onClick={() => setInstructionsModal(null)} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-50 transition-colors">ביטול</button>
              <button
                onClick={() => {
                  setSectionInstructions(prev => ({ ...prev, [instructionsModal.id]: instructionsDraft }));
                  setInstructionsModal(null);
                }}
                className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-colors"
                style={{ background: '#1B3A6B' }}>
                שמירה
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Classified viewers modal */}
      {classifiedViewersModal && (() => {
        const sid = classifiedViewersModal;
        const selectedIds = classifiedViewers[sid] ?? new Set<string>();
        const filtered = CLASSIFIED_POOL.filter(u =>
          u.name.includes(classifiedSearch) ||
          u.idNumber.includes(classifiedSearch) ||
          u.env.includes(classifiedSearch)
        );
        const toggle = (uid: string) => {
          setClassifiedViewers(prev => {
            const cur = new Set(prev[sid] ?? []);
            if (cur.has(uid)) cur.delete(uid); else cur.add(uid);
            return { ...prev, [sid]: cur };
          });
        };
        return (
          <div className="fixed inset-0 z-[99998] flex items-center justify-center" style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(2px)' }} onClick={() => { setClassifiedViewersModal(null); setClassifiedSearch(''); }}>
            <div className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{ width: 560, maxHeight: '75vh' }} dir="rtl" onClick={e => e.stopPropagation()}>
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
                <h2 className="text-sm font-bold text-gray-800">רשימת צופים ממודרת</h2>
                <button onClick={() => { setClassifiedViewersModal(null); setClassifiedSearch(''); }} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400">
                  <X className="w-4 h-4" />
                </button>
              </div>
              {/* Search */}
              <div className="px-5 py-3 border-b border-gray-100 flex-shrink-0">
                <div className="relative">
                  <input
                    type="text"
                    value={classifiedSearch}
                    onChange={e => setClassifiedSearch(e.target.value)}
                    placeholder="חיפוש..."
                    className="w-full text-sm rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 pr-9 outline-none focus:border-blue-300 text-right"
                    dir="rtl"
                  />
                  <svg className="absolute top-2.5 right-2.5 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" strokeWidth="2"/><path d="m21 21-4.35-4.35" strokeWidth="2"/></svg>
                </div>
              </div>
              {/* Table */}
              <div className="overflow-y-auto flex-1">
                <table className="w-full text-sm" dir="rtl">
                  <thead className="sticky top-0 bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-right px-5 py-2.5 text-xs font-semibold text-gray-500 w-8"></th>
                      <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-500">שם מלא</th>
                      <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-500">ת.ז</th>
                      <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-500">סביבה</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(u => (
                      <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer" onClick={() => toggle(u.id)}>
                        <td className="px-5 py-3 text-center">
                          <input type="checkbox" checked={selectedIds.has(u.id)} onChange={() => toggle(u.id)} onClick={e => e.stopPropagation()} className="rounded w-3.5 h-3.5 flex-shrink-0 accent-[#1B3A6B] cursor-pointer" />
                        </td>
                        <td className="px-4 py-3 text-gray-800 font-medium">{u.name}</td>
                        <td className="px-4 py-3 text-gray-500 font-mono text-xs">{u.idNumber}</td>
                        <td className="px-4 py-3 text-gray-500">{u.env}</td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr><td colSpan={4} className="px-5 py-8 text-center text-gray-400 text-sm">לא נמצאו תוצאות</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              {/* Footer */}
              <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 flex-shrink-0">
                <button onClick={() => { setClassifiedViewersModal(null); setClassifiedSearch(''); }} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-50 transition-colors">ביטול</button>
                <button onClick={() => { setClassifiedViewersModal(null); setClassifiedSearch(''); }} className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-colors" style={{ background: '#1B3A6B' }}>שמירה</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Delete topic confirmation — centered modal */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.45)' }}
          onClick={() => setDeleteConfirm(null)}>
          <div
            ref={deleteConfirmRef}
            dir="rtl"
            className="bg-white rounded-3xl shadow-2xl px-8 py-7 flex flex-col items-center gap-3"
            style={{ width: 340 }}
            onClick={e => e.stopPropagation()}>
            <p className="text-base font-bold text-gray-900 text-center">האם אתה בטוח שברצונך למחוק?</p>
            <p className="text-sm text-gray-400 text-center">מחיקת הנושא תמחק את כל הסעיפים שלו</p>
            <div className="flex gap-3 w-full mt-1">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-2xl text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
                ביטול
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-2xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: '#1B3A6B' }}>
                מחיקה
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
