import { useState, useRef, useEffect, useCallback } from 'react';
import { TopNavbar } from '../components/TopNavbar';
import {
  ChevronLeft, Plus, RotateCcw,
  Undo2, Redo2,
  Bold, Italic, Underline, Strikethrough, Highlighter,
  AlignRight, AlignCenter, AlignLeft, AlignJustify,
  List, ListOrdered, Indent, Outdent,
  WrapText, Baseline,
  PilcrowRight, PilcrowLeft, Superscript, Paperclip,
  Table2, PaintBucket, PaintRoller, RemoveFormatting,
  MessageSquare, Send, X,
  MoreHorizontal, MoreVertical, UserCheck, Users, EyeOff, Lock, FileText, FileDown, BookOpen, Trash2, Pencil,
  FolderPlus, FileInput, Lightbulb, Check,
  Search, SlidersHorizontal, ArrowRight,
} from 'lucide-react';
import type { EditDocInfo } from '../../App';

function Sep() {
  return <span style={{ width: 1, height: 18, background: '#d1d5db', margin: '0 4px', flexShrink: 0 }} />;
}

function TB({ title, children, active }: { title: string; children: React.ReactNode; active?: boolean }) {
  return (
    <button title={title}
      className={`flex items-center justify-center p-1.5 rounded transition-colors flex-shrink-0 ${active ? 'bg-blue-100 text-[#1B3A6B]' : 'text-gray-600 hover:bg-gray-100'}`}
      style={{ minWidth: 28, minHeight: 28 }}>
      {children}
    </button>
  );
}

function ColorSwatch({ title, color, textColor }: { title: string; color: string; textColor?: boolean }) {
  return (
    <button title={title}
      className="flex flex-col items-center justify-center p-1.5 rounded hover:bg-gray-100 transition-colors flex-shrink-0"
      style={{ minWidth: 28, minHeight: 28 }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: '#374151', lineHeight: 1 }}>{textColor ? 'A' : 'A'}</span>
      <span style={{ width: 16, height: 3, borderRadius: 1, background: color, marginTop: 2 }} />
    </button>
  );
}

type SectionAction = { label: string; Icon: React.ElementType; danger?: boolean } | { sep: true };
const SECTION_ACTIONS: SectionAction[] = [
  { label: 'מאשרי הסעיף',          Icon: UserCheck },
  { label: 'עורכי הסעיף',           Icon: Users },
  { sep: true },
  { label: 'הסתרת סעיף',            Icon: EyeOff },
  { label: 'הגדרה כסעיף ממודר',    Icon: Lock },
  { sep: true },
  { label: 'ייצוא ל-Word',          Icon: FileText },
  { label: 'ייצוא ל-PDF',           Icon: FileDown },
  { sep: true },
  { label: 'הנחיות לסעיף',          Icon: BookOpen },
  { sep: true },
  { label: 'מחיקת סעיף',            Icon: Trash2, danger: true },
];

function SectionMenu({ x, y, flipped, onClose }: { x: number; y: number; flipped: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [onClose]);

  return (
    <div ref={ref} className="fixed z-[99999]"
      style={flipped ? { bottom: y, left: x } : { top: y, left: x }}>
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 min-w-[200px]" dir="rtl">
        {SECTION_ACTIONS.map((action, i) => {
          if ('sep' in action) return <div key={`sep-${i}`} className="my-1 border-t border-gray-100" />;
          const { label, Icon, danger } = action;
          return (
            <button key={label} onClick={onClose}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-right transition-colors hover:bg-gray-50 ${danger ? 'text-red-500' : 'text-gray-700'}`}>
              <Icon className={`w-4 h-4 flex-shrink-0 ${danger ? 'text-red-400' : 'text-gray-400'}`} />
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

function RestorePanel({ x, y, onClose }: { x: number; y: number; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['p1']));

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [onClose]);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const countSelected = selected.size;
  const panelWidth = 280;
  const left = Math.max(8, Math.min(x, window.innerWidth - panelWidth - 8));

  const Checkbox = ({ checked }: { checked: boolean }) => (
    <div className={`flex-shrink-0 flex items-center justify-center rounded-md transition-all
      ${checked ? 'bg-[#1B3A6B]' : 'border-2 border-gray-300 bg-white'}`}
      style={{ width: 16, height: 16 }}>
      {checked && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
    </div>
  );

  return (
    <div ref={ref} className="fixed z-[99999]" style={{ bottom: y, left }}>
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden" style={{ width: panelWidth }} dir="rtl">
        <div className="px-4 pt-3 pb-2 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-800">סעיפים שנמחקו</p>
        </div>

        <div className="py-1 max-h-64 overflow-y-auto">
          {DELETED_SECTIONS.map(section => {
            const isChecked = selected.has(section.id);
            const isExpanded = expanded.has(section.id);

            return (
              <div key={section.id}>
                {/* Section row */}
                <div
                  className={`flex items-center gap-2 px-4 py-2.5 cursor-pointer transition-colors ${isChecked ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                  onClick={() => toggleSelect(section.id)}>
                  <Checkbox checked={isChecked} />
                  {section.children?.length ? (
                    <button onClick={e => toggleExpand(section.id, e)}
                      className="flex-shrink-0 p-0.5 rounded hover:bg-gray-200 transition-colors"
                      style={{ color: '#9ca3af' }}>
                      <ChevronLeft className={`w-3.5 h-3.5 transition-transform ${isExpanded ? '-rotate-90' : ''}`} />
                    </button>
                  ) : <span className="w-5 flex-shrink-0" />}
                  <div className="flex items-baseline gap-1.5 text-sm text-right flex-1">
                    <span className="font-bold text-gray-500 text-xs">{section.label}</span>
                    <span className="text-gray-800 font-medium">{section.title}</span>
                  </div>
                </div>

                {/* Children — display only, no checkboxes */}
                {section.children?.length && isExpanded && (
                  <div className={isChecked ? 'bg-blue-50' : ''}>
                    {section.children.map(child => (
                      <div key={child.id}
                        className="flex items-center gap-2 pr-10 pl-4 py-1.5 text-sm text-right">
                        <div className="flex items-baseline gap-1.5 flex-1">
                          <span className="font-semibold text-gray-400 text-xs">{child.label}</span>
                          <span className="text-gray-500">{child.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="px-4 py-2.5 border-t border-gray-100">
          <button disabled={countSelected === 0} onClick={onClose}
            className="w-full py-1.5 rounded-full text-sm font-semibold transition-all"
            style={{ background: countSelected > 0 ? '#1B3A6B' : '#e5e7eb', color: countSelected > 0 ? '#fff' : '#9ca3af' }}>
            {countSelected > 1 ? `שחזר ${countSelected} סעיפים` : 'שחזר סעיף'}
          </button>
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

function SectionChat({ title, top, onClose }: { title: string; top: number; onClose: () => void }) {
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([
    { from: 'them', text: 'איך אפשר לעזור בסעיף זה?' },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = () => {
    if (!msg.trim()) return;
    setMessages(prev => [...prev, { from: 'me', text: msg.trim() }]);
    setMsg('');
  };

  const clampedTop = Math.max(80, Math.min(top - 10, window.innerHeight - 240));

  return (
    <div className="rounded-2xl border border-gray-200 bg-white flex flex-col overflow-hidden"
      style={{
        position: 'fixed', left: 12, top: clampedTop,
        width: 240, maxHeight: 220, zIndex: 9999,
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
      }} dir="rtl">
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
            <span className={`text-xs px-2.5 py-1.5 rounded-xl max-w-[85%] ${m.from === 'me' ? 'bg-[#1B3A6B] text-white' : 'bg-gray-100 text-gray-700'}`}>
              {m.text}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      {/* Input */}
      <div className="flex items-center gap-1.5 px-2 py-1.5 border-t border-gray-100 flex-shrink-0">
        <button onClick={send}
          className="p-1.5 rounded-lg transition-colors flex-shrink-0"
          style={{ background: '#1B3A6B', color: '#fff' }}>
          <Send className="w-3 h-3" style={{ transform: 'scaleX(-1)' }} />
        </button>
        <input value={msg} onChange={e => setMsg(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="הקלד הודעה..."
          className="flex-1 text-xs bg-transparent focus:outline-none text-right"
          dir="rtl" />
      </div>
    </div>
  );
}

function DocToolbar() {
  return (
    <div className="flex items-center gap-0.5 px-3 py-1.5 flex-wrap"
      style={{
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        borderTop: '1px solid #e5e7eb',
        direction: 'rtl',
        boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
      }}>
      {/* Text formatting */}
      <TB title="מודגש (Ctrl+B)"><Bold className="w-3.5 h-3.5" /></TB>
      <TB title="נטוי (Ctrl+I)"><Italic className="w-3.5 h-3.5" /></TB>
      <TB title="קו תחתון (Ctrl+U)"><Underline className="w-3.5 h-3.5" /></TB>
      <TB title="קו חוצה"><Strikethrough className="w-3.5 h-3.5" /></TB>
      <Sep />

      {/* Colors */}
      <ColorSwatch title="צבע טקסט" color="#dc2626" textColor />
      <button title="צבע מרקר"
        className="flex flex-col items-center justify-center p-1.5 rounded hover:bg-gray-100 transition-colors flex-shrink-0"
        style={{ minWidth: 28, minHeight: 28 }}>
        <Highlighter className="w-3.5 h-3.5" style={{ color: '#374151' }} />
        <span style={{ width: 16, height: 3, borderRadius: 1, background: '#fde047', marginTop: 2 }} />
      </button>
      <Sep />

      {/* Lists */}
      <TB title="רשימה ממוספרת (1 2 3)"><ListOrdered className="w-3.5 h-3.5" /></TB>
      <TB title="רשימת תבליטים">
        <List className="w-3.5 h-3.5" />
      </TB>
      <Sep />

      {/* Alignment */}
      <TB title="יישור לימין"><AlignRight className="w-3.5 h-3.5" /></TB>
      <TB title="מרכוז"><AlignCenter className="w-3.5 h-3.5" /></TB>
      <TB title="יישור לשמאל"><AlignLeft className="w-3.5 h-3.5" /></TB>
      <TB title="יישור לשני הצדדים"><AlignJustify className="w-3.5 h-3.5" /></TB>
      <Sep />

      {/* Indent & wrap */}
      <TB title="הגדל הזחה"><Indent className="w-3.5 h-3.5" /></TB>
      <TB title="הקטן הזחה"><Outdent className="w-3.5 h-3.5" /></TB>
      <Sep />

      {/* Text direction */}
      <TB title="כיוון טקסט מימין לשמאל"><PilcrowRight className="w-3.5 h-3.5" /></TB>
      <TB title="כיוון טקסט משמאל לימין"><PilcrowLeft className="w-3.5 h-3.5" /></TB>
      <Sep />

      {/* References & attachments */}
      <TB title="הפניה / הערת שוליים"><Superscript className="w-3.5 h-3.5" /></TB>
      <TB title="הוספת קובץ מצורף"><Paperclip className="w-3.5 h-3.5" /></TB>
      <Sep />

      {/* Table, fill, brush, clear */}
      <TB title="הוספת טבלה"><Table2 className="w-3.5 h-3.5" /></TB>
      <TB title="מילוי רקע"><PaintBucket className="w-3.5 h-3.5" /></TB>
      <TB title="מברשת עיצוב"><PaintRoller className="w-3.5 h-3.5" /></TB>
      <TB title="נקה עיצוב"><RemoveFormatting className="w-3.5 h-3.5" /></TB>
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

interface Section {
  id: string;
  title: string;
  children?: Section[];
}

const MOCK_SECTIONS: Section[] = [
  {
    id: 's1', title: 'מטרה ורקע',
    children: [
      { id: 's1-1', title: 'מטרת המסמך' },
      { id: 's1-2', title: 'היסטוריית גרסאות' },
    ],
  },
  {
    id: 's2', title: 'הגדרות ומונחים',
    children: [
      { id: 's2-1', title: 'מונחים כלליים' },
      { id: 's2-2', title: 'קיצורים' },
    ],
  },
  {
    id: 's3', title: 'נהלים ותהליכים',
    children: [
      { id: 's3-1', title: 'תהליך קבלת החלטות' },
      { id: 's3-2', title: 'אחריות ותפקידים' },
      { id: 's3-3', title: 'לוחות זמנים' },
    ],
  },
  {
    id: 's4', title: 'הוראות ביצוע',
    children: [
      { id: 's4-1', title: 'שלב א׳ – הכנה' },
      { id: 's4-2', title: 'שלב ב׳ – ביצוע' },
      { id: 's4-3', title: 'שלב ג׳ – בקרה' },
    ],
  },
  {
    id: 's5', title: 'נספחים',
  },
  {
    id: 's6', title: 'חתימות',
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
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-600 bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-100">{value}</span>
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

function EditDocDetailsModal({ doc, onClose }: { doc?: { name?: string; orderNum?: string; status?: string } | null; onClose: () => void }) {
  const [name,      setName]      = useState(doc?.name ?? 'שם הפקודה');
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

  return (
    <div className="fixed inset-0 z-[99998] flex items-center justify-center"
      style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(2px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden" dir="rtl"
        style={{ width: 620, maxHeight: '88vh' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-base font-semibold text-gray-800">פרטי המסמך</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6">

          {/* Read-only section */}
          <div className="rounded-xl p-4 flex flex-col gap-3" style={{ background: '#f8f9fb' }}>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">שדות קבועים</p>
            <div className="grid grid-cols-3 gap-3">
              <ReadOnlyField label="סיווג"       value="בלמ״ס" />
              <ReadOnlyField label="תבנית"       value="מסמך בטיחות" />
              <ReadOnlyField label="ארגון"       value="ארגון א׳" />
              <ReadOnlyField label="מס׳ פקודה"  value={doc?.orderNum ?? '001'} />
              <ReadOnlyField label="מס׳ עדכון"  value="1" />
            </div>
          </div>

          {/* Editable fields */}
          <div className="flex flex-col gap-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">שדות לעריכה</p>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <EditableField label="שם המסמך" value={name} onChange={setName} />
              </div>
              <SelectField label="מחלקה" value={dept} onChange={setDept}
                options={['משאבי אנוש', 'מבצעים', 'לוגיסטיקה', 'כספים', 'טכנולוגיה']} />
              <SelectField label="סוג מסמך" value={docType} onChange={setDocType}
                options={['פקודה', 'נוהל', 'הוראה', 'הנחיה', 'נספח']} />
              <div className="col-span-2">
                <EditableField label="שיוך לתיקייה מבצעית" value={folder} onChange={setFolder} />
              </div>
              <div className="col-span-2">
                <AmazonSelector entityType={amazonType} entityName={amazonName}
                  onChangeType={v => { setAmazonType(v); setAmazonName(''); }}
                  onChangeName={setAmazonName} />
              </div>
              <EditableField label="כניסה לתוקף" value={entryDate} onChange={setEntryDate} type="date" />
              <EditableField label="יציאה מתוקף" value={exitDate} onChange={setExitDate} type="date" />
            </div>

            {/* Toggles & controls */}
            <div className="flex flex-col gap-0 rounded-xl overflow-hidden border border-gray-100">

              {/* PDF export — segmented control */}
              <div className="flex items-center justify-between px-4 py-3 bg-white">
                <span className="text-sm text-gray-700">ייצוא לPDF</span>
                <div className="flex rounded-lg overflow-hidden border border-gray-200" style={{ fontSize: 12 }}>
                  {(['authorized', 'all'] as const).map((opt, i) => (
                    <button key={opt} onClick={() => setPdfAccess(opt)}
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
                <Toggle checked={cancelApproval} onChange={() => setCancelApproval(p => !p)} />
              </div>

              <div className="flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors"
                style={{ borderTop: '1px solid #f3f4f6' }}>
                <span className="text-sm text-gray-700">הצגת סימן מים</span>
                <Toggle checked={watermark} onChange={() => setWatermark(p => !p)} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-start gap-3 px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <button onClick={onClose}
            className="px-5 py-2 rounded-full text-sm font-semibold text-white transition-colors"
            style={{ background: '#1B3A6B' }}>
            שמור שינויים
          </button>
          <button onClick={onClose}
            className="px-5 py-2 rounded-full text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
            ביטול
          </button>
        </div>
      </div>
    </div>
  );
}

const FILTER_STATUSES = [
  { id: 'editing',   label: 'סעיף בעריכה',      color: '#0284c7' },
  { id: 'fix',       label: 'דרוש תיקון',        color: '#dc2626' },
  { id: 'idle',      label: 'לא בעבודה',         color: '#9ca3af' },
  { id: 'pending',   label: 'ממתין לאישור',      color: '#d97706' },
  { id: 'approved',  label: 'מאושר',             color: '#16a34a' },
];

function FilterPanel({ onClose }: { onClose: () => void }) {
  const [active, setActive] = useState<Set<string>>(new Set());
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
          disabled={active.size === 0}
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

export function Edit({ navigate, doc }: EditProps) {
  const docStatus = doc?.status ?? 'בהכנה';
  const statusIdx = STATUS_FLOW.indexOf(docStatus);
  const prevStatus = statusIdx > 0 ? STATUS_FLOW[statusIdx - 1] : null;
  const nextStatus = statusIdx < STATUS_FLOW.length - 1 ? STATUS_FLOW[statusIdx + 1] : null;

  const dotColor = STATUS_COLOR[docStatus] ?? '#6b7280';
  const [openChat, setOpenChat] = useState<{ id: string; title: string; top: number } | null>(null);
  const [sectionMenu, setSectionMenu] = useState<{ x: number; y: number; flipped: boolean } | null>(null);
  const [addMenu, setAddMenu] = useState<{ x: number; y: number } | null>(null);
  const [restorePanel, setRestorePanel] = useState<{ x: number; y: number } | null>(null);
  const [sections, setSections] = useState<Section[]>(MOCK_SECTIONS);
  const [editingNewId, setEditingNewId] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const closeFilterPanel = useCallback(() => setShowFilterPanel(false), []);
  const [showEditDocModal, setShowEditDocModal] = useState(false);
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
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setRestorePanel({ x: rect.left, y: window.innerHeight - rect.top + 8 });
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

  const openSectionMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const flipped = rect.bottom > window.innerHeight * 0.6;
    setSectionMenu({ x: rect.left, y: flipped ? window.innerHeight - rect.top + 4 : rect.bottom + 4, flipped });
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
        onEditDocClick={() => setShowEditDocModal(true)} />
      {showFilterPanel && <FilterPanel onClose={closeFilterPanel} />}

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
        <aside className="w-64 flex-shrink-0 flex flex-col overflow-hidden z-10 relative px-4 py-5 before:content-[''] before:absolute before:left-0 before:top-6 before:bottom-6 before:w-[1px] before:bg-[#E5E5E5]">

          {/* Status header */}
          <div className="mb-4">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border"
              style={{ background: 'rgba(27,58,107,0.07)', borderColor: 'rgba(27,58,107,0.2)' }}>
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: dotColor }} />
              <span className="text-sm font-semibold" style={{ color: '#1B3A6B' }}>מסמך {docStatus}</span>
            </div>
          </div>

          {/* Status navigation */}
          <div className="flex flex-col gap-2 mb-5">
            {nextStatus && (
              <button className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-sm font-semibold w-full transition-all hover:opacity-90 active:scale-95"
                style={{ background: '#1B3A6B', color: '#fff', boxShadow: '0 2px 8px rgba(27,58,107,0.3)' }}>
                <span className="flex-1 text-right">העבר ל{nextStatus}</span>
                <ChevronLeft className="w-3.5 h-3.5 flex-shrink-0" />
              </button>
            )}
            {prevStatus && (
              <button className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl text-xs text-gray-500 w-full transition-all hover:bg-white/70 border border-gray-200">
                <span className="flex-1 text-right">החזר למסמך {prevStatus}</span>
                <ChevronLeft className="w-3 h-3 flex-shrink-0 rotate-180 text-gray-400" />
              </button>
            )}
          </div>

          <div className="h-px bg-gray-200 mb-4" />

          {/* Template-creation style section tree */}
          <div className="flex-1 overflow-y-auto min-h-0 flex flex-col gap-0 pb-1">


            {/* Topic list */}
            <div className="flex flex-col gap-1">
              {sections.map(section => (
                <div key={section.id}>

                  {/* Topic row */}
                  <div
                    className="flex items-center gap-2 px-2 py-2 rounded-xl group transition-colors cursor-pointer hover:bg-white"
                    dir="rtl"
                    onClick={() => editingNewId !== section.id && toggleTopic(section.id)}>
                    <ChevronLeft
                      className="w-3.5 h-3.5 flex-shrink-0 text-[#1B3A6B]/50 transition-transform duration-200"
                      style={{ transform: expandedTopics.has(section.id) ? 'rotate(-90deg)' : 'rotate(0deg)' }}
                    />
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#1B3A6B' }} />
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
                      onClick={e => { e.stopPropagation(); const rect = (e.currentTarget as HTMLElement).getBoundingClientRect(); setItemMenu({ id: section.id, type: 'topic', x: rect.left, y: rect.bottom + 4, onDelete: () => { setItemMenu(null); setPendingDelete({ label: 'נושא זה', onConfirm: () => { setSections(prev => prev.filter(s => s.id !== section.id)); setPendingDelete(null); } }); }, onRename: () => { setRenamingId(section.id); setItemMenu(null); } }); }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-full text-[#1B3A6B] hover:bg-gray-200/70 transition-all flex-shrink-0">
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Section children — aligned with title start */}
                  {section.children && expandedTopics.has(section.id) && (
                    <div className="flex flex-col gap-1 mb-1" style={{ paddingRight: 30 }}>
                      {section.children.map((child, ci) => (
                        <div key={child.id} dir="rtl">
                          {/* Child row */}
                          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl group transition-colors cursor-pointer hover:bg-white" dir="rtl">
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
                            <button
                              title="אפשרויות"
                              onClick={e => { e.stopPropagation(); const rect = (e.currentTarget as HTMLElement).getBoundingClientRect(); setItemMenu({ id: child.id, type: 'section', x: rect.left, y: rect.bottom + 4, onDelete: () => { setItemMenu(null); setPendingDelete({ label: 'סעיף זה', onConfirm: () => { setSections(prev => prev.map(s => s.id === section.id ? { ...s, children: s.children!.filter(c => c.id !== child.id) } : s)); setPendingDelete(null); } }); }, onRename: () => { setRenamingId(child.id); setItemMenu(null); } }); }}
                              className="p-1 rounded-full text-[#1B3A6B] hover:bg-gray-200/70 transition-colors flex-shrink-0">
                              <MoreVertical className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Sub-children */}
                          {child.children && child.children.map((sub, si) => (
                            <div key={sub.id} className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl group transition-colors cursor-pointer hover:bg-white" style={{ paddingRight: 28 }} dir="rtl">
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
                                onClick={e => { e.stopPropagation(); const rect = (e.currentTarget as HTMLElement).getBoundingClientRect(); setItemMenu({ id: sub.id, type: 'subsection', x: rect.left, y: rect.bottom + 4, onDelete: () => { setItemMenu(null); setPendingDelete({ label: 'תת סעיף זה', onConfirm: () => { setSections(prev => prev.map(s => s.id === section.id ? { ...s, children: s.children!.map(c => c.id === child.id ? { ...c, children: c.children!.filter(sb => sb.id !== sub.id) } : c) } : s)); setPendingDelete(null); } }); }, onRename: () => { setRenamingId(sub.id); setItemMenu(null); } }); }}
                                className="p-1 rounded-full text-[#1B3A6B] hover:bg-gray-200/70 transition-colors flex-shrink-0">
                                <MoreVertical className="w-3 h-3" />
                              </button>
                            </div>
                          ))}

                          {/* Add sub-section */}
                          <div style={{ paddingRight: 28 }} dir="rtl">
                            <button
                              className="text-right text-[11px] text-gray-400 hover:text-gray-600 transition-colors"
                              onClick={e => { e.stopPropagation(); const id = `sub-${Date.now()}`; setSections(prev => prev.map(s => s.id === section.id ? { ...s, children: s.children!.map(c => c.id === child.id ? { ...c, children: [...(c.children ?? []), { id, title: `תת סעיף ${HE_ALPHA[(c.children?.length ?? 0)]}` }] } : c) } : s)); }}>
                              + תת סעיף
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Add section */}
                      <div className="pb-1" dir="rtl">
                        <button
                          className="text-right text-xs font-semibold text-[#1B3A6B] hover:text-[#152e54] transition-colors"
                          onClick={e => { e.stopPropagation(); const id = `child-${Date.now()}`; setSections(prev => prev.map(s => s.id === section.id ? { ...s, children: [...(s.children ?? []), { id, title: `סעיף ${(s.children?.length ?? 0) + 1}` }] } : s)); }}>
                          + הוספת סעיף
                        </button>
                      </div>
                    </div>
                  )}

                  {/* No children — show add section link only when expanded */}
                  {!section.children && expandedTopics.has(section.id) && (
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
            <button
              title="שחזר סעיף שנמחק"
              onClick={openRestorePanel}
              className="p-2 rounded-full text-white transition-colors hover:opacity-90"
              style={{ background: '#1B3A6B', boxShadow: '0 2px 8px rgba(27,58,107,0.3)' }}>
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              title="הוסף סעיף / נושא"
              onClick={openAddMenu}
              className="p-2 rounded-full text-white transition-colors hover:opacity-90"
              style={{ background: '#1B3A6B', boxShadow: '0 2px 8px rgba(27,58,107,0.3)' }}>
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </aside>

        {/* Main editor area — Docs/Word style */}
        <main className="flex-1 overflow-y-auto">
          <div className="flex flex-col items-center pt-6 gap-0">

            {/* Toolbar — sticky at top of scroll area */}
            <div style={{ width: '210mm', position: 'sticky', top: 0, zIndex: 20, borderRadius: '8px 8px 0 0', overflow: 'hidden' }}>
              <DocToolbar />
            </div>

            {/* Continuous document — sections as white boxes, A4 page-break lines in background */}
            <div ref={paperRef} style={{
              width: '210mm',
              minHeight: '297mm',
              backgroundColor: 'white',
              boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
              direction: 'rtl',
              position: 'relative',
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
                {sections.map((section, idx) => (
                  <div key={section.id} {...(!section.children ? { 'data-page-box': '' } : {})} style={{ display: 'flex', gap: '0.3em', marginBottom: '10mm' }}>

                    {/* Number column */}
                    <div style={{ flexShrink: 0, fontSize: 13, fontWeight: 700, color: '#1e293b', lineHeight: 1.5 }}>
                      {idx + 1}.
                    </div>

                    {/* Content column — aligns with first letter of section name */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Section heading */}
                      <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        marginBottom: '3mm', paddingBottom: '1.5mm',
                        borderBottom: '1px solid #e5e7eb',
                      }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{section.title}</div>
                        {!section.children && (
                          <div className="flex items-center gap-0.5">
                            <button title="בטל" className="p-1 rounded hover:bg-gray-100 transition-colors" style={{ color: '#d1d5db' }}>
                              <Undo2 className="w-3 h-3" />
                            </button>
                            <button title="בצע שנית" className="p-1 rounded hover:bg-gray-100 transition-colors" style={{ color: '#d1d5db' }}>
                              <Redo2 className="w-3 h-3" />
                            </button>
                            <button title="צאט"
                              onClick={e => {
                                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                setOpenChat(openChat?.id === section.id ? null : { id: section.id, title: `${idx + 1}. ${section.title}`, top: rect.top });
                              }}
                              className={`p-1 rounded hover:bg-gray-100 transition-colors ${openChat?.id === section.id ? 'text-[#1B3A6B]' : 'text-gray-400'}`}>
                              <MessageSquare className="w-3 h-3" />
                            </button>
                            <button title="אפשרויות" onClick={openSectionMenu}
                              className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
                              <MoreHorizontal className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Content box for leaf sections */}
                      {!section.children && (
                        <div style={{ minHeight: '35mm', border: '1px solid #e5e7eb', borderRadius: 4, background: 'white' }} />
                      )}

                      {/* Sub-sections */}
                      {section.children?.map((child, ci) => (
                        <div key={child.id} data-page-box="" style={{ display: 'flex', gap: '0.3em', marginBottom: '5mm' }}>

                          {/* Sub-section number column */}
                          <div style={{ flexShrink: 0, fontSize: 12, fontWeight: 600, color: '#374151', lineHeight: 1.5, whiteSpace: 'nowrap' }}>
                            {idx + 1}.{ci + 1}
                          </div>

                          {/* Sub-section content column — aligns with first letter of sub-section name */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              marginBottom: '2mm',
                            }}>
                              <div style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{child.title}</div>
                              <div className="flex items-center gap-0.5">
                                <button title="בטל" className="p-1 rounded hover:bg-gray-100 transition-colors" style={{ color: '#d1d5db' }}>
                                  <Undo2 className="w-3 h-3" />
                                </button>
                                <button title="בצע שנית" className="p-1 rounded hover:bg-gray-100 transition-colors" style={{ color: '#d1d5db' }}>
                                  <Redo2 className="w-3 h-3" />
                                </button>
                                <button title="צאט"
                                  onClick={e => {
                                    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                    setOpenChat(openChat?.id === child.id ? null : { id: child.id, title: `${idx + 1}.${ci + 1} ${child.title}`, top: rect.top });
                                  }}
                                  className={`p-1 rounded hover:bg-gray-100 transition-colors ${openChat?.id === child.id ? 'text-[#1B3A6B]' : 'text-gray-400'}`}>
                                  <MessageSquare className="w-3 h-3" />
                                </button>
                                <button title="אפשרויות" onClick={openSectionMenu}
                                  className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
                                  <MoreHorizontal className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            <div style={{ minHeight: '28mm', border: '1px solid #e5e7eb', borderRadius: 4, background: 'white' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

      </div>

      {openChat && (
        <SectionChat title={openChat.title} top={openChat.top} onClose={() => setOpenChat(null)} />
      )}
      {sectionMenu && (
        <SectionMenu x={sectionMenu.x} y={sectionMenu.y} flipped={sectionMenu.flipped} onClose={() => setSectionMenu(null)} />
      )}
      {addMenu && (
        <AddMenu x={addMenu.x} y={addMenu.y} onClose={() => setAddMenu(null)} onAction={handleAddAction} />
      )}
      {restorePanel && (
        <RestorePanel x={restorePanel.x} y={restorePanel.y} onClose={() => setRestorePanel(null)} />
      )}
      {showImportModal && (
        <ImportDocModal onClose={() => setShowImportModal(false)} onImport={() => setShowImportModal(false)} />
      )}
      {showEditDocModal && (
        <EditDocDetailsModal doc={doc} onClose={() => setShowEditDocModal(false)} />
      )}

      {/* 3-dots context menu for section / sub-section items */}
      {itemMenu && (
        <div ref={itemMenuRef} className="fixed z-[99999] bg-white rounded-xl shadow-xl border border-gray-100 py-1 min-w-[130px]"
          style={{ top: itemMenu.y, left: itemMenu.x }} dir="rtl">
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
