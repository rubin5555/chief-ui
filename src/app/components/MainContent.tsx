import { Search, FileText, FileEdit, SquarePen, ChevronLeft, Plus, ArrowUpLeft, Upload, Pencil, Copy, RefreshCw, Hash, X, Link2, Folder, ChevronDown, MoreHorizontal } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { NewDocModal } from '../pages/Catalog';
import { EditDocDetailsModal } from '../pages/Edit';

const ALL_DOCS = [
  { name: 'נהלי עבודה',            organization: 'ארגון א׳',  dept: 'מחלקת משאבי אנוש' },
  { name: 'דוחות שנתיים',          organization: 'ארגון ב׳',  dept: 'מחלקת כספים' },
  { name: 'מסמכי תקציב 2026',      organization: 'ארגון א׳',  dept: 'מחלקת כספים' },
  { name: 'נהלי בטיחות',           organization: 'ארגון ג׳',  dept: 'מחלקת משאבי אנוש' },
  { name: 'פקודת מבצע קיץ',        organization: 'הסביבה שלי', dept: 'מחלקת משאבי אנוש' },
  { name: 'פקודת בטיחות מרחב א׳',  organization: 'הסביבה שלי', dept: 'מחלקת משאבי אנוש' },
  { name: 'תקציב שנתי 2025',       organization: 'ארגון א׳',  dept: 'מחלקת כספים' },
  { name: 'נוהל גיוס עובדים',       organization: 'הסביבה שלי', dept: 'מחלקת משאבי אנוש' },
  { name: 'דוח רבעוני Q3',          organization: 'ארגון ב׳',  dept: 'מחלקת כספים' },
  { name: 'נוהל אבטחת מידע',        organization: 'הסביבה שלי', dept: 'מחלקת טכנולוגיה' },
  { name: 'תוכנית עבודה שנתית',     organization: 'ארגון א׳',  dept: 'מחלקת תפעול' },
  { name: 'פרוטוקול ועדת היגוי',    organization: 'ארגון ב׳',  dept: 'מחלקת טכנולוגיה' },
];

const RECENT_DOCS = [
  { name: 'מסמך נהלי עבודה',        organization: 'ארגון א׳',   type: 'פקודה',  when: 'אתמול, 14:32' },
  { name: 'פקודת בטיחות מרחב א׳',   organization: 'הסביבה שלי', type: 'הוראה',  when: 'לפני 3 ימים' },
  { name: 'חוזה העסקה',             organization: 'ארגון א׳',   type: 'מסמך',   when: 'לפני שבוע' },
];

const DISTRIBUTED_DOCS = [
  {
    name: 'פקודת מבצע קיץ 2026', organization: 'הסביבה שלי', type: 'פקודה', when: 'הופץ אתמול',
    from: 'לוח הפצה', to: 'לוח תפוצה', ref: '221047(06)2026',
    sections: [
      { title: 'מטרה ורקע', items: [
        { heading: '.1 מטרת המסמך', body: 'פקודה זו מגדירה את משימות הכוח לביצוע מבצע קיץ 2026 בגזרה הצפונית, תחת פיקוד מטכ״ל.' },
        { heading: '.2 היסטוריית גרסאות', body: 'גרסה 1.0 — ינואר 2026. גרסה 1.1 — מרץ 2026 (עדכון מרחב פעולה).' },
      ]},
      { title: 'הגדרות ומונחים', items: [
        { heading: '.3 הגדרות', body: 'גזרה צפונית: מרחב הפעולה כהגדרתו בנספח א׳. שעת H: שעת הפתיחה בפעולה המבצעית.' },
      ]},
      { title: 'נהלים ותהליכים', items: [
        { heading: '.4 שלבי הביצוע', body: 'שלב א׳ — תמרון משולב מ-0400. שלב ב׳ — כיבוש יעדים עד 0800. שלב ג׳ — החזקת שטח.' },
      ]},
    ],
  },
  {
    name: 'נוהל אבטחת מידע מעודכן', organization: 'ארגון א׳', type: 'נוהל', when: 'הופץ לפני 3 ימים',
    from: 'קצין ביטחון ראשי', to: 'כלל הדרגים', ref: '119003(04)2026',
    sections: [
      { title: 'מטרה ורקע', items: [
        { heading: '.1 כללי', body: 'נוהל זה מגדיר את הדרישות לאבטחת מידע רגיש ומסווג בכלל גורמי הארגון, בהתאם להנחיות החמ״ל.' },
        { heading: '.2 תחולה', body: 'הנוהל חל על כלל הגורמים המחזיקים מידע ביטחוני ברמת סוד ומעלה.' },
      ]},
      { title: 'הגדרות ומונחים', items: [
        { heading: '.3 הגדרות', body: 'מידע רגיש: כל מסמך הנושא סיווג ביטחוני. גורם מורשה: עובד בעל היתר גישה מאושר.' },
      ]},
      { title: 'נהלים ותהליכים', items: [
        { heading: '.4 אחריות', body: 'קצין הביטחון אחראי ליישום הנוהל ולדיווח על הפרות. כל חריגה תדווח תוך 2 שעות.' },
      ]},
    ],
  },
  {
    name: 'דוח רבעוני Q2 2026', organization: 'ארגון ב׳', type: 'דוח', when: 'הופץ לפני שבוע',
    from: 'מחלקת מבצעים', to: 'מפקד הארגון', ref: '330812(07)2026',
    sections: [
      { title: 'מטרה ורקע', items: [
        { heading: '.1 תקציר מנהלים', body: 'דוח זה מסכם את ביצועי הארגון לרבעון השני של 2026. סה״כ 47 משימות הושלמו בהצלחה.' },
        { heading: '.2 ממצאים עיקריים', body: 'אחוז עמידה ביעדים: 91%. חריגות תקציביות: 3 מקרים. ממוצע זמן תגובה: 4.2 שעות.' },
      ]},
      { title: 'הגדרות ומונחים', items: [
        { heading: '.3 מדדי ביצוע', body: 'KPI ראשי: עמידה בלוחות זמנים. KPI משני: ניצול תקציב. שניהם עומדים ביעד הרבעוני.' },
      ]},
      { title: 'נהלים ותהליכים', items: [
        { heading: '.4 המלצות לQ3', body: 'הגדלת כוח אדם בגזרה מערבית. עדכון נוהל דיווח. קיום תרגיל מתוזמן בספטמבר.' },
      ]},
    ],
  },
  {
    name: 'הוראת קבע שנתית 2026', organization: 'ארגון ג׳', type: 'הוראה', when: 'הופץ לפני 10 ימים',
    from: 'מפקד הבסיס', to: 'כלל הסגל', ref: '445001(08)2026',
    sections: [
      { title: 'מטרה ורקע', items: [
        { heading: '.1 מטרת ההוראה', body: 'הוראה זו מסדירה את נהלי העבודה השנתיים לכלל יחידות הבסיס לשנת 2026.' },
        { heading: '.2 תחולה', body: 'ההוראה חלה על כלל חיילי הקבע והמילואים בבסיס.' },
      ]},
      { title: 'הגדרות ומונחים', items: [
        { heading: '.3 הגדרות', body: 'סגל בסיס: כל בעלי תפקיד קבועים. יחידת סמך: יחידה הכפופה ישירות למפקד.' },
      ]},
      { title: 'נהלים ותהליכים', items: [
        { heading: '.4 לוח זמנים', body: 'ינואר–מרץ: אימונים בסיסיים. אפריל–יוני: תרגילים מורכבים. יולי–ספטמבר: מבצעים.' },
      ]},
    ],
  },
  {
    name: 'נוהל חירום ובטיחות', organization: 'הסביבה שלי', type: 'נוהל', when: 'הופץ לפני שבועיים',
    from: 'קצין הבטיחות', to: 'כלל הדרגים', ref: '556023(05)2026',
    sections: [
      { title: 'מטרה ורקע', items: [
        { heading: '.1 מטרת הנוהל', body: 'נוהל זה מגדיר את נהלי החירום והבטיחות הנדרשים בעת אירוע חריג בשטח הבסיס.' },
        { heading: '.2 עקרונות', body: 'בטיחות הכוח היא עדיפות עליונה. כל אירוע חריג ידווח מיד לקב״א ולמפקד.' },
      ]},
      { title: 'הגדרות ומונחים', items: [
        { heading: '.3 הגדרות', body: 'אירוע חריג: כל סטייה מהשגרה הדורשת התערבות מפקד. קב״א: קצין בטיחות אזורי.' },
      ]},
      { title: 'נהלים ותהליכים', items: [
        { heading: '.4 נוהל חירום', body: 'שלב א׳: דיווח מיידי. שלב ב׳: פינוי ועזרה ראשונה. שלב ג׳: חקירת אירוע.' },
      ]},
    ],
  },
];


const DAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS_EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function getWeekDays(baseDate: Date) {
  const day = baseDate.getDay();
  const sunday = new Date(baseDate);
  sunday.setDate(baseDate.getDate() - day);
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    return d;
  });
}

const DEPARTMENTS = ['מחלקת משאבי אנוש', 'מחלקת כספים', 'מחלקת טכנולוגיה', 'מחלקת תפעול', 'הסביבה שלי'];

function FolderSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const trigRef = useRef<HTMLButtonElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (trigRef.current?.contains(e.target as Node) || dropRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  const openDrop = () => {
    if (trigRef.current) {
      const rect = trigRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
    setOpen(v => !v);
  };

  return (
    <>
      <button ref={trigRef} type="button" onClick={openDrop}
        className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-xl bg-white hover:border-gray-400 focus:outline-none transition-colors"
        style={{ fontFamily: 'inherit' }}>
        <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
        <span className={`text-sm flex-1 text-right ${!value ? 'text-gray-400' : 'text-gray-800'}`}>
          {value || 'בחר מחלקה...'}
        </span>
      </button>
      {open && pos && (
        <div ref={dropRef} className="fixed bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 overflow-y-auto"
          style={{ top: pos.top, left: pos.left, width: pos.width, maxHeight: 240, zIndex: 99999 }} dir="rtl">
          {DEPARTMENTS.map(opt => (
            <button key={opt} type="button" onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-right px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 ${value === opt ? 'text-[#1B3A6B] font-medium bg-[#EEF4FF]' : 'text-gray-700'}`}
              style={{ fontFamily: 'inherit' }}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

function DocEditIcon({ size = 16, color = '#1B3A6B' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill={color} style={{ flexShrink: 0 }}>
      {/* document body — left/bottom/top-left, then dog-ear fold */}
      <path d="M15 5 h45 l20 20 v65 a5 5 0 0 1-5 5 H20 a5 5 0 0 1-5-5 V10 a5 5 0 0 1 5-5z" fillOpacity="0.08" stroke={color} strokeWidth="4" fill="none" strokeLinejoin="round" />
      {/* dog-ear fold */}
      <polyline points="60,5 60,25 80,25" fill="none" stroke={color} strokeWidth="4" strokeLinejoin="round" />
      {/* text lines */}
      <line x1="27" y1="42" x2="60" y2="42" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <line x1="27" y1="54" x2="60" y2="54" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <line x1="27" y1="66" x2="45" y2="66" stroke={color} strokeWidth="4" strokeLinecap="round" />
      {/* pencil body */}
      <g transform="translate(52, 58) rotate(-45)">
        <rect x="-4" y="-18" width="8" height="22" rx="1" fill={color} />
        {/* pencil tip */}
        <polygon points="-4,4 4,4 0,12" fill={color} />
        {/* eraser */}
        <rect x="-4" y="-22" width="8" height="5" rx="1" fill={color} fillOpacity="0.5" />
      </g>
    </svg>
  );
}

interface MainContentProps {
  onOpenDoc?: (doc: { name: string; organization: string }) => void;
  onNewDoc?: () => void;
}

export function MainContent({ onOpenDoc, onNewDoc }: MainContentProps) {
  const [query, setQuery]         = useState('');
  const [showDrop, setShowDrop]   = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [weekOffset, setWeekOffset] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [pencilDoc, setPencilDoc] = useState<typeof DISTRIBUTED_DOCS[0] | null>(null);
  const [docAction, setDocAction] = useState<{ type: 'duplicate' | 'issue-update' | 'issue-new'; doc: typeof DISTRIBUTED_DOCS[0] } | null>(null);
  const [shareDoc, setShareDoc] = useState<typeof DISTRIBUTED_DOCS[0] | null>(null);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [folderDept, setFolderDept] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const today    = new Date(2026, 7, 5);
  const baseDate = new Date(today);
  baseDate.setDate(today.getDate() + weekOffset * 7);
  const weekDays   = getWeekDays(baseDate);
  const monthLabel = MONTHS_EN[weekDays[0].getMonth()];

  const results = query.trim().length > 0
    ? ALL_DOCS.filter(d =>
        d.name.includes(query.trim()) ||
        d.dept.includes(query.trim()) ||
        d.organization.includes(query.trim())
      )
    : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node))
        setShowDrop(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const select = (doc: typeof ALL_DOCS[0]) => {
    setQuery('');
    setShowDrop(false);
    onOpenDoc?.({ name: doc.name, organization: doc.organization });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!showDrop || results.length === 0) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, results.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && activeIdx >= 0) select(results[activeIdx]);
    if (e.key === 'Escape') setShowDrop(false);
  };

  return (
    <>
    <main className="flex-1 flex flex-col overflow-hidden justify-center" style={{ padding: '36px 40px', paddingTop: 20 }} dir="rtl">

      {/* Hero — centered heading + search + create buttons */}
      <div className="flex flex-col items-center flex-shrink-0 mb-10" ref={containerRef}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#111827', marginBottom: 6, textAlign: 'center' }}>
          במה תרצה לעבוד היום?
        </h1>
        {/* Search — pill shape */}
        <div className="relative w-full" style={{ marginBottom: 16, maxWidth: 560 }}>
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setShowDrop(true); setActiveIdx(-1); }}
            onFocus={() => { if (query.trim()) setShowDrop(true); }}
            onKeyDown={onKeyDown}
            placeholder="חיפוש לפי שם מסמך..."
            className="w-full px-6 py-3 pr-14 focus:outline-none text-right text-sm transition-all"
            style={{
              background: 'white',
              borderRadius: 50,
              border: '1px solid rgba(27,58,107,0.15)',
              boxShadow: '0 2px 12px rgba(27,58,107,0.08)',
            }}
            dir="rtl"
          />
          <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" style={{ color: '#aab0bb' }} />
          {showDrop && results.length > 0 && (
            <div className="absolute top-full mt-2 w-full rounded-2xl overflow-hidden z-50"
              style={{ background: 'rgba(255,255,255,0.97)', border: '0.5px solid rgba(0,0,0,0.07)', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
              {results.map((doc, idx) => (
                <div key={idx} onMouseDown={() => select(doc)} onMouseEnter={() => setActiveIdx(idx)}
                  className="flex items-center gap-3 px-5 py-3.5 cursor-pointer transition-colors"
                  style={{ background: activeIdx === idx ? 'rgba(27,58,107,0.04)' : 'transparent', borderBottom: '0.5px solid rgba(0,0,0,0.05)' }}>
                  <FileText className="w-4 h-4 flex-shrink-0" style={{ color: '#1B3A6B' }} />
                  <div className="flex flex-col text-right min-w-0">
                    <span className="text-sm font-medium text-gray-800 truncate">{doc.name}</span>
                    <span className="text-xs truncate" style={{ color: '#aab0bb' }}>{doc.dept} · {doc.organization}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create buttons — pill with navy + circle */}
        <div className="flex gap-3">
          <button onClick={onNewDoc}
            className="flex items-center gap-2"
            style={{ background: 'white', border: 'none', borderRadius: 50, padding: '10px 20px', cursor: 'pointer', boxShadow: '0 3px 14px rgba(27,58,107,0.16)', transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.03)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'white')}>
            <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#1B3A6B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 15, lineHeight: 1, flexShrink: 0 }}>+</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>מסמך חדש</span>
          </button>
          <button
            onClick={() => { setFolderName(''); setFolderDept(''); setShowNewFolder(true); }}
            className="flex items-center gap-2"
            style={{ background: 'white', border: 'none', borderRadius: 50, padding: '10px 20px', cursor: 'pointer', boxShadow: '0 3px 14px rgba(27,58,107,0.16)', transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.03)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'white')}>
            <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#1B3A6B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 15, lineHeight: 1, flexShrink: 0 }}>+</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>תיקייה חדשה</span>
          </button>
        </div>
      </div>

      {/* Main layout — two columns side by side */}
      <div className="flex flex-shrink-0">
        <div className="grid grid-cols-2 gap-4 w-full flex-shrink-0">

        {/* RIGHT column — "המשך מאיפה שעצרת" */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-start gap-1.5">
            <SquarePen className="w-3 h-3 flex-shrink-0" style={{ color: '#1B3A6B' }} />
            <span style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', letterSpacing: '0.05em' }}>המשך מאיפה שעצרת</span>
          </div>
          <div className="rounded-2xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(16px)', border: '0.5px solid rgba(0,0,0,0.07)' }}>
            {RECENT_DOCS.map((doc, i) => (
              <div key={i}
                className="flex items-center gap-3 px-4 cursor-pointer transition-colors"
                style={{ paddingTop: 11, paddingBottom: 11, borderBottom: i < RECENT_DOCS.length - 1 ? '0.5px solid rgba(0,0,0,0.05)' : 'none' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.02)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                onClick={() => onOpenDoc?.({ name: doc.name, organization: doc.organization })}>
                <div className="flex-1 min-w-0 text-right">
                  <p className="truncate" style={{ fontSize: 12, fontWeight: 500, color: '#111827' }}>{doc.name}</p>
                  <p className="mt-0.5" style={{ fontSize: 10, color: '#aab0bb' }}>{doc.type} · {doc.organization}</p>
                </div>
                <span className="flex-shrink-0" style={{ fontSize: 10, color: '#d1d5db' }}>{doc.when}</span>
                <ChevronLeft className="flex-shrink-0 w-4 h-4" style={{ color: '#d1d5db' }} />
              </div>
            ))}
          </div>
        </div>

        {/* LEFT column — "הופצו לאחרונה" as list */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-start gap-1.5">
            <ArrowUpLeft className="w-3 h-3 flex-shrink-0" style={{ color: '#6b7280' }} />
            <span style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', letterSpacing: '0.05em' }}>הופצו לאחרונה</span>
          </div>
          <div className="rounded-2xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(16px)', border: '0.5px solid rgba(0,0,0,0.07)' }}>
            {DISTRIBUTED_DOCS.slice(0, 3).map((doc, i) => (
              <div key={i}
                className="flex items-center gap-3 px-4 cursor-pointer transition-colors"
                style={{ paddingTop: 11, paddingBottom: 11, borderBottom: i < 2 ? '0.5px solid rgba(0,0,0,0.05)' : 'none' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.02)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                onClick={() => onOpenDoc?.({ name: doc.name, organization: doc.organization })}>
                <div className="flex-1 min-w-0 text-right">
                  <p className="truncate" style={{ fontSize: 12, fontWeight: 500, color: '#111827' }}>{doc.name}</p>
                  <p className="mt-0.5" style={{ fontSize: 10, color: '#aab0bb' }}>{doc.organization} · {doc.type}</p>
                </div>
                <span className="flex-shrink-0" style={{ fontSize: 10, color: '#d1d5db' }}>{doc.when.replace('הופץ ', '')}</span>
                <ChevronLeft className="flex-shrink-0 w-4 h-4" style={{ color: '#d1d5db' }} />
              </div>
            ))}
          </div>
        </div>

        </div>
      </div>


    </main>

    {/* Pencil action picker */}
    {pencilDoc && (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
        onClick={() => setPencilDoc(null)}>
        <div className="bg-white rounded-3xl shadow-2xl" style={{ width: 360 }}
          onClick={e => e.stopPropagation()} dir="rtl">
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '0.5px solid #f0f0f0' }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', maxWidth: 270 }} className="truncate">{pencilDoc.name}</p>
            <button onClick={() => setPencilDoc(null)} className="p-1.5 hover:bg-gray-100 rounded-xl text-gray-400 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-2">
            {([
              { label: 'שכפול מסמך',           Icon: Copy,       type: 'duplicate'    as const },
              { label: 'הוצאת עדכון למסמך',    Icon: RefreshCw,  type: 'issue-update' as const },
              { label: 'שינוי מס׳ פקודה',       Icon: Hash,       type: 'issue-new'    as const },
            ]).map(({ label, Icon, type }) => (
              <button key={type}
                onClick={() => { setPencilDoc(null); setDocAction({ type, doc: pencilDoc }); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                dir="rtl">
                <Icon className="w-4 h-4 flex-shrink-0" style={{ color: '#1B3A6B' }} />
                <span style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    )}

    {/* Duplicate → NewDocModal */}
    {docAction?.type === 'duplicate' && (
      <NewDocModal
        title="שכפול מסמך"
        initialData={{ name: docAction.doc.name, docType: docAction.doc.type, org: docAction.doc.organization }}
        onClose={() => setDocAction(null)}
      />
    )}

    {/* Issue-update / Issue-new → EditDocDetailsModal */}
    {(docAction?.type === 'issue-update' || docAction?.type === 'issue-new') && (
      <EditDocDetailsModal
        doc={{ name: docAction.doc.name, orderNum: docAction.doc.ref }}
        mode={docAction.type}
        onClose={() => setDocAction(null)}
      />
    )}

    {/* New folder modal */}
    {showNewFolder && (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
        onClick={() => setShowNewFolder(false)}>
        <div className="bg-white rounded-3xl shadow-2xl" style={{ width: 400 }}
          onClick={e => e.stopPropagation()} dir="rtl">
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '0.5px solid #f0f0f0' }}>
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4" style={{ color: '#1B3A6B' }} />
              <p style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>תיקייה חדשה</p>
            </div>
            <button onClick={() => setShowNewFolder(false)} className="p-1.5 hover:bg-gray-100 rounded-xl text-gray-400 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label style={{ fontSize: 12, fontWeight: 500, color: '#6b7280' }}>שם התיקייה</label>
              <input
                autoFocus
                value={folderName}
                onChange={e => setFolderName(e.target.value)}
                placeholder="לדוגמה: נהלי בטיחות"
                className="w-full px-4 py-3 text-right text-sm focus:outline-none"
                style={{ background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: 10, fontFamily: 'inherit', color: '#111827' }}
                dir="rtl"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label style={{ fontSize: 12, fontWeight: 500, color: '#6b7280' }}>חיבור למחלקה</label>
              <FolderSelect value={folderDept} onChange={setFolderDept} />
            </div>
            <div className="flex gap-2 mt-1">
              <button
                onClick={() => setShowNewFolder(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-gray-50"
                style={{ border: '0.5px solid #e5e7eb', color: '#6b7280', fontFamily: 'inherit' }}>
                ביטול
              </button>
              <button
                onClick={() => setShowNewFolder(false)}
                disabled={!folderName.trim() || !folderDept}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-opacity"
                style={{ background: '#1B3A6B', fontFamily: 'inherit', opacity: (!folderName.trim() || !folderDept) ? 0.45 : 1, cursor: (!folderName.trim() || !folderDept) ? 'not-allowed' : 'pointer' }}>
                יצירה
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Share action picker */}
    {shareDoc && (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
        onClick={() => setShareDoc(null)}>
        <div className="bg-white rounded-3xl shadow-2xl" style={{ width: 360 }}
          onClick={e => e.stopPropagation()} dir="rtl">
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '0.5px solid #f0f0f0' }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', maxWidth: 270 }} className="truncate">{shareDoc.name}</p>
            <button onClick={() => setShareDoc(null)} className="p-1.5 hover:bg-gray-100 rounded-xl text-gray-400 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-2">
            {([
              { label: 'העתקת קישור',        Icon: Link2,      action: 'copy'   as const },
              { label: 'יצירת לינק מתעדכן',  Icon: RefreshCw,  action: 'live'   as const },
              { label: 'שיתוף המסמך',        Icon: Upload,     action: 'send'   as const },
            ]).map(({ label, Icon, action }) => (
              <button key={action}
                onClick={() => setShareDoc(null)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                dir="rtl">
                <Icon className="w-4 h-4 flex-shrink-0" style={{ color: '#1B3A6B' }} />
                <span style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    )}

    </>

  );
}
