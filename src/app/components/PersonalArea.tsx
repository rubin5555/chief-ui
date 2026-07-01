import { User, Eye, Send, CheckCircle, Share2, FileText, PenLine, List, Search, Folder, Trash2, Copy, ChevronDown, ChevronLeft, ChevronRight, GripVertical, Pin, Filter, X, Check, Download, Users, Layers, Network, UserCheck, UserCog, AlertCircle, Bold, Italic, Underline, Strikethrough, Highlighter, AlignRight, AlignCenter, AlignLeft, AlignJustify, ListOrdered, Indent, Outdent, PilcrowRight, PilcrowLeft, Superscript, Paperclip, Table2, PaintBucket, PaintRoller, RemoveFormatting, Plus, Database, RotateCcw} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { ImportDropdown } from './ImportDropdown';
import { CustomSelect } from './CustomSelect';
import { DatePicker } from './DatePicker';
import { DateTimePicker } from './DateTimePicker';

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

const HAMAL_GROUPS = [
  { id: 'h1', name: 'חמל ביטחון שטח',    type: 'ביטחוני',  environment: 'ארגון א׳', memberCount: 12,
    members: [
      { name: 'אבי כהן',     idNumber: '012345678', environment: 'ארגון א׳' },
      { name: 'שרה לוי',     idNumber: '023456789', environment: 'ארגון ב׳' },
      { name: 'מירי פרץ',    idNumber: '067890123', environment: 'ארגון א׳' },
      { name: 'יעקב בן-דוד', idNumber: '112345678', environment: 'ארגון א׳' },
    ]},
  { id: 'h2', name: 'חמל לוגיסטי',        type: 'לוגיסטי',  environment: 'ארגון ב׳', memberCount: 8,
    members: [
      { name: 'משה ישראלי', idNumber: '034567890', environment: 'ארגון א׳' },
      { name: 'לאה כץ',     idNumber: '089012345', environment: 'ארגון ב׳' },
      { name: 'יוסף מזרחי', idNumber: '056789012', environment: 'ארגון ב׳' },
    ]},
  { id: 'h3', name: 'חמל מודיעין',        type: 'מודיעיני', environment: 'ארגון א׳', memberCount: 6,
    members: [
      { name: 'אורן שמש',  idNumber: '090123456', environment: 'ארגון א׳' },
      { name: 'נועה גרין', idNumber: '101234567', environment: 'ארגון ג׳' },
    ]},
  { id: 'h4', name: 'חמל תקשורת',         type: 'תקשורתי', environment: 'ארגון ג׳', memberCount: 5,
    members: [
      { name: 'ריקי נחום', idNumber: '145678901', environment: 'ארגון א׳' },
      { name: 'תמר ברק',   idNumber: '123456789', environment: 'ארגון ב׳' },
    ]},
  { id: 'h5', name: 'חמל רפואי',           type: 'רפואי',    environment: 'ארגון ב׳', memberCount: 9,
    members: [
      { name: 'גיל אלון',  idNumber: '156789012', environment: 'ארגון ג׳' },
      { name: 'דני אברהם', idNumber: '078901234', environment: 'ארגון ד׳' },
      { name: 'עמי שלו',   idNumber: '134567890', environment: 'ארגון ד׳' },
      { name: 'רחל דוד',   idNumber: '045678901', environment: 'ארגון ג׳' },
    ]},
];

const MIRAZ_GROUPS = [
  { id: 'm1', name: "מיראז' קרבי",          type: 'קרבי',      environment: 'ארגון א׳',
    members: [
      { name: 'אבי כהן',     idNumber: '012345678', environment: 'ארגון א׳' },
      { name: 'מירי פרץ',    idNumber: '067890123', environment: 'ארגון א׳' },
      { name: 'יעקב בן-דוד', idNumber: '112345678', environment: 'ארגון א׳' },
    ]},
  { id: 'm2', name: "מיראז' סייבר",         type: 'סייבר',     environment: 'ארגון ב׳',
    members: [
      { name: 'שרה לוי',    idNumber: '023456789', environment: 'ארגון ב׳' },
      { name: 'תמר ברק',    idNumber: '123456789', environment: 'ארגון ב׳' },
      { name: 'נועה גרין',  idNumber: '101234567', environment: 'ארגון ג׳' },
    ]},
  { id: 'm3', name: "מיראז' מודיעין",       type: 'מודיעיני',  environment: 'ארגון א׳',
    members: [
      { name: 'אורן שמש',  idNumber: '090123456', environment: 'ארגון א׳' },
      { name: 'ריקי נחום', idNumber: '145678901', environment: 'ארגון א׳' },
    ]},
  { id: 'm4', name: "מיראז' לוגיסטי",      type: 'לוגיסטי',   environment: 'ארגון ג׳',
    members: [
      { name: 'משה ישראלי', idNumber: '034567890', environment: 'ארגון א׳' },
      { name: 'יוסף מזרחי', idNumber: '056789012', environment: 'ארגון ב׳' },
      { name: 'לאה כץ',     idNumber: '089012345', environment: 'ארגון ב׳' },
    ]},
  { id: 'm5', name: "מיראז' רפואי",         type: 'רפואי',     environment: 'ארגון ב׳',
    members: [
      { name: 'גיל אלון',  idNumber: '156789012', environment: 'ארגון ג׳' },
      { name: 'עמי שלו',   idNumber: '134567890', environment: 'ארגון ד׳' },
      { name: 'דני אברהם', idNumber: '078901234', environment: 'ארגון ד׳' },
      { name: 'רחל דוד',   idNumber: '045678901', environment: 'ארגון ג׳' },
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

const NETWORK_PEOPLE = [
  { id: 'n1',  name: 'דוד לוי',        idNumber: '201234567', environment: 'ארגון א׳', network: 'sodi'      as const, networkLabel: 'מערכת סודי'    },
  { id: 'n2',  name: 'רונית שפיר',     idNumber: '202345678', environment: 'ארגון ב׳', network: 'sodi'      as const, networkLabel: 'מערכת סודי'    },
  { id: 'n3',  name: 'אייל כץ',         idNumber: '203456789', environment: 'ארגון א׳', network: 'sodi'      as const, networkLabel: 'מערכת סודי'    },
  { id: 'n4',  name: 'מיכל אברמוב',    idNumber: '204567890', environment: 'ארגון ג׳', network: 'sodi'      as const, networkLabel: 'מערכת סודי'    },
  { id: 'n5',  name: 'ניר שלום',        idNumber: '205678901', environment: 'ארגון ב׳', network: 'sodi'      as const, networkLabel: 'מערכת סודי'    },
  { id: 'n6',  name: 'הדס ברון',        idNumber: '206789012', environment: 'ארגון א׳', network: 'sodi'      as const, networkLabel: 'מערכת סודי'    },
  { id: 'n7',  name: 'שי מנדל',         idNumber: '207890123', environment: 'ארגון ד׳', network: 'sodi'      as const, networkLabel: 'מערכת סודי'    },
  { id: 'n8',  name: 'אורית פרידמן',   idNumber: '208901234', environment: 'ארגון ג׳', network: 'sodi'      as const, networkLabel: 'מערכת סודי'    },
  { id: 'n9',  name: 'גדעון רוזן',      idNumber: '301234567', environment: 'ארגון ב׳', network: 'aman'      as const, networkLabel: 'אמ"ן'           },
  { id: 'n10', name: 'טל חיים',         idNumber: '302345678', environment: 'ארגון א׳', network: 'aman'      as const, networkLabel: 'אמ"ן'           },
  { id: 'n11', name: 'שירה בן-דוד',    idNumber: '303456789', environment: 'ארגון ג׳', network: 'aman'      as const, networkLabel: 'אמ"ן'           },
  { id: 'n12', name: 'עופר ויס',        idNumber: '304567890', environment: 'ארגון א׳', network: 'aman'      as const, networkLabel: 'אמ"ן'           },
  { id: 'n13', name: 'ליאת כהן',        idNumber: '305678901', environment: 'ארגון ב׳', network: 'aman'      as const, networkLabel: 'אמ"ן'           },
  { id: 'n14', name: 'ברק שוהם',        idNumber: '306789012', environment: 'ארגון ד׳', network: 'aman'      as const, networkLabel: 'אמ"ן'           },
  { id: 'n15', name: 'נעמה זיו',         idNumber: '307890123', environment: 'ארגון ג׳', network: 'aman'      as const, networkLabel: 'אמ"ן'           },
  { id: 'n16', name: 'אלון מזרחי',      idNumber: '401234567', environment: 'ארגון א׳', network: 'sodibioti' as const, networkLabel: 'סודי ביותר'     },
  { id: 'n17', name: 'יפית הרוש',       idNumber: '402345678', environment: 'ארגון ב׳', network: 'sodibioti' as const, networkLabel: 'סודי ביותר'     },
  { id: 'n18', name: 'רועי שניר',        idNumber: '403456789', environment: 'ארגון ג׳', network: 'sodibioti' as const, networkLabel: 'סודי ביותר'     },
  { id: 'n19', name: 'מאיה לוין',        idNumber: '404567890', environment: 'ארגון א׳', network: 'sodibioti' as const, networkLabel: 'סודי ביותר'     },
  { id: 'n20', name: 'תומר שגב',         idNumber: '405678901', environment: 'ארגון ד׳', network: 'sodibioti' as const, networkLabel: 'סודי ביותר'     },
];

const PERSONAL_LISTS = [
  { id: 'pl1', name: 'רשימת הפצה — מטה מבצעי',   tab: 'mine' as const, lastUpdate: '12.06.2026', members: [
    { name: 'אבי כהן',     idNumber: '012345678', environment: 'ארגון א׳' },
    { name: 'שרה לוי',     idNumber: '023456789', environment: 'ארגון ב׳' },
    { name: 'מירי פרץ',    idNumber: '067890123', environment: 'ארגון א׳' },
  ]},
  { id: 'pl2', name: 'רשימת הפצה — לוגיסטיקה',    tab: 'mine' as const, lastUpdate: '08.06.2026', members: [
    { name: 'משה ישראלי', idNumber: '034567890', environment: 'ארגון א׳' },
    { name: 'לאה כץ',     idNumber: '089012345', environment: 'ארגון ב׳' },
    { name: 'יוסף מזרחי', idNumber: '056789012', environment: 'ארגון ב׳' },
    { name: 'דני אברהם',  idNumber: '078901234', environment: 'ארגון ד׳' },
  ]},
  { id: 'pl3', name: 'צוות מודיעין — רשימה א׳',   tab: 'mine' as const, lastUpdate: '01.06.2026', members: [
    { name: 'אורן שמש',  idNumber: '090123456', environment: 'ארגון א׳' },
    { name: 'נועה גרין',  idNumber: '101234567', environment: 'ארגון ג׳' },
  ]},
  { id: 'pl4', name: 'כלל קציני הקשר',             tab: 'all'  as const, lastUpdate: '15.06.2026', members: [
    { name: 'יעקב בן-דוד', idNumber: '112345678', environment: 'ארגון א׳' },
    { name: 'תמר ברק',     idNumber: '123456789', environment: 'ארגון ב׳' },
    { name: 'עמי שלו',     idNumber: '134567890', environment: 'ארגון ד׳' },
  ]},
  { id: 'pl5', name: 'רשימת כוננות — מחלקת ביטחון', tab: 'all' as const, lastUpdate: '10.06.2026', members: [
    { name: 'ריקי נחום', idNumber: '145678901', environment: 'ארגון א׳' },
    { name: 'גיל אלון',  idNumber: '156789012', environment: 'ארגון ג׳' },
    { name: 'רחל דוד',   idNumber: '045678901', environment: 'ארגון ג׳' },
  ]},
  { id: 'pl6', name: 'מכלול תקשורת — פיקוד עורף',  tab: 'all' as const, lastUpdate: '05.06.2026', members: [
    { name: 'אבי כהן',   idNumber: '012345678', environment: 'ארגון א׳' },
    { name: 'משה ישראלי', idNumber: '034567890', environment: 'ארגון א׳' },
  ]},
];

/* ── Filter section helper (mirrors Catalog's SearchableCheckboxSection / SimpleCheckboxSection) ── */
function ImportFilterSection({ title, options, selected, onChange, searchable = false }: {
  title: string; options: string[]; selected: string[]; onChange: (v: string[]) => void; searchable?: boolean;
}) {
  const [q, setQ] = useState('');
  const visible = searchable ? options.filter(o => o.includes(q)) : options;
  const toggle = (opt: string) =>
    onChange(selected.includes(opt) ? selected.filter(x => x !== opt) : [...selected, opt]);
  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 px-4 pb-1.5 uppercase tracking-wide">{title}</p>
      {searchable && (
        <div className="relative mx-3 mb-1.5">
          <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-300 pointer-events-none" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="חיפוש..."
            className="w-full pr-7 pl-2 py-1 text-xs rounded-md border border-gray-100 bg-gray-50 focus:outline-none focus:border-gray-200"
            dir="rtl" />
        </div>
      )}
      <div className="max-h-28 overflow-y-auto">
        {visible.map(opt => (
          <label key={opt} className="flex items-center gap-2 px-4 py-1.5 cursor-pointer hover:bg-gray-50 transition-colors">
            <input type="checkbox" checked={selected.includes(opt)} onChange={() => toggle(opt)}
              className="rounded w-3.5 h-3.5 flex-shrink-0 accent-[#1B3A6B]" />
            <span className={`flex-1 text-right text-sm ${selected.includes(opt) ? 'font-semibold text-[#1B3A6B]' : 'text-gray-700'}`}>{opt}</span>
          </label>
        ))}
        {visible.length === 0 && <p className="px-4 py-1.5 text-xs text-gray-300 text-right">לא נמצאו</p>}
      </div>
    </div>
  );
}

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
                <button type="button" onClick={e => { e.stopPropagation(); toggle(s); }} className="hover:text-[#1B3A6B]">
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

/* ── Dynamic field binding ── */
type DynamicField = {
  id: string;
  systemId: string; systemName: string;
  operationId: string; operationName: string;
  instanceName: string;
  fieldName: string;
};

const _DB_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#1B3A6B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;display:inline-block;vertical-align:middle;margin-left:2px"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/></svg>`;

// Each chip is wrapped in an editable <div> so it sits on its own line and the
// user can type free text before/after it in the same line.
const makeChipHtml = (df: DynamicField): string =>
  `<span data-chip-id="${df.id}" data-chip-field="${encodeURIComponent(df.fieldName)}" data-chip-op="${df.operationId}" data-chip-op-name="${encodeURIComponent(df.operationName)}" data-chip-system="${df.systemId}" data-chip-system-name="${encodeURIComponent(df.systemName)}" data-chip-instance="${encodeURIComponent(df.instanceName)}" contenteditable="false" draggable="true" style="display:inline-flex;align-items:center;gap:3px;padding:3px 8px 3px 6px;background:#EEF4FF;border:1px solid rgba(27,58,107,0.25);border-radius:8px;font-size:11px;color:#1B3A6B;font-weight:600;cursor:grab;white-space:nowrap;user-select:none;line-height:1.5;box-shadow:0 1px 2px rgba(27,58,107,0.08);vertical-align:middle">${_DB_ICON_SVG} ${df.fieldName}<span style="font-weight:400;opacity:0.5;font-size:9.5px"> · ${df.instanceName} · ${df.operationName}</span><button data-chip-remove="${df.id}" contenteditable="false" style="margin-right:5px;opacity:0.4;cursor:pointer;background:none;border:none;color:#1B3A6B;padding:0;line-height:1;font-size:13px;font-family:inherit">×</button></span>`;

const extractChipIds = (html: string): string[] => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return Array.from(div.querySelectorAll('[data-chip-id]')).map(el => el.getAttribute('data-chip-id')!);
};

const parseChipsFromHtml = (html: string): DynamicField[] => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return Array.from(div.querySelectorAll('[data-chip-id]')).map(el => ({
    id:            el.getAttribute('data-chip-id')!,
    fieldName:     decodeURIComponent(el.getAttribute('data-chip-field') || ''),
    operationId:   el.getAttribute('data-chip-op') || '',
    operationName: decodeURIComponent(el.getAttribute('data-chip-op-name') || ''),
    systemId:      el.getAttribute('data-chip-system') || '',
    systemName:    decodeURIComponent(el.getAttribute('data-chip-system-name') || ''),
    instanceName:  decodeURIComponent(el.getAttribute('data-chip-instance') || ''),
  }));
};

function ContentEditor({
  value, onChange, onChipRemoved, placeholder = '', rows = 2,
}: {
  value: string;
  onChange: (v: string) => void;
  onChipRemoved?: (chipId: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  const divRef  = useRef<HTMLDivElement>(null);
  const lastHtml = useRef(value);
  const lastIds  = useRef(new Set(extractChipIds(value)));
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (!divRef.current) return;
    if (value !== lastHtml.current) {
      divRef.current.innerHTML = value;
      lastHtml.current = value;
      lastIds.current  = new Set(extractChipIds(value));
    }
  }, [value]);

  const commit = () => {
    if (!divRef.current) return;
    const html = divRef.current.innerHTML;
    if (onChipRemoved) {
      const curr = new Set(extractChipIds(html));
      lastIds.current.forEach(id => { if (!curr.has(id)) onChipRemoved(id); });
      lastIds.current = curr;
    }
    lastHtml.current = html;
    onChange(html);
  };

  const handleClick = (e: React.MouseEvent) => {
    const btn = (e.target as HTMLElement).closest('[data-chip-remove]') as HTMLElement | null;
    if (btn && divRef.current) {
      const chipId = btn.dataset.chipRemove!;
      divRef.current.querySelector(`[data-chip-id="${chipId}"]`)?.remove();
      const html = divRef.current.innerHTML;
      lastHtml.current = html;
      lastIds.current  = new Set(extractChipIds(html));
      onChange(html);
      onChipRemoved?.(chipId);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!e.dataTransfer.types.includes('application/x-dyn-chip')) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setDragOver(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    setDragOver(false);
    const chipHtml = e.dataTransfer.getData('text/x-chip-html');
    if (!chipHtml || !divRef.current) return;
    e.preventDefault();

    // Insert at the exact drop position
    divRef.current.focus();
    let inserted = false;
    const caretRange =
      (document as any).caretRangeFromPoint?.(e.clientX, e.clientY) ??
      (() => {
        const pos = (document as any).caretPositionFromPoint?.(e.clientX, e.clientY);
        if (!pos) return null;
        const r = document.createRange();
        r.setStart(pos.offsetNode, pos.offset);
        r.collapse(true);
        return r;
      })();

    if (caretRange && divRef.current.contains(caretRange.startContainer)) {
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(caretRange);
      const tmp = document.createElement('div');
      tmp.innerHTML = chipHtml + '<br>';
      const frag = document.createDocumentFragment();
      while (tmp.firstChild) frag.appendChild(tmp.firstChild);
      caretRange.deleteContents();
      caretRange.insertNode(frag);
      inserted = true;
    }
    if (!inserted) divRef.current.innerHTML += '<br>' + chipHtml + '<br>';

    const html = divRef.current.innerHTML;
    lastHtml.current = html;
    lastIds.current  = new Set(extractChipIds(html));
    onChange(html);
  };

  return (
    <div
      ref={divRef}
      contentEditable
      suppressContentEditableWarning
      dir="rtl"
      onInput={commit}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      data-placeholder={placeholder}
      className={[
        'content-editor w-full text-xs text-gray-600 bg-gray-50 border rounded-xl px-3 py-2 focus:border-[#1B3A6B] mb-2 transition-colors text-right',
        dragOver ? 'border-[#1B3A6B] border-dashed bg-[#EEF4FF]/60' : 'border-gray-100',
      ].join(' ')}
      style={{ minHeight: `${rows * 1.75}rem`, lineHeight: '1.75' }}
    />
  );
}

const DYNAMIC_SYSTEMS = [
  { id: 'sys1', name: 'UniTree', operations: [
    { id: 'op1', name: 'הבאת יחידת אב', instances: ['יחידה 101', 'יחידה 202', 'יחידה 303', 'יחידה 404', 'יחידה 505', 'יחידה 606', 'יחידה 707', 'יחידה 808', 'יחידה 900', 'יחידה 1001', 'יחידה צפון א׳', 'יחידה צפון ב׳', 'יחידה דרום א׳', 'יחידה דרום ב׳', 'יחידה מרכז'], fields: ['שם היחידה', 'מספר יחידה', 'מפקד היחידה', 'כתובת היחידה', 'סוג היחידה'] },
    { id: 'op2', name: 'הבאת פרטי כוח אדם', instances: ['יחידה 101', 'יחידה 202', 'יחידה 303', 'יחידה 404', 'יחידה 505', 'יחידה 606', 'יחידה 707', 'יחידה 808', 'יחידה 900', 'יחידה 1001'], fields: ['מספר חיילים', 'מספר קצינים', 'שם קצין הכוננות', 'כוח זמין'] },
  ]},
  { id: 'sys2', name: 'Ganttit', operations: [
    { id: 'op3', name: 'הבאת פרטי פעולה', instances: ['מבצע שחר', 'מבצע ברק', 'מבצע סערה', 'מבצע חרב', 'מבצע מגן', 'מבצע נשר', 'מבצע אריה', 'מבצע כוח', 'מבצע מים', 'מבצע רוח', 'מבצע אש', 'מבצע ענן'], fields: ['שם הפעולה', 'תאריך הפעולה', 'איזור הפעולה', 'מטרת הפעולה', 'שעת כניסה'] },
    { id: 'op4', name: 'הבאת פרטי איום', instances: ['איום צפון 1', 'איום צפון 2', 'איום דרום 1', 'איום דרום 2', 'איום מרכז 1', 'איום מרכז 2', 'איום מזרח 1', 'איום מערב 1'], fields: ['סוג האיום', 'מיקום האיום', 'עוצמת כוח'] },
  ]},
  { id: 'sys3', name: 'LineApp', operations: [
    { id: 'op5', name: 'הבאת נתוני ציוד', instances: ['מחסן ראשי א׳', 'מחסן ראשי ב׳', 'מחסן שדה 1', 'מחסן שדה 2', 'מחסן שדה 3', 'מחסן שדה 4', 'מחסן מובייל א׳', 'מחסן מובייל ב׳', 'מחסן חירום צפון', 'מחסן חירום דרום'], fields: ['כמות כלי רכב', 'כמות נשק', 'מלאי תחמושת', 'ציוד רפואי'] },
    { id: 'op6', name: 'הבאת פרטי אחסון', instances: ['מחסן ראשי א׳', 'מחסן ראשי ב׳', 'מחסן שדה 1', 'מחסן שדה 2', 'מחסן שדה 3', 'מחסן מובייל א׳', 'מחסן חירום'], fields: ['מיקום מחסן', 'שם אחראי', 'תאריך עדכון אחסון'] },
  ]},
];

// Fields that expand to show optional sub-fields (used in Col 3 of DynamicFieldPicker)
const FIELD_CHILDREN: Record<string, string[]> = {
  'שם היחידה':    ['שם מלא', 'שם קצר', 'שם בעברית'],
  'מפקד היחידה': ['דרגה', 'שם פרטי', 'שם משפחה'],
};

function SidebarFieldPicker({
  existingFields, onAdd,
}: { existingFields: DynamicField[]; onAdd: (v: DynamicField[]) => void }) {
  const [selSys,  setSelSys]  = useState<typeof DYNAMIC_SYSTEMS[0] | null>(null);
  const [selOp,   setSelOp]   = useState<typeof DYNAMIC_SYSTEMS[0]['operations'][0] | null>(null);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggleF  = (name: string) => setChecked(p => { const n = new Set(p); n.has(name) ? n.delete(name) : n.add(name); return n; });
  const pickSys  = (s: typeof DYNAMIC_SYSTEMS[0]) => { setSelSys(s); setSelOp(null); setChecked(new Set()); };
  const pickOp   = (o: typeof DYNAMIC_SYSTEMS[0]['operations'][0]) => { setSelOp(o); setChecked(new Set()); };

  const handleAdd = () => {
    if (!selSys || !selOp) return;
    const newFields: DynamicField[] = [];
    checked.forEach(fn => {
      if (!existingFields.find(f => f.operationId === selOp!.id && f.fieldName === fn))
        newFields.push({ id: `df-${Date.now()}-${Math.random().toString(36).slice(2)}`, systemId: selSys!.id, systemName: selSys!.name, operationId: selOp!.id, operationName: selOp!.name, fieldName: fn });
    });
    if (newFields.length) { onAdd(newFields); setChecked(new Set()); }
  };

  const ROW = (active: boolean) =>
    `w-full text-right px-2.5 py-1.5 rounded-lg text-[11px] flex items-center justify-between gap-1 transition-colors ${active ? 'bg-[#1B3A6B] text-white font-semibold' : 'hover:bg-gray-100 text-gray-700'}`;

  return (
    <div className="space-y-2.5">
      {/* Maarechet */}
      <div>
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-0.5">מערכת מקור</p>
        <div className="space-y-0.5">
          {DYNAMIC_SYSTEMS.map(sys => (
            <button key={sys.id} type="button" onClick={() => pickSys(sys)} className={ROW(selSys?.id === sys.id)}>
              <span className="flex-1 truncate">{sys.name}</span>
              {selSys?.id === sys.id && <ChevronLeft className="w-3 h-3 flex-shrink-0" />}
            </button>
          ))}
        </div>
      </div>

      {/* Peula */}
      {selSys && (
        <div className="border-t border-gray-100 pt-2.5">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-0.5">פעולה</p>
          <div className="space-y-0.5">
            {selSys.operations.map(op => (
              <button key={op.id} type="button" onClick={() => pickOp(op)} className={ROW(selOp?.id === op.id)}>
                <span className="flex-1 truncate">{op.name}</span>
                {selOp?.id === op.id && <ChevronLeft className="w-3 h-3 flex-shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sadot */}
      {selOp && (
        <div className="border-t border-gray-100 pt-2.5">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-0.5">שדות מידע</p>
          <div className="space-y-0.5 max-h-36 overflow-y-auto">
            {selOp.fields.map(fn => {
              const linked = existingFields.some(f => f.operationId === selOp!.id && f.fieldName === fn);
              return (
                <button key={fn} type="button" onClick={() => !linked && toggleF(fn)}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] transition-colors ${linked ? 'opacity-40 cursor-default' : checked.has(fn) ? 'bg-[#EEF4FF]' : 'hover:bg-gray-50'}`}>
                  <div className={`w-3 h-3 rounded border-2 flex-shrink-0 flex items-center justify-center flex-none ${checked.has(fn) ? 'bg-[#1B3A6B] border-[#1B3A6B]' : 'border-gray-300'}`}>
                    {checked.has(fn) && <Check className="w-2 h-2 text-white" />}
                  </div>
                  <span className={`flex-1 text-right truncate ${checked.has(fn) ? 'text-[#1B3A6B] font-semibold' : 'text-gray-700'}`}>{fn}</span>
                  {linked && <span className="text-[9px] text-gray-400 flex-shrink-0">מחובר</span>}
                </button>
              );
            })}
          </div>
          {checked.size > 0 && (
            <button type="button" onClick={handleAdd}
              className="w-full mt-2 py-1.5 bg-[#1B3A6B] text-white rounded-xl text-[11px] font-semibold hover:bg-[#152e54] transition-colors">
              + הוסף {checked.size} שדות
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function DynamicFieldPicker({
  existingFields, onAdd, onRemove, onClose,
}: { existingFields: DynamicField[]; onAdd: (v: DynamicField[]) => void; onRemove?: (id: string) => void; onClose?: () => void }) {
  const [selSys,       setSelSys]       = useState<typeof DYNAMIC_SYSTEMS[0] | null>(null);
  const [selOp,        setSelOp]        = useState<typeof DYNAMIC_SYSTEMS[0]['operations'][0] | null>(null);
  const [selInsts,     setSelInsts]     = useState<string[]>([]);
  const [instSearch,   setInstSearch]   = useState('');
  const [showInstPanel, setShowInstPanel] = useState(false);
  const [expandedField, setExpandedField] = useState<string | null>(null);

  // Per-operation parameters
  const [opParams, setOpParams] = useState<Record<string, { name: string; date: string; quantity: string; question: boolean }>>({});
  const [opNameSearch, setOpNameSearch] = useState<Record<string, string>>({});
  const [opNameDropOpen, setOpNameDropOpen] = useState<string | null>(null);

  const getParam = (opId: string) => opParams[opId] ?? { name: '', date: '', quantity: '', question: false };
  const setParam = (opId: string, patch: Partial<{ name: string; date: string; quantity: string; question: boolean }>) =>
    setOpParams(prev => ({ ...prev, [opId]: { ...(prev[opId] ?? { name: '', date: '', quantity: '', question: false }), ...patch } }));
  const pickOpName = (opId: string, name: string) => {
    setParam(opId, { name });
    setOpNameSearch(prev => ({ ...prev, [opId]: '' }));
    setOpNameDropOpen(null);
  };

  const pickSys = (s: typeof DYNAMIC_SYSTEMS[0]) => {
    setSelSys(s); setSelOp(null); setSelInsts([]); setInstSearch(''); setShowInstPanel(false);
  };
  const pickOp = (o: typeof DYNAMIC_SYSTEMS[0]['operations'][0]) => {
    if (selOp?.id === o.id) {
      setShowInstPanel(p => !p);
    } else {
      setSelOp(o); setSelInsts([]); setInstSearch(''); setShowInstPanel(true);
    }
  };
  const toggleInst = (inst: string) => {
    setSelInsts(prev => prev.includes(inst) ? prev.filter(i => i !== inst) : [...prev, inst]);
  };

  const toggleField = (fn: string) => {
    if (!selSys || !selOp || selInsts.length === 0) return;
    const toAdd: DynamicField[] = [];
    selInsts.forEach(inst => {
      const existing = existingFields.find(f => f.operationId === selOp!.id && f.instanceName === inst && f.fieldName === fn);
      if (existing) onRemove?.(existing.id);
      else toAdd.push({ id: `df-${Date.now()}-${Math.random().toString(36).slice(2)}`, systemId: selSys!.id, systemName: selSys!.name, operationId: selOp!.id, operationName: selOp!.name, instanceName: inst, fieldName: fn });
    });
    if (toAdd.length > 0) onAdd(toAdd);
  };

  const filteredInsts = selOp ? selOp.instances.filter(i => i.includes(instSearch)) : [];

  return (
    <>
    <div className="flex overflow-hidden" style={{ height: 320 }}>

      {/* ── Col 1: Systems ── */}
      <div className="w-36 flex-shrink-0 overflow-y-auto border-l border-gray-100 bg-white">
        <p className="text-[9px] font-semibold text-gray-400 tracking-widest uppercase px-4 pt-3 pb-2 sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-50">מערכת</p>
        {DYNAMIC_SYSTEMS.map((sys, idx) => {
          const isSel = selSys?.id === sys.id;
          return (
            <div key={sys.id} className={idx > 0 ? 'border-t border-gray-50' : ''}>
              <button type="button" onClick={() => pickSys(sys)}
                className={`relative w-full flex items-center gap-2 px-4 py-3 text-right transition-all duration-150 ${isSel ? 'bg-gradient-to-l from-[#EEF4FF] to-[#F7F9FF]' : 'hover:bg-gray-50/70'}`}>
                {isSel && <span className="absolute right-0 top-2 bottom-2 w-[3px] rounded-full bg-[#1B3A6B]" />}
                <ChevronLeft className={`w-3 h-3 flex-shrink-0 transition-colors ${isSel ? 'text-[#1B3A6B]/50' : 'text-transparent'}`} />
                <span className={`flex-1 truncate text-right text-[11px] ${isSel ? 'font-bold text-[#1B3A6B]' : 'font-medium text-gray-600'}`}>{sys.name}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Col 2: Operations + parameters ── */}
      <div className="w-80 flex-shrink-0 overflow-y-auto border-l border-gray-100 bg-white">
        <p className="text-[9px] font-semibold text-gray-400 tracking-widest uppercase px-4 pt-3 pb-2 sticky top-0 bg-white/95 backdrop-blur-sm z-10 border-b border-gray-50">פעולה</p>
        {selSys ? selSys.operations.map((op, idx) => {
          const isOpen = selOp?.id === op.id;
          const panelVisible = isOpen && showInstPanel;
          const param = getParam(op.id);
          const nameSearch = opNameSearch[op.id] ?? '';
          const nameDropVisible = opNameDropOpen === op.id;
          const filteredNames = LIST_PEOPLE_POOL.filter(p =>
            nameSearch.trim() === '' || p.name.includes(nameSearch.trim())
          );
          return (
            <div key={op.id} className={idx > 0 ? 'border-t border-gray-50' : ''}>
              {/* Operation row */}
              <button type="button" onClick={() => pickOp(op)}
                className={`relative w-full flex items-center gap-2 py-3 pr-4 text-right transition-all duration-150 ${
                  isOpen ? 'bg-gradient-to-l from-[#EEF4FF] to-[#F7F9FF]' : 'hover:bg-gray-50/70'
                } ${isOpen && selInsts.length > 0 ? 'pl-9' : 'pl-4'}`}>
                {isOpen && <span className="absolute right-0 top-2 bottom-2 w-[3px] rounded-full bg-[#1B3A6B]" />}
                {/* Badge — absolutely at far left */}
                {isOpen && selInsts.length > 0 && (
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[9px] font-bold bg-[#1B3A6B] text-white rounded-full leading-none flex-shrink-0">
                    {selInsts.length}
                  </span>
                )}
                {/* Chevron */}
                <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${panelVisible ? 'rotate-180 text-[#1B3A6B]' : isOpen ? 'text-[#1B3A6B]/40' : 'text-gray-300'}`} />
                {/* Name — always bold */}
                <span className={`flex-1 truncate text-right text-[12px] font-bold ${isOpen ? 'text-[#1B3A6B]' : 'text-gray-700'}`}>{op.name}</span>
              </button>

              {/* ── Parameters (shown when operation is clicked/expanded) ── */}
              {panelVisible && (
                <div className="px-3 pb-3 space-y-2.5 bg-white">

                  {/* פרמטר א׳: שם (single-select search dropdown) — no label, dropdown first */}
                  <div className="pt-2">
                    {/* Search input + dropdown */}
                    <div className="relative">
                      <div className="relative">
                        <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                        <input
                          type="text"
                          value={nameSearch}
                          onChange={e => {
                            setOpNameSearch(prev => ({ ...prev, [op.id]: e.target.value }));
                            setOpNameDropOpen(op.id);
                          }}
                          onFocus={() => setOpNameDropOpen(op.id)}
                          onBlur={() => setTimeout(() => setOpNameDropOpen(null), 150)}
                          placeholder="חיפוש שם..."
                          dir="rtl"
                          className="w-full pr-8 pl-3 py-1.5 text-[11px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B3A6B]/50 focus:ring-1 focus:ring-[#1B3A6B]/15 placeholder-gray-300 text-gray-700"
                        />
                      </div>
                      {/* Dropdown */}
                      {nameDropVisible && (
                        <div className="absolute top-full mt-0.5 left-0 right-0 bg-white rounded-lg border border-gray-200 shadow-md z-50 overflow-hidden" style={{ maxHeight: 120 }}>
                          <div className="overflow-y-auto" style={{ maxHeight: 120 }}>
                            {filteredNames.length > 0 ? filteredNames.map(p => {
                              const sel = param.name === p.name;
                              return (
                                <button key={p.id} type="button"
                                  onMouseDown={e => { e.preventDefault(); pickOpName(op.id, p.name); }}
                                  className={`w-full flex items-center px-3 py-1.5 text-[11px] transition-colors border-b border-gray-50 last:border-0 ${sel ? 'bg-[#EEF4FF] text-[#1B3A6B] font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}>
                                  <span className="truncate">{p.name}</span>
                                </button>
                              );
                            }) : (
                              <div className="py-3 text-center text-[10px] text-gray-400">אין תוצאות</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Selected name display */}
                    {param.name && (
                      <div className="mt-1.5 flex items-center justify-between px-2.5 py-1.5 bg-[#EEF4FF] rounded-lg">
                        <span className="text-[11px] font-semibold text-[#1B3A6B] truncate">{param.name}</span>
                        <button type="button" onClick={() => setParam(op.id, { name: '' })} className="text-[#1B3A6B]/40 hover:text-[#1B3A6B] transition-colors ml-1 flex-shrink-0">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* פרמטר ב׳: תאריך */}
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 mb-1">תאריך</p>
                    <DateTimePicker
                      value={param.date}
                      onChange={v => setParam(op.id, { date: v })}
                      placeholder="בחר תאריך ושעה"
                    />
                  </div>

                  {/* פרמטר ג׳: כמות */}
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] font-bold text-gray-500 flex-shrink-0">כמות</p>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={param.quantity}
                      onChange={e => setParam(op.id, { quantity: e.target.value.replace(/[^\d]/g, '') })}
                      placeholder="הכנס מספר"
                      dir="ltr"
                      className="flex-1 px-2 py-1 text-xs rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-[#1B3A6B]/50 focus:ring-1 focus:ring-[#1B3A6B]/15 placeholder-gray-300 text-gray-700 text-center"
                    />
                  </div>

                  {/* פרמטר ד׳: שאלה (toggle) */}
                  <div className="flex items-center justify-between py-0.5">
                    <p className="text-[10px] font-bold text-gray-500">שאלה</p>
                    <button
                      type="button"
                      dir="ltr"
                      onClick={() => setParam(op.id, { question: !param.question })}
                      className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none ${param.question ? 'bg-[#1B3A6B]' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${param.question ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </button>
                  </div>

                </div>
              )}

              {/* Inline instance picker */}
              {panelVisible && (
                <div className="mx-3 mb-2 rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
                  {/* Search */}
                  <div className="px-3 pt-2.5 pb-2">
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                      <input type="text" value={instSearch} onChange={e => setInstSearch(e.target.value)}
                        placeholder="חיפוש ישות..." dir="rtl" autoFocus
                        className="w-full pr-8 pl-3 py-2 text-[11px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B3A6B]/50 focus:ring-1 focus:ring-[#1B3A6B]/15 placeholder-gray-300 text-gray-700" />
                    </div>
                  </div>
                  {/* List */}
                  <div className="overflow-y-auto border-t border-gray-100" style={{ maxHeight: 118 }}>
                    {filteredInsts.length > 0 ? filteredInsts.map(inst => {
                      const checked = selInsts.includes(inst);
                      return (
                        <button key={inst} type="button" onClick={() => toggleInst(inst)}
                          className={`w-full flex items-center justify-between px-3 py-2 text-[11px] transition-all border-b border-gray-50 last:border-0 ${checked ? 'bg-[#EEF4FF] text-[#1B3A6B] font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
                          <span className="truncate ml-2">{inst}</span>
                          <div className={`w-4 h-4 rounded-md flex-shrink-0 border-[1.5px] flex items-center justify-center transition-all duration-150 ${checked ? 'bg-[#1B3A6B] border-[#1B3A6B]' : 'border-gray-300 bg-white'}`}>
                            {checked && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                          </div>
                        </button>
                      );
                    }) : (
                      <div className="flex items-center justify-center py-4">
                        <p className="text-[10px] text-gray-400">אין תוצאות</p>
                      </div>
                    )}
                  </div>
                  {/* Confirm button */}
                  <div className="px-3 pt-2 pb-2.5 border-t border-gray-100">
                    <button type="button" onClick={() => setShowInstPanel(false)}
                      className={`w-full py-2 rounded-xl text-[11px] font-bold tracking-wide transition-all duration-150 ${selInsts.length > 0 ? 'bg-[#1B3A6B] text-white hover:bg-[#152e54]' : 'bg-gray-100 text-gray-400 cursor-default'}`}>
                      {selInsts.length > 0 ? `אישור  ·  ${selInsts.length} נבחרו` : 'בחר ישות'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        }) : (
          <div className="flex flex-col items-center justify-center h-full gap-1.5 pb-8"><p className="text-[11px] text-gray-300">בחר מערכת</p></div>
        )}
      </div>

      {/* ── Col 3: Fields ── */}
      <div className="flex-1 min-w-0 overflow-y-auto border-l border-gray-100 bg-white">
        <p className="text-[9px] font-semibold text-gray-400 tracking-widest uppercase px-3 pt-3 pb-2 sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-50">שדה מידע</p>
        {selInsts.length > 0 && selOp ? selOp.fields.map(fn => {
          const linked = selInsts.every(inst => existingFields.some(f => f.operationId === selOp!.id && f.instanceName === inst && f.fieldName === fn));
          const subFields = FIELD_CHILDREN[fn];
          const isExpanded = expandedField === fn;

          return (
            <div key={fn}>
              {/* Parent field row */}
              <button type="button"
                onClick={() => {
                  if (subFields) {
                    setExpandedField(isExpanded ? null : fn);
                  } else {
                    toggleField(fn);
                  }
                }}
                className={`w-full flex items-center justify-between gap-1.5 px-3 py-2 mx-1 rounded-lg text-[11px] text-right transition-all mb-0.5 group ${isExpanded ? 'bg-[#EEF4FF] text-[#1B3A6B]' : linked ? 'text-gray-700 hover:bg-[#EEF4FF] hover:text-[#1B3A6B]' : 'text-gray-600 hover:bg-[#EEF4FF] hover:text-[#1B3A6B]'}`}
                style={{ width: 'calc(100% - 8px)' }}>
                <span className={`truncate ${isExpanded ? 'font-semibold' : linked ? 'font-medium' : 'group-hover:font-medium'}`}>{fn}</span>
                {subFields
                  ? <ChevronDown className={`w-3 h-3 flex-shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-[#1B3A6B]' : 'text-gray-300 group-hover:text-[#1B3A6B]/50'}`} />
                  : linked
                    ? <><Check className="w-3.5 h-3.5 text-[#1B3A6B]/40 flex-shrink-0 group-hover:hidden" /><X className="w-3.5 h-3.5 text-[#1B3A6B] flex-shrink-0 hidden group-hover:block" /></>
                    : <Plus className="w-3.5 h-3.5 text-transparent group-hover:text-[#1B3A6B]/50 flex-shrink-0 transition-colors" />}
              </button>

              {/* Sub-fields (expanded hierarchy) */}
              {subFields && isExpanded && (
                <div className="mr-3 mb-1 border-r-2 border-[#1B3A6B]/10 pr-2">
                  {subFields.map(sf => {
                    const sfLinked = selInsts.every(inst => existingFields.some(f => f.operationId === selOp!.id && f.instanceName === inst && f.fieldName === sf));
                    return (
                      <button key={sf} type="button" onClick={() => toggleField(sf)}
                        className={`w-full flex items-center justify-between gap-1.5 px-2.5 py-1.5 mx-0.5 rounded-lg text-[11px] text-right transition-all mb-0.5 group ${sfLinked ? 'text-[#1B3A6B] bg-[#EEF4FF]/60' : 'text-gray-500 hover:bg-[#EEF4FF] hover:text-[#1B3A6B]'}`}
                        style={{ width: 'calc(100% - 4px)' }}>
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-[#1B3A6B]/20 flex-shrink-0 text-[10px]">└</span>
                          <span className={`truncate text-[10px] ${sfLinked ? 'font-semibold' : 'group-hover:font-medium'}`}>{sf}</span>
                          {sfLinked && <span className="text-[9px] text-[#1B3A6B]/50 flex-shrink-0">אופציונלי</span>}
                        </div>
                        {sfLinked
                          ? <><Check className="w-3 h-3 text-[#1B3A6B]/40 flex-shrink-0 group-hover:hidden" /><X className="w-3 h-3 text-[#1B3A6B] flex-shrink-0 hidden group-hover:block" /></>
                          : <Plus className="w-3 h-3 text-transparent group-hover:text-[#1B3A6B]/50 flex-shrink-0 transition-colors" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }) : (
          <div className="flex flex-col items-center justify-center h-full gap-1.5 pb-8">
            <p className="text-[11px] text-gray-300">{!selOp ? 'בחר פעולה' : 'בחר ישות'}</p>
          </div>
        )}
      </div>

    </div>
    {/* Footer — action button */}
    {onClose && (
      <div className="border-t border-gray-100 bg-white rounded-b-2xl">
        <div className="flex items-center justify-between px-5 py-3">
          <span className="text-[11px] text-gray-400">
            {existingFields.length > 0 ? `${existingFields.length} שדות נבחרו` : 'לחץ על שדה להוספה מיידית'}
          </span>
          <button type="button" onClick={onClose}
            className="px-5 py-2 bg-[#1B3A6B] text-white rounded-xl text-sm font-semibold hover:bg-[#152e54] transition-colors">
            הוסף שדות
          </button>
        </div>
      </div>
    )}
    </>
  );
}

type PermSource = 'user' | 'group' | 'list';
type PermTag = { label: string; source: PermSource };

const PERM_SOURCE_OPTIONS: { id: PermSource; label: string; Icon: React.FC<{ className?: string }> }[] = [
  { id: 'user',  label: 'שם פרטי',       Icon: User  },
  { id: 'group', label: 'קבוצה ממיראז׳',  Icon: Users },
  { id: 'list',  label: 'רשימת תפוצה',   Icon: List  },
];

const MOCK_BY_SOURCE: Record<PermSource, string[]> = {
  user:  ['אבי כהן', 'שרה לוי', 'יוסי מזרחי', 'רחל גולן', 'דניאל שמש', 'מיכל ברק', 'נועם שפירא', 'תמר אלון'],
  group: ['צוות פיתוח', 'צוות תפעול', 'מחלקת ביטחון', 'הנהלה', 'צוות לוגיסטיקה', 'מחלקת מבצעים'],
  list:  ['רשימת מנהלים', 'רשימת טכנאים', 'רשימת מאשרים', 'רשימת עדכונים', 'רשימת תפוצה כללית'],
};

// Unified pool: all sources combined, each entry tagged with its source
const ALL_PERM_OPTIONS: PermTag[] = [
  ...MOCK_BY_SOURCE.user.map(label  => ({ label, source: 'user'  as PermSource })),
  ...MOCK_BY_SOURCE.group.map(label => ({ label, source: 'group' as PermSource })),
  ...MOCK_BY_SOURCE.list.map(label  => ({ label, source: 'list'  as PermSource })),
];

function PermissionsPanel({ approvers, editors, onChangeApprovers, onChangeEditors, showApprovers = true }: {
  approvers: PermTag[]; editors: PermTag[];
  onChangeApprovers: (v: PermTag[]) => void; onChangeEditors: (v: PermTag[]) => void;
  showApprovers?: boolean;
}) {
  // Active role tab — default to 'editors'; if no approvers toggle skip to editors
  const [activeRole, setActiveRole] = useState<'approvers' | 'editors'>(showApprovers ? 'approvers' : 'editors');
  const [q, setQ] = useState('');
  const [dropOpen, setDropOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Reset to valid tab if showApprovers changes
  useEffect(() => { if (!showApprovers && activeRole === 'approvers') setActiveRole('editors'); }, [showApprovers]);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setDropOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const isApproverTab = activeRole === 'approvers';
  const currentTags   = isApproverTab ? approvers : editors;
  const onChangeTags  = isApproverTab ? onChangeApprovers : onChangeEditors;

  const suggestions = ALL_PERM_OPTIONS.filter(opt =>
    !currentTags.find(t => t.label === opt.label && t.source === opt.source) &&
    opt.label.includes(q)
  );
  const getIcon = (src: PermSource) => PERM_SOURCE_OPTIONS.find(o => o.id === src)?.Icon ?? User;

  return (
    <div className="flex flex-col" ref={wrapRef}>
      {/* Role tabs */}
      <div className="flex border-b border-gray-100 px-5 pt-1">
        {showApprovers && (
          <button type="button" onClick={() => { setActiveRole('approvers'); setQ(''); setDropOpen(false); }}
            className="relative flex items-center gap-1.5 px-3 py-2 text-xs focus:outline-none transition-colors flex-shrink-0"
            style={{ color: activeRole === 'approvers' ? '#111827' : '#9ca3af', fontWeight: activeRole === 'approvers' ? 600 : 400 }}>
            <UserCheck className="w-3 h-3" />
            מאשר הסעיף
            {activeRole === 'approvers' && <span className="absolute bottom-0 right-0 left-0 h-[2px] rounded-full bg-[#1B3A6B]" />}
          </button>
        )}
        <button type="button" onClick={() => { setActiveRole('editors'); setQ(''); setDropOpen(false); }}
          className="relative flex items-center gap-1.5 px-3 py-2 text-xs focus:outline-none transition-colors flex-shrink-0"
          style={{ color: activeRole === 'editors' ? '#111827' : '#9ca3af', fontWeight: activeRole === 'editors' ? 600 : 400 }}>
          <Users className="w-3 h-3" />
          עורכי הסעיף
          {activeRole === 'editors' && <span className="absolute bottom-0 right-0 left-0 h-[2px] rounded-full bg-[#1B3A6B]" />}
        </button>
      </div>

      {/* Panel body */}
      <div className="flex flex-col gap-3 p-5">
        {/* Search */}
        <div className="relative">
          <div className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-xl bg-white focus-within:border-[#1B3A6B] transition-colors">
            <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <input value={q}
              onChange={e => { setQ(e.target.value); setDropOpen(true); }}
              onFocus={() => setDropOpen(true)}
              placeholder="חיפוש שם, קבוצה או רשימה..."
              className="flex-1 text-sm text-right focus:outline-none bg-transparent placeholder-gray-400"
              dir="rtl" />
          </div>
          {dropOpen && suggestions.length > 0 && (
            <div className="absolute top-full mt-1 right-0 left-0 bg-white border border-gray-100 rounded-xl shadow-lg z-30 py-1 max-h-48 overflow-y-auto">
              {suggestions.map((opt, idx) => {
                const Ico = getIcon(opt.source);
                return (
                  <button key={idx} type="button"
                    onMouseDown={() => { onChangeTags([...currentTags, opt]); setQ(''); setDropOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors justify-end">
                    {opt.label}
                    <Ico className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Table of selected */}
        {currentTags.length > 0 ? (
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            {currentTags.map((t, i) => {
              const Ico = getIcon(t.source);
              return (
                <div key={i} className={`flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${i > 0 ? 'border-t border-gray-50' : ''}`}>
                  <Ico className="w-3.5 h-3.5 text-[#1B3A6B] flex-shrink-0" />
                  <span className="flex-1 text-right text-gray-700">{t.label}</span>
                  <button type="button"
                    onClick={() => onChangeTags(currentTags.filter((_,j) => j !== i))}
                    className="p-0.5 rounded text-gray-300 hover:text-[#1B3A6B] hover:bg-[#EEF4FF] transition-colors flex-shrink-0">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-gray-400 text-center py-3">אין {isApproverTab ? 'מאשרים' : 'עורכים'} מוגדרים</p>
        )}
      </div>
    </div>
  );
}

export function PersonalArea() {
  const [activeCard, setActiveCard] = useState<'templates' | 'signatures' | 'lists'>('templates');
  const [activeSubTab, setActiveSubTab] = useState<'my-templates' | 'deleted'>('my-templates');
  const [deletedTemplates, setDeletedTemplates] = useState([{ id: 'del-1', name: 'תבנית ישנה שנמחקה' }]);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState<{ onConfirm: () => void } | null>(null);
  const confirmRestore = (onConfirm: () => void) => setShowRestoreConfirm({ onConfirm });
  const [activeSignatureTab, setActiveSignatureTab] = useState<'approver' | 'distribution' | 'personal'>('approver');
  const [activeListTab, setActiveListTab] = useState<'my-lists' | 'deleted'>('my-lists');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ onConfirm: () => void; label?: string } | null>(null);
  const confirmDelete = (onConfirm: () => void, label?: string) => setShowDeleteConfirm({ onConfirm, label });
  const [showDuplicatePanel, setShowDuplicatePanel] = useState<{type: string, name: string} | null>(null);
  const [hoveredSignature, setHoveredSignature] = useState<string | null>(null);
  const [showNewTemplate, setShowNewTemplate] = useState(false);
  type TemplatePermissions = { approvers: PermTag[]; editors: PermTag[] };
  type TemplateSubRow = { id: string; content: string; permissions?: TemplatePermissions };
  type TemplateRow = { id: string; type: 'section' | 'topic' | 'attachment' | 'emphasis'; content: string; subsections?: TemplateSubRow[]; permissions?: TemplatePermissions };
  const [templateRows, setTemplateRows] = useState<TemplateRow[]>([]);
  const [expandedPermissions, setExpandedPermissions] = useState<Set<string>>(new Set());
  const togglePerm = (id: string) => setExpandedPermissions(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const [templateApprovalDefault, setTemplateApprovalDefault] = useState<'allow' | 'skip'>('allow');
  const [templateName, setTemplateName] = useState('');
  const [tTopics, setTTopics] = useState<Array<{
    id: string; title: string;
    sections: Array<{
      id: string; title: string; content: string;
      permissions: { approvers: PermTag[]; editors: PermTag[] };
      dynamicFields: DynamicField[];
      subsections: Array<{id: string; title: string; content: string; permissions: { approvers: PermTag[]; editors: PermTag[] }; dynamicFields: DynamicField[]}>;
    }>;
  }>>([]);
  const [tAppendices, setTAppendices] = useState<Array<{id: string; title: string; content: string; permissions: { approvers: PermTag[]; editors: PermTag[] }; dynamicFields: DynamicField[]}>>([]);
  const [tClassification, setTClassification] = useState('');
  const [tClassificationTag, setTClassificationTag] = useState('');
  const nowIso = () => { const n = new Date(); return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}-${String(n.getDate()).padStart(2,'0')}T${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`; };
  const [tEffectiveDateTime, setTEffectiveDateTime] = useState(() => { const n = new Date(); return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}-${String(n.getDate()).padStart(2,'0')}T${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`; });
  const [tExpiryDateTime, setTExpiryDateTime] = useState('');
  const [tPermTarget, setTPermTarget] = useState<{
    id: string; label: string;
    permissions: { approvers: PermTag[]; editors: PermTag[] };
    onChangeApprovers: (v: PermTag[]) => void;
    onChangeEditors: (v: PermTag[]) => void;
  } | null>(null);
  const tPermCardRef = useRef<HTMLDivElement>(null);
  const [tHasEmphasis, setTHasEmphasis] = useState(false);
  const [tEmphasis, setTEmphasis] = useState('');
  const [showApprovalTooltip, setShowApprovalTooltip] = useState(false);
  const [showSpellCheckModal, setShowSpellCheckModal] = useState(false);
  const [showEnvRequestModal, setShowEnvRequestModal] = useState(false);
  const [envForm, setEnvForm] = useState({
    bodyType: '',
    name: '',
    logoPreview: '' as string,
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
  const [signatureEditMode, setSignatureEditMode] = useState(false);
  const [signatureDuplicateMode, setSignatureDuplicateMode] = useState(false);
  const [signatureDirty, setSignatureDirty] = useState(false);
  const [templateEditMode, setTemplateEditMode] = useState(false);
  const [templateDuplicateMode, setTemplateDuplicateMode] = useState(false);
  const [templateOriginalName, setTemplateOriginalName] = useState('');
  const [templateDirty, setTemplateDirty] = useState(false);
  const [showNewList, setShowNewList] = useState(false);
  const [listName, setListName] = useState('');
  const [listEditMode, setListEditMode] = useState(false);
  const [listDuplicateMode, setListDuplicateMode] = useState(false);
  const [listOriginalName, setListOriginalName] = useState('');
  const [listDirty, setListDirty] = useState(false);
  const [listFilterDropdown, setListFilterDropdown] = useState(false);
  const [listMembers, setListMembers] = useState<Array<{
    id: string; name: string; idNumber: string; environment: string;
    subLabel?: string;
    isGroup?: boolean; groupType?: string;
    groupMembers?: Array<{name: string; idNumber: string; environment: string}>;
  }>>([]);
  const [memberGroupExpanded, setMemberGroupExpanded] = useState<string | null>(null);
  const [pinnedTemplates, setPinnedTemplates] = useState<Set<string>>(new Set());
  const [activeFilters, setActiveFilters] = useState<Array<string>>([]);
  const [selectedTemplateType, setSelectedTemplateType] = useState<'command' | 'instruction' | 'document' | null>(null);
  const [showNetworkSubMenu, setShowNetworkSubMenu] = useState(false);
  const [listImportPanel, setListImportPanel] = useState<'doc' | 'hamal' | 'miraz' | 'personal' | 'network' | null>(null);
  const [listImportTab, setListImportTab] = useState<'network' | 'doc' | 'hamal' | 'miraz' | 'personal' | null>(null);
  const [listDocTab, setListDocTab] = useState<'drafts' | 'distributed'>('distributed');
  const [listSearchEnvFilter, setListSearchEnvFilter] = useState('');
  const [listSearchFilterOpen, setListSearchFilterOpen] = useState(false);
  const listSearchFilterRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (listSearchFilterRef.current && !listSearchFilterRef.current.contains(e.target as Node))
        setListSearchFilterOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const [listDocFilterOpen, setListDocFilterOpen] = useState(false);
  const [listDocFilterPos, setListDocFilterPos] = useState<{ top: number; left: number } | null>(null);
  const [listDocTypeFilter, setListDocTypeFilter] = useState<string[]>([]);
  const [listDocStatusFilter, setListDocStatusFilter] = useState<string[]>([]);
  const [listDocOrgFilter, setListDocOrgFilter] = useState<string[]>([]);
  const [listDocDateFrom, setListDocDateFrom] = useState('');
  const [listDocDateTo, setListDocDateTo] = useState('');
  const listDocFilterBtnRef = useRef<HTMLButtonElement>(null);
  const listDocFilterRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (
        listDocFilterRef.current && !listDocFilterRef.current.contains(e.target as Node) &&
        listDocFilterBtnRef.current && !listDocFilterBtnRef.current.contains(e.target as Node)
      ) setListDocFilterOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const [listDocSelected, setListDocSelected] = useState<Set<string>>(new Set());
  const [listDocAdded, setListDocAdded] = useState<Set<string>>(new Set());
  const [listDocExpanded, setListDocExpanded] = useState<string | null>(null);
  const [listAddDropdown, setListAddDropdown] = useState(false);
  const [listSearchQuery, setListSearchQuery] = useState('');
  const [listSearchOpen, setListSearchOpen] = useState(false);
  const [mirazSearchQuery, setMirazSearchQuery] = useState('');
  const [mirazSearchOpen, setMirazSearchOpen] = useState(false);
  const [mirazSelected, setMirazSelected] = useState<Set<string>>(new Set());
  const [mirazAdded, setMirazAdded] = useState<Set<string>>(new Set());
  const [mirazExpanded, setMirazExpanded] = useState<string | null>(null);
  const [listSearchNetworkFilter, setListSearchNetworkFilter] = useState<'sodibioti' | 'sodi' | 'aman' | ''>('sodibioti');
  const [manualAddOpen, setManualAddOpen] = useState(false);
  const [manualAddPos, setManualAddPos] = useState<{top:number;left:number} | null>(null);
  const [manualAddUsername, setManualAddUsername] = useState('');
  const [manualAddDisplayName, setManualAddDisplayName] = useState('');
  const manualAddBtnRef = useRef<HTMLButtonElement>(null);
  const [personalListTab, setPersonalListTab] = useState<'mine' | 'all'>('mine');
  const [personalListSearch, setPersonalListSearch] = useState('');
  const [personalListSelected, setPersonalListSelected] = useState<Set<string>>(new Set());
  const [personalListAdded, setPersonalListAdded] = useState<Set<string>>(new Set());
  const [personalListExpanded, setPersonalListExpanded] = useState<string | null>(null);
  const [templateFilterOpen, setTemplateFilterOpen] = useState(false);
  const [templateDeptFilter, setTemplateDeptFilter] = useState('');
  const [listDeptFilterOpen, setListDeptFilterOpen] = useState(false);
  const [listDeptFilter, setListDeptFilter] = useState('');
  const [sigAgafFilterOpen, setSigAgafFilterOpen] = useState(false);
  const [sigAgafFilter, setSigAgafFilter] = useState('');
  // Import panel rich filter
  const [importFilterOpen, setImportFilterOpen] = useState(false);
  const [importDocTypeFilter, setImportDocTypeFilter] = useState<string[]>([]);
  const [importStatusFilter, setImportStatusFilter] = useState<string[]>([]);
  const [importEnvFilter, setImportEnvFilter] = useState<string[]>([]);
  const [importDateFrom, setImportDateFrom] = useState('');
  const [importDateTo, setImportDateTo] = useState('');
  const importFilterRef = useRef<HTMLDivElement>(null);
  const [hamalSelected, setHamalSelected] = useState<Set<string>>(new Set());
  const [hamalAdded, setHamalAdded] = useState<Set<string>>(new Set());
  const [hamalSearch, setHamalSearch] = useState('');
  const [hamalExpanded, setHamalExpanded] = useState<string | null>(null);
  const [showCreateHamal, setShowCreateHamal] = useState(false);
  const [hamalCreatePos, setHamalCreatePos] = useState<{top:number; left:number} | null>(null);
  const hamalCreateBtnRef = useRef<HTMLButtonElement>(null);
  const hamalCreatePanelRef = useRef<HTMLDivElement>(null);
  const [newHamalName, setNewHamalName] = useState('');
  const [newHamalMemberSearch, setNewHamalMemberSearch] = useState('');
  const [newHamalDropdownOpen, setNewHamalDropdownOpen] = useState(false);
  const [newHamalPicked, setNewHamalPicked] = useState<Array<{name:string; idNumber:string; environment:string}>>([]);

  const [hamalAddMemberGroupId, setHamalAddMemberGroupId] = useState<string | null>(null);
  const [hamalAddMemberPos, setHamalAddMemberPos] = useState<{top:number; left:number} | null>(null);
  const [hamalAddMemberSearch, setHamalAddMemberSearch] = useState('');
  const hamalAddMemberPanelRef = useRef<HTMLDivElement>(null);
  const [hamalExtraMembers, setHamalExtraMembers] = useState<Record<string, Array<{name:string; idNumber:string; environment:string}>>>({});
  const [commandImportValue, setCommandImportValue] = useState<string | null>(null);
  const [timesImportValue, setTimesImportValue] = useState<string | null>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (importFilterRef.current && !importFilterRef.current.contains(e.target as Node)) setImportFilterOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (hamalCreatePanelRef.current && !hamalCreatePanelRef.current.contains(e.target as Node) &&
          hamalCreateBtnRef.current && !hamalCreateBtnRef.current.contains(e.target as Node))
        setShowCreateHamal(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (hamalAddMemberPanelRef.current && !hamalAddMemberPanelRef.current.contains(e.target as Node))
        setHamalAddMemberGroupId(null);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

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

  // ── New template builder helpers ──────────────────────────────────
  const heAlpha = ['א','ב','ג','ד','ה','ו','ז','ח','ט','י','כ','ל','מ','נ','ס','ע','פ','צ'];
  const resetNewTemplate = () => {
    setTemplateRows([]); setSelectedTemplateType(null);
    setTTopics([]); setTAppendices([]); setTHasEmphasis(false); setTEmphasis(''); setTemplateName('');
    setTClassification(''); setTClassificationTag(''); setTEffectiveDateTime(nowIso()); setTExpiryDateTime('');
    setTPermTarget(null); setTTemplateFields([]); setTDynTarget(null); setTemplateEditMode(false); setTemplateDuplicateMode(false); setTemplateOriginalName(''); setTemplateDirty(false);
  };
  const addTTopic = () => { setTTopics(p => [...p, {id:`tt-${Date.now()}`,title:'',sections:[]}]); setTemplateDirty(true); };
  const addTSection = (ti: number) => { setTTopics(p => p.map((t,i) => i!==ti?t:{...t,sections:[...t.sections,{id:`ts-${Date.now()}`,title:'',content:'',subsections:[],permissions:{approvers:[],editors:[]},dynamicFields:[]}]})); setTemplateDirty(true); };
  const addTSub = (ti: number, si: number) => { setTTopics(p => p.map((t,i) => i!==ti?t:{...t,sections:t.sections.map((s,j) => j!==si?s:{...s,subsections:[...s.subsections,{id:`tss-${Date.now()}`,title:'',content:'',permissions:{approvers:[],editors:[]},dynamicFields:[]}]})})); setTemplateDirty(true); };
  const delTTopic = (ti: number) => { setTTopics(p => p.filter((_,i) => i!==ti)); setTemplateDirty(true); };
  const delTSection = (ti: number, si: number) => { setTTopics(p => p.map((t,i) => i!==ti?t:{...t,sections:t.sections.filter((_,j) => j!==si)})); setTemplateDirty(true); };
  const delTSub = (ti: number, si: number, subi: number) => { setTTopics(p => p.map((t,i) => i!==ti?t:{...t,sections:t.sections.map((s,j) => j!==si?s:{...s,subsections:s.subsections.filter((_,k) => k!==subi)})})); setTemplateDirty(true); };
  const updTTopicTitle = (ti: number, v: string) => { setTTopics(p => p.map((t,i) => i!==ti?t:{...t,title:v})); setTemplateDirty(true); };
  const updTSecTitle = (ti: number, si: number, v: string) => { setTTopics(p => p.map((t,i) => i!==ti?t:{...t,sections:t.sections.map((s,j) => j!==si?s:{...s,title:v})})); setTemplateDirty(true); };
  const updTSecContent = (ti: number, si: number, v: string) => { setTTopics(p => p.map((t,i) => i!==ti?t:{...t,sections:t.sections.map((s,j) => j!==si?s:{...s,content:v})})); setTemplateDirty(true); };
  const updTSubTitle = (ti: number, si: number, subi: number, v: string) => { setTTopics(p => p.map((t,i) => i!==ti?t:{...t,sections:t.sections.map((s,j) => j!==si?s:{...s,subsections:s.subsections.map((ss,k) => k!==subi?ss:{...ss,title:v})})})); setTemplateDirty(true); };
  const updTSubContent = (ti: number, si: number, subi: number, v: string) => { setTTopics(p => p.map((t,i) => i!==ti?t:{...t,sections:t.sections.map((s,j) => j!==si?s:{...s,subsections:s.subsections.map((ss,k) => k!==subi?ss:{...ss,content:v})})})); setTemplateDirty(true); };
  const addTAppendix = () => { setTAppendices(p => [...p, {id:`ta-${Date.now()}`,title:'',content:'',permissions:{approvers:[],editors:[]},dynamicFields:[]}]); setTemplateDirty(true); };
  const updTSecPerms = (ti: number, si: number, v: {approvers: PermTag[]; editors: PermTag[]}) => setTTopics(p => p.map((t,i) => i!==ti?t:{...t,sections:t.sections.map((s,j) => j!==si?s:{...s,permissions:v})}));
  const updTSubPerms = (ti: number, si: number, subi: number, v: {approvers: PermTag[]; editors: PermTag[]}) => setTTopics(p => p.map((t,i) => i!==ti?t:{...t,sections:t.sections.map((s,j) => j!==si?s:{...s,subsections:s.subsections.map((ss,k) => k!==subi?ss:{...ss,permissions:v})})}));
  const updTAppPerms = (ai: number, v: {approvers: PermTag[]; editors: PermTag[]}) => setTAppendices(p => p.map((a,i) => i!==ai?a:{...a,permissions:v}));
  const [tTemplateFields, setTTemplateFields] = useState<DynamicField[]>([]);
  const [showFieldBankPicker, setShowFieldBankPicker] = useState(false);
  const [fieldsExpanded, setFieldsExpanded] = useState(false);

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
          <div className="flex-1 flex flex-col">
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { key: 'templates', Icon: FileText, label: 'תבניות' },
                { key: 'signatures', Icon: PenLine, label: 'חתימות' },
                { key: 'lists', Icon: UserCog, label: 'רשימות תפוצה' },
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

            <div className="flex-1">
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
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                  {activeSubTab === 'my-templates' && (
                    <div className="max-h-96 overflow-y-auto space-y-0">
                      {templates.map((t, i) => (
                        <div key={t.id}>
                          <div onClick={() => { setTemplateName(t.name); setTemplateEditMode(true); setShowNewTemplate(true); }} className="py-4 hover:bg-gray-50/50 px-4 transition-colors cursor-pointer flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <button onClick={(e) => { e.stopPropagation(); togglePin(t.id); }} className="p-1 hover:bg-gray-200 rounded transition-colors">
                                <Pin className={`w-4 h-4 ${pinnedTemplates.has(t.id) ? 'text-[#1B3A6B] fill-[#1B3A6B]' : 'text-gray-400'}`} />
                              </button>
                              <span className="text-sm text-gray-900">{t.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button onClick={(e) => { e.stopPropagation(); setTemplateName(t.name); setTemplateOriginalName(t.name); setTemplateDuplicateMode(true); setShowNewTemplate(true); }} className="p-1 hover:bg-gray-200 rounded transition-colors">
                                <Copy className="w-4 h-4 text-gray-400" />
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); confirmDelete(() => {}); }} className="p-1 hover:bg-gray-200 rounded transition-colors">
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
                    <div>
                      {deletedTemplates.length === 0 ? (
                        <div className="py-10 text-center text-sm text-gray-400">אין תבניות שנמחקו</div>
                      ) : deletedTemplates.map((t, i) => (
                        <div key={t.id}>
                          <div className="px-4 py-3.5 flex items-center justify-between gap-3">
                            <span className="text-sm text-gray-900 flex-1">{t.name}</span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={e => { e.stopPropagation(); setTemplateName(t.name); setTemplateOriginalName(t.name); setTemplateDuplicateMode(true); setShowNewTemplate(true); }}
                                title="שכפול תבנית"
                                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                                <Copy className="w-4 h-4" />
                              </button>
                              <button
                                onClick={e => { e.stopPropagation(); confirmRestore(() => setDeletedTemplates(p => p.filter(x => x.id !== t.id))); }}
                                title="שחזור תבנית"
                                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#1B3A6B] transition-colors">
                                <RotateCcw className="w-4 h-4" />
                              </button>
                              <button
                                onClick={e => { e.stopPropagation(); confirmDelete(() => setDeletedTemplates(p => p.filter(x => x.id !== t.id))); }}
                                title="מחיקה לצמיתות"
                                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          {i < deletedTemplates.length - 1 && <div className="border-t border-gray-100 mx-4" />}
                        </div>
                      ))}
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
                    <input type="text" placeholder="חיפוש..." className="w-full pr-10 pl-10 py-2 bg-white/70 backdrop-blur-md rounded-xl text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/50 text-right" />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setSigAgafFilterOpen(p => !p)}
                      className={`absolute left-3 top-1/2 -translate-y-1/2 p-0.5 rounded transition-colors ${sigAgafFilter ? 'text-[#1B3A6B]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <Filter className="w-4 h-4" />
                    </button>
                    {sigAgafFilterOpen && (
                      <div className="absolute top-full mt-1 left-0 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-[99999]" style={{ minWidth: 200 }}>
                        <p className="px-4 py-1.5 text-xs font-medium text-gray-400">סינון לפי אגף</p>
                        {['אגף מבצעים', 'אגף לוגיסטיקה', 'אגף כוח אדם', 'אגף טכנולוגיה', 'אגף תכנון'].map(agaf => (
                          <button
                            key={agaf}
                            onClick={() => { setSigAgafFilter(sigAgafFilter === agaf ? '' : agaf); setSigAgafFilterOpen(false); }}
                            className={`w-full flex items-center justify-between px-4 py-2 text-sm text-right transition-colors hover:bg-gray-50 ${sigAgafFilter === agaf ? 'text-[#1B3A6B] font-medium' : 'text-gray-700'}`}
                          >
                            {agaf}
                            {sigAgafFilter === agaf && <Check className="w-3.5 h-3.5 text-[#1B3A6B] flex-shrink-0 mr-2" />}
                          </button>
                        ))}
                        {sigAgafFilter && (
                          <button onClick={() => setSigAgafFilter('')} className="w-full px-4 py-2 text-xs text-red-400 hover:text-red-600 text-right border-t border-gray-100 mt-1 pt-2">
                            נקה סינון
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {sigAgafFilter && (
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-gray-500">מסונן לפי:</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#EEF4FF] text-[#1B3A6B] rounded-lg text-xs font-medium">
                      {sigAgafFilter}
                      <button onClick={() => setSigAgafFilter('')} className="hover:text-red-500 transition-colors mr-1">×</button>
                    </span>
                  </div>
                )}
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
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                  <div className="max-h-96 overflow-y-auto space-y-0">
                    {signatureData[activeSignatureTab].map((sig, i) => (
                      <div key={sig.id}>
                        <div onClick={() => { setSignatureType(activeSignatureTab); setSignatureEditMode(true); setShowNewSignature(true); }} className="py-4 hover:bg-gray-50/50 px-4 transition-colors cursor-pointer flex items-center justify-between">
                          <span className="text-sm text-gray-900">{sig.name}</span>
                          <div className="flex items-center gap-2 relative">
                            <button onClick={(e) => { e.stopPropagation(); setSignatureType(activeSignatureTab); setSignatureDuplicateMode(true); setShowNewSignature(true); }} className="p-1 hover:bg-gray-200 rounded transition-colors">
                              <Copy className="w-4 h-4 text-gray-400" />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); confirmDelete(() => {}); }} className="p-1 hover:bg-gray-200 rounded transition-colors">
                              <Trash2 className="w-4 h-4 text-gray-400" />
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
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                  {activeListTab === 'my-lists' && (
                    <div className="max-h-96 overflow-y-auto space-y-0">
                      {PERSONAL_LISTS.filter(l => l.tab === 'mine').map((list, i, arr) => (
                        <div key={list.id}>
                          <div onClick={() => { setListName(list.name); setListMembers(list.members.map((m, mi) => ({ id: `edit-m-${mi}`, ...m }))); setListEditMode(true); setShowNewList(true); }} className="py-4 hover:bg-gray-50/50 px-4 transition-colors cursor-pointer flex items-center justify-between">
                            <span className="text-sm text-gray-900">{list.name}</span>
                            <div className="flex items-center gap-2">
                              <button onClick={(e) => { e.stopPropagation(); setListName(list.name); setListOriginalName(list.name); setListMembers(list.members.map((m, mi) => ({ id: `dup-m-${mi}`, ...m }))); setListDuplicateMode(true); setShowNewList(true); }} className="p-1 hover:bg-gray-200 rounded transition-colors">
                                <Copy className="w-4 h-4 text-gray-400" />
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); confirmDelete(() => {}); }} className="p-1 hover:bg-gray-200 rounded transition-colors">
                                <Trash2 className="w-4 h-4 text-gray-400" />
                              </button>
                            </div>
                          </div>
                          {i < arr.length - 1 && <div className="border-t border-gray-200/50"></div>}
                        </div>
                      ))}
                    </div>
                  )}
                  {activeListTab === 'deleted' && (
                    <div className="py-4 hover:bg-gray-50/50 px-4 transition-colors cursor-pointer flex items-center justify-between">
                      <span className="text-sm text-gray-900">רשימה ישנה שנמחקה</span>
                      <div className="flex items-center gap-2">
                        <button onClick={(e) => { e.stopPropagation(); setListOriginalName('רשימה ישנה שנמחקה'); setListName('רשימה ישנה שנמחקה'); setListDuplicateMode(true); setShowNewList(true); }} className="p-1 hover:bg-gray-200 rounded transition-colors">
                          <Copy className="w-4 h-4 text-gray-400" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); confirmDelete(() => {}, 'רשימה זו'); }} className="p-1 hover:bg-gray-200 rounded transition-colors">
                          <Trash2 className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            </div>{/* end flex-1 card content wrapper */}

            {/* Spell checker card — always pinned to bottom */}
            <div className="mt-4 rounded-2xl px-4 py-3.5 flex items-center gap-3" style={{
              background: 'transparent', border: '1px solid #e5e7eb',
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
          <div className="bg-white rounded-3xl shadow-2xl w-[540px] max-w-[90vw] max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()} dir="rtl">
            <div className="flex-shrink-0 flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100">
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

            <div className="flex-1 overflow-y-auto px-8 py-6">
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
        </div>
      )}

      {/* Environment Request Modal */}
      {showEnvRequestModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[9998]" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowEnvRequestModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-[620px] max-w-[90vw] max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()} dir="rtl">

            {/* Header — sticky */}
            <div className="flex-shrink-0 flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100">
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

            <div className="flex-1 overflow-y-auto px-8 py-6">
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

              {/* לוגו / תמונת סביבה */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 text-right">תמונת סביבה</label>
                <div className="flex items-center gap-4">
                  {/* Upload area */}
                  <label className="flex-1 cursor-pointer">
                    <div className="flex flex-col items-center justify-center gap-1.5 px-4 py-4 border border-dashed border-gray-300 rounded-xl hover:border-[#1B3A6B]/40 hover:bg-blue-50/30 transition-colors">
                      <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                        <Plus className="w-4 h-4 text-gray-400" />
                      </div>
                      <span className="text-xs text-gray-500 font-medium">העלאת תמונה</span>
                      <span className="text-[10px] text-gray-400">PNG, JPG עד 2MB</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = ev => setEnvForm(f => ({ ...f, logoPreview: ev.target?.result as string }));
                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>
                  {/* Remove button */}
                  {envForm.logoPreview && (
                    <button type="button" onClick={() => setEnvForm(f => ({ ...f, logoPreview: '' }))}
                      className="p-1.5 rounded-lg text-gray-300 hover:text-[#1B3A6B] hover:bg-[#EEF4FF] transition-colors flex-shrink-0">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
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
        </div>
      )}

      {/* New Template Modal */}
      {showNewTemplate && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[9998]"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => { setShowNewTemplate(false); resetNewTemplate(); }}
        >
          <div
            className="relative bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            style={{ width: '1140px', maxWidth: '96vw', height: '90vh' }}
            onClick={e => e.stopPropagation()}
            dir="rtl"
          >
            {/* ── Header ── */}
            <div className="flex-shrink-0 flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">{templateDuplicateMode ? 'שכפול תבנית' : templateEditMode ? 'עריכת תבנית' : 'תבנית חדשה'}</h2>
              <button onClick={() => { setShowNewTemplate(false); resetNewTemplate(); }} className="text-gray-400 hover:text-gray-700 text-xl leading-none">✕</button>
            </div>

            {/* ── Top form fields ── */}
            <div className="flex-shrink-0 px-8 py-4 border-b border-gray-100 bg-gray-50/40">
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                {/* שם התבנית */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 text-right">שם התבנית</label>
                  <input type="text" value={templateName} onChange={e => { setTemplateName(e.target.value); setTemplateDirty(true); }}
                    placeholder="הזן שם תבנית..."
                    className={`w-full px-3 py-2 border rounded-xl text-sm text-right focus:outline-none focus:border-[#1B3A6B] bg-white transition-colors ${templateDuplicateMode && templateName === templateOriginalName ? 'border-amber-400 bg-amber-50' : 'border-gray-200'}`} />
                  {templateDuplicateMode && templateName === templateOriginalName && (
                    <p className="text-[11px] text-amber-600 mt-1 text-right">יש לשנות את שם התבנית לפני השכפול</p>
                  )}
                </div>
                {/* סוג מסמך */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 text-right">סוג מסמך</label>
                  <div className="flex gap-2">
                    {([{ key: 'command', label: 'פקודה', soon: false }, { key: 'instruction', label: 'הוראה', soon: true }, { key: 'document', label: 'מסמך', soon: true }] as const).map(({ key, label, soon }) => (
                      <button key={key} onClick={() => { if (!soon) { setSelectedTemplateType(key); setTemplateDirty(true); } }} disabled={soon}
                        className={`relative flex-1 py-2 px-3 rounded-xl text-xs font-medium border transition-all ${soon ? 'opacity-50 cursor-default text-gray-400 border-gray-200' : selectedTemplateType === key ? 'bg-[#1B3A6B] text-white border-[#1B3A6B]' : 'text-gray-600 border-gray-200 bg-white hover:border-[#1B3A6B] hover:text-[#1B3A6B]'}`}>
                        {soon && <span className="absolute -top-1.5 left-0.5 text-[8px] bg-amber-100 text-amber-600 px-1 rounded-full font-bold leading-tight">soon</span>}
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                {/* בחירת אגף + חיבור לתיקייה — both inside one grid cell */}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1 text-right">בחירת אגף</label>
                    <CustomSelect placeholder="בחר אגף..." options={['מחלקת משאבי אנוש', 'מחלקת כספים', 'מחלקת טכנולוגיה', 'מחלקת תפעול', 'מחלקת שיווק']} />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1 text-right">חיבור לתיקייה</label>
                    <CustomSelect placeholder="בחר תיקייה..." options={['תיקיית פקודות', 'תיקיית דוחות', 'תיקיית הוראות', 'תיקייה כללית']} />
                  </div>
                </div>
                {/* סבב אישורים — same row, left cell */}
                <div className="flex flex-col">
                  <span className="block text-xs font-medium text-gray-500 mb-1 invisible select-none">_</span>
                  <div className="flex items-center justify-between gap-2 px-3 bg-white border border-gray-200 rounded-xl" style={{ height: '38px' }}>
                    <span className="text-xs text-gray-600 leading-tight">סבב אישורים על סעיפי הפקודה</span>
                    <button type="button" dir="ltr"
                      onClick={() => { setTemplateApprovalDefault(v => v === 'allow' ? 'skip' : 'allow'); setTemplateDirty(true); }}
                      className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors duration-200 ${templateApprovalDefault === 'allow' ? 'bg-[#1B3A6B]' : 'bg-gray-300'}`}>
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${templateApprovalDefault === 'allow' ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                </div>
                {/* סיווג + תגית */}
                <div className="flex gap-3 items-end">
                  <div className={tClassification === 'סודי ביותר' || tClassification === 'סודי ביותר לשו"ס' ? 'flex-1' : 'w-full'}>
                    <label className="block text-xs font-medium text-gray-500 mb-1 text-right">סיווג</label>
                    <CustomSelect
                      value={tClassification}
                      onChange={v => { setTClassification(v); setTClassificationTag(''); setTemplateDirty(true); }}
                      placeholder="בחר סיווג..."
                      options={['בלמ"ס', 'סודי', 'סודי ביותר', 'סודי ביותר לשו"ס']}
                    />
                  </div>
                  {(tClassification === 'סודי ביותר' || tClassification === 'סודי ביותר לשו"ס') && (
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-500 mb-1 text-right">תגית</label>
                      <CustomSelect
                        value={tClassificationTag}
                        onChange={setTClassificationTag}
                        placeholder="בחר תגית..."
                        options={
                          tClassification === 'סודי ביותר'
                            ? ['ללא', 'תגית א׳', 'תגית ב׳']
                            : ['תגית א׳', 'תגית ב׳']
                        }
                      />
                    </div>
                  )}
                </div>
                {/* זמנים */}
                <div>
                  <div className="flex gap-3">
                    {/* כניסה לתוקף */}
                    <div className="flex-1">
                      <label className="block text-[10px] text-gray-400 mb-0.5 text-right">כניסה לתוקף</label>
                      <DateTimePicker
                        value={tEffectiveDateTime}
                        onChange={setTEffectiveDateTime}
                        placeholder="בחר תאריך ושעה"
                      />
                    </div>
                    {/* יציאה מתוקף */}
                    <div className="flex-1">
                      <label className="block text-[10px] text-gray-400 mb-0.5 text-right">יציאה מתוקף</label>
                      <DateTimePicker
                        value={tExpiryDateTime}
                        onChange={setTExpiryDateTime}
                        placeholder="בחר תאריך ושעה"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Main body: sidebar + preview ── */}
            <div className="flex-1 flex overflow-hidden">

              {/* Right sidebar — structure builder */}
              <div className="w-64 flex-shrink-0 border-l border-gray-100 bg-[#FAFAFA] flex flex-col overflow-hidden">

                {/* ── Field bank view: title moves to top as header ── */}
                {fieldsExpanded && tTemplateFields.length > 0 ? (
                  <>
                    {/* Header at top when expanded */}
                    <div className="flex-shrink-0 border-b-2 border-[#1B3A6B]/10 bg-[#FAFAFA]">
                      <div className="px-3 py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Database className="w-3 h-3 text-[#1B3A6B]" />
                          <span className="text-[11px] font-bold text-[#1B3A6B]">ייבוא מידע ממערכת מקור</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setFieldsExpanded(false)}
                            className="p-0.5 text-[#1B3A6B]/40 hover:text-[#1B3A6B] transition-colors"
                            title="חזור לנושאים">
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setShowFieldBankPicker(true)}
                            className="p-0.5 text-[#1B3A6B]/50 hover:text-[#1B3A6B] transition-colors">
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Scrollable field list */}
                    <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
                      <p className="text-[9px] text-[#1B3A6B]/40 px-1">גרור שדה לתוך הסעיף הרצוי</p>
                      {tTemplateFields.map(df => (
                        <div
                          key={df.id}
                          draggable
                          onDragStart={e => {
                            e.dataTransfer.effectAllowed = 'copy';
                            e.dataTransfer.setData('application/x-dyn-chip', df.id);
                            e.dataTransfer.setData('text/x-chip-html', makeChipHtml(df));
                          }}
                          className="flex items-center gap-2 px-2.5 py-2 bg-[#EEF4FF] border border-[#1B3A6B]/15 rounded-xl cursor-grab select-none hover:bg-[#dce9ff] hover:border-[#1B3A6B]/30 active:opacity-60 transition-colors group"
                        >
                          <GripVertical className="w-3.5 h-3.5 text-[#1B3A6B]/30 flex-shrink-0 group-hover:text-[#1B3A6B]/60 transition-colors" />
                          <div className="flex-1 min-w-0">
                            <div className="text-[11px] font-semibold text-[#1B3A6B] truncate">{df.fieldName}</div>
                            <div className="text-[9px] text-[#1B3A6B]/50 truncate leading-tight">{df.operationName}{df.instanceName ? ` · ${df.instanceName}` : ''} · {df.systemName}</div>
                          </div>
                          <button
                            onMouseDown={e => e.stopPropagation()}
                            onClick={() => setTTemplateFields(p => p.filter(f => f.id !== df.id))}
                            className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-gray-300 hover:text-[#1B3A6B] transition-all flex-shrink-0">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <button onClick={() => setShowFieldBankPicker(true)}
                        className="flex items-center gap-1.5 w-full px-3 py-1.5 text-[#1B3A6B]/50 hover:text-[#1B3A6B] border border-dashed border-[#1B3A6B]/20 hover:border-[#1B3A6B]/40 rounded-xl text-xs transition-colors mt-1">
                        <Plus className="w-3.5 h-3.5" />
                        הוסף שדות נוספים
                      </button>
                    </div>
                  </>
                ) : (
                <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">

                {/* Add topic button */}
                <button onClick={addTTopic}
                  className="flex items-center gap-1.5 w-full px-3 py-2 bg-white border border-dashed border-[#1B3A6B] text-[#1B3A6B] rounded-xl text-xs font-semibold hover:bg-blue-50 transition-colors">
                  <Plus className="w-3.5 h-3.5 flex-shrink-0" />
                  הוספת נושא
                </button>

                {/* Topics tree */}
                <div className="space-y-2 flex-1">
                  {tTopics.map((topic, ti) => (
                    <div key={topic.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                      {/* Topic header */}
                      <div className="flex items-center gap-1.5 px-2.5 py-2 bg-[#EEF3FB] border-b border-gray-100">
                        <div className="w-2 h-2 rounded-full bg-[#1B3A6B] flex-shrink-0" />
                        <input value={topic.title} onChange={e => updTTopicTitle(ti, e.target.value)}
                          placeholder={`נושא ${ti + 1}...`}
                          className="flex-1 bg-transparent text-xs font-bold text-gray-800 focus:outline-none placeholder-gray-400 text-right min-w-0"
                          dir="rtl" />
                        <button onClick={() => delTTopic(ti)} className="p-0.5 rounded text-gray-400 hover:text-[#1B3A6B] hover:bg-[#EEF4FF] transition-colors flex-shrink-0">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      {/* Sections */}
                      <div className="p-2 space-y-1.5">
                        {topic.sections.map((sec, si) => {
                          const secHasPerms = sec.permissions.approvers.length > 0 || sec.permissions.editors.length > 0;
                          const secPermActive = tPermTarget?.id === sec.id;
                          return (
                          <div key={sec.id} className="pr-2">
                            <div className="flex items-center gap-1 px-2 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                              <span className="text-[10px] text-[#1B3A6B] font-bold flex-shrink-0 w-4 text-left">{si + 1}.</span>
                              <input value={sec.title} onChange={e => updTSecTitle(ti, si, e.target.value)}
                                placeholder="שם הסעיף..."
                                className="flex-1 bg-transparent text-xs text-gray-700 focus:outline-none placeholder-gray-400 text-right min-w-0"
                                dir="rtl" />
                              <button
                                onClick={() => setTPermTarget(secPermActive ? null : {
                                  id: sec.id,
                                  label: `הרשאות סעיף ${si + 1}`,
                                  permissions: sec.permissions,
                                  onChangeApprovers: v => updTSecPerms(ti, si, { ...sec.permissions, approvers: v }),
                                  onChangeEditors:   v => updTSecPerms(ti, si, { ...sec.permissions, editors: v }),
                                })}
                                title="הרשאות"
                                className={`p-0.5 rounded transition-colors flex-shrink-0 ${secPermActive ? 'text-[#1B3A6B] bg-[#EEF4FF]' : secHasPerms ? 'text-[#1B3A6B]' : 'text-gray-300 hover:text-[#1B3A6B] hover:bg-[#EEF4FF]'}`}>
                                <User className="w-3 h-3" />
                              </button>
                              <button onClick={() => delTSection(ti, si)} className="p-0.5 rounded text-gray-400 hover:text-[#1B3A6B] hover:bg-[#EEF4FF] transition-colors flex-shrink-0">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                            {/* Subsections */}
                            {sec.subsections.length > 0 && (
                              <div className="pr-4 mt-1 space-y-1">
                                {sec.subsections.map((sub, subi) => {
                                  const subHasPerms = sub.permissions.approvers.length > 0 || sub.permissions.editors.length > 0;
                                  const subPermActive = tPermTarget?.id === sub.id;
                                  return (
                                  <div key={sub.id}>
                                    <div className="flex items-center gap-1 px-2 py-1 bg-white rounded-lg border border-gray-100">
                                      <span className="text-[10px] text-gray-500 font-bold flex-shrink-0 w-4 text-left">{heAlpha[subi]}.</span>
                                      <input value={sub.title} onChange={e => updTSubTitle(ti, si, subi, e.target.value)}
                                        placeholder="תת סעיף..."
                                        className="flex-1 bg-transparent text-xs text-gray-600 focus:outline-none placeholder-gray-400 text-right min-w-0"
                                        dir="rtl" />
                                      <button
                                        onClick={() => setTPermTarget(subPermActive ? null : {
                                          id: sub.id,
                                          label: `הרשאות תת סעיף ${heAlpha[subi]}`,
                                          permissions: sub.permissions,
                                          onChangeApprovers: v => updTSubPerms(ti, si, subi, { ...sub.permissions, approvers: v }),
                                          onChangeEditors:   v => updTSubPerms(ti, si, subi, { ...sub.permissions, editors: v }),
                                        })}
                                        title="הרשאות"
                                        className={`p-0.5 rounded transition-colors flex-shrink-0 ${subPermActive ? 'text-[#1B3A6B] bg-[#EEF4FF]' : subHasPerms ? 'text-[#1B3A6B]' : 'text-gray-300 hover:text-[#1B3A6B] hover:bg-[#EEF4FF]'}`}>
                                        <User className="w-3 h-3" />
                                      </button>
                                      <button onClick={() => delTSub(ti, si, subi)} className="p-0.5 rounded text-gray-400 hover:text-[#1B3A6B] hover:bg-[#EEF4FF] transition-colors flex-shrink-0">
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                  );
                                })}
                              </div>
                            )}
                            <button onClick={() => addTSub(ti, si)}
                              className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-[#1B3A6B] mt-1 pr-4 transition-colors">
                              <Plus className="w-3 h-3" />
                              תת סעיף
                            </button>
                          </div>
                          );
                        })}
                        <button onClick={() => addTSection(ti)}
                          className="flex items-center gap-1 text-[11px] text-[#1B3A6B] hover:text-[#152e54] mt-1 pr-1 font-medium transition-colors">
                          <Plus className="w-3 h-3" />
                          הוספת סעיף
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom: appendices + emphasis */}
                <div className="pt-2 border-t border-gray-100 space-y-2 mt-auto">
                  {tAppendices.map((app, ai) => {
                    const appHasPerms = app.permissions.approvers.length > 0 || app.permissions.editors.length > 0;
                    const appPermActive = tPermTarget?.id === app.id;
                    return (
                    <div key={app.id} className="flex items-center gap-1 px-2 py-1.5 bg-white border border-gray-100 rounded-lg shadow-sm">
                      <span className="text-[10px] text-gray-500 font-semibold flex-shrink-0">נספח {heAlpha[ai]}.</span>
                      <input value={app.title} onChange={e => setTAppendices(p => p.map((a,i) => i!==ai?a:{...a,title:e.target.value}))}
                        placeholder="שם הנספח..."
                        className="flex-1 bg-transparent text-xs focus:outline-none placeholder-gray-400 text-right min-w-0"
                        dir="rtl" />
                      <button
                        onClick={() => setTPermTarget(appPermActive ? null : {
                          id: app.id,
                          label: `הרשאות נספח ${heAlpha[ai]}`,
                          permissions: app.permissions,
                          onChangeApprovers: v => updTAppPerms(ai, { ...app.permissions, approvers: v }),
                          onChangeEditors:   v => updTAppPerms(ai, { ...app.permissions, editors: v }),
                        })}
                        title="הרשאות"
                        className={`p-0.5 rounded transition-colors flex-shrink-0 ${appPermActive ? 'text-[#1B3A6B] bg-[#EEF4FF]' : appHasPerms ? 'text-[#1B3A6B]' : 'text-gray-300 hover:text-[#1B3A6B] hover:bg-[#EEF4FF]'}`}>
                        <User className="w-3 h-3" />
                      </button>
                      <button onClick={() => setTAppendices(p => p.filter((_,i) => i!==ai))} className="p-0.5 rounded text-gray-400 hover:text-[#1B3A6B] hover:bg-[#EEF4FF] transition-colors flex-shrink-0">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    );
                  })}
                  <button onClick={addTAppendix}
                    className="flex items-center gap-1.5 w-full px-3 py-1.5 text-gray-500 hover:text-gray-800 border border-dashed border-gray-300 rounded-xl text-xs hover:bg-gray-50 transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                    הוספת נספח
                  </button>
                  {tHasEmphasis ? (
                    <div className="flex items-center justify-between px-2 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
                      <span className="text-[11px] text-amber-700 font-medium">דגשים לכתיבה</span>
                      <button onClick={() => { setTHasEmphasis(false); setTEmphasis(''); }} className="p-0.5 rounded text-amber-400 hover:text-amber-600 hover:bg-amber-100 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setTHasEmphasis(true)}
                      className="flex items-center gap-1.5 w-full px-3 py-1.5 text-gray-500 hover:text-gray-800 border border-dashed border-gray-300 rounded-xl text-xs hover:bg-gray-50 transition-colors">
                      <Plus className="w-3.5 h-3.5" />
                      הוספת דגשים לכתיבת המסמך
                    </button>
                  )}
                </div>

                </div>
                )}

                {/* ── Fixed bottom: title bar — only when fields are collapsed ── */}
                {!(fieldsExpanded && tTemplateFields.length > 0) && (
                <div className="flex-shrink-0 border-t-2 border-[#1B3A6B]/10 bg-[#FAFAFA]">
                  <div className="px-3 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Database className="w-3 h-3 text-[#1B3A6B]" />
                      <span className="text-[11px] font-bold text-[#1B3A6B]">ייבוא מידע ממערכת מקור</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {tTemplateFields.length > 0 && (
                        <button
                          onClick={() => setFieldsExpanded(p => !p)}
                          className="p-0.5 text-[#1B3A6B]/40 hover:text-[#1B3A6B] transition-colors"
                          title={fieldsExpanded ? 'חזור לנושאים' : 'הצג שדות'}>
                          <ChevronDown className="w-3.5 h-3.5 rotate-180 transition-transform duration-200" />
                        </button>
                      )}
                      <button onClick={() => setShowFieldBankPicker(true)}
                        className="p-0.5 text-[#1B3A6B]/50 hover:text-[#1B3A6B] transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
                )}

              </div>

              {/* Left panel — live document preview */}
              <div className="flex-1 flex flex-col overflow-hidden bg-white">
              {/* Word-style toolbar */}
              <div className="flex-shrink-0 flex items-center gap-0.5 px-3 py-1.5 flex-wrap border-b border-gray-200 bg-[#fafafa]" style={{ direction: 'rtl' }}>
                <button title="מודגש" className="flex items-center justify-center p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600" style={{ minWidth: 28, minHeight: 28 }}><Bold className="w-3.5 h-3.5" /></button>
                <button title="נטוי" className="flex items-center justify-center p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600" style={{ minWidth: 28, minHeight: 28 }}><Italic className="w-3.5 h-3.5" /></button>
                <button title="קו תחתון" className="flex items-center justify-center p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600" style={{ minWidth: 28, minHeight: 28 }}><Underline className="w-3.5 h-3.5" /></button>
                <button title="קו חוצה" className="flex items-center justify-center p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600" style={{ minWidth: 28, minHeight: 28 }}><Strikethrough className="w-3.5 h-3.5" /></button>
                <span style={{ width: 1, height: 18, background: '#d1d5db', margin: '0 4px', flexShrink: 0 }} />
                <button title="צבע טקסט" className="flex flex-col items-center justify-center p-1.5 rounded hover:bg-gray-200 transition-colors flex-shrink-0" style={{ minWidth: 28, minHeight: 28 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#374151', lineHeight: 1 }}>A</span>
                  <span style={{ width: 16, height: 3, borderRadius: 1, background: '#dc2626', marginTop: 2 }} />
                </button>
                <button title="צבע מרקר" className="flex flex-col items-center justify-center p-1.5 rounded hover:bg-gray-200 transition-colors flex-shrink-0" style={{ minWidth: 28, minHeight: 28 }}>
                  <Highlighter className="w-3.5 h-3.5 text-gray-600" />
                  <span style={{ width: 16, height: 3, borderRadius: 1, background: '#fde047', marginTop: 2 }} />
                </button>
                <span style={{ width: 1, height: 18, background: '#d1d5db', margin: '0 4px', flexShrink: 0 }} />
                <button title="יישור לימין" className="flex items-center justify-center p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600" style={{ minWidth: 28, minHeight: 28 }}><AlignRight className="w-3.5 h-3.5" /></button>
                <button title="מרכוז" className="flex items-center justify-center p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600" style={{ minWidth: 28, minHeight: 28 }}><AlignCenter className="w-3.5 h-3.5" /></button>
                <button title="יישור לשמאל" className="flex items-center justify-center p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600" style={{ minWidth: 28, minHeight: 28 }}><AlignLeft className="w-3.5 h-3.5" /></button>
                <button title="יישור לשני הצדדים" className="flex items-center justify-center p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600" style={{ minWidth: 28, minHeight: 28 }}><AlignJustify className="w-3.5 h-3.5" /></button>
                <span style={{ width: 1, height: 18, background: '#d1d5db', margin: '0 4px', flexShrink: 0 }} />
                <button title="הגדל הזחה" className="flex items-center justify-center p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600" style={{ minWidth: 28, minHeight: 28 }}><Indent className="w-3.5 h-3.5" /></button>
                <button title="הקטן הזחה" className="flex items-center justify-center p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600" style={{ minWidth: 28, minHeight: 28 }}><Outdent className="w-3.5 h-3.5" /></button>
                <span style={{ width: 1, height: 18, background: '#d1d5db', margin: '0 4px', flexShrink: 0 }} />
                <button title="RTL" className="flex items-center justify-center p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600" style={{ minWidth: 28, minHeight: 28 }}><PilcrowRight className="w-3.5 h-3.5" /></button>
                <button title="LTR" className="flex items-center justify-center p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600" style={{ minWidth: 28, minHeight: 28 }}><PilcrowLeft className="w-3.5 h-3.5" /></button>
                <span style={{ width: 1, height: 18, background: '#d1d5db', margin: '0 4px', flexShrink: 0 }} />
                <button title="הפניה" className="flex items-center justify-center p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600" style={{ minWidth: 28, minHeight: 28 }}><Superscript className="w-3.5 h-3.5" /></button>
                <button title="קובץ מצורף" className="flex items-center justify-center p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600" style={{ minWidth: 28, minHeight: 28 }}><Paperclip className="w-3.5 h-3.5" /></button>
                <button title="טבלה" className="flex items-center justify-center p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600" style={{ minWidth: 28, minHeight: 28 }}><Table2 className="w-3.5 h-3.5" /></button>
                <button title="מילוי רקע" className="flex items-center justify-center p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600" style={{ minWidth: 28, minHeight: 28 }}><PaintBucket className="w-3.5 h-3.5" /></button>
                <button title="מברשת עיצוב" className="flex items-center justify-center p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600" style={{ minWidth: 28, minHeight: 28 }}><PaintRoller className="w-3.5 h-3.5" /></button>
                <button title="נקה עיצוב" className="flex items-center justify-center p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600" style={{ minWidth: 28, minHeight: 28 }}><RemoveFormatting className="w-3.5 h-3.5" /></button>
              </div>
              {/* Scrollable document content */}
              <div className="flex-1 overflow-y-auto">
                {tTopics.length === 0 && tAppendices.length === 0 && !tHasEmphasis ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <FileText className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                      <p className="text-sm text-gray-400">הוסף נושאים מהסייד בר לבניית התבנית</p>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-2xl mx-auto px-10 py-8 space-y-6">
                    {tTopics.map((topic, ti) => (
                      <div key={topic.id}>
                        {/* Topic heading — editable, synced with sidebar */}
                        <div className="border-b-2 border-gray-800 pb-1 mb-4 group">
                          <input
                            value={topic.title}
                            onChange={e => updTTopicTitle(ti, e.target.value)}
                            placeholder={`נושא ${ti + 1}`}
                            dir="rtl"
                            className="w-full bg-transparent text-base font-bold text-gray-900 text-right focus:outline-none placeholder-gray-300 rounded px-1 hover:bg-gray-50 focus:bg-gray-50 transition-colors"
                          />
                        </div>
                        {/* Sections */}
                        {topic.sections.map((sec, si) => (
                          <div key={sec.id} className="mb-5 pr-4">
                            {/* Section title — editable */}
                            <div className="flex items-baseline gap-1 mb-2">
                              <span className="text-[#1B3A6B] text-sm font-bold flex-shrink-0">{si + 1}.</span>
                              <input
                                value={sec.title}
                                onChange={e => updTSecTitle(ti, si, e.target.value)}
                                placeholder="שם הסעיף"
                                dir="rtl"
                                className="flex-1 bg-transparent text-sm font-semibold text-gray-800 text-right focus:outline-none placeholder-gray-300 rounded px-1 hover:bg-gray-50 focus:bg-gray-50 transition-colors"
                              />
                            </div>
                            <ContentEditor
                              value={sec.content}
                              onChange={v => updTSecContent(ti, si, v)}
                              placeholder="מלל קבוע לסעיף (אופציונלי)..."
                              rows={2}
                            />
                            {/* Subsections */}
                            {sec.subsections.map((sub, subi) => (
                              <div key={sub.id} className="mb-3 pr-5">
                                {/* Subsection title — editable */}
                                <div className="flex items-baseline gap-1 mb-1.5">
                                  <span className="text-gray-500 text-xs font-bold flex-shrink-0">{heAlpha[subi]}.</span>
                                  <input
                                    value={sub.title}
                                    onChange={e => updTSubTitle(ti, si, subi, e.target.value)}
                                    placeholder="שם תת הסעיף"
                                    dir="rtl"
                                    className="flex-1 bg-transparent text-xs font-semibold text-gray-700 text-right focus:outline-none placeholder-gray-300 rounded px-1 hover:bg-gray-50 focus:bg-gray-50 transition-colors"
                                  />
                                </div>
                                <ContentEditor
                                  value={sub.content}
                                  onChange={v => updTSubContent(ti, si, subi, v)}
                                  placeholder="מלל קבוע (אופציונלי)..."
                                  rows={2}
                                />
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    ))}
                    {/* Appendices */}
                    {tAppendices.map((app, ai) => (
                      <div key={app.id} className="border-t border-dashed border-gray-200 pt-5">
                        {/* Appendix title — editable */}
                        <div className="flex items-baseline gap-1 mb-2">
                          <span className="text-gray-500 text-sm font-semibold flex-shrink-0">נספח {heAlpha[ai]}.</span>
                          <input
                            value={app.title}
                            onChange={e => setTAppendices(p => p.map((a,i) => i!==ai ? a : {...a, title: e.target.value}))}
                            placeholder="שם הנספח"
                            dir="rtl"
                            className="flex-1 bg-transparent text-sm font-semibold text-gray-800 text-right focus:outline-none placeholder-gray-300 rounded px-1 hover:bg-gray-50 focus:bg-gray-50 transition-colors"
                          />
                        </div>
                        <ContentEditor
                          value={app.content}
                          onChange={v => setTAppendices(p => p.map((a,i) => i!==ai?a:{...a,content:v}))}
                          placeholder="תוכן הנספח..."
                          rows={3}
                        />
                      </div>
                    ))}
                    {/* Emphasis */}
                    {tHasEmphasis && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-2">
                        <p className="text-xs font-bold text-amber-700 mb-2 text-right">דגשים לכתיבה:</p>
                        <textarea value={tEmphasis} onChange={e => setTEmphasis(e.target.value)}
                          placeholder="הזן דגשים לכתיבת המסמך..."
                          className="w-full text-xs text-gray-700 bg-transparent focus:outline-none resize-none"
                          rows={3} dir="rtl" />
                      </div>
                    )}
                  </div>
                )}
              </div>
              </div>{/* end flex-col left panel */}
            </div>

            {/* ── Footer ── */}
            <div className="flex-shrink-0 px-8 py-4 border-t border-gray-100 flex justify-end">
              {(() => {
                const isDupBlocked = templateDuplicateMode && templateName === templateOriginalName;
                const isEditBlocked = templateEditMode && !templateDirty;
                const isDisabled = isDupBlocked || isEditBlocked;
                const label = templateDuplicateMode ? 'שכפל' : templateEditMode ? 'שמור שינויים' : 'צור תבנית';
                return (
                  <button
                    onClick={() => { if (isDisabled) return; setShowNewTemplate(false); resetNewTemplate(); }}
                    disabled={isDisabled}
                    className={`px-8 py-2.5 rounded-xl font-medium text-sm transition-colors ${isDisabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#1B3A6B] text-white hover:bg-[#152e54]'}`}>
                    {label}
                  </button>
                );
              })()}
            </div>

            {/* ── Import from source system floating card ── */}
            {showFieldBankPicker && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 10 }}>
                <div dir="rtl" className="pointer-events-auto bg-white rounded-2xl border border-gray-200 w-[680px] max-w-[90%]"
                  style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.04)' }}
                  onMouseDown={e => e.stopPropagation()}>
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-[#EEF4FF] rounded-t-2xl">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-[#1B3A6B]" />
                      <span className="text-sm font-semibold text-[#1B3A6B]">ייבוא ממערכת מקור</span>
                    </div>
                    <button onClick={() => setShowFieldBankPicker(false)}
                      className="p-1.5 rounded-lg hover:bg-[#1B3A6B]/10 transition-colors text-[#1B3A6B]/60 hover:text-[#1B3A6B]">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {/* Picker */}
                  <DynamicFieldPicker
                    existingFields={tTemplateFields}
                    onAdd={newFields => {
                      setTTemplateFields(p => [...p, ...newFields]);
                      setFieldsExpanded(true);
                    }}
                    onRemove={id => setTTemplateFields(p => p.filter(f => f.id !== id))}
                    onClose={() => setShowFieldBankPicker(false)}
                  />
                </div>
              </div>
            )}

            {tPermTarget && (
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ zIndex: 10 }}
              >
                <div
                  ref={tPermCardRef}
                  dir="rtl"
                  className="pointer-events-auto bg-white rounded-2xl border border-gray-200 w-[640px] max-w-[90%]"
                  style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.04)' }}
                  onMouseDown={e => e.stopPropagation()}
                >
                  {/* Card header */}
                  <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-[#EEF4FF] rounded-t-2xl">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#1B3A6B]" />
                      <span className="text-sm font-semibold text-[#1B3A6B]">{tPermTarget.label}</span>
                    </div>
                    <button
                      onClick={() => setTPermTarget(null)}
                      className="p-1.5 rounded-lg hover:bg-[#1B3A6B]/10 transition-colors text-[#1B3A6B]/60 hover:text-[#1B3A6B]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {/* Card body */}
                  <div>
                    <PermissionsPanel
                      showApprovers={templateApprovalDefault === 'allow'}
                      approvers={tPermTarget.permissions.approvers}
                      editors={tPermTarget.permissions.editors}
                      onChangeApprovers={v => {
                        tPermTarget.onChangeApprovers(v);
                        setTPermTarget(prev => prev ? { ...prev, permissions: { ...prev.permissions, approvers: v } } : null);
                      }}
                      onChangeEditors={v => {
                        tPermTarget.onChangeEditors(v);
                        setTPermTarget(prev => prev ? { ...prev, permissions: { ...prev.permissions, editors: v } } : null);
                      }}
                    />
                  </div>
                  {/* Card footer — ביטול left / אישור right (RTL: first child = rightmost) */}
                  <div className="flex items-center justify-between px-5 pb-4">
                    <button
                      onClick={() => setTPermTarget(null)}
                      className="px-5 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      ביטול
                    </button>
                    <button
                      onClick={() => setTPermTarget(null)}
                      className="px-5 py-2 bg-[#1B3A6B] text-white rounded-xl text-sm font-medium hover:bg-[#152e54] transition-colors"
                    >
                      אישור
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* New Signature Modal */}
      {showNewSignature && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[9998]"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => { setShowNewSignature(false); setSignatureType(null); setSignatureEditMode(false); setSignatureDuplicateMode(false); setSignatureDirty(false); }}
        >
          <div className="bg-white rounded-3xl shadow-2xl w-[700px] max-w-[95vw] max-h-[90vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()} dir="rtl">
            {/* Header — sticky */}
            <div className="flex-shrink-0 flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">{signatureDuplicateMode ? 'שכפול חתימה' : signatureEditMode ? 'עריכת חתימה' : 'חתימה חדשה'}</h2>
              <button onClick={() => { setShowNewSignature(false); setSignatureType(null); setSignatureEditMode(false); setSignatureDuplicateMode(false); setSignatureDirty(false); }} className="text-gray-600 hover:text-gray-900 text-2xl">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto">
            {/* Type segmented control */}
            <div className="px-8 mb-6">
              <div className="flex rounded-xl overflow-hidden border border-gray-200">
                {([{ key: 'distribution', label: 'חתימה להפצה', soon: false }, { key: 'personal', label: 'חתימה אישית במסמך', soon: false }, { key: 'approver', label: 'חתימת מאשר', soon: true }] as const).map(({ key, label, soon }, i, arr) => (
                  <div key={key} className="relative group flex-1">
                    <button
                      type="button"
                      onClick={() => { if (!soon) { setSignatureType(key); setSignatureDirty(true); } }}
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
                onChange={() => setSignatureDirty(true)}
              />
              <div>
                <input type="file" accept="image/*" className="hidden" id="signature-upload" />
                <label htmlFor="signature-upload" className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                  <Download className="w-4 h-4" />
                  <span>העלאת תמונת חתימה</span>
                </label>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button onClick={() => { setShowNewSignature(false); setSignatureType(null); setSignatureEditMode(false); setSignatureDuplicateMode(false); setSignatureDirty(false); }} className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">ביטול</button>
                {(() => {
                  const isEditBlocked = signatureEditMode && !signatureDirty;
                  const isDisabled = isEditBlocked;
                  const label = signatureDuplicateMode ? 'שכפל' : signatureEditMode ? 'שמור שינויים' : 'שמור חתימה';
                  return (
                    <button
                      onClick={() => { if (isDisabled) return; setShowNewSignature(false); setSignatureType(null); setSignatureEditMode(false); setSignatureDuplicateMode(false); setSignatureDirty(false); }}
                      disabled={isDisabled}
                      className={`px-6 py-2 rounded-xl transition-colors ${isDisabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#1B3A6B] text-white hover:bg-[#152e54]'}`}>
                      {label}
                    </button>
                  );
                })()}
              </div>
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
          onClick={() => { setShowNewList(false); setListName(''); setListEditMode(false); setListDuplicateMode(false); setListOriginalName(''); setListDirty(false); setListMembers([]); setActiveFilters([]); setListImportPanel(null); setListImportTab(null); setListDocSelected(new Set()); setListDocAdded(new Set()); setHamalSelected(new Set()); setHamalAdded(new Set()); setHamalExtraMembers({}); setShowCreateHamal(false); }}
        >
          <div
            className="relative bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            style={{ width: '1140px', maxWidth: '96vw', height: '90vh' }}
            onClick={e => e.stopPropagation()}
            dir="rtl"
          >
            {/* ── Header ── */}
            <div className="flex-shrink-0 flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">{listDuplicateMode ? 'שכפול רשימת תפוצה' : listEditMode ? 'עריכת רשימת תפוצה' : 'רשימת תפוצה חדשה'}</h2>
              <button
                onClick={() => { setShowNewList(false); setListName(''); setListEditMode(false); setListDuplicateMode(false); setListOriginalName(''); setListDirty(false); setListMembers([]); setActiveFilters([]); setListImportPanel(null); setListImportTab(null); setListDocSelected(new Set()); setListDocAdded(new Set()); setHamalSelected(new Set()); setHamalAdded(new Set()); setHamalExtraMembers({}); setShowCreateHamal(false); }}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* ── Body: two-column layout ── */}
            <div className="flex-1 flex overflow-hidden">

              {/* ══ RIGHT PANEL ══ */}
              <div className="w-[700px] flex-shrink-0 flex flex-col border-l border-gray-100 overflow-hidden">

                {/* Form fields — fixed */}
                <div className="flex-shrink-0 px-5 py-4 border-b border-gray-100 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1 text-right">שם רשימת התפוצה</label>
                    <input type="text" value={listName} onChange={e => { setListName(e.target.value); setListDirty(true); }} placeholder="הזן שם רשימה..."
                      className={`w-full px-3 py-2 border rounded-xl text-sm text-right focus:outline-none focus:border-[#1B3A6B] bg-white transition-colors ${listDuplicateMode && listName === listOriginalName ? 'border-amber-400 bg-amber-50' : 'border-gray-200'}`} />
                    {listDuplicateMode && listName === listOriginalName && (
                      <p className="text-[11px] text-amber-600 mt-1 text-right">יש לשנות את שם הרשימה לפני השכפול</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1 text-right">בחירת אגף</label>
                    <CustomSelect placeholder="בחר אגף..." options={['מחלקת משאבי אנוש', 'מחלקת כספים', 'מחלקת טכנולוגיה', 'מחלקת תפעול']} />
                  </div>
                </div>

                {/* chips row — fixed */}
                <div className="px-4 pt-3 pb-3 flex-shrink-0" dir="rtl">
                  <p className="text-[11px] text-gray-400 mb-2 font-medium">ייבוא ממקורות נוספים</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {([
                      { key: 'network'  as const, label: 'הוסף מרשתות',   Icon: Network  },
                      { key: 'doc'      as const, label: 'ממסמך קיים',    Icon: FileText },
                      { key: 'hamal'    as const, label: 'קבוצות חמ"ל',   Icon: Users    },
                      { key: 'miraz'    as const, label: "קבוצות מיראז'", Icon: Layers   },
                      { key: 'personal' as const, label: 'אזור אישי',      Icon: List     },
                    ]).map(({ key, label, Icon }) => {
                      const active = listImportTab === key;
                      return (
                        <button key={key} type="button"
                          onClick={() => { setListImportTab(active ? null : key); setListSearchQuery(''); setListSearchOpen(false); if (!active && key !== 'network') setListSearchNetworkFilter('sodibioti'); }}
                          className={`flex items-center gap-1.5 flex-1 px-2.5 py-2 rounded-xl border transition-all text-right ${active ? '' : 'border-gray-100 bg-gray-50/60 hover:bg-white hover:border-gray-200 hover:shadow-sm'}`}
                          style={active ? { background: '#1B3A6B07', borderColor: '#1B3A6B35', boxShadow: '0 1px 3px rgba(27,58,107,0.08)' } : undefined}>
                          <div className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={active ? { background: '#1B3A6B18' } : { background: 'white', border: '1px solid #f3f4f6' }}>
                            <Icon className="w-2.5 h-2.5" style={{ color: active ? '#1B3A6B' : '#9ca3af' }} />
                          </div>
                          <span className="text-[11px] font-semibold truncate" style={{ color: active ? '#1B3A6B' : '#374151' }}>{label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* fixed search + conditional buttons */}
                <div className="px-4 pb-3 flex-shrink-0 flex items-center gap-2" dir="rtl">
                  <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input type="text" autoComplete="new-password"
                      value={listSearchQuery}
                      onChange={e => { setListSearchQuery(e.target.value); setListSearchOpen(true); if (listImportTab === null) setListImportTab('network'); }}
                      onFocus={() => { if (listSearchQuery.trim()) setListSearchOpen(true); if (listImportTab === null) setListImportTab('network'); }}
                      onBlur={() => setTimeout(() => setListSearchOpen(false), 150)}
                      placeholder="הוספה או חיפוש לפי שם או ת.ז..."
                      dir="rtl"
                      className={`w-full pr-9 py-2.5 border border-gray-200 rounded-xl text-right text-sm focus:outline-none focus:border-[#1B3A6B] bg-white transition-colors ${listImportTab === 'doc' ? 'pl-9' : 'pl-4'}`} />
                    {/* Search results dropdown — only for network/null mode */}
                    {listSearchOpen && listSearchQuery.trim() !== '' && (listImportTab === 'network' || listImportTab === null) && (() => {
                      const pool = NETWORK_PEOPLE.filter(p => p.network === listSearchNetworkFilter);
                      const results = pool
                        .map(p => ({ id: p.id, name: p.name, idNumber: p.idNumber, environment: p.environment, subLabel: p.networkLabel }))
                        .filter(p => p.name.includes(listSearchQuery) || p.idNumber.includes(listSearchQuery))
                        .filter(p => !listMembers.some(m => m.id === p.id));
                      return (
                        <div className="absolute top-full right-0 left-0 mt-1.5 z-[9999] rounded-xl border border-gray-100 bg-white shadow-lg overflow-hidden" dir="rtl">
                          {results.length === 0
                            ? <div className="py-5 text-center text-sm text-gray-400">לא נמצאו תוצאות</div>
                            : results.map(person => (
                              <button key={person.id} type="button"
                                onMouseDown={() => { setListMembers(prev => [...prev, { ...person }]); setListSearchQuery(''); setListSearchOpen(false); setListDirty(true); }}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 text-right">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-800 truncate">{person.name}</p>
                                  <p className="text-xs text-gray-400">{person.idNumber}</p>
                                </div>
                                <Plus className="w-4 h-4 text-gray-300 flex-shrink-0" />
                              </button>
                            ))
                          }
                        </div>
                      );
                    })()}
                    {listImportTab === 'doc' && (
                      <button ref={listDocFilterBtnRef} type="button"
                        onClick={() => {
                          if (!listDocFilterOpen && listDocFilterBtnRef.current) {
                            const r = listDocFilterBtnRef.current.getBoundingClientRect();
                            setListDocFilterPos({ top: r.bottom + 6, left: r.left - 268 });
                          }
                          setListDocFilterOpen(o => !o);
                        }}
                        className={`absolute left-2.5 top-1/2 -translate-y-1/2 transition-colors ${(listDocTypeFilter.length || listDocStatusFilter.length || listDocOrgFilter.length || listDocDateFrom || listDocDateTo) ? 'text-[#1B3A6B]' : 'text-gray-400 hover:text-gray-600'}`}>
                        <Filter className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  {listImportTab === 'network' && (
                    <button ref={manualAddBtnRef} type="button"
                      onClick={() => {
                        if (!manualAddOpen && manualAddBtnRef.current) {
                          const r = manualAddBtnRef.current.getBoundingClientRect();
                          setManualAddPos({ top: r.bottom + 6, left: r.left - 260 + r.width });
                        }
                        setManualAddOpen(o => !o);
                        setManualAddUsername(''); setManualAddDisplayName('');
                      }}
                      className="flex items-center gap-1 px-3 py-2 text-xs rounded-xl font-semibold transition-colors whitespace-nowrap flex-shrink-0 bg-[#1B3A6B] text-white hover:bg-[#152e54]">
                      <Plus className="w-3.5 h-3.5" />
                      הוספה ידנית
                    </button>
                  )}
                </div>

                {/* Tab content — flex-1 scrollable */}
                <div className="flex-1 overflow-y-auto border-t border-gray-100">

                  {/* ── NETWORK TAB ── */}
                  {listImportTab === 'network' && (
                    <div className="flex flex-col h-full" dir="rtl">
                      {/* network sub-tabs */}
                      <div className="flex items-center border-b border-gray-100 px-4 flex-shrink-0">
                        {([['sodibioti', 'סודי ביותר'], ['sodi', 'סודי'], ['aman', 'אמ"ן']] as const).map(([val, label]) => (
                          <button key={val} type="button"
                            onClick={() => { setListSearchNetworkFilter(val); setListSearchQuery(''); setListSearchOpen(false); }}
                            className={`relative pb-2.5 pt-3 pl-4 text-sm font-semibold transition-colors whitespace-nowrap ${listSearchNetworkFilter === val ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
                            {label}
                            {listSearchNetworkFilter === val && <span className="absolute bottom-0 right-0 left-0 h-0.5 rounded-full bg-gray-900" />}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center justify-center flex-1">
                        <p className="text-xs text-gray-400">חפש לפי שם או ת.ז. להוספה</p>
                      </div>
                    </div>
                  )}

                  {/* hint when nothing selected */}
                  {listImportTab === null && (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-xs text-gray-400">בחר מקור ייבוא או חפש לפי שם</p>
                    </div>
                  )}

                  {/* ── DOC TAB ── */}
                  {listImportTab === 'doc' && (
                    <div className="flex flex-col h-full">
                      {/* Sub-tabs */}
                      <div className="flex items-center border-b border-gray-100 px-4 bg-gray-50/50 flex-shrink-0">
                        {(['distributed', 'drafts'] as const).map(tab => (
                          <button key={tab} type="button" onClick={() => setListDocTab(tab)}
                            className="relative px-4 py-3 text-xs focus:outline-none transition-colors"
                            style={{ color: listDocTab === tab ? '#111827' : '#9ca3af', fontWeight: listDocTab === tab ? 600 : 400 }}>
                            {tab === 'drafts' ? 'טיוטות' : 'פקודות שהופצו'}
                            {listDocTab === tab && <span className="absolute bottom-0 right-4 left-4 h-[2px] rounded-full bg-gray-900" />}
                          </button>
                        ))}
                      </div>
                      {/* Filter popover */}
                      {listDocFilterOpen && listDocFilterPos && (() => {
                            const docTypes = Array.from(new Set(LIST_DOCS_DATA.map(d => d.docType)));
                            const statuses = Array.from(new Set(LIST_DOCS_DATA.map(d => d.status)));
                            const orgs    = Array.from(new Set(LIST_DOCS_DATA.map(d => d.environment)));
                            const hasActive = listDocTypeFilter.length || listDocStatusFilter.length || listDocOrgFilter.length || listDocDateFrom || listDocDateTo;
                            return (
                              <div ref={listDocFilterRef} className="fixed bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-[99999] w-72 overflow-y-auto" dir="rtl"
                                style={{ top: listDocFilterPos.top, left: listDocFilterPos.left, maxHeight: `calc(100vh - ${listDocFilterPos.top}px - 16px)` }}>
                                <ImportFilterSection title="סוג מסמך" options={docTypes} selected={listDocTypeFilter} onChange={setListDocTypeFilter} searchable />
                                <div className="my-2 border-t border-gray-100" />
                                <ImportFilterSection title="סטטוס" options={statuses} selected={listDocStatusFilter} onChange={setListDocStatusFilter} />
                                <div className="my-2 border-t border-gray-100" />
                                <ImportFilterSection title="ארגון" options={orgs} selected={listDocOrgFilter} onChange={setListDocOrgFilter} searchable />
                                <div className="my-2 border-t border-gray-100" />
                                <div>
                                  <p className="text-xs font-semibold text-gray-400 px-4 pb-1.5 uppercase tracking-wide">תאריך עדכון</p>
                                  <div className="px-3 flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs text-gray-400 w-5 flex-shrink-0 text-right">מ-</span>
                                      <div className="flex-1">
                                        <DatePicker value={listDocDateFrom} onChange={setListDocDateFrom} placeholder="מ-" />
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs text-gray-400 w-5 flex-shrink-0 text-right">עד</span>
                                      <div className="flex-1">
                                        <DatePicker value={listDocDateTo} onChange={setListDocDateTo} placeholder="עד" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {hasActive && (
                                  <>
                                    <div className="my-2 border-t border-gray-100" />
                                    <div className="px-3">
                                      <button type="button"
                                        onClick={() => { setListDocTypeFilter([]); setListDocStatusFilter([]); setListDocOrgFilter([]); setListDocDateFrom(''); setListDocDateTo(''); }}
                                        className="w-full py-1.5 text-xs font-medium text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                                        נקה הכל
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            );
                          })()}
                      {/* Active filter chips */}
                      {(listDocTypeFilter.length > 0 || listDocStatusFilter.length > 0 || listDocOrgFilter.length > 0 || listDocDateFrom || listDocDateTo) && (
                        <div className="flex flex-wrap gap-1.5 px-4 pb-2">
                            {listDocTypeFilter.map(v => (
                              <span key={v} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
                                style={{ background: '#EEF4FF', color: '#1B3A6B', borderColor: '#c7d9ff' }}>
                                {v}
                                <button type="button" onClick={() => setListDocTypeFilter(p => p.filter(x => x !== v))}><X className="w-3 h-3" /></button>
                              </span>
                            ))}
                            {listDocStatusFilter.map(v => (
                              <span key={v} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
                                style={{ background: '#EEF4FF', color: '#1B3A6B', borderColor: '#c7d9ff' }}>
                                {v}
                                <button type="button" onClick={() => setListDocStatusFilter(p => p.filter(x => x !== v))}><X className="w-3 h-3" /></button>
                              </span>
                            ))}
                            {listDocOrgFilter.map(v => (
                              <span key={v} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
                                style={{ background: '#EEF4FF', color: '#1B3A6B', borderColor: '#c7d9ff' }}>
                                {v}
                                <button type="button" onClick={() => setListDocOrgFilter(p => p.filter(x => x !== v))}><X className="w-3 h-3" /></button>
                              </span>
                            ))}
                            {listDocDateFrom && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
                                style={{ background: '#EEF4FF', color: '#1B3A6B', borderColor: '#c7d9ff' }}>
                                מ- {listDocDateFrom}
                                <button type="button" onClick={() => setListDocDateFrom('')}><X className="w-3 h-3" /></button>
                              </span>
                            )}
                            {listDocDateTo && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
                                style={{ background: '#EEF4FF', color: '#1B3A6B', borderColor: '#c7d9ff' }}>
                                עד {listDocDateTo}
                                <button type="button" onClick={() => setListDocDateTo('')}><X className="w-3 h-3" /></button>
                              </span>
                            )}
                          </div>
                        )}
                      {/* Table header */}
                      {(() => {
                        const docGrid = '28px 1fr 64px 58px 48px 70px 80px 58px 24px';
                        const filteredDocs = LIST_DOCS_DATA.filter(doc =>
                          (listSearchQuery === '' || doc.name.includes(listSearchQuery)) &&
                          (listDocTypeFilter.length === 0 || listDocTypeFilter.includes(doc.docType)) &&
                          (listDocStatusFilter.length === 0 || listDocStatusFilter.includes(doc.status)) &&
                          (listDocOrgFilter.length === 0 || listDocOrgFilter.includes(doc.environment))
                        );
                        return (
                          <>
                            <div className="flex-shrink-0 grid items-center px-3 py-2 text-[10px] font-semibold text-gray-500 select-none"
                              style={{ background: '#EBEBEB', gridTemplateColumns: docGrid, columnGap: '6px' }}>
                              <span />
                              <span className="text-right">שם מסמך</span>
                              <span className="text-center">מס׳ פקודה</span>
                              <span className="text-center">מס׳ עדכון</span>
                              <span className="text-center">סוג</span>
                              <span className="text-center">ארגון</span>
                              <span className="text-center">תאריך עדכון</span>
                              <span className="text-center">מס׳ סימוכין</span>
                              <span />
                            </div>
                            {/* Doc list */}
                            <div className="flex-1 overflow-y-auto">
                              {filteredDocs.length === 0 ? (
                                <div className="py-10 text-center text-sm text-gray-400">לא נמצאו תוצאות</div>
                              ) : filteredDocs.map(doc => {
                                const isSelected = listDocSelected.has(doc.id);
                                const isAdded   = listDocAdded.has(doc.id);
                                const isExpanded = listDocExpanded === doc.id;
                                return (
                                  <div key={doc.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                                    <div
                                      className={`grid items-center px-3 py-2.5 transition-colors ${isAdded ? 'cursor-default' : isSelected ? 'bg-[#EEF4FF] cursor-pointer' : 'hover:bg-gray-50 cursor-pointer'}`}
                                      style={{ gridTemplateColumns: docGrid, columnGap: '6px', borderRight: isSelected ? '3px solid #1B3A6B' : '3px solid transparent' }}
                                    >
                                      <button type="button"
                                        disabled={isAdded}
                                        onClick={() => { if (isAdded) return; const next = new Set(listDocSelected); if (isSelected) next.delete(doc.id); else next.add(doc.id); setListDocSelected(next); }}
                                        className={`w-5 h-5 rounded border-[1.5px] flex items-center justify-center transition-colors ${isAdded ? 'bg-white border-gray-200 cursor-default' : isSelected ? 'bg-[#1B3A6B] border-[#1B3A6B]' : 'border-gray-300 hover:border-[#1B3A6B]'}`}>
                                        {isAdded && <Check className="w-3.5 h-3.5 text-gray-300" strokeWidth={2.5} />}
                                        {isSelected && !isAdded && <Check className="w-3 h-3 text-white" />}
                                      </button>
                                      <span className="text-right text-xs font-medium text-gray-800 truncate">
                                        {doc.name}
                                        <span className="font-normal text-gray-400 mr-1">({doc.distribution.length})</span>
                                      </span>
                                      <span className="text-center text-xs text-gray-600">{doc.cmdNum}</span>
                                      <span className="text-center text-xs text-gray-600">{doc.update}</span>
                                      <span className="text-center text-xs text-gray-600">{doc.docType}</span>
                                      <span className="text-center text-xs text-gray-600">{doc.environment}</span>
                                      <span className="text-center text-xs text-gray-500">{doc.lastUpdate}</span>
                                      <span className="text-center text-xs text-gray-400">{doc.refNum}</span>
                                      <button type="button" onClick={() => setListDocExpanded(isExpanded ? null : doc.id)}
                                        className="flex items-center justify-center w-5 h-5">
                                        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                      </button>
                                    </div>
                                    {isExpanded && (
                                      <div className="bg-blue-50/40 border-t border-blue-100 py-1">
                                        {/* Header — same grid as parent */}
                                        <div className="grid items-center px-3 py-1 text-[10px] font-semibold text-gray-400 select-none"
                                          style={{ gridTemplateColumns: '28px 1fr 64px 58px 48px 70px 80px 58px 24px', columnGap: '6px' }}>
                                          <span /><span className="text-right">שם מלא</span>
                                          <span className="text-center">תעודת זהות</span>
                                          <span />
                                          <span className="text-center">ארגון</span>
                                        </div>
                                        {doc.distribution.map((person, i) => (
                                          <div key={i} className="grid items-center px-3 py-1.5 border-b border-blue-100/40 last:border-0"
                                            style={{ gridTemplateColumns: '28px 1fr 64px 58px 48px 70px 80px 58px 24px', columnGap: '6px' }}>
                                            <span />
                                            <span className="text-right text-[11px] font-medium text-gray-700 truncate">{person.name}</span>
                                            <span className="text-center text-[11px] text-gray-500 tabular-nums">{person.idNumber}</span>
                                            <span />
                                            <span className="text-center text-[11px] text-gray-500">{person.environment}</span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </>
                        );
                      })()}
                      {/* Import bar */}
                      {listDocSelected.size > 0 && (
                        <div className="flex-shrink-0 px-4 py-3 border-t border-gray-100 bg-white flex items-center justify-between">
                          <span className="text-xs text-gray-500">{listDocSelected.size} מסמכים נבחרו</span>
                          <button type="button"
                            onClick={() => {
                              const toAdd = LIST_DOCS_DATA.filter(doc => listDocSelected.has(doc.id)).flatMap(doc => doc.distribution);
                              setListMembers(prev => {
                                const existingIds = new Set(prev.map(m => m.idNumber));
                                return [...prev, ...toAdd.filter(p => !existingIds.has(p.idNumber)).map(p => ({ id: `imp-${p.idNumber}`, name: p.name, idNumber: p.idNumber, environment: p.environment }))];
                              });
                              setListDocAdded(prev => { const next = new Set(prev); listDocSelected.forEach(id => next.add(id)); return next; });
                              setListDocSelected(new Set()); setListDirty(true);
                            }}
                            className="px-4 py-1.5 bg-[#1B3A6B] text-white text-xs font-medium rounded-lg hover:bg-[#152e54] transition-colors">
                            הוסף לרשימה
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── HAMAL TAB ── */}
                  {listImportTab === 'hamal' && (() => {
                    const filteredHamal = HAMAL_GROUPS.filter(g =>
                      g.name.includes(listSearchQuery) || g.type.includes(listSearchQuery) || g.environment.includes(listSearchQuery)
                    );
                    const allFilteredIds = filteredHamal.map(g => g.id);
                    const allSelected = allFilteredIds.length > 0 && allFilteredIds.every(id => hamalSelected.has(id));
                    return (
                      <div className="flex flex-col h-full">
                        {/* Create group floating panel — rendered via portal below */}
                        {/* Table — CSS grid like doc tab */}
                        <div className="flex-1 overflow-y-auto">
                          {/* Header row */}
                          <div className="sticky top-0 grid items-center px-3 py-2 text-[10px] font-semibold text-gray-500 select-none z-10"
                            style={{ background: '#EBEBEB', gridTemplateColumns: '28px 1fr 28px 28px', columnGap: '6px' }}>
                            <span />
                            <span className="text-right">שם הקבוצה</span>
                            <span />
                            <span />
                          </div>
                          {/* Rows */}
                          {filteredHamal.length === 0 ? (
                            <div className="px-3 py-8 text-center text-sm text-gray-400">לא נמצאו קבוצות</div>
                          ) : filteredHamal.map(group => {
                            const isGroupSelected = hamalSelected.has(group.id);
                            const isGroupAdded   = hamalAdded.has(group.id);
                            const isGroupExpanded = hamalExpanded === group.id;
                            return (
                              <div key={group.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                                {/* Group row */}
                                <div
                                  className={`grid items-center px-3 py-2.5 transition-colors ${isGroupAdded ? 'cursor-default' : isGroupSelected ? 'bg-[#EEF4FF] cursor-pointer' : 'hover:bg-gray-50 cursor-pointer'}`}
                                  style={{ gridTemplateColumns: '28px 1fr 28px 28px', columnGap: '6px' }}
                                  onClick={() => !isGroupAdded && setHamalExpanded(isGroupExpanded ? null : group.id)}
                                >
                                  <div className="flex items-center justify-center" onClick={e => e.stopPropagation()}>
                                    <button type="button"
                                      disabled={isGroupAdded}
                                      onClick={() => { if (isGroupAdded) return; setHamalSelected(prev => { const next = new Set(prev); next.has(group.id) ? next.delete(group.id) : next.add(group.id); return next; }); }}
                                      className={`w-5 h-5 rounded border-[1.5px] flex items-center justify-center transition-colors ${isGroupAdded ? 'bg-white border-gray-200 cursor-default' : isGroupSelected ? 'bg-[#1B3A6B] border-[#1B3A6B]' : 'border-gray-300 hover:border-[#1B3A6B]'}`}>
                                      {isGroupAdded && <Check className="w-3.5 h-3.5 text-gray-300" strokeWidth={2.5} />}
                                      {isGroupSelected && !isGroupAdded && <Check className="w-3 h-3 text-white" />}
                                    </button>
                                  </div>
                                  <span className="text-right text-xs font-medium text-gray-800 truncate">
                                    {group.name}
                                    <span className="font-normal text-gray-400 mr-1">({group.members.length + (hamalExtraMembers[group.id]?.length ?? 0)})</span>
                                  </span>
                                  <button type="button"
                                    onClick={e => {
                                      e.stopPropagation();
                                      const r = e.currentTarget.getBoundingClientRect();
                                      setHamalAddMemberPos({ top: r.bottom + 6, left: r.left - 260 + r.width });
                                      setHamalAddMemberGroupId(hamalAddMemberGroupId === group.id ? null : group.id);
                                      setHamalAddMemberSearch('');
                                    }}
                                    className="flex items-center justify-center w-5 h-5 rounded hover:bg-blue-100 transition-colors">
                                    <Plus className={`w-3.5 h-3.5 transition-colors ${hamalAddMemberGroupId === group.id ? 'text-[#1B3A6B]' : 'text-gray-400 hover:text-[#1B3A6B]'}`} />
                                  </button>
                                  <div className="flex items-center justify-center">
                                    <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-150 ${isGroupExpanded ? 'rotate-180' : ''}`} />
                                  </div>
                                </div>
                                {/* Expanded members */}
                                {isGroupExpanded && (
                                  <div className="bg-blue-50/40 border-t border-blue-100 py-1">
                                    {/* Member sub-header — same grid as docGrid so TZ/org align with doc tab */}
                                    <div className="grid items-center px-3 py-1 text-[10px] font-semibold text-gray-400 select-none"
                                      style={{ gridTemplateColumns: '28px 1fr 64px 58px 48px 70px 80px 58px 24px', columnGap: '6px' }}>
                                      <span />
                                      <span className="text-right">שם מלא</span>
                                      <span className="text-center">תעודת זהות</span>
                                      <span /><span className="text-center">ארגון</span>
                                    </div>
                                    {[...group.members, ...(hamalExtraMembers[group.id] ?? [])].map((m, mi) => (
                                      <div key={mi} className="grid items-center px-3 py-1.5 border-b border-blue-100/40 last:border-0"
                                        style={{ gridTemplateColumns: '28px 1fr 64px 58px 48px 70px 80px 58px 24px', columnGap: '6px' }}>
                                        <span />
                                        <span className="text-right text-[11px] font-medium text-gray-700 truncate">{m.name}</span>
                                        <span className="text-center text-[11px] text-gray-500 tabular-nums">{m.idNumber}</span>
                                        <span />
                                        <span className="text-center text-[11px] text-gray-500">{m.environment}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        {/* Import bar */}
                        {hamalSelected.size > 0 && (
                          <div className="flex-shrink-0 px-4 py-3 border-t border-gray-100 bg-white flex items-center justify-between">
                            <span className="text-xs text-gray-500">{hamalSelected.size} קבוצות נבחרו</span>
                            <button type="button"
                              onClick={() => {
                                const groupsToAdd = HAMAL_GROUPS.filter(g => hamalSelected.has(g.id));
                                setListMembers(prev => {
                                  const existingIds = new Set(prev.map(m => m.id));
                                  return [...prev, ...groupsToAdd.filter(g => !existingIds.has(`hml-${g.id}`)).map(g => ({ id: `hml-${g.id}`, name: g.name, idNumber: '', environment: g.environment, isGroup: true, groupType: g.type, groupMembers: g.members }))];
                                });
                                setHamalAdded(prev => { const next = new Set(prev); hamalSelected.forEach(id => next.add(id)); return next; });
                                setHamalSelected(new Set());
                                setHamalSearch(''); setListDirty(true);
                              }}
                              className="px-4 py-1.5 bg-[#1B3A6B] text-white text-xs font-medium rounded-lg hover:bg-[#152e54] transition-colors">
                              הוסף לרשימה
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* ── MIRAZ TAB ── */}
                  {listImportTab === 'miraz' && (() => {
                    const filteredMiraz = MIRAZ_GROUPS.filter(g =>
                      g.name.includes(listSearchQuery) || g.type.includes(listSearchQuery) || g.environment.includes(listSearchQuery)
                    );
                    return (
                      <div className="flex flex-col h-full">
                        {/* Groups list */}
                        <div className="flex-1 overflow-y-auto">
                          {/* Header */}
                          <div className="sticky top-0 grid items-center px-3 py-2 text-[10px] font-semibold text-gray-500 select-none z-10"
                            style={{ background: '#EBEBEB', gridTemplateColumns: '28px 1fr 28px', columnGap: '6px' }}>
                            <span />
                            <span className="text-right">שם הקבוצה</span>
                            <span />
                          </div>
                          {filteredMiraz.length === 0 ? (
                            <div className="px-3 py-8 text-center text-sm text-gray-400">לא נמצאו קבוצות</div>
                          ) : filteredMiraz.map(group => {
                            const isSelected = mirazSelected.has(group.id);
                            const isAdded    = mirazAdded.has(group.id);
                            const isExpanded = mirazExpanded === group.id;
                            return (
                              <div key={group.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                                {/* Group row */}
                                <div
                                  className={`grid items-center px-3 py-2.5 transition-colors cursor-pointer ${isAdded ? 'cursor-default' : isSelected ? 'bg-[#EEF4FF]' : 'hover:bg-gray-50'}`}
                                  style={{ gridTemplateColumns: '28px 1fr 28px', columnGap: '6px' }}
                                  onClick={() => !isAdded && setMirazExpanded(isExpanded ? null : group.id)}
                                >
                                  <div className="flex items-center justify-center" onClick={e => e.stopPropagation()}>
                                    <button type="button"
                                      disabled={isAdded}
                                      onClick={() => { if (isAdded) return; setMirazSelected(prev => { const next = new Set(prev); next.has(group.id) ? next.delete(group.id) : next.add(group.id); return next; }); }}
                                      className={`w-5 h-5 rounded border-[1.5px] flex items-center justify-center transition-colors ${isAdded ? 'bg-white border-gray-200 cursor-default' : isSelected ? 'bg-[#1B3A6B] border-[#1B3A6B]' : 'border-gray-300 hover:border-[#1B3A6B]'}`}>
                                      {isAdded && <Check className="w-3.5 h-3.5 text-gray-300" strokeWidth={2.5} />}
                                      {isSelected && !isAdded && <Check className="w-3 h-3 text-white" />}
                                    </button>
                                  </div>
                                  <span className="text-right text-xs font-medium text-gray-800 truncate">
                                    {group.name}
                                    <span className="font-normal text-gray-400 mr-1">({group.members.length})</span>
                                  </span>
                                  <div className="flex items-center justify-center">
                                    <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-150 ${isExpanded ? 'rotate-180' : ''}`} />
                                  </div>
                                </div>
                                {/* Expanded members */}
                                {isExpanded && (
                                  <div className="bg-blue-50/40 border-t border-blue-100 py-1">
                                    <div className="grid items-center px-3 py-1 text-[10px] font-semibold text-gray-400 select-none"
                                      style={{ gridTemplateColumns: '28px 1fr 64px 58px 48px 70px 80px 58px 24px', columnGap: '6px' }}>
                                      <span />
                                      <span className="text-right">שם מלא</span>
                                      <span className="text-center">תעודת זהות</span>
                                      <span /><span className="text-center">ארגון</span>
                                    </div>
                                    {group.members.map((m, mi) => (
                                      <div key={mi} className="grid items-center px-3 py-1.5 border-b border-blue-100/40 last:border-0"
                                        style={{ gridTemplateColumns: '28px 1fr 64px 58px 48px 70px 80px 58px 24px', columnGap: '6px' }}>
                                        <span />
                                        <span className="text-right text-[11px] font-medium text-gray-700 truncate">{m.name}</span>
                                        <span className="text-center text-[11px] text-gray-500 tabular-nums">{m.idNumber}</span>
                                        <span />
                                        <span className="text-center text-[11px] text-gray-500">{m.environment}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        {/* Import bar */}
                        {mirazSelected.size > 0 && (
                          <div className="flex-shrink-0 px-4 py-3 border-t border-gray-100 bg-white flex items-center justify-between">
                            <span className="text-xs text-gray-500">{mirazSelected.size} קבוצות נבחרו</span>
                            <button type="button"
                              onClick={() => {
                                const groupsToAdd = MIRAZ_GROUPS.filter(g => mirazSelected.has(g.id));
                                setListMembers(prev => {
                                  const existingIds = new Set(prev.map(m => m.id));
                                  return [...prev, ...groupsToAdd.filter(g => !existingIds.has(`mrz-${g.id}`)).map(g => ({ id: `mrz-${g.id}`, name: g.name, idNumber: '', environment: g.environment, isGroup: true, groupType: g.type, groupMembers: g.members }))];
                                });
                                setMirazAdded(prev => { const next = new Set(prev); mirazSelected.forEach(id => next.add(id)); return next; });
                                setMirazSelected(new Set());
                                setMirazSearchQuery(''); setListDirty(true);
                              }}
                              className="px-4 py-1.5 bg-[#1B3A6B] text-white text-xs font-medium rounded-lg hover:bg-[#152e54] transition-colors">
                              הוסף לרשימה
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* ── PERSONAL TAB ── */}
                  {listImportTab === 'personal' && (() => {
                    const personalGrid = '28px 1fr 24px';
                    const filteredPersonal = PERSONAL_LISTS.filter(l =>
                      l.tab === personalListTab &&
                      (listSearchQuery === '' || l.name.includes(listSearchQuery))
                    );
                    return (
                      <div className="flex flex-col h-full">
                        {/* Sub-tabs */}
                        <div className="flex items-center border-b border-gray-100 px-4 bg-gray-50/50 flex-shrink-0">
                          {(['mine', 'all'] as const).map(tab => (
                            <button key={tab} type="button" onClick={() => setPersonalListTab(tab)}
                              className="relative px-4 py-3 text-xs focus:outline-none transition-colors"
                              style={{ color: personalListTab === tab ? '#111827' : '#9ca3af', fontWeight: personalListTab === tab ? 600 : 400 }}>
                              {tab === 'mine' ? 'רשימות של המכלול שלי' : 'כלל רשימות התפוצה'}
                              {personalListTab === tab && <span className="absolute bottom-0 right-4 left-4 h-[2px] rounded-full bg-gray-900" />}
                            </button>
                          ))}
                        </div>
                        {/* Table header */}
                        <div className="flex-shrink-0 grid items-center px-3 py-2 text-[10px] font-semibold text-gray-500 select-none"
                          style={{ background: '#EBEBEB', gridTemplateColumns: personalGrid, columnGap: '6px' }}>
                          <span />
                          <span className="text-right">שם הרשימה</span>
                          <span />
                        </div>
                        {/* Rows */}
                        <div className="flex-1 overflow-y-auto">
                          {filteredPersonal.length === 0 ? (
                            <div className="py-10 text-center text-sm text-gray-400">לא נמצאו רשימות</div>
                          ) : filteredPersonal.map(list => {
                            const isSelected = personalListSelected.has(list.id);
                            const isAdded    = personalListAdded.has(list.id);
                            const isExpanded = personalListExpanded === list.id;
                            return (
                              <div key={list.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                                <div
                                  className={`grid items-center px-3 py-2.5 transition-colors ${isAdded ? 'cursor-default' : isSelected ? 'bg-[#EEF4FF] cursor-pointer' : 'hover:bg-gray-50 cursor-pointer'}`}
                                  style={{ gridTemplateColumns: personalGrid, columnGap: '6px', borderRight: isSelected ? '3px solid #1B3A6B' : '3px solid transparent' }}
                                >
                                  <button type="button"
                                    disabled={isAdded}
                                    onClick={() => { if (isAdded) return; setPersonalListSelected(prev => { const next = new Set(prev); next.has(list.id) ? next.delete(list.id) : next.add(list.id); return next; }); }}
                                    className={`w-5 h-5 rounded border-[1.5px] flex items-center justify-center transition-colors ${isAdded ? 'bg-white border-gray-200 cursor-default' : isSelected ? 'bg-[#1B3A6B] border-[#1B3A6B]' : 'border-gray-300 hover:border-[#1B3A6B]'}`}>
                                    {isAdded && <Check className="w-3.5 h-3.5 text-gray-300" strokeWidth={2.5} />}
                                    {isSelected && !isAdded && <Check className="w-3 h-3 text-white" />}
                                  </button>
                                  <span className="text-right text-xs font-medium text-gray-800 truncate">
                                    {list.name}
                                    <span className="font-normal text-gray-400 mr-1">({list.members.length})</span>
                                  </span>
                                  <button type="button" onClick={() => setPersonalListExpanded(isExpanded ? null : list.id)}
                                    className="flex items-center justify-center w-5 h-5">
                                    <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                  </button>
                                </div>
                                {isExpanded && (
                                  <div className="bg-blue-50/40 border-t border-blue-100 py-1">
                                    <div className="grid items-center px-3 py-1 text-[10px] font-semibold text-gray-400 select-none"
                                      style={{ gridTemplateColumns: '28px 1fr 64px 58px 48px 70px 80px 58px 24px', columnGap: '6px' }}>
                                      <span /><span className="text-right">שם מלא</span>
                                      <span className="text-center">תעודת זהות</span>
                                      <span /><span className="text-center">ארגון</span>
                                    </div>
                                    {list.members.map((m, mi) => (
                                      <div key={mi} className="grid items-center px-3 py-1.5 border-b border-blue-100/40 last:border-0"
                                        style={{ gridTemplateColumns: '28px 1fr 64px 58px 48px 70px 80px 58px 24px', columnGap: '6px' }}>
                                        <span />
                                        <span className="text-right text-[11px] font-medium text-gray-700 truncate">{m.name}</span>
                                        <span className="text-center text-[11px] text-gray-500 tabular-nums">{m.idNumber}</span>
                                        <span />
                                        <span className="text-center text-[11px] text-gray-500">{m.environment}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        {/* Import bar */}
                        {personalListSelected.size > 0 && (
                          <div className="flex-shrink-0 px-4 py-3 border-t border-gray-100 bg-white flex items-center justify-between">
                            <span className="text-xs text-gray-500">{personalListSelected.size} רשימות נבחרו</span>
                            <button type="button"
                              onClick={() => {
                                const toAdd = PERSONAL_LISTS.filter(l => personalListSelected.has(l.id)).flatMap(l => l.members);
                                setListMembers(prev => {
                                  const existingIds = new Set(prev.map(m => m.idNumber));
                                  return [...prev, ...toAdd.filter(p => !existingIds.has(p.idNumber)).map(p => ({ id: `prs-${p.idNumber}`, name: p.name, idNumber: p.idNumber, environment: p.environment }))];
                                });
                                setPersonalListAdded(prev => { const next = new Set(prev); personalListSelected.forEach(id => next.add(id)); return next; });
                                setPersonalListSelected(new Set()); setListDirty(true);
                              }}
                              className="px-4 py-1.5 bg-[#1B3A6B] text-white text-xs font-medium rounded-lg hover:bg-[#152e54] transition-colors">
                              הוסף לרשימה
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })()}


                </div>
              </div>

              {/* ══ LEFT PANEL (flex-1) ══ */}
              <div className="flex-1 flex flex-col overflow-hidden">

                {/* Sub-header */}
                <div className="flex-shrink-0 flex items-center justify-between px-6 py-3.5 border-b border-gray-100 bg-gray-50/50">
                  <span className="text-sm font-semibold text-gray-800">רשימת אנשים {listMembers.length > 0 && <span className="font-normal text-gray-500">({listMembers.length})</span>}</span>
                </div>

                {/* Members table */}
                {(() => {
                  const membersGrid = '28px 1fr 1fr 1fr 32px';
                  return (
                  <div className="flex-1 overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 grid items-center px-3 py-2 text-[10px] font-semibold text-gray-500 select-none z-10"
                      style={{ background: '#EBEBEB', gridTemplateColumns: membersGrid, columnGap: '6px' }}>
                      <span />
                      <span className="text-right">שם מלא</span>
                      <span className="text-center">תעודת זהות</span>
                      <span className="text-center">ארגון</span>
                      <span />
                    </div>
                    {/* Rows */}
                    {listMembers.length === 0 ? (
                      <div className="px-4 py-16 text-center">
                        <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-400 text-sm">הוסף אנשים לרשימה באמצעות<br />החיפוש או ייבוא מהפאנל הימני</p>
                      </div>
                    ) : listMembers.map(member => (
                      member.isGroup ? (
                        <div key={member.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                          {/* Group row */}
                          <div
                            className="grid items-center px-3 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors"
                            style={{ gridTemplateColumns: membersGrid, columnGap: '6px' }}
                            onClick={() => setMemberGroupExpanded(memberGroupExpanded === member.id ? null : member.id)}
                          >
                            <div className="flex items-center justify-center">
                              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-150 ${memberGroupExpanded === member.id ? 'rotate-180' : ''}`} />
                            </div>
                            <span className="text-right text-xs font-medium text-gray-800 truncate">{member.name}</span>
                            <span className="text-center text-xs text-gray-400">—</span>
                            <span className="text-center text-xs text-gray-600">{member.environment}</span>
                            <button onClick={e => { e.stopPropagation(); confirmDelete(() => { setListMembers(prev => prev.filter(m => m.id !== member.id)); if (memberGroupExpanded === member.id) setMemberGroupExpanded(null); setListDirty(true); }); }}
                              className="flex items-center justify-center p-1 rounded transition-colors hover:text-[#1B3A6B]">
                              <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-[#1B3A6B]" />
                            </button>
                          </div>
                          {/* Expanded members */}
                          {memberGroupExpanded === member.id && (
                            <div className="bg-blue-50/40 border-t border-blue-100 py-1">
                              <div className="grid items-center px-3 py-1 text-[10px] font-semibold text-gray-400 select-none"
                                style={{ gridTemplateColumns: '28px 1fr 90px 90px', columnGap: '6px' }}>
                                <span /><span className="text-right">שם מלא</span>
                                <span className="text-center">תעודת זהות</span>
                                <span className="text-center">ארגון</span>
                              </div>
                              {(member.groupMembers ?? []).map((gm, gi) => (
                                <div key={gi} className="grid items-center px-3 py-1.5 border-b border-blue-100/40 last:border-0"
                                  style={{ gridTemplateColumns: '28px 1fr 90px 90px', columnGap: '6px' }}>
                                  <span />
                                  <span className="text-right text-[11px] font-medium text-gray-700 truncate">{gm.name}</span>
                                  <span className="text-center text-[11px] text-gray-500 tabular-nums">{gm.idNumber}</span>
                                  <span className="text-center text-[11px] text-gray-500">{gm.environment}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Individual person row */
                        <div key={member.id} className="grid items-center px-3 py-2.5 hover:bg-gray-50 transition-colors"
                          style={{ gridTemplateColumns: membersGrid, columnGap: '6px', borderBottom: '1px solid #f5f5f5' }}>
                          <span />
                          <div className="text-right min-w-0">
                            <p className="text-xs font-medium text-gray-800 truncate">{member.name}</p>
                            {member.subLabel && <p className="text-[10px] text-gray-400 truncate">{member.subLabel}</p>}
                          </div>
                          <span className="text-center text-xs text-gray-600 tabular-nums">{member.idNumber}</span>
                          <span className="text-center text-xs text-gray-600">{member.environment}</span>
                          <button onClick={() => confirmDelete(() => { setListMembers(prev => prev.filter(m => m.id !== member.id)); setListDirty(true); })}
                            className="flex items-center justify-center p-1 rounded transition-colors hover:text-[#1B3A6B]">
                            <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-[#1B3A6B]" />
                          </button>
                        </div>
                      )
                    ))}
                  </div>
                  );
                })()}
              </div>
            </div>

            {/* ── Footer ── */}
            <div className="flex-shrink-0 flex items-center justify-between px-8 py-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => { setShowNewList(false); setListName(''); setListEditMode(false); setListDuplicateMode(false); setListOriginalName(''); setListDirty(false); setListMembers([]); setActiveFilters([]); setListImportPanel(null); setListImportTab(null); setListDocSelected(new Set()); setListDocAdded(new Set()); setHamalSelected(new Set()); setHamalAdded(new Set()); setHamalExtraMembers({}); setShowCreateHamal(false); }}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                ביטול
              </button>
              {(() => {
                const isDupBlocked = listDuplicateMode && listName === listOriginalName;
                const isEditBlocked = listEditMode && !listDirty;
                const isDisabled = isDupBlocked || isEditBlocked;
                const label = listDuplicateMode ? 'שכפל' : listEditMode ? 'שמור שינויים' : 'צור רשימה';
                const closeAll = () => { setShowNewList(false); setListName(''); setListEditMode(false); setListDuplicateMode(false); setListOriginalName(''); setListDirty(false); setListMembers([]); setActiveFilters([]); setListImportPanel(null); setListImportTab(null); setListDocSelected(new Set()); setListDocAdded(new Set()); setHamalSelected(new Set()); setHamalAdded(new Set()); setHamalExtraMembers({}); setShowCreateHamal(false); };
                return (
                  <button
                    type="button"
                    disabled={isDisabled}
                    onClick={() => { if (isDisabled) return; closeAll(); }}
                    className={`px-6 py-2.5 rounded-xl transition-colors text-sm font-medium ${isDisabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#1B3A6B] text-white hover:bg-[#152e54]'}`}
                  >
                    {label}
                  </button>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ── Hamal: Create Group floating panel ── */}
      {showCreateHamal && hamalCreatePos && (
        <div ref={hamalCreatePanelRef} dir="rtl"
          className="fixed bg-white rounded-2xl shadow-xl border border-gray-100 z-[99999] flex flex-col"
          style={{ top: hamalCreatePos.top, left: hamalCreatePos.left, width: 320, maxHeight: `calc(100vh - ${hamalCreatePos.top}px - 16px)` }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-4 pb-2 flex-shrink-0">
            <h3 className="text-sm font-semibold text-gray-800">קבוצה חדשה</h3>
            <button type="button" onClick={() => setShowCreateHamal(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          {/* Name */}
          <div className="px-3 pb-2 flex-shrink-0">
            <label className="block text-[11px] font-semibold text-gray-500 mb-1">שם הקבוצה</label>
            <input type="text" value={newHamalName} onChange={e => setNewHamalName(e.target.value)}
              placeholder="הזן שם קבוצה..." autoComplete="new-password"
              className="w-full pr-3 pl-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#1B3A6B] transition-colors text-right" dir="rtl" />
          </div>
          {/* Member search */}
          <div className="px-3 pb-2 flex-shrink-0">
            <div className="relative">
              <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              <input type="text" value={newHamalMemberSearch}
                onChange={e => setNewHamalMemberSearch(e.target.value)}
                placeholder="חפש לפי שם או ת.ז..." autoComplete="new-password"
                className="w-full pr-8 pl-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#1B3A6B] transition-colors text-right" dir="rtl" />
            </div>
            {/* Dropdown results */}
            {newHamalMemberSearch && (() => {
              const results = LIST_PEOPLE_POOL.filter(p =>
                (p.name.includes(newHamalMemberSearch) || p.idNumber.includes(newHamalMemberSearch)) &&
                !newHamalPicked.some(pk => pk.idNumber === p.idNumber)
              ).slice(0, 8);
              return results.length > 0 ? (
                <div className="mt-0.5 bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden" style={{ maxHeight: 160 }}>
                  <div className="overflow-y-auto" style={{ maxHeight: 160 }}>
                    {results.map(p => (
                      <button key={p.id} type="button"
                        onClick={() => { setNewHamalPicked(prev => [...prev, { name: p.name, idNumber: p.idNumber, environment: p.environment }]); setNewHamalMemberSearch(''); }}
                        className="w-full px-3 py-2 hover:bg-gray-50 text-[11px] text-right border-b border-gray-50 last:border-0" dir="rtl">
                        <span className="font-medium text-gray-800">{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null;
            })()}
          </div>
          {/* Added members list */}
          {newHamalPicked.length > 0 && (
            <div className="flex-1 overflow-y-auto border-t border-gray-100">
              <p className="px-3 py-1.5 text-[10px] font-semibold text-gray-400 select-none" style={{ background: '#f5f5f5' }}>
                נוספו לקבוצה
              </p>
              {newHamalPicked.map((m, i) => (
                <div key={i} dir="ltr" className="flex items-center gap-2 px-3 py-1.5 border-b border-gray-50 last:border-0">
                  <button type="button" onClick={() => setNewHamalPicked(prev => prev.filter((_, j) => j !== i))}
                    className="p-0.5 hover:text-[#1B3A6B] transition-colors flex-shrink-0">
                    <Trash2 className="w-3 h-3 text-gray-300" />
                  </button>
                  <span className="flex-1 text-[11px] font-medium text-gray-800 text-right">{m.name}</span>
                </div>
              ))}
            </div>
          )}
          {/* Footer */}
          <div className="flex gap-2 px-3 py-2.5 border-t border-gray-100 flex-shrink-0">
            <button type="button" onClick={() => setShowCreateHamal(false)}
              className="flex-1 py-1.5 rounded-xl text-[11px] font-semibold border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">ביטול</button>
            <button type="button" disabled={!newHamalName.trim()}
              onClick={() => { setShowCreateHamal(false); setNewHamalName(''); setNewHamalPicked([]); }}
              className="flex-1 py-1.5 rounded-xl text-[11px] font-semibold bg-[#1B3A6B] text-white hover:bg-[#152e54] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">צור קבוצה</button>
          </div>
        </div>
      )}

      {/* ── Hamal: Add member to group floating panel ── */}
      {hamalAddMemberGroupId && hamalAddMemberPos && (() => {
        const targetGroup = HAMAL_GROUPS.find(g => g.id === hamalAddMemberGroupId);
        const existingIds = new Set([...(targetGroup?.members ?? []).map(m => m.idNumber), ...(hamalExtraMembers[hamalAddMemberGroupId] ?? []).map(m => m.idNumber)]);
        const results = LIST_PEOPLE_POOL.filter(p =>
          (p.name.includes(hamalAddMemberSearch) || p.idNumber.includes(hamalAddMemberSearch)) &&
          !existingIds.has(p.idNumber)
        ).slice(0, 8);
        return (
          <div ref={hamalAddMemberPanelRef} dir="rtl"
            className="fixed bg-white rounded-2xl shadow-xl border border-gray-100 z-[99999]"
            style={{ top: hamalAddMemberPos.top, left: hamalAddMemberPos.left, width: 280 }}>
            <div className="px-3 pt-3 pb-2">
              <p className="text-[11px] font-semibold text-gray-500 mb-2">הוסף משתמש ל{targetGroup?.name}</p>
              <div className="relative">
                <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                <input type="text" value={hamalAddMemberSearch} onChange={e => setHamalAddMemberSearch(e.target.value)}
                  autoFocus placeholder="חפש לפי שם או ת.ז..." autoComplete="new-password"
                  className="w-full pr-8 pl-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#1B3A6B] transition-colors text-right" dir="rtl" />
              </div>
            </div>
            {hamalAddMemberSearch && (
              <div className="border-t border-gray-100 overflow-hidden">
                {results.length === 0 ? (
                  <p className="px-3 py-3 text-xs text-gray-400 text-center">לא נמצאו תוצאות</p>
                ) : results.map(p => (
                  <button key={p.id} type="button"
                    onClick={() => {
                      setHamalExtraMembers(prev => ({ ...prev, [hamalAddMemberGroupId]: [...(prev[hamalAddMemberGroupId] ?? []), { name: p.name, idNumber: p.idNumber, environment: p.environment }] }));
                      setHamalAddMemberSearch('');
                    }}
                    className="w-full flex items-center justify-start px-3 py-2 hover:bg-gray-50 text-xs border-b border-gray-50 last:border-0" dir="rtl">
                    <span className="font-medium text-gray-800">{p.name}</span>
                  </button>
                ))}
              </div>
            )}
            {/* Added members list */}
            {(hamalExtraMembers[hamalAddMemberGroupId] ?? []).length > 0 && (
              <div className="border-t border-gray-100">
                <p className="px-3 py-1.5 text-[10px] font-semibold text-gray-400 select-none" style={{ background: '#f5f5f5' }}>
                  נוספו לקבוצה
                </p>
                {(hamalExtraMembers[hamalAddMemberGroupId] ?? []).map((m, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-1.5 border-b border-gray-50 last:border-0">
                    <div className="flex-1 flex items-center gap-2">
                      <span className="text-[11px] font-medium text-gray-800">{m.name}</span>
                    </div>
                    <button type="button" onClick={() => setHamalExtraMembers(prev => ({ ...prev, [hamalAddMemberGroupId]: prev[hamalAddMemberGroupId].filter((_, j) => j !== i) }))}
                      className="p-0.5 hover:text-[#1B3A6B] transition-colors flex-shrink-0">
                      <Trash2 className="w-3 h-3 text-gray-300" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {/* Footer buttons */}
            <div className="flex gap-2 px-3 py-2.5 border-t border-gray-100">
              <button type="button"
                onClick={() => { setHamalAddMemberGroupId(null); setHamalAddMemberPos(null); setHamalAddMemberSearch(''); }}
                className="flex-1 py-1.5 rounded-xl text-[11px] font-semibold border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
                ביטול
              </button>
              <button type="button"
                onClick={() => { setHamalAddMemberGroupId(null); setHamalAddMemberPos(null); setHamalAddMemberSearch(''); }}
                className="flex-1 py-1.5 rounded-xl text-[11px] font-semibold bg-[#1B3A6B] text-white hover:bg-[#152e54] transition-colors">
                אישור
              </button>
            </div>
          </div>
        );
      })()}

      {/* Manual Add Floating Panel */}
      {manualAddOpen && manualAddPos && (
        <div dir="rtl"
          className="fixed bg-white rounded-2xl shadow-xl border border-gray-100 z-[99999] flex flex-col"
          style={{ top: manualAddPos.top, left: manualAddPos.left, width: 280 }}>
          <div className="px-4 pt-4 pb-3">
            <p className="text-xs font-semibold text-gray-700 mb-3">הוספה ידנית</p>
            {/* Username + domain */}
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-[#1B3A6B] focus-within:ring-1 focus-within:ring-[#1B3A6B]/20 transition-colors mb-2.5" dir="ltr">
              <input
                type="text"
                value={manualAddUsername}
                onChange={e => setManualAddUsername(e.target.value)}
                placeholder="מזהה משתמש"
                dir="rtl"
                className="flex-1 min-w-0 px-2.5 py-2 text-xs focus:outline-none bg-white text-right"
              />
              <span className="px-2.5 py-2 text-xs text-gray-400 bg-gray-50 border-l border-gray-200 flex-shrink-0 select-none whitespace-nowrap">@army.idf.il</span>
            </div>
            {/* Display name */}
            <input
              type="text"
              value={manualAddDisplayName}
              onChange={e => setManualAddDisplayName(e.target.value)}
              placeholder="שם תצוגה"
              dir="rtl"
              className="w-full px-2.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B3A6B] focus:ring-1 focus:ring-[#1B3A6B]/20 transition-colors"
            />
          </div>
          {/* Actions */}
          <div className="flex gap-2 px-4 pb-4">
            <button type="button"
              onClick={() => { setManualAddOpen(false); setManualAddUsername(''); setManualAddDisplayName(''); }}
              className="flex-1 py-1.5 rounded-xl text-xs font-semibold border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
              ביטול
            </button>
            <button type="button"
              disabled={!manualAddUsername.trim() && !manualAddDisplayName.trim()}
              onClick={() => {
                const networkLabel = listSearchNetworkFilter === 'sodibioti' ? 'סודי ביותר' : listSearchNetworkFilter === 'sodi' ? 'מערכת סודי' : 'אמ"ן';
                const newId = `manual-${Date.now()}`;
                const name = manualAddDisplayName.trim() || manualAddUsername.trim();
                setListMembers(prev => [...prev, { id: newId, name, idNumber: manualAddUsername.trim(), environment: '', subLabel: networkLabel }]);
                setManualAddOpen(false); setManualAddUsername(''); setManualAddDisplayName(''); setListDirty(true);
              }}
              className="flex-1 py-1.5 rounded-xl text-xs font-semibold bg-[#1B3A6B] text-white hover:bg-[#152e54] transition-colors disabled:opacity-40">
              הוספה
            </button>
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
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-72" onClick={(e) => e.stopPropagation()} dir="rtl">
            <p className="text-sm font-semibold text-gray-800 text-center mb-1">{showDeleteConfirm?.label ? `בטוח שתרצה למחוק ${showDeleteConfirm.label}?` : 'האם אתה בטוח שברצונך למחוק?'}</p>
            <p className="text-xs text-gray-400 text-center mb-5">פעולה זו אינה ניתנת לביטול</p>
            <div className="flex gap-2">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">ביטול</button>
              <button onClick={() => { showDeleteConfirm?.onConfirm(); setShowDeleteConfirm(null); }} className="flex-1 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: '#1B3A6B' }}>אישור</button>
            </div>
          </div>
        </div>
      )}

      {/* Restore Confirmation */}
      {showRestoreConfirm && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[9999]"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setShowRestoreConfirm(null)}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-80" onClick={(e) => e.stopPropagation()} dir="rtl">
            <p className="text-center text-gray-900 mb-6">האם אתה בטוח שתרצה לשחזר תבנית זו?</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setShowRestoreConfirm(null)} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors">ביטול</button>
              <button onClick={() => { showRestoreConfirm?.onConfirm(); setShowRestoreConfirm(null); }} className="px-6 py-2 bg-[#1B3A6B] text-white rounded-xl hover:bg-[#152e54] transition-colors">שחזור</button>
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
