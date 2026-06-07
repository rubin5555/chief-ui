import { User, Eye, Send, CheckCircle, Share2, FileText, PenLine, List, Search, Folder, Trash2, Copy, ChevronDown, ChevronLeft, GripVertical, Pin, Filter, X, Check, Download, Users, Layers, Network, UserCheck, AlertCircle, Bold, Italic, Underline, Strikethrough, Highlighter, AlignRight, AlignCenter, AlignLeft, AlignJustify, ListOrdered, Indent, Outdent, PilcrowRight, PilcrowLeft, Superscript, Paperclip, Table2, PaintBucket, PaintRoller, RemoveFormatting, Plus } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { ImportDropdown } from './ImportDropdown';
import { CustomSelect } from './CustomSelect';

const ENV_PEOPLE_OPTIONS = [
  'אבי כהן', 'שרה לוי', 'משה ישראלי', 'רחל דוד', 'יוסף מזרחי',
  'מירי פרץ', 'דני אברהם', 'לאה כץ', 'אורן שמש', 'נועה גרין',
  'יעקב בן-דוד', 'תמר ברק', 'עמי שלו', 'ריקי נחום', 'גיל אלון',
];

const LIST_DOCS_DATA = [
  { id: 'd1', name: 'נוהל בטיחות 2026',  cmdNum: '001', update: 'גרסה 2', environment: 'ארגון א׳', docType: 'נוהל',  lastUpdate: '10/05/2026', refNum: '1001', status: 'טיוטה',
    distribution: [
      { name: 'אבי כהן',     idNumber: '012345678', environment: 'ארגון א׳' },
      { name: 'שרה לוי',     idNumber: '023456789', environment: 'ארגון ב׳' },
      { name: 'דני אברהם',   idNumber: '078901234', environment: 'ארגון ד׳' },
      { name: 'מירי פרץ',    idNumber: '067890123', environment: 'ארגון א׳' },
      { name: 'יעקב בן-דוד', idNumber: '112345678', environment: 'ארגון א׳' },
      { name: 'תמר ברק',     idNumber: '123456789', environment: 'ארגון ב׳' },
    ]},
  { id: 'd2', name: 'נוהל גיוס עובדים',  cmdNum: '002', update: 'גרסה 1', environment: 'ארגון ב׳', docType: 'נוהל',  lastUpdate: '08/05/2026', refNum: '1002', status: 'בהכנה',
    distribution: [
      { name: 'משה ישראלי', idNumber: '034567890', environment: 'ארגון א׳' },
      { name: 'לאה כץ',     idNumber: '089012345', environment: 'ארגון ב׳' },
    ]},
  { id: 'd3', name: 'תקנון משמעת',        cmdNum: '003', update: 'גרסה 3', environment: 'ארגון א׳', docType: 'תקנון', lastUpdate: '05/05/2026', refNum: '1003', status: 'טיוטה',
    distribution: [
      { name: 'אורן שמש',  idNumber: '090123456', environment: 'ארגון א׳' },
      { name: 'גיל אלון',  idNumber: '156789012', environment: 'ארגון ג׳' },
      { name: 'נועה גרין', idNumber: '101234567', environment: 'ארגון ג׳' },
      { name: 'ריקי נחום', idNumber: '145678901', environment: 'ארגון א׳' },
    ]},
  { id: 'd4', name: 'נוהל רכש ואספקה',   cmdNum: '004', update: 'גרסה 1', environment: 'ארגון ג׳', docType: 'נוהל',  lastUpdate: '03/05/2026', refNum: '1004', status: 'טיוטה',
    distribution: [
      { name: 'יוסף מזרחי', idNumber: '056789012', environment: 'ארגון ב׳' },
    ]},
];

const LIST_PEOPLE_POOL = [
  { id: 'p1',  name: 'אבי כהן',       idNumber: '012345678', environment: 'ארגון א׳' },
  { id: 'p2',  name: 'שרה לוי',        idNumber: '023456789', environment: 'ארגון ב׳' },
  { id: 'p3',  name: 'משה ישראלי',     idNumber: '034567890', environment: 'ארגון א׳' },
  { id: 'p4',  name: 'רחל דוד',        idNumber: '045678901', environment: 'ארגון ג׳' },
  { id: 'p5',  name: 'יוסף מזרחי',     idNumber: '056789012', environment: 'ארגון ב׳' },
  { id: 'p6',  name: 'מירי פרץ',       idNumber: '067890123', environment: 'ארגון א׳' },
  { id: 'p7',  name: 'דני אברהם',      idNumber: '078901234', environment: 'ארגון ד׳' },
  { id: 'p8',  name: 'לאה כץ',         idNumber: '089012345', environment: 'ארגון ב׳' },
  { id: 'p9',  name: 'אורן שמש',       idNumber: '090123456', environment: 'ארגון א׳' },
  { id: 'p10', name: 'נועה גרין',      idNumber: '101234567', environment: 'ארגון ג׳' },
  { id: 'p11', name: 'יעקב בן-דוד',   idNumber: '112345678', environment: 'ארגון א׳' },
  { id: 'p12', name: 'תמר ברק',        idNumber: '123456789', environment: 'ארגון ב׳' },
  { id: 'p13', name: 'עמי שלו',        idNumber: '134567890', environment: 'ארגון ד׳' },
  { id: 'p14', name: 'ריקי נחום',      idNumber: '145678901', environment: 'ארגון א׳' },
  { id: 'p15', name: 'גיל אלון',       idNumber: '156789012', environment: 'ארגון ג׳' },
];

function SearchableSelect({ value, onChange, placeholder = 'חפש...', options = ENV_PEOPLE_OPTIONS, noBorder = false }: {
  value: string; onChange: (v: string) => void; placeholder?: string; options?: string[]; noBorder?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [dropPos, setDropPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setTimeout(() => inputRef.current?.focus(), 50);
    const h = (e: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
          dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setIsOpen(false); setSearch('');
      }
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [isOpen]);

  const open = () => {
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      const dropH = Math.min(options.length * 40 + 52, 260);
      const spaceBelow = window.innerHeight - r.bottom;
      const top = spaceBelow < dropH + 8 ? r.top - dropH - 4 : r.bottom + 4;
      setDropPos({ top, left: r.left, width: r.width });
    }
    setIsOpen(p => !p);
  };

  const select = (opt: string) => { onChange(opt); setIsOpen(false); setSearch(''); };
  const filtered = options.filter(o => o.includes(search));

  return (
    <>
      <button ref={triggerRef} type="button" onClick={open}
        className={`w-full flex items-center justify-between px-4 py-2 bg-white focus:outline-none transition-colors ${noBorder ? '' : 'border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1B3A6B]/50 hover:border-gray-400'}`}>
        <span className={`text-sm flex-1 text-right ${!value ? 'text-gray-400' : 'text-gray-800'}`}>{value || placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && dropPos && (
        <div ref={dropRef} className="fixed bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden" dir="rtl"
          style={{ top: dropPos.top, left: dropPos.left, width: dropPos.width, zIndex: 99999 }}>
          <div className="p-2 border-b border-gray-100">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl">
              <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <input ref={inputRef} type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="חפש שם..." dir="rtl"
                className="flex-1 text-sm bg-transparent outline-none text-right placeholder-gray-400" />
            </div>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: 200 }}>
            {filtered.length === 0
              ? <p className="text-center text-xs text-gray-400 py-4">לא נמצאו תוצאות</p>
              : filtered.map(opt => (
                <button key={opt} type="button" onClick={() => select(opt)}
                  className={`w-full text-right px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 ${value === opt ? 'text-[#1B3A6B] font-medium bg-[#EEF4FF]' : 'text-gray-700'}`}>
                  {opt}
                </button>
              ))
            }
          </div>
        </div>
      )}
    </>
  );
}

function SearchableMultiSelect({ selected, onChange, placeholder = 'בחר...', options = ENV_PEOPLE_OPTIONS, noBorder = false }: {
  selected: string[]; onChange: (v: string[]) => void; placeholder?: string; options?: string[]; noBorder?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [dropPos, setDropPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setTimeout(() => inputRef.current?.focus(), 50);
    const h = (e: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
          dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setIsOpen(false); setSearch('');
      }
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [isOpen]);

  const open = () => {
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      const dropH = Math.min(options.length * 40 + 52, 260);
      const spaceBelow = window.innerHeight - r.bottom;
      const top = spaceBelow < dropH + 8 ? r.top - dropH - 4 : r.bottom + 4;
      setDropPos({ top, left: r.left, width: Math.max(r.width, 220) });
    }
    setIsOpen(p => !p);
  };

  const toggle = (opt: string) => onChange(selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt]);
  const filtered = options.filter(o => o.includes(search));

  return (
    <>
      <button ref={triggerRef} type="button" onClick={open}
        className={`w-full flex items-center justify-between gap-2 px-4 py-2 bg-white focus:outline-none transition-colors min-h-[38px] ${noBorder ? '' : 'border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1B3A6B]/50 hover:border-gray-400'}`}>
        <div className="flex-1 flex flex-wrap gap-1 justify-start">
          {selected.length === 0
            ? <span className="text-sm text-gray-400">{placeholder}</span>
            : selected.map(s => (
              <span key={s} className="inline-flex items-center gap-1 bg-[#EEF4FF] text-[#1B3A6B] text-xs font-medium px-2 py-0.5 rounded-lg">
                <button type="button" onClick={e => { e.stopPropagation(); toggle(s); }} className="hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
                {s}
              </span>
            ))
          }
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && dropPos && (
        <div ref={dropRef} className="fixed bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden" dir="rtl"
          style={{ top: dropPos.top, left: dropPos.left, width: dropPos.width, zIndex: 99999 }}>
          <div className="p-2 border-b border-gray-100">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl">
              <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <input ref={inputRef} type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="חפש שם..." dir="rtl"
                className="flex-1 text-sm bg-transparent outline-none text-right placeholder-gray-400" />
            </div>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: 200 }}>
            {filtered.length === 0
              ? <p className="text-center text-xs text-gray-400 py-4">לא נמצאו תוצאות</p>
              : filtered.map(opt => (
                <button key={opt} type="button" onClick={() => toggle(opt)}
                  className={`w-full text-right px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 flex items-center justify-between ${selected.includes(opt) ? 'text-[#1B3A6B] font-medium' : 'text-gray-700'}`}>
                  <span>{opt}</span>
                  <span>{selected.includes(opt) ? <Check className="w-3.5 h-3.5 text-[#1B3A6B]" /> : null}</span>
                </button>
              ))
            }
          </div>
        </div>
      )}
    </>
  );
}

function MultiSelectDropdown({ options, selected, onChange, placeholder }: {
  options: string[]; selected: string[]; onChange: (v: string[]) => void; placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropPos, setDropPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const h = (e: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
          dropRef.current && !dropRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [isOpen]);

  const open = () => {
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      const dropH = Math.min(options.length * 44 + 12, 240);
      const spaceBelow = window.innerHeight - r.bottom;
      const top = spaceBelow < dropH + 8 ? r.top - dropH - 4 : r.bottom + 4;
      setDropPos({ top, left: r.left, width: r.width });
    }
    setIsOpen(p => !p);
  };

  const toggle = (opt: string) => onChange(selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt]);
  const display = selected.length === 0 ? (placeholder ?? 'בחר...') : selected.length === 1 ? selected[0] : `${selected.length} נבחרו`;

  return (
    <>
      <button ref={triggerRef} type="button" onClick={open}
        className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/50 transition-colors hover:border-gray-400">
        <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        <span className={`text-sm flex-1 text-right ${selected.length === 0 ? 'text-gray-400' : 'text-gray-800'}`}>{display}</span>
      </button>
      {isOpen && dropPos && (
        <div ref={dropRef} className="fixed bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 overflow-y-auto" dir="rtl"
          style={{ top: dropPos.top, left: dropPos.left, width: dropPos.width, maxHeight: 240, zIndex: 99999 }}>
          {options.map(opt => (
            <button key={opt} type="button" onClick={() => toggle(opt)}
              className="w-full text-right px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 flex items-center gap-2">
              <div className={`w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center ${selected.includes(opt) ? 'bg-[#1B3A6B] border-[#1B3A6B]' : 'border-gray-300'}`}>
                {selected.includes(opt) && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
              </div>
              <span className={`flex-1 text-right ${selected.includes(opt) ? 'text-[#1B3A6B] font-medium' : 'text-gray-700'}`}>{opt}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}

type PermSource = 'user' | 'group' | 'list';
type PermTag = { label: string; source: PermSource };

const PERM_SOURCE_OPTIONS: { id: PermSource; label: string; Icon: React.FC<{ className?: string }> }[] = [
  { id: 'user',  label: 'שם פרטי',       Icon: User  },
  { id: 'group', label: 'קבוצה',          Icon: Users },
  { id: 'list',  label: 'רשימת תפוצה',   Icon: List  },
];

const MOCK_BY_SOURCE: Record<PermSource, string[]> = {
  user:  ['אבי כהן', 'שרה לוי', 'יוסי מזרחי', 'רחל גולן', 'דניאל שמש', 'מיכל ברק', 'נועם שפירא', 'תמר אלון'],
  group: ['צוות פיתוח', 'צוות תפעול', 'מחלקת ביטחון', 'הנהלה', 'צוות לוגיסטיקה', 'מחלקת מבצעים'],
  list:  ['רשימת מנהלים', 'רשימת טכנאים', 'רשימת מאשרים', 'רשימת עדכונים', 'רשימת תפוצה כללית'],
};

const SOURCE_TAG_COLORS: Record<PermSource, string> = {
  user:  'bg-blue-50 text-blue-800',
  group: 'bg-purple-50 text-purple-800',
  list:  'bg-green-50 text-green-800',
};

function PermUserInput({ tags, onChange }: { tags: PermTag[]; onChange: (t: PermTag[]) => void }) {
  const [source, setSource] = useState<PermSource>('user');
  const [input, setInput] = useState('');
  const [showSug, setShowSug] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const suggestions = MOCK_BY_SOURCE[source].filter(u => !tags.find(t => t.label === u && t.source === source) && u.includes(input));

  useEffect(() => {
    if (!showSug) return;
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setShowSug(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [showSug]);

  const add = (label: string) => { onChange([...tags, { label, source }]); setInput(''); setShowSug(false); };
  const remove = (idx: number) => onChange(tags.filter((_, i) => i !== idx));

  return (
    <div ref={ref} className="relative flex flex-col gap-1">
      {/* Source type selector */}
      <div className="flex rounded-lg overflow-hidden border border-gray-200 self-start">
        {PERM_SOURCE_OPTIONS.map(({ id, label, Icon }, i) => (
          <button key={id} type="button" onClick={() => setSource(id)}
            style={{
              background: source === id ? '#1B3A6B' : '#fff',
              color: source === id ? '#fff' : '#6b7280',
              borderRight: i < PERM_SOURCE_OPTIONS.length - 1 ? '1px solid #e5e7eb' : undefined,
              fontSize: 11, padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 3,
            }}>
            <Icon className="w-3 h-3" />
            {label}
          </button>
        ))}
      </div>
      {/* Tag input */}
      <div className="flex flex-wrap gap-1.5 items-center min-h-[34px] px-2.5 py-1.5 border border-gray-200 rounded-lg bg-white focus-within:border-[#1B3A6B] transition-colors">
        {tags.map((t, i) => {
          const Ico = PERM_SOURCE_OPTIONS.find(o => o.id === t.source)?.Icon ?? User;
          return (
            <span key={i} className={`flex items-center gap-1 text-xs rounded-full px-2 py-0.5 ${SOURCE_TAG_COLORS[t.source]}`}>
              <Ico className="w-3 h-3 opacity-70" />
              {t.label}
              <button type="button" onClick={() => remove(i)} className="opacity-60 hover:opacity-100"><X className="w-3 h-3" /></button>
            </span>
          );
        })}
        <input value={input} onChange={e => { setInput(e.target.value); setShowSug(true); }}
          onFocus={() => setShowSug(true)}
          onKeyDown={e => { if (e.key === 'Enter' && input.trim()) { add(input.trim()); e.preventDefault(); } }}
          placeholder={tags.length === 0 ? 'חיפוש...' : ''}
          className="flex-1 min-w-[60px] text-sm text-right focus:outline-none bg-transparent" dir="rtl" />
      </div>
      {showSug && suggestions.length > 0 && (
        <div className="absolute top-full mt-1 right-0 left-0 bg-white border border-gray-100 rounded-xl shadow-lg z-20 py-1 max-h-36 overflow-y-auto" style={{ marginTop: 2 }}>
          {suggestions.map(u => {
            const Ico = PERM_SOURCE_OPTIONS.find(o => o.id === source)?.Icon ?? User;
            return (
              <button key={u} type="button" onMouseDown={() => add(u)}
                className="w-full text-right px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 justify-end">
                {u}
                <Ico className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PermissionsPanel({ approvers, editors, onChangeApprovers, onChangeEditors, indent = false }: {
  approvers: PermTag[]; editors: PermTag[];
  onChangeApprovers: (v: PermTag[]) => void; onChangeEditors: (v: PermTag[]) => void;
  indent?: boolean;
}) {
  return (
    <div className={`border border-gray-200 border-t-0 rounded-b-xl bg-blue-50/40 px-4 py-3 flex flex-col gap-3 ${indent ? '' : ''}`}>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
            <UserCheck className="w-3.5 h-3.5 text-[#1B3A6B]" />
            מאשרי הסעיף
          </label>
          <PermUserInput tags={approvers} onChange={onChangeApprovers} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
            <Users className="w-3.5 h-3.5 text-[#1B3A6B]" />
            עורכי הסעיף
          </label>
          <PermUserInput tags={editors} onChange={onChangeEditors} />
        </div>
      </div>
    </div>
  );
}

export function PersonalArea() {
  const [activeCard, setActiveCard] = useState<'templates' | 'signatures' | 'lists'>('templates');
  const [activeSubTab, setActiveSubTab] = useState<'my-templates' | 'deleted'>('my-templates');
  const [activeSignatureTab, setActiveSignatureTab] = useState<'approver' | 'distribution' | 'personal'>('approver');
  const [activeListTab, setActiveListTab] = useState<'my-lists' | 'deleted'>('my-lists');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showDuplicatePanel, setShowDuplicatePanel] = useState<{type: string, name: string} | null>(null);
  const [hoveredSignature, setHoveredSignature] = useState<string | null>(null);
  const [showNewTemplate, setShowNewTemplate] = useState(false);
  const [templateMode, setTemplateMode] = useState<'new' | 'automatic'>('new');
  type TemplatePermissions = { approvers: PermTag[]; editors: PermTag[] };
  type TemplateSubRow = { id: string; content: string; permissions?: TemplatePermissions };
  type TemplateRow = { id: string; type: 'section' | 'topic' | 'attachment' | 'emphasis'; content: string; subsections?: TemplateSubRow[]; permissions?: TemplatePermissions };
  const [templateRows, setTemplateRows] = useState<TemplateRow[]>([]);
  const [expandedPermissions, setExpandedPermissions] = useState<Set<string>>(new Set());
  const togglePerm = (id: string) => setExpandedPermissions(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const [templateApprovalDefault, setTemplateApprovalDefault] = useState<'allow' | 'skip'>('allow');
  const [showApprovalTooltip, setShowApprovalTooltip] = useState(false);
  const [showSpellCheckModal, setShowSpellCheckModal] = useState(false);
  const [showEnvRequestModal, setShowEnvRequestModal] = useState(false);
  const [envForm, setEnvForm] = useState({
    bodyType: '',
    name: '',
    creators: [] as string[],
    approvers: { 'סא״ל': [], 'אל״ם': [], 'תא״ל': [], 'אלוף': [], 'רא״ל': [] } as Record<string, string[]>,
    distributors: [] as string[],
    redPhone: '',
    mobilePhone: '',
    templates: [] as string[],
    departments: [] as string[],
  });
  const [showNewSignature, setShowNewSignature] = useState(false);
  const [signatureType, setSignatureType] = useState<'approver' | 'distribution' | 'personal' | null>(null);
  const [showNewList, setShowNewList] = useState(false);
  const [listFilterDropdown, setListFilterDropdown] = useState(false);
  const [listMembers, setListMembers] = useState<Array<{id: string, name: string, idNumber: string, environment: string}>>([]);
  const [pinnedTemplates, setPinnedTemplates] = useState<Set<string>>(new Set());
  const [activeFilters, setActiveFilters] = useState<Array<string>>([]);
  const [selectedTemplateType, setSelectedTemplateType] = useState<'command' | 'instruction' | 'document' | null>(null);
  const [showNetworkSubMenu, setShowNetworkSubMenu] = useState(false);
  const [listImportPanel, setListImportPanel] = useState<'doc' | 'hamal' | 'miraz' | 'personal' | 'network' | null>(null);
  const [listDocTab, setListDocTab] = useState<'drafts' | 'distributed'>('drafts');
  const [listDocSelected, setListDocSelected] = useState<Set<string>>(new Set());
  const [listDocExpanded, setListDocExpanded] = useState<string | null>(null);
  const [listAddDropdown, setListAddDropdown] = useState(false);
  const [listSearchQuery, setListSearchQuery] = useState('');
  const [listSearchOpen, setListSearchOpen] = useState(false);
  const [templateFilterOpen, setTemplateFilterOpen] = useState(false);
  const [templateDeptFilter, setTemplateDeptFilter] = useState('');
  const [listDeptFilterOpen, setListDeptFilterOpen] = useState(false);
  const [listDeptFilter, setListDeptFilter] = useState('');
  const [commandImportValue, setCommandImportValue] = useState<string | null>(null);
  const [timesImportValue, setTimesImportValue] = useState<string | null>(null);

  const togglePin = (id: string) => {
    const newPinned = new Set(pinnedTemplates);
    if (newPinned.has(id)) {
      newPinned.delete(id);
    } else {
      newPinned.add(id);
    }
    setPinnedTemplates(newPinned);
  };

  const templates = [
    { id: 'template-1', name: 'תבנית פקודה כללית' },
    { id: 'template-2', name: 'תבנית דוח שבועי' },
    { id: 'template-3', name: 'תבנית הודעה' },
    { id: 'template-4', name: 'תבנית דוח חודשי' },
  ];

  const signatureData = {
    approver: [
      { id: 'signature-1', name: 'חתימת מאשר ראשי' },
      { id: 'signature-2', name: 'חתימת מאשר משנה' },
    ],
    distribution: [{ id: 'signature-3', name: 'חתימה להפצה כללית' }],
    personal: [{ id: 'signature-4', name: 'חתימה אישית' }],
  };

  const signaturePreview = { name: 'ישראל ישראלי', role: 'מנהל מחלקה', phone: '050-1234567', email: 'israel@org.co.il' };

  return (
    <div className="flex-1 overflow-auto px-8 py-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-6">
          {/* User Profile */}
          <div className="w-80 flex-shrink-0 space-y-4 relative">
            <div className="absolute left-0 top-4 bottom-4 w-px bg-[#E5E5E5]"></div>
            <div className="px-6">
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 rounded-full bg-[#1B3A6B] flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
              </div>
              <div className="text-center mb-6">
                <h3 className="font-bold text-lg text-gray-900 mb-2">שם המשתמש</h3>
                <p className="text-sm text-gray-600 mb-1">ת.ז: 123456789</p>
                <p className="text-sm text-gray-600">ארגון א'</p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-xs font-medium text-gray-500 mb-3 text-right">הרשאות</h4>
                <div className="max-h-24 overflow-y-auto space-y-2 pr-1">
                  {[
                    { Icon: Eye, label: 'נצפה פקודה' },
                    { Icon: Send, label: 'מפיץ פקודות' },
                    { Icon: CheckCircle, label: 'מאשר פקודות' },
                    { Icon: Share2, label: 'משתף פקודות' },
                    { Icon: Search, label: 'מתחקר' },
                  ].map(({ Icon, label }) => (
                    <div key={label} className="flex items-center gap-2 text-right">
                      <Icon className="w-4 h-4 text-[#1B3A6B] flex-shrink-0" />
                      <span className="text-sm text-gray-700">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <h4 className="text-xs font-medium text-gray-500 mb-3 text-right">אגפים</h4>
                <div className="relative">
                  <div className="max-h-32 overflow-y-auto space-y-2 pr-1">
                    {['מחלקת משאבי אנוש', 'מחלקת כספים', 'מחלקת טכנולוגיה', 'מחלקת תפעול', 'מחלקת שיווק', 'מחלקת מכירות'].map(dept => (
                      <div key={dept} className="flex items-center gap-2 text-right">
                        <Folder className="w-4 h-4 text-[#1B3A6B] flex-shrink-0" />
                        <span className="text-sm text-gray-700">{dept}</span>
                      </div>
                    ))}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white/20 to-transparent pointer-events-none"></div>
                </div>
              </div>

              {/* Request environment card */}
              <div className="border-t border-gray-200 pt-4 mt-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <Network className="w-4 h-4 text-[#1B3A6B]" />
                </div>
                <div className="flex-1 text-right min-w-0">
                  <p className="text-xs font-semibold text-gray-900">רוצה סביבה משלך?</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">ליצור ולערוך פקודות באופן עצמאי</p>
                </div>
                <button onClick={() => setShowEnvRequestModal(true)} className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap" style={{ background: '#1B3A6B', color: '#fff' }}>
                  שלח בקשה
                </button>
              </div>
            </div>
          </div>

          {/* Main section */}
          <div className="flex-1">
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { key: 'templates', Icon: FileText, label: 'תבניות' },
                { key: 'signatures', Icon: PenLine, label: 'חתימות' },
                { key: 'lists', Icon: List, label: 'רשימות תפוצה' },
              ].map(({ key, Icon, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveCard(key as 'templates' | 'signatures' | 'lists')}
                  className={`rounded-2xl p-4 transition-all cursor-pointer h-24 flex flex-col items-center justify-center gap-2 border ${
                    activeCard === key ? 'bg-white shadow-lg border-[#E0E0E0]' : 'bg-transparent border-[#E0E0E0]'
                  }`}
                >
                  <Icon className="w-8 h-8 text-gray-600" strokeWidth={1.5} />
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                </button>
              ))}
            </div>

            {/* Templates */}
            {activeCard === 'templates' && (
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <button
                    onClick={() => setShowNewTemplate(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1B3A6B] text-white rounded-xl text-sm hover:bg-[#152e54] transition-colors flex-shrink-0"
                  >
                    <span>+</span><span>תבנית חדשה</span>
                  </button>
                  <div className="relative flex-1">
                    <input type="text" placeholder="חיפוש..." className="w-full pr-10 pl-10 py-2 bg-white/70 backdrop-blur-md rounded-xl text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/50 text-right" />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setTemplateFilterOpen(p => !p)}
                      className={`absolute left-3 top-1/2 -translate-y-1/2 p-0.5 rounded transition-colors ${templateDeptFilter ? 'text-[#1B3A6B]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <Filter className="w-4 h-4" />
                    </button>
                    {templateFilterOpen && (
                      <div className="absolute top-full mt-1 left-0 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-[99999]" style={{ minWidth: 200 }}>
                        <p className="px-4 py-1.5 text-xs font-medium text-gray-400">סינון לפי אגף</p>
                        {['מחלקת משאבי אנוש', 'מחלקת כספים', 'מחלקת טכנולוגיה', 'מחלקת תפעול', 'מחלקת שיווק'].map(dept => (
                          <button
                            key={dept}
                            type="button"
                            onClick={() => { setTemplateDeptFilter(templateDeptFilter === dept ? '' : dept); setTemplateFilterOpen(false); }}
                            className={`w-full flex items-center justify-between px-4 py-2 text-sm text-right transition-colors hover:bg-gray-50 ${templateDeptFilter === dept ? 'text-[#1B3A6B] font-medium' : 'text-gray-700'}`}
                          >
                            <span className="text-right flex-1">{dept}</span>
                            {templateDeptFilter === dept && <Check className="w-3.5 h-3.5 text-[#1B3A6B] flex-shrink-0 mr-2" />}
                          </button>
                        ))}
                        {templateDeptFilter && (
                          <button
                            type="button"
                            onClick={() => { setTemplateDeptFilter(''); setTemplateFilterOpen(false); }}
                            className="w-full px-4 py-2 text-xs text-red-500 text-right hover:bg-red-50 transition-colors border-t border-gray-100 mt-1"
                          >
                            נקה סינון
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {/* Active department filter chip */}
                {templateDeptFilter && (
                  <div className="flex items-center gap-2 mb-3" dir="rtl">
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-[#EFF6FF] text-[#1B3A6B] text-xs font-medium rounded-full border border-[#BFDBFE]">
                      {templateDeptFilter}
                      <button
                        type="button"
                        onClick={() => setTemplateDeptFilter('')}
                        className="hover:text-blue-900 transition-colors ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  </div>
                )}
                <div className="flex gap-4 mb-4">
                  {[{ key: 'my-templates', label: 'התבניות שלי' }, { key: 'deleted', label: 'תבניות שנמחקו' }].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setActiveSubTab(key as 'my-templates' | 'deleted')}
                      className={`text-sm transition-colors pb-2 ${activeSubTab === key ? 'text-gray-900 font-medium border-b-2 border-[#1B3A6B]' : 'text-gray-500'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="bg-white/70 backdrop-blur-md p-6 shadow-lg">
                  {activeSubTab === 'my-templates' && (
                    <div className="max-h-96 overflow-y-auto space-y-0">
                      {templates.map((t, i) => (
                        <div key={t.id}>
                          <div className="py-4 hover:bg-gray-50/50 px-4 transition-colors cursor-pointer flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <button onClick={(e) => { e.stopPropagation(); togglePin(t.id); }} className="p-1 hover:bg-gray-200 rounded transition-colors">
                                <Pin className={`w-4 h-4 ${pinnedTemplates.has(t.id) ? 'text-[#1B3A6B] fill-[#1B3A6B]' : 'text-gray-400'}`} />
                              </button>
                              <span className="text-sm text-gray-900">{t.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button onClick={(e) => { e.stopPropagation(); setShowNewTemplate(true); }} className="p-1 hover:bg-gray-200 rounded transition-colors">
                                <Copy className="w-4 h-4 text-gray-400" />
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(t.id); }} className="p-1 hover:bg-gray-200 rounded transition-colors">
                                <Trash2 className="w-4 h-4 text-gray-400" />
                              </button>
                            </div>
                          </div>
                          {i < templates.length - 1 && <div className="border-t border-gray-200/50"></div>}
                        </div>
                      ))}
                    </div>
                  )}
                  {activeSubTab === 'deleted' && (
                    <div className="py-4 hover:bg-gray-50/50 px-4 transition-colors cursor-pointer flex items-center justify-between">
                      <span className="text-sm text-gray-900">תבנית ישנה שנמחקה</span>
                      <button onClick={(e) => { e.stopPropagation(); setShowNewTemplate(true); }} className="p-1 hover:bg-gray-200 rounded transition-colors">
                        <Copy className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Signatures */}
            {activeCard === 'signatures' && (
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <button
                    onClick={() => setShowNewSignature(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1B3A6B] text-white rounded-xl text-sm hover:bg-[#152e54] transition-colors flex-shrink-0"
                  >
                    <span>+</span><span>חתימה חדשה</span>
                  </button>
                  <div className="relative flex-1">
                    <input type="text" placeholder="חיפוש..." className="w-full pr-10 pl-4 py-2 bg-white/70 backdrop-blur-md rounded-xl text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/50 text-right" />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="flex gap-4 mb-4">
                  {([{ key: 'distribution', label: 'חתימה להפצה', soon: false }, { key: 'personal', label: 'חתימה אישית במסמך', soon: false }, { key: 'approver', label: 'חתימת מאשר', soon: true }] as const).map(({ key, label, soon }) => (
                    <div key={key} className="relative group">
                      <button
                        onClick={() => !soon && setActiveSignatureTab(key)}
                        className={`text-sm transition-colors pb-2 ${soon ? 'text-gray-400 cursor-default' : activeSignatureTab === key ? 'text-gray-900 font-medium border-b-2 border-[#1B3A6B]' : 'text-gray-500'}`}
                      >
                        {label}
                      </button>
                      {soon && (
                        <div className="absolute bottom-full mb-2 right-1/2 translate-x-1/2 bg-gray-800 text-white text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[99999]">
                          Coming Soon
                          <div className="absolute top-full right-1/2 translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="bg-white/70 backdrop-blur-md p-6 shadow-lg relative overflow-visible">
                  <div className="max-h-96 overflow-y-auto space-y-0">
                    {signatureData[activeSignatureTab].map((sig, i) => (
                      <div key={sig.id}>
                        <div className="py-4 hover:bg-gray-50/50 px-4 transition-colors cursor-pointer flex items-center justify-between">
                          <span className="text-sm text-gray-900">{sig.name}</span>
                          <div className="flex items-center gap-2 relative">
                            <button onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(sig.id); }} className="p-1 hover:bg-gray-200 rounded transition-colors">
                              <Trash2 className="w-4 h-4 text-gray-400" />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); setShowNewSignature(true); }} className="p-1 hover:bg-gray-200 rounded transition-colors">
                              <Copy className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        </div>
                        {i < signatureData[activeSignatureTab].length - 1 && <div className="border-t border-gray-200/50"></div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Distribution Lists */}
            {activeCard === 'lists' && (
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <button
                    onClick={() => setShowNewList(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1B3A6B] text-white rounded-xl text-sm hover:bg-[#152e54] transition-colors flex-shrink-0"
                  >
                    <span>+</span><span>רשימה חדשה</span>
                  </button>
                  <div className="relative flex-1">
                    <input type="text" placeholder="חיפוש..." className="w-full pr-10 pl-10 py-2 bg-white/70 backdrop-blur-md rounded-xl text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/50 text-right" />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setListDeptFilterOpen(p => !p)}
                      className={`absolute left-3 top-1/2 -translate-y-1/2 p-0.5 rounded transition-colors ${listDeptFilter ? 'text-[#1B3A6B]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <Filter className="w-4 h-4" />
                    </button>
                    {listDeptFilterOpen && (
                      <div className="absolute top-full mt-1 left-0 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-[99999]" style={{ minWidth: 200 }}>
                        <p className="px-4 py-1.5 text-xs font-medium text-gray-400">סינון לפי אגף</p>
                        {['מחלקת משאבי אנוש', 'מחלקת כספים', 'מחלקת טכנולוגיה', 'מחלקת תפעול', 'מחלקת שיווק'].map(dept => (
                          <button
                            key={dept}
                            type="button"
                            onClick={() => { setListDeptFilter(listDeptFilter === dept ? '' : dept); setListDeptFilterOpen(false); }}
                            className={`w-full flex items-center justify-between px-4 py-2 text-sm text-right transition-colors hover:bg-gray-50 ${listDeptFilter === dept ? 'text-[#1B3A6B] font-medium' : 'text-gray-700'}`}
                          >
                            <span className="text-right flex-1">{dept}</span>
                            {listDeptFilter === dept && <Check className="w-3.5 h-3.5 text-[#1B3A6B] flex-shrink-0 mr-2" />}
                          </button>
                        ))}
                        {listDeptFilter && (
                          <button
                            type="button"
                            onClick={() => { setListDeptFilter(''); setListDeptFilterOpen(false); }}
                            className="w-full px-4 py-2 text-xs text-red-500 text-right hover:bg-red-50 transition-colors border-t border-gray-100 mt-1"
                          >
                            נקה סינון
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {/* Active department filter chip */}
                {listDeptFilter && (
                  <div className="flex items-center gap-2 mb-3" dir="rtl">
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-[#EFF6FF] text-[#1B3A6B] text-xs font-medium rounded-full border border-[#BFDBFE]">
                      {listDeptFilter}
                      <button
                        type="button"
                        onClick={() => setListDeptFilter('')}
                        className="hover:text-blue-900 transition-colors ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  </div>
                )}
                <div className="flex gap-4 mb-4">
                  {[{ key: 'my-lists', label: 'הרשימות שלי' }, { key: 'deleted', label: 'רשימות שנמחקו' }].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setActiveListTab(key as 'my-lists' | 'deleted')}
                      className={`text-sm transition-colors pb-2 ${activeListTab === key ? 'text-gray-900 font-medium border-b-2 border-[#1B3A6B]' : 'text-gray-500'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="bg-white/70 backdrop-blur-md p-6 shadow-lg">
                  {activeListTab === 'my-lists' && (
                    <div className="max-h-96 overflow-y-auto space-y-0">
                      {['רשימת מפקדים', 'רשימת צוות א\'', 'רשימת כלל המשתמשים'].map((list, i) => (
                        <div key={list}>
                          <div className="py-4 hover:bg-gray-50/50 px-4 transition-colors cursor-pointer flex items-center justify-between">
                            <span className="text-sm text-gray-900">{list}</span>
                            <div className="flex items-center gap-2">
                              <button onClick={(e) => { e.stopPropagation(); setShowNewList(true); }} className="p-1 hover:bg-gray-200 rounded transition-colors">
                                <Copy className="w-4 h-4 text-gray-400" />
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(`list-${i}`); }} className="p-1 hover:bg-gray-200 rounded transition-colors">
                                <Trash2 className="w-4 h-4 text-gray-400" />
                              </button>
                            </div>
                          </div>
                          {i < 2 && <div className="border-t border-gray-200/50"></div>}
                        </div>
                      ))}
                    </div>
                  )}
                  {activeListTab === 'deleted' && (
                    <div className="py-4 hover:bg-gray-50/50 px-4 transition-colors cursor-pointer flex items-center justify-between">
                      <span className="text-sm text-gray-900">רשימה ישנה שנמחקה</span>
                      <button onClick={(e) => { e.stopPropagation(); setShowNewList(true); }} className="p-1 hover:bg-gray-200 rounded transition-colors">
                        <Copy className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Spell checker card */}
            <div className="mt-4 rounded-2xl px-4 py-3.5 flex items-center gap-3" style={{
              background: '#fff', border: '1px solid #e5e7eb', boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
            }}>
              <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-[#1B3A6B]" />
              </div>
              <div className="flex-1 text-right">
                <p className="text-xs font-semibold text-gray-900">התקנת בדיקת איות</p>
                <p className="text-[11px] text-gray-400 mt-0.5">שפר את איכות הכתיבה עם בדיקת איות חכמה</p>
              </div>
              <button onClick={() => setShowSpellCheckModal(true)} className="flex-shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-medium text-white transition-all hover:opacity-90" style={{ background: '#1B3A6B' }}>
                התקן
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Spell Check Install Modal */}
      {showSpellCheckModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[9998]" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowSpellCheckModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-[540px] max-w-[90vw] max-h-[90vh] overflow-y-auto p-8" onClick={e => e.stopPropagation()} dir="rtl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
                  <Check className="w-4 h-4 text-[#1B3A6B]" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">התקנת בדיקת איות</h2>
              </div>
              <button onClick={() => setShowSpellCheckModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <ol className="space-y-5" dir="rtl">
              {[
                { step: 1, text: 'יש לפתוח את קובץ ההתקנה שירד אליכם' },
                { step: 2, text: 'יש להכנס לתפריט של הכרום הנמצא למעלה ונראה כך:', hasIcon: true },
                { step: 3, text: 'בתפריט יש לבחור ב־settings' },
                { step: 4, text: 'יש ללחוץ בתפריט בצד שמאל Languages (במידה ולא נראה לעין, תרשמו בחיפוש)' },
                { step: 5, text: 'במידה ויש עברית (Hebrew) ברשימה, יש למחוק ע״י לחיצה על התפריט ולאחר מכן Remove' },
                { step: 6, text: 'יש ללחוץ על הכפתור add languages ואז להוסיף Hebrew' },
                { step: 7, text: 'יש להפעיל את הכפתור ליד על מנת להפעיל בדיקת איות:', hasToggle: true },
              ].map(({ step, text, hasIcon, hasToggle }) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1B3A6B] text-white text-xs font-bold flex items-center justify-center mt-0.5">
                    {step}
                  </span>
                  <div className="flex-1 text-sm text-gray-700 leading-relaxed">
                    {text}
                    {hasIcon && (
                      <span className="inline-flex items-center gap-0.5 mx-1.5 px-2 py-0.5 bg-gray-100 rounded-md align-middle border border-gray-200">
                        <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                        <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                        <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                      </span>
                    )}
                    {hasToggle && (
                      <div className="w-9 h-5 rounded-full flex items-center px-0.5 inline-flex flex-shrink-0 align-middle mx-2" style={{ background: '#1B3A6B' }}>
                        <div className="w-4 h-4 rounded-full bg-white shadow-sm ml-auto" />
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {/* Environment Request Modal */}
      {showEnvRequestModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[9998]" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowEnvRequestModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-[620px] max-w-[90vw] max-h-[90vh] overflow-y-auto p-8" onClick={e => e.stopPropagation()} dir="rtl">

            {/* Header */}
            <div className="flex items-center justify-between mb-7">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
                  <Network className="w-4 h-4 text-[#1B3A6B]" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">בקשת פתיחת סביבה</h2>
              </div>
              <button onClick={() => setShowEnvRequestModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              {/* סוג הגוף */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 text-right">סוג הגוף</label>
                <CustomSelect
                  placeholder="בחר סוג גוף..."
                  options={['ארגון', 'אגף', 'מחלקה']}
                  value={envForm.bodyType}
                  onChange={v => setEnvForm(f => ({ ...f, bodyType: v }))}
                />
              </div>

              {/* שם הגוף */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 text-right">שם הגוף</label>
                <input type="text" value={envForm.name} onChange={e => setEnvForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="הזן שם הגוף..." dir="rtl"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/50 bg-white hover:border-gray-400 transition-colors" />
              </div>

              {/* יוצרי המסמכים */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 text-right">
                  יוצרי המסמכים
                  <span className="text-xs font-normal text-gray-400 mr-1">(עד 3)</span>
                </label>
                <div className="flex flex-col gap-2">
                  {[0, 1, 2].map(i => (
                    <SearchableSelect key={i}
                      value={envForm.creators[i] ?? ''}
                      onChange={v => setEnvForm(f => { const c = [...f.creators]; c[i] = v; return { ...f, creators: c }; })}
                      placeholder={`שם יוצר ${i + 1}...`} />
                  ))}
                </div>
              </div>

              {/* מאשרי המסמכים */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 text-right">מאשרי המסמכים לפי סוג אישור</label>
                <div className="rounded-xl border border-gray-300 overflow-hidden divide-y divide-gray-100">
                  {(['סא״ל', 'אל״ם', 'תא״ל', 'אלוף', 'רא״ל'] as const).map(rank => (
                    <div key={rank} className="flex items-center gap-3 px-3 py-2 bg-white">
                      <span className="text-sm font-bold text-[#1B3A6B] flex-shrink-0 w-10 text-right border-l border-gray-100 pl-3">{rank}</span>
                      <div className="flex-1">
                        <SearchableMultiSelect
                          selected={envForm.approvers[rank]}
                          onChange={v => setEnvForm(f => ({ ...f, approvers: { ...f.approvers, [rank]: v } }))}
                          placeholder="בחר מאשרים..." noBorder />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* מפיצי המסמך */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 text-right">מפיצי המסמך</label>
                <SearchableMultiSelect
                  selected={envForm.distributors}
                  onChange={v => setEnvForm(f => ({ ...f, distributors: v }))}
                  placeholder="בחר מפיצים..." />
              </div>

              {/* טלפונים */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 text-right">טלפון נייד ליצירת קשר</label>
                  <input type="tel" value={envForm.mobilePhone} onChange={e => setEnvForm(f => ({ ...f, mobilePhone: e.target.value }))}
                    placeholder="05X-XXXXXXX" dir="ltr"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm text-left focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/50 bg-white hover:border-gray-400 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 text-right">טלפון אדום ליצירת קשר</label>
                  <input type="tel" value={envForm.redPhone} onChange={e => setEnvForm(f => ({ ...f, redPhone: e.target.value }))}
                    placeholder="XXXX" dir="ltr"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm text-left focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/50 bg-white hover:border-gray-400 transition-colors" />
                </div>
              </div>

              {/* תבניות ומחלקות */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 text-right">בחירת תבניות</label>
                  <MultiSelectDropdown
                    options={['תבנית פקודה כללית', 'תבנית דוח שבועי', 'תבנית הודעה', 'תבנית דוח חודשי']}
                    selected={envForm.templates}
                    onChange={v => setEnvForm(f => ({ ...f, templates: v }))}
                    placeholder="בחר תבניות..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 text-right">בחירת מחלקות</label>
                  <MultiSelectDropdown
                    options={['מחלקת משאבי אנוש', 'מחלקת כספים', 'מחלקת טכנולוגיה', 'מחלקת תפעול', 'מחלקת שיווק', 'מחלקת מכירות']}
                    selected={envForm.departments}
                    onChange={v => setEnvForm(f => ({ ...f, departments: v }))}
                    placeholder="בחר מחלקות..." />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end mt-8">
              <button onClick={() => setShowEnvRequestModal(false)}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
                ביטול
              </button>
              <button onClick={() => setShowEnvRequestModal(false)}
                className="px-6 py-2.5 bg-[#1B3A6B] text-white rounded-xl text-sm font-medium hover:bg-[#152e54] transition-colors">
                שלח בקשה
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Template Modal */}
      {showNewTemplate && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[9998]"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => { setShowNewTemplate(false); setTemplateRows([]); setSelectedTemplateType(null); setTemplateMode('new'); }}
        >
          <div className="bg-white rounded-3xl shadow-2xl w-[800px] max-w-[90vw] max-h-[90vh] overflow-y-auto overflow-x-hidden p-8" onClick={(e) => e.stopPropagation()} dir="rtl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">תבנית חדשה</h2>
              <button onClick={() => { setShowNewTemplate(false); setTemplateRows([]); setTemplateMode('new'); setSelectedTemplateType(null); }} className="text-gray-600 hover:text-gray-900 text-2xl">✕</button>
            </div>

            <div className="flex gap-4 mb-6 border-b border-gray-200">
              {([{ key: 'new', label: 'תבנית חדשה', soon: false }, { key: 'automatic', label: 'תבנית פקודה אוטומטית', soon: true }] as const).map(({ key, label, soon }) => (
                <div key={key} className="relative group">
                  <button
                    onClick={() => setTemplateMode(key)}
                    className={`pb-3 px-2 text-sm transition-colors ${templateMode === key ? 'text-gray-900 font-medium border-b-2 border-[#1B3A6B]' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    {label}
                  </button>
                  {soon && (
                    <div className="absolute bottom-full mb-2 right-1/2 translate-x-1/2 bg-gray-800 text-white text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[99999]">
                      Coming Soon
                      <div className="absolute top-full right-1/2 translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm text-gray-700 mb-2 text-right">שם התבנית</label>
                <input type="text" placeholder="הזן שם תבנית..." className="w-full px-4 py-2 border border-gray-300 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/50" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2 text-right">בחירת אגף</label>
                <CustomSelect
                  placeholder="בחר אגף..."
                  options={['מחלקת משאבי אנוש', 'מחלקת כספים', 'מחלקת טכנולוגיה', 'מחלקת תפעול', 'מחלקת שיווק', 'מחלקת מכירות']}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2 text-right">חיבור לתיקייה</label>
                <CustomSelect
                  placeholder="בחר תיקייה..."
                  options={['תיקיית פקודות', 'תיקיית דוחות', 'תיקיית הוראות', 'תיקייה כללית']}
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-2 justify-start">
                  <label className="text-sm text-gray-700">ברירת מחדל</label>
                  <div className="relative"
                    onMouseEnter={() => setShowApprovalTooltip(true)}
                    onMouseLeave={() => setShowApprovalTooltip(false)}>
                    <AlertCircle className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                    {showApprovalTooltip && (
                      <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 text-gray-700 text-xs rounded-xl px-3 py-2 z-50 shadow-lg" style={{ whiteSpace: 'nowrap' }}>
                        ניתן יהיה לשנות את ברירת המחדל בעת פתיחת מסמך חדש
                        <div className="absolute top-full right-2 w-0 h-0" style={{ borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid #e5e7eb' }} />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex rounded-xl overflow-hidden border border-gray-200">
                  {(['allow', 'skip'] as const).map((opt, i) => (
                    <button key={opt} type="button" onClick={() => setTemplateApprovalDefault(opt)}
                      style={{
                        flex: 1, padding: '9px 12px', fontSize: 13, transition: 'background 0.15s',
                        background: templateApprovalDefault === opt ? '#1B3A6B' : '#fff',
                        color: templateApprovalDefault === opt ? '#fff' : '#6b7280',
                        borderRight: i === 0 ? '1px solid #e5e7eb' : undefined,
                      }}>
                      {opt === 'allow' ? 'אפשר סבב אישורים לסעיפי מסמך' : 'ביטול סבב אישורים לסעיפי המסמך'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm text-gray-700 mb-4 text-right">בחירת סוג מסמך</label>
              <div className="grid grid-cols-3 gap-3">
                {([{ key: 'command', label: 'פקודה', soon: false }, { key: 'instruction', label: 'הוראה', soon: true }, { key: 'document', label: 'מסמך', soon: true }] as const).map(({ key, label, soon }) => (
                  <button
                    key={key}
                    onClick={() => !soon && setSelectedTemplateType(key)}
                    disabled={soon}
                    className={`relative rounded-xl transition-all overflow-hidden ${soon ? 'opacity-60 cursor-default' : ''} ${selectedTemplateType === key ? 'border-2 border-[#1B3A6B]' : 'border border-[#DEDEDE]'}`}
                  >
                    {soon && (
                      <div className="absolute top-2 left-2 bg-amber-100 text-amber-700 text-[10px] font-semibold px-2 py-0.5 rounded-full z-10">Coming Soon</div>
                    )}
                    <div className={`p-4 pb-0 ${selectedTemplateType === key ? 'bg-[#E8F4F8]' : 'bg-[#EEF2F7]'}`}>
                      {selectedTemplateType === key && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-[#1B3A6B] rounded-full flex items-center justify-center z-10">
                          <Check className="w-3 h-3 text-white" strokeWidth={2.5} />
                        </div>
                      )}
                      <div className="bg-white rounded-t-lg p-3 pb-6 h-28 flex flex-col justify-start pt-4">
                        <div className="space-y-2">
                          <div className="h-2 bg-[#EEF2F7] rounded w-full"></div>
                          <div className="flex gap-1.5">
                            <div className="h-10 bg-[#EEF2F7] rounded flex-1"></div>
                            <div className="h-10 bg-[#EEF2F7] rounded flex-1"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white px-3 py-2">
                      <span className="text-xs font-medium text-gray-900">{label}</span>
                    </div>
                  </button>
                ))}
              </div>

              {templateMode === 'automatic' && (
                <>
                  <div className="mt-4">
                    <label className="block text-sm text-gray-700 mb-2 text-right">שם הפקודה</label>
                    <div className="flex items-center gap-2 px-3 py-1.5 pl-2 border border-gray-300 rounded-xl focus-within:ring-2 focus-within:ring-[#1B3A6B]/50 bg-white min-h-[40px]">
                      {commandImportValue ? (
                        <span className="flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-full px-2.5 py-1 flex-shrink-0">
                          {commandImportValue}
                          <button type="button" onClick={() => setCommandImportValue(null)} className="hover:text-blue-600 ml-1">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ) : (
                        <input type="text" placeholder="הזן שם פקודה..." className="flex-1 text-right text-sm focus:outline-none bg-transparent min-w-0" />
                      )}
                      <div className="flex-shrink-0"><ImportDropdown onSelect={setCommandImportValue} /></div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm text-gray-700 mb-2 text-right">זמנים</label>
                    <div className="flex items-center gap-2 px-3 py-1.5 pl-2 border border-gray-300 rounded-xl focus-within:ring-2 focus-within:ring-[#1B3A6B]/50 bg-white min-h-[40px]">
                      {timesImportValue ? (
                        <span className="flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-full px-2.5 py-1 flex-shrink-0">
                          {timesImportValue}
                          <button type="button" onClick={() => setTimesImportValue(null)} className="hover:text-blue-600 ml-1">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ) : (
                        <input type="text" placeholder="הזן זמנים..." className="flex-1 text-right text-sm focus:outline-none bg-transparent min-w-0" />
                      )}
                      <div className="flex-shrink-0"><ImportDropdown onSelect={setTimesImportValue} /></div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-right">בניית התבנית</h3>
              <div className="space-y-2 mb-4">
                {templateRows.map((row, index) => {
                  const permOpen = expandedPermissions.has(row.id);
                  const updateRowPerm = (field: 'approvers' | 'editors', val: string[]) => {
                    const n = [...templateRows]; n[index].permissions = { ...n[index].permissions, approvers: n[index].permissions?.approvers ?? [], editors: n[index].permissions?.editors ?? [], [field]: val }; setTemplateRows(n);
                  };
                  return (
                  <div key={row.id}>
                    <div className={`flex items-center gap-3 py-3 px-4 bg-white border border-gray-200 ${permOpen ? 'rounded-t-xl border-b-0' : 'rounded-xl'}`}>
                      <GripVertical className="w-4 h-4 text-gray-400 cursor-move flex-shrink-0" />
                      <div className="flex-1 relative">
                        <input type="text" value={row.content}
                          onChange={(e) => { const n = [...templateRows]; n[index].content = e.target.value; setTemplateRows(n); }}
                          placeholder={row.type === 'section' ? 'שם הסעיף...' : row.type === 'topic' ? 'שם הנושא...' : row.type === 'attachment' ? 'שם הנספח...' : 'דגשים לכתיבה...'}
                          className={`w-full text-right focus:outline-none ${templateMode === 'automatic' && row.type !== 'emphasis' ? 'pl-8' : ''}`} />
                        {templateMode === 'automatic' && row.type !== 'emphasis' && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2"><ImportDropdown /></div>
                        )}
                      </div>
                      {row.type !== 'emphasis' && (
                        <button onClick={() => togglePerm(row.id)} title="הרשאות סעיף"
                          className={`p-1 rounded transition-colors flex-shrink-0 ${permOpen ? 'bg-blue-50 text-[#1B3A6B]' : 'hover:bg-gray-100 text-gray-400'}`}>
                          <Users className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => setTemplateRows(templateRows.filter((_, i) => i !== index))} className="p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0">
                        <Trash2 className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                    {permOpen && row.type !== 'emphasis' && (
                      <PermissionsPanel
                        approvers={row.permissions?.approvers ?? []}
                        editors={row.permissions?.editors ?? []}
                        onChangeApprovers={v => updateRowPerm('approvers', v)}
                        onChangeEditors={v => updateRowPerm('editors', v)} />
                    )}
                    {row.type === 'section' && (
                      <div className="mr-8 mt-2 space-y-2">
                        {row.subsections?.map((subsection, subIndex) => {
                          const subPermOpen = expandedPermissions.has(subsection.id);
                          const updateSubPerm = (field: 'approvers' | 'editors', val: string[]) => {
                            const n = [...templateRows]; n[index].subsections![subIndex].permissions = { ...n[index].subsections![subIndex].permissions, approvers: n[index].subsections![subIndex].permissions?.approvers ?? [], editors: n[index].subsections![subIndex].permissions?.editors ?? [], [field]: val }; setTemplateRows(n);
                          };
                          return (
                          <div key={subsection.id}>
                            <div className={`flex items-center gap-3 py-2 px-4 bg-gray-50 border border-gray-200 ${subPermOpen ? 'rounded-t-xl border-b-0' : 'rounded-xl'}`}>
                              <GripVertical className="w-4 h-4 text-gray-400 cursor-move flex-shrink-0" />
                              <div className="flex-1 relative">
                                <input type="text" value={subsection.content}
                                  onChange={(e) => { const n = [...templateRows]; n[index].subsections![subIndex].content = e.target.value; setTemplateRows(n); }}
                                  placeholder="שם תת הסעיף..."
                                  className={`w-full text-right focus:outline-none bg-transparent ${templateMode === 'automatic' ? 'pl-8' : ''}`} />
                                {templateMode === 'automatic' && <div className="absolute left-0 top-1/2 -translate-y-1/2"><ImportDropdown /></div>}
                              </div>
                              <button onClick={() => togglePerm(subsection.id)} title="הרשאות תת-סעיף"
                                className={`p-1 rounded transition-colors flex-shrink-0 ${subPermOpen ? 'bg-blue-50 text-[#1B3A6B]' : 'hover:bg-gray-100 text-gray-400'}`}>
                                <Users className="w-4 h-4" />
                              </button>
                              <button onClick={() => { const n = [...templateRows]; n[index].subsections = n[index].subsections?.filter((_, i) => i !== subIndex); setTemplateRows(n); }} className="p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0">
                                <Trash2 className="w-4 h-4 text-gray-400" />
                              </button>
                            </div>
                            {subPermOpen && (
                              <PermissionsPanel
                                approvers={subsection.permissions?.approvers ?? []}
                                editors={subsection.permissions?.editors ?? []}
                                onChangeApprovers={v => updateSubPerm('approvers', v)}
                                onChangeEditors={v => updateSubPerm('editors', v)}
                                indent />
                            )}
                          </div>
                          );
                        })}
                        <button onClick={() => { const n = [...templateRows]; if (!n[index].subsections) n[index].subsections = []; n[index].subsections!.push({ id: `subsection-${Date.now()}`, content: '' }); setTemplateRows(n); }}
                          className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2">
                          <span>+</span><span>הוספת תת סעיף</span>
                        </button>
                      </div>
                    )}
                  </div>
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-3">
                {[
                  { type: 'section', label: 'הוספת סעיף' },
                  { type: 'topic', label: 'הוספת נושא' },
                  { type: 'attachment', label: 'הוספת נספח' },
                  { type: 'emphasis', label: 'הוספת דגשים לכתיבת המסמך' },
                ].map(({ type, label }) => (
                  <button
                    key={type}
                    onClick={() => setTemplateRows([...templateRows, { id: `${type}-${Date.now()}`, type: type as 'section' | 'topic' | 'attachment' | 'emphasis', content: '', subsections: type === 'section' ? [] : undefined }])}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <span>+</span><span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => { setShowNewTemplate(false); setTemplateRows([]); setSelectedTemplateType(null); setTemplateMode('new'); }}
                className="px-8 py-3 bg-[#1B3A6B] text-white rounded-xl hover:bg-[#152e54] transition-colors font-medium"
              >
                צור תבנית
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Signature Modal */}
      {showNewSignature && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[9998]"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => { setShowNewSignature(false); setSignatureType(null); }}
        >
          <div className="bg-white rounded-3xl shadow-2xl w-[700px] max-w-[95vw] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()} dir="rtl">
            {/* Header */}
            <div className="flex items-center justify-between px-8 pt-8 pb-6">
              <h2 className="text-2xl font-bold text-gray-900">חתימה חדשה</h2>
              <button onClick={() => { setShowNewSignature(false); setSignatureType(null); }} className="text-gray-600 hover:text-gray-900 text-2xl">✕</button>
            </div>

            {/* Type segmented control */}
            <div className="px-8 mb-6">
              <div className="flex rounded-xl overflow-hidden border border-gray-200">
                {([{ key: 'distribution', label: 'חתימה להפצה', soon: false }, { key: 'personal', label: 'חתימה אישית במסמך', soon: false }, { key: 'approver', label: 'חתימת מאשר', soon: true }] as const).map(({ key, label, soon }, i, arr) => (
                  <div key={key} className="relative group flex-1">
                    <button
                      type="button"
                      onClick={() => !soon && setSignatureType(key)}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        fontSize: 13,
                        fontWeight: signatureType === key ? 600 : 400,
                        background: soon ? '#f9fafb' : signatureType === key ? '#1B3A6B' : '#fff',
                        color: soon ? '#d1d5db' : signatureType === key ? '#fff' : '#6b7280',
                        borderLeft: i < arr.length - 1 ? '1px solid #e5e7eb' : undefined,
                        transition: 'all 0.15s',
                        cursor: soon ? 'default' : 'pointer',
                      }}
                    >
                      {label}
                    </button>
                    {soon && (
                      <div className="absolute bottom-full mb-2 right-1/2 translate-x-1/2 bg-gray-800 text-white text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[99999]">
                        Coming Soon
                        <div className="absolute top-full right-1/2 translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-0.5 px-3 py-1.5 flex-wrap border-t border-b border-gray-200" style={{ background: '#fafafa', direction: 'rtl' }}>
              {/* B I U S */}
              <button title="מודגש" className="flex items-center justify-center p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600" style={{ minWidth: 28, minHeight: 28 }}><Bold className="w-3.5 h-3.5" /></button>
              <button title="נטוי" className="flex items-center justify-center p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600" style={{ minWidth: 28, minHeight: 28 }}><Italic className="w-3.5 h-3.5" /></button>
              <button title="קו תחתון" className="flex items-center justify-center p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600" style={{ minWidth: 28, minHeight: 28 }}><Underline className="w-3.5 h-3.5" /></button>
              <button title="קו חוצה" className="flex items-center justify-center p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600" style={{ minWidth: 28, minHeight: 28 }}><Strikethrough className="w-3.5 h-3.5" /></button>
              <span style={{ width: 1, height: 18, background: '#d1d5db', margin: '0 4px', flexShrink: 0 }} />
              {/* Colors */}
              <button title="צבע טקסט" className="flex flex-col items-center justify-center p-1.5 rounded hover:bg-gray-200 transition-colors flex-shrink-0" style={{ minWidth: 28, minHeight: 28 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#374151', lineHeight: 1 }}>A</span>
                <span style={{ width: 16, height: 3, borderRadius: 1, background: '#dc2626', marginTop: 2 }} />
              </button>
              <button title="צבע מרקר" className="flex flex-col items-center justify-center p-1.5 rounded hover:bg-gray-200 transition-colors flex-shrink-0" style={{ minWidth: 28, minHeight: 28 }}>
                <Highlighter className="w-3.5 h-3.5 text-gray-600" />
                <span style={{ width: 16, height: 3, borderRadius: 1, background: '#fde047', marginTop: 2 }} />
              </button>
              <span style={{ width: 1, height: 18, background: '#d1d5db', margin: '0 4px', flexShrink: 0 }} />
              {/* Alignment */}
              <button title="יישור לימין" className="flex items-center justify-center p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600" style={{ minWidth: 28, minHeight: 28 }}><AlignRight className="w-3.5 h-3.5" /></button>
              <button title="מרכוז" className="flex items-center justify-center p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600" style={{ minWidth: 28, minHeight: 28 }}><AlignCenter className="w-3.5 h-3.5" /></button>
              <button title="יישור לשמאל" className="flex items-center justify-center p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600" style={{ minWidth: 28, minHeight: 28 }}><AlignLeft className="w-3.5 h-3.5" /></button>
              <button title="יישור לשני הצדדים" className="flex items-center justify-center p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600" style={{ minWidth: 28, minHeight: 28 }}><AlignJustify className="w-3.5 h-3.5" /></button>
              <span style={{ width: 1, height: 18, background: '#d1d5db', margin: '0 4px', flexShrink: 0 }} />
              {/* Indent */}
              <button title="הגדל הזחה" className="flex items-center justify-center p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600" style={{ minWidth: 28, minHeight: 28 }}><Indent className="w-3.5 h-3.5" /></button>
              <button title="הקטן הזחה" className="flex items-center justify-center p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600" style={{ minWidth: 28, minHeight: 28 }}><Outdent className="w-3.5 h-3.5" /></button>
              <span style={{ width: 1, height: 18, background: '#d1d5db', margin: '0 4px', flexShrink: 0 }} />
              {/* Direction */}
              <button title="RTL" className="flex items-center justify-center p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600" style={{ minWidth: 28, minHeight: 28 }}><PilcrowRight className="w-3.5 h-3.5" /></button>
              <button title="LTR" className="flex items-center justify-center p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600" style={{ minWidth: 28, minHeight: 28 }}><PilcrowLeft className="w-3.5 h-3.5" /></button>
              <span style={{ width: 1, height: 18, background: '#d1d5db', margin: '0 4px', flexShrink: 0 }} />
              {/* Extras */}
              <button title="הפניה" className="flex items-center justify-center p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600" style={{ minWidth: 28, minHeight: 28 }}><Superscript className="w-3.5 h-3.5" /></button>
              <button title="קובץ מצורף" className="flex items-center justify-center p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600" style={{ minWidth: 28, minHeight: 28 }}><Paperclip className="w-3.5 h-3.5" /></button>
              <button title="טבלה" className="flex items-center justify-center p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600" style={{ minWidth: 28, minHeight: 28 }}><Table2 className="w-3.5 h-3.5" /></button>
              <button title="מילוי רקע" className="flex items-center justify-center p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600" style={{ minWidth: 28, minHeight: 28 }}><PaintBucket className="w-3.5 h-3.5" /></button>
              <button title="מברשת עיצוב" className="flex items-center justify-center p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600" style={{ minWidth: 28, minHeight: 28 }}><PaintRoller className="w-3.5 h-3.5" /></button>
              <button title="נקה עיצוב" className="flex items-center justify-center p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600" style={{ minWidth: 28, minHeight: 28 }}><RemoveFormatting className="w-3.5 h-3.5" /></button>
            </div>

            {/* Editor + upload */}
            <div className="px-8 pt-5 pb-8 space-y-4">
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/50 resize-none"
                rows={7}
                placeholder="הזן את תוכן החתימה..."
              />
              <div>
                <input type="file" accept="image/*" className="hidden" id="signature-upload" />
                <label htmlFor="signature-upload" className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                  <Download className="w-4 h-4" />
                  <span>העלאת תמונת חתימה</span>
                </label>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button onClick={() => { setShowNewSignature(false); setSignatureType(null); }} className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">ביטול</button>
                <button onClick={() => { setShowNewSignature(false); setSignatureType(null); }} className="px-6 py-2 bg-[#1B3A6B] text-white rounded-xl hover:bg-[#152e54] transition-colors">שמור חתימה</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Distribution List Modal */}
      {showNewList && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[9998]"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => { setShowNewList(false); setListMembers([]); setActiveFilters([]); setListImportPanel(null); setListAddDropdown(false); }}
        >
          <div className="bg-white rounded-3xl shadow-2xl w-[800px] max-w-[90vw] max-h-[90vh] overflow-y-auto overflow-x-hidden p-8" onClick={(e) => e.stopPropagation()} dir="rtl">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">רשימת תפוצה חדשה</h2>
              <button
                onClick={() => { setShowNewList(false); setListMembers([]); setActiveFilters([]); setListImportPanel(null); setListAddDropdown(false); }}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Form fields */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-sm text-gray-700 mb-2 text-right">שם רשימת התפוצה</label>
                <input type="text" placeholder="הזן שם רשימה..." className="w-full px-4 py-2 border border-gray-300 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/50" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2 text-right">בחירת אגף</label>
                <CustomSelect placeholder="בחר אגף..." options={['מחלקת משאבי אנוש', 'מחלקת כספים', 'מחלקת טכנולוגיה', 'מחלקת תפעול']} />
              </div>
            </div>

            {/* Search row + add button */}
            <div className="flex items-center gap-2 mb-4">
              {/* Searchable people input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  autoComplete="new-password"
                  value={listSearchQuery}
                  onChange={e => { setListSearchQuery(e.target.value); setListSearchOpen(true); }}
                  onFocus={() => setListSearchOpen(true)}
                  onBlur={() => setTimeout(() => setListSearchOpen(false), 150)}
                  placeholder="חיפוש לפי שם..."
                  dir="rtl"
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-xl text-right text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/50"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                {listSearchOpen && listSearchQuery.trim() !== '' && (() => {
                  const results = LIST_PEOPLE_POOL.filter(p =>
                    p.name.includes(listSearchQuery) || p.idNumber.includes(listSearchQuery)
                  ).filter(p => !listMembers.some(m => m.id === p.id));
                  if (results.length === 0) return (
                    <div className="absolute top-full mt-1 right-0 left-0 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-[99999] text-center text-sm text-gray-400">לא נמצאו תוצאות</div>
                  );
                  return (
                    <div className="absolute top-full mt-1 right-0 left-0 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[99999]">
                      {results.map(person => (
                        <button
                          key={person.id}
                          type="button"
                          onMouseDown={() => {
                            setListMembers(prev => [...prev, person]);
                            setListSearchQuery('');
                            setListSearchOpen(false);
                          }}
                          className="w-full grid items-center px-4 py-2.5 hover:bg-gray-50 transition-colors gap-3"
                          style={{ gridTemplateColumns: '2fr 1fr 1fr', direction: 'rtl' }}
                        >
                          <span className="text-sm font-medium text-gray-800 text-right">{person.name}</span>
                          <span className="text-xs text-gray-500 text-right">{person.environment}</span>
                          <span className="text-xs text-gray-400 text-right">{person.idNumber}</span>
                        </button>
                      ))}
                    </div>
                  );
                })()}
              </div>
              {/* + dropdown */}
              <div className="relative flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setListAddDropdown(p => !p)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1B3A6B] text-white text-sm font-medium hover:bg-[#152e54] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  הוספה
                </button>
                {listAddDropdown && (
                  <div
                    className="absolute top-full mt-1 left-0 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-[99999]"
                    style={{ minWidth: 260 }}
                  >
                    {([
                      { key: 'doc',      label: 'ייבוא ממסמך קיים',                   Icon: FileText, color: 'text-[#2563EB]', hover: 'hover:bg-[#EFF6FF]' },
                      { key: 'hamal',    label: 'הוספת קבוצות חמל',                    Icon: Users,    color: 'text-[#16A34A]', hover: 'hover:bg-[#F0FDF4]' },
                      { key: 'miraz',    label: "הוספת קבוצות ממיראז'",                Icon: Layers,   color: 'text-[#9333EA]', hover: 'hover:bg-[#FDF4FF]' },
                      { key: 'personal', label: 'הוספת רשימת תפוצה מהאזור האישי',      Icon: List,     color: 'text-[#EA580C]', hover: 'hover:bg-[#FFF7ED]' },
                      { key: 'network',  label: 'הוספת אנשים מרשתות אחרות',            Icon: Network,  color: 'text-[#0D9488]', hover: 'hover:bg-[#F0FDFA]' },
                    ] as const).map(({ key, label, Icon, color, hover }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => { setListImportPanel(prev => prev === key ? null : key); setListAddDropdown(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${hover} ${listImportPanel === key ? 'font-medium' : ''}`}
                      >
                        <Icon className={`w-4 h-4 flex-shrink-0 ${color}`} />
                        <span className="flex-1 text-right text-gray-700">{label}</span>
                        {listImportPanel === key && <Check className="w-3.5 h-3.5 text-[#1B3A6B] flex-shrink-0" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Active import sub-panel */}
            {listImportPanel === 'doc' && (
              <div className="rounded-2xl overflow-hidden mb-4" style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)' }}>
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-800">ייבוא ממסמך קיים</h3>
                  <button type="button" onClick={() => setListImportPanel(null)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {/* Tabs */}
                <div className="flex items-center gap-1 px-5 pt-1 border-b border-gray-100">
                  {(['drafts', 'distributed'] as const).map((tab) => (
                    <button key={tab} type="button" onClick={() => setListDocTab(tab)}
                      className="relative px-4 py-2 text-sm focus:outline-none transition-colors"
                      style={{ color: listDocTab === tab ? '#111827' : '#9ca3af', fontWeight: listDocTab === tab ? 600 : 400 }}>
                      {tab === 'drafts' ? 'טיוטות' : 'פקודות שהופצו'}
                      {listDocTab === tab && <span className="absolute bottom-0 right-4 left-4 h-[2px] rounded-full bg-gray-900" />}
                    </button>
                  ))}
                </div>
                {/* Search */}
                <div className="px-5 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-full"
                    style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.05)' }}>
                    <div className="relative flex-1">
                      <Search className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input type="text" placeholder="חיפוש לפי שם, מספר פקודה..."
                        className="w-full pr-8 pl-3 py-1 text-sm text-right focus:outline-none bg-transparent" dir="rtl" />
                    </div>
                    <div className="w-px h-4 bg-gray-200 flex-shrink-0" />
                    <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
                      <Filter className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {/* Table */}
                <div className="overflow-hidden rounded-b-2xl">
                  {/* Header */}
                  <div className="grid items-center px-4 py-2.5 text-xs font-semibold text-gray-500"
                    style={{ background: '#EBEBEB', gridTemplateColumns: '24px 2fr 0.7fr 0.6fr 0.8fr 0.8fr 1fr 0.8fr 28px', columnGap: '8px', direction: 'rtl' }}>
                    <span />
                    <span className="text-right">שם המסמך</span>
                    <span className="text-right">מס׳ פק׳</span>
                    <span className="text-right">עדכון</span>
                    <span className="text-right">סביבה</span>
                    <span className="text-right">סוג מסמך</span>
                    <span className="text-right">תאריך עדכון אחרון</span>
                    <span className="text-right">מס סימוכין</span>
                    <span />
                  </div>
                  {LIST_DOCS_DATA.map(doc => {
                    const dotColor = doc.status === 'בהכנה' ? '#0284c7' : '#94a3b8';
                    const isSelected = listDocSelected.has(doc.id);
                    const isExpanded = listDocExpanded === doc.id;
                    return (
                      <div key={doc.id}>
                        <div
                          className={`grid items-center px-4 py-2.5 transition-colors ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                          style={{ borderBottom: '1px solid #f5f5f5', gridTemplateColumns: '24px 2fr 0.7fr 0.6fr 0.8fr 0.8fr 1fr 0.8fr 28px', columnGap: '8px', direction: 'rtl' }}>
                          {/* Arrow — far right in RTL */}
                          <button
                            type="button"
                            onClick={() => setListDocExpanded(isExpanded ? null : doc.id)}
                            className="flex items-center justify-center w-6 h-6 rounded hover:bg-gray-200 transition-colors flex-shrink-0"
                          >
                            <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>
                          <span className="text-right text-sm font-medium text-gray-800 truncate">{doc.name}</span>
                          <span className="text-right text-xs text-gray-500">{doc.cmdNum}</span>
                          <span className="text-right text-xs text-gray-500">{doc.update}</span>
                          <span className="text-right text-xs text-gray-500">{doc.environment}</span>
                          <span className="text-right text-xs text-gray-500">{doc.docType}</span>
                          <span className="text-right text-xs text-gray-500">{doc.lastUpdate}</span>
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: dotColor }} />
                            <span className="text-xs text-gray-600">{doc.refNum}</span>
                          </span>
                          {/* Checkbox — far left in RTL */}
                          <button
                            type="button"
                            onClick={() => {
                              const next = new Set(listDocSelected);
                              if (isSelected) next.delete(doc.id); else next.add(doc.id);
                              setListDocSelected(next);
                            }}
                            className={`w-5 h-5 rounded flex items-center justify-center border flex-shrink-0 transition-colors ${isSelected ? 'bg-[#1B3A6B] border-[#1B3A6B]' : 'border-gray-300 hover:border-gray-400'}`}
                          >
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </button>
                        </div>
                        {/* Expanded distribution list */}
                        {isExpanded && (
                          <div className="border-b border-blue-100 bg-[#f5f8ff]" dir="rtl">
                            {/* Mini table header */}
                            <div className="grid px-6 py-2 text-xs font-semibold text-gray-500"
                              style={{ background: '#e8edf7', gridTemplateColumns: '2fr 1fr 1fr', columnGap: '1rem' }}>
                              <span className="text-right">שם מלא</span>
                              <span className="text-right">תעודת זהות</span>
                              <span className="text-right">סביבה</span>
                            </div>
                            {/* Scrollable rows — max 5 visible */}
                            <div className="overflow-y-auto" style={{ maxHeight: `${5 * 36}px` }}>
                              {doc.distribution.map((person, i) => (
                                <div key={i}
                                  className="grid items-center px-6 py-2 text-xs hover:bg-blue-50 transition-colors"
                                  style={{ borderBottom: '1px solid #e8edf7', gridTemplateColumns: '2fr 1fr 1fr', columnGap: '1rem' }}>
                                  <span className="text-right font-medium text-gray-800">{person.name}</span>
                                  <span className="text-right text-gray-500">{person.idNumber}</span>
                                  <span className="text-right text-gray-500">{person.environment}</span>
                                </div>
                              ))}
                            </div>
                            {doc.distribution.length > 5 && (
                              <div className="px-6 py-1.5 text-xs text-gray-400 text-right">
                                ועוד {doc.distribution.length - 5} נוספים
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {/* Import selected button */}
                  {listDocSelected.size > 0 && (
                    <div className="px-5 py-3 bg-white border-t border-gray-100 flex items-center justify-between" dir="rtl">
                      <span className="text-xs text-gray-500">{listDocSelected.size} מסמכים נבחרו</span>
                      <button
                        type="button"
                        onClick={() => { setListImportPanel(null); setListDocSelected(new Set()); }}
                        className="px-4 py-1.5 bg-[#1B3A6B] text-white text-xs font-medium rounded-lg hover:bg-[#152e54] transition-colors"
                      >
                        ייבא נבחרים
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {listImportPanel === 'hamal' && (
              <div className="border border-gray-200 rounded-2xl mb-4 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-200">
                  <span className="text-xs font-medium text-[#16A34A]">הוספת קבוצות חמל</span>
                  <button type="button" onClick={() => setListImportPanel(null)} className="p-1 hover:bg-gray-200 rounded-lg transition-colors"><X className="w-4 h-4 text-gray-400" /></button>
                </div>
                <div className="p-8 text-center">
                  <Users className="w-10 h-10 text-[#16A34A] mx-auto mb-2 opacity-40" />
                  <p className="text-gray-400 text-sm">בחר קבוצות חמל להוספה לרשימה</p>
                </div>
              </div>
            )}

            {listImportPanel === 'miraz' && (
              <div className="border border-gray-200 rounded-2xl mb-4 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-200">
                  <span className="text-xs font-medium text-[#9333EA]">הוספת קבוצות ממיראז'</span>
                  <button type="button" onClick={() => setListImportPanel(null)} className="p-1 hover:bg-gray-200 rounded-lg transition-colors"><X className="w-4 h-4 text-gray-400" /></button>
                </div>
                <div className="p-8 text-center">
                  <Layers className="w-10 h-10 text-[#9333EA] mx-auto mb-2 opacity-40" />
                  <p className="text-gray-400 text-sm">בחר קבוצות ממיראז' להוספה לרשימה</p>
                </div>
              </div>
            )}

            {listImportPanel === 'personal' && (
              <div className="border border-gray-200 rounded-2xl mb-4 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-200">
                  <span className="text-xs font-medium text-[#EA580C]">הוספת רשימת תפוצה מהאזור האישי</span>
                  <button type="button" onClick={() => setListImportPanel(null)} className="p-1 hover:bg-gray-200 rounded-lg transition-colors"><X className="w-4 h-4 text-gray-400" /></button>
                </div>
                <div className="p-8 text-center">
                  <List className="w-10 h-10 text-[#EA580C] mx-auto mb-2 opacity-40" />
                  <p className="text-gray-400 text-sm">בחר רשימות תפוצה מהאזור האישי שלך</p>
                </div>
              </div>
            )}

            {listImportPanel === 'network' && (
              <div className="border border-gray-200 rounded-2xl mb-4 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-200">
                  <span className="text-xs font-medium text-[#0D9488]">הוספת אנשים מרשתות אחרות</span>
                  <button type="button" onClick={() => setListImportPanel(null)} className="p-1 hover:bg-gray-200 rounded-lg transition-colors"><X className="w-4 h-4 text-gray-400" /></button>
                </div>
                <div className="p-8 text-center">
                  <Network className="w-10 h-10 text-[#0D9488] mx-auto mb-2 opacity-40" />
                  <p className="text-gray-400 text-sm">בחר אנשים מרשתות חיצוניות להוספה לרשימה</p>
                </div>
              </div>
            )}

            {/* Members table — always visible */}
            <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">שם מלא</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">תעודת זהות</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">סביבה</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700"></th>
                  </tr>
                </thead>
                <tbody>
                  {listMembers.length === 0 ? (
                    <tr><td colSpan={4} className="px-4 py-10 text-center text-gray-500 text-sm">אין פריטים ברשימה</td></tr>
                  ) : listMembers.map(member => (
                    <tr key={member.id} className="border-t border-gray-200">
                      <td className="px-4 py-3 text-sm text-gray-700 text-right">{member.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 text-right">{member.idNumber}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 text-right">{member.environment}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => setListMembers(listMembers.filter(m => m.id !== member.id))} className="p-1 hover:bg-gray-200 rounded transition-colors">
                          <Trash2 className="w-4 h-4 text-gray-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => { setShowNewList(false); setListMembers([]); setActiveFilters([]); setListImportPanel(null); setListAddDropdown(false); }}
                className="px-8 py-3 bg-[#1B3A6B] text-white rounded-xl hover:bg-[#152e54] transition-colors font-medium"
              >
                צור רשימה
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[9999]"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setShowDeleteConfirm(null)}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-80" onClick={(e) => e.stopPropagation()} dir="rtl">
            <p className="text-center text-gray-900 mb-6">אתה בטוח שאתה רוצה למחוק?</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setShowDeleteConfirm(null)} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors">ביטול</button>
              <button onClick={() => setShowDeleteConfirm(null)} className="px-6 py-2 bg-[#1B3A6B] text-white rounded-xl hover:bg-[#152e54] transition-colors">אישור</button>
            </div>
          </div>
        </div>
      )}

      {/* Duplicate Panel */}
      {showDuplicatePanel && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[9999]"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setShowDuplicatePanel(null)}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[600px] max-w-[90vw]" onClick={(e) => e.stopPropagation()} dir="rtl">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-right">
              שכפול {showDuplicatePanel.type === 'template' ? 'תבנית' : showDuplicatePanel.type === 'signature' ? 'חתימה' : 'רשימה'}
            </h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2 text-right">שם</label>
                <input type="text" defaultValue={showDuplicatePanel.name} className="w-full px-4 py-2 border border-gray-300 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/50" />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowDuplicatePanel(null)} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors">ביטול</button>
              <button onClick={() => setShowDuplicatePanel(null)} className="px-6 py-2 bg-[#1B3A6B] text-white rounded-xl hover:bg-[#152e54] transition-colors">שמור וצור חדש</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
