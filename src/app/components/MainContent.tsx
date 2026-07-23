import { Search, Plus, FileText } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const RECENT_UPDATES = [
  { name: 'פקודת מבצע קיץ 2024',       date: '15 יול 2025', dept: 'מחלקת משאבי אנוש' },
  { name: 'נוהל אבטחת מידע',            date: '10 יול 2025', dept: 'מחלקת טכנולוגיה' },
  { name: 'תקציב שנתי 2025',            date: '03 יול 2025', dept: 'מחלקת כספים' },
  { name: 'נוהל גיוס עובדים',           date: '28 יונ 2025', dept: 'מחלקת משאבי אנוש' },
  { name: 'פרוטוקול ועדת היגוי',        date: '22 יונ 2025', dept: 'מחלקת טכנולוגיה' },
];

interface MainContentProps {
  onOpenDoc?: (doc: { name: string; organization: string }) => void;
  onNewDoc?: () => void;
}

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

function UpdateCard({ doc, onOpenDoc }: { doc: typeof RECENT_UPDATES[0]; onOpenDoc?: MainContentProps['onOpenDoc'] }) {
  return (
    <div
      onClick={() => onOpenDoc?.({ name: doc.name, organization: doc.dept })}
      className="flex-1 min-w-0 rounded-2xl p-5 cursor-pointer hover:-translate-y-0.5 transition-all duration-200"
      style={{ background: 'rgba(255,255,255,0.82)', boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}
    >
      <p className="text-xs text-gray-400 mb-2 text-right">{doc.date}</p>
      <h3 className="text-sm font-bold text-gray-800 text-right leading-snug mb-1">{doc.name}</h3>
      <p className="text-xs text-gray-400 text-right">{doc.dept}</p>
    </div>
  );
}

export function MainContent({ onOpenDoc, onNewDoc }: MainContentProps) {
  const [query,       setQuery]       = useState('');
  const [showDrop,    setShowDrop]    = useState(false);
  const [activeIdx,   setActiveIdx]   = useState(-1);
  const [showAllUpdates, setShowAllUpdates] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const recentDocuments = [
    { name: 'נהלי עבודה',       organization: 'ארגון א׳' },
    { name: 'דוחות שנתיים',     organization: 'ארגון ב׳' },
    { name: 'מסמכי תקציב 2026', organization: 'ארגון א׳' },
  ];

  const results = query.trim().length > 0
    ? ALL_DOCS.filter(d => d.name.includes(query.trim()) || d.dept.includes(query.trim()) || d.organization.includes(query.trim()))
    : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDrop(false);
      }
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
    <main className="flex-1 p-8 overflow-y-auto" dir="rtl">
      <div className="max-w-3xl mx-auto mb-16 mt-10" ref={containerRef}>
        <label className="block text-base text-gray-500 mb-3 text-right">חיפוש מסמך</label>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setShowDrop(true); setActiveIdx(-1); }}
            onFocus={() => { if (query.trim()) setShowDrop(true); }}
            onKeyDown={onKeyDown}
            placeholder="הקלד שם מסמך..."
            className="w-full px-8 py-6 pr-16 bg-white shadow-lg rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30 text-right text-base transition-all hover:shadow-xl"
            dir="rtl"
          />
          <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />

          {/* Dropdown */}
          {showDrop && results.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
              {results.map((doc, idx) => (
                <div
                  key={idx}
                  onMouseDown={() => select(doc)}
                  onMouseEnter={() => setActiveIdx(idx)}
                  className={`flex items-center gap-3 px-5 py-3.5 cursor-pointer transition-colors ${activeIdx === idx ? 'bg-[#1B3A6B]/5' : 'hover:bg-gray-50'}`}
                >
                  <FileText className="w-4 h-4 text-[#1B3A6B] flex-shrink-0" />
                  <div className="flex flex-col text-right min-w-0">
                    <span className="text-sm font-semibold text-gray-800 truncate">{doc.name}</span>
                    <span className="text-xs text-gray-400 truncate">{doc.dept} · {doc.organization}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto flex flex-col gap-10">

        {/* פתחת לאחרונה */}
        <div>
          <h2 className="text-lg text-gray-800 mb-4 text-right">פתחת לאחרונה</h2>
          <div className="relative overflow-hidden">
            <div className="flex gap-3">
              <div
                onClick={onNewDoc}
                className="min-w-[150px] bg-transparent border-2 border-dashed border-[#D0D0D0] rounded-2xl hover:border-gray-400 transition-all p-6 cursor-pointer hover:-translate-y-0.5 duration-300 flex flex-col items-center justify-center"
              >
                <Plus className="w-8 h-8 text-gray-500 mb-2" />
                <p className="text-sm text-gray-600">מסמך חדש</p>
              </div>

              {recentDocuments.map((doc, idx) => (
                <div
                  key={idx}
                  onClick={() => onOpenDoc?.(doc)}
                  className="min-w-[150px] bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-6 cursor-pointer hover:-translate-y-0.5 duration-300"
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <FileText className="w-8 h-8 text-[#555555]" />
                    <div>
                      <h3 className="text-gray-800 text-sm font-bold mb-1">{doc.name}</h3>
                      <p className="text-xs text-gray-400">{doc.organization}</p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="min-w-[150px] bg-white rounded-2xl shadow-md p-6 -ml-20 opacity-40">
                <div className="flex flex-col items-center text-center gap-3">
                  <FileText className="w-8 h-8 text-[#555555]" />
                  <div>
                    <h3 className="text-gray-800 text-sm font-bold mb-1">נהלי בטיחות</h3>
                    <p className="text-xs text-gray-400">ארגון ג׳</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* עדכונים אחרונים */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg text-gray-800">פקודות ראשיות</h2>
            <button
              onClick={() => setShowAllUpdates(v => !v)}
              className="text-sm font-medium text-[#1B3A6B] hover:underline transition-colors"
            >
              {showAllUpdates ? 'סגור' : 'קרא עוד'}
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {/* First row — always 3 */}
            <div className="flex gap-3">
              {RECENT_UPDATES.slice(0, 3).map((doc, idx) => (
                <UpdateCard key={idx} doc={doc} onOpenDoc={onOpenDoc} />
              ))}
            </div>
            {/* Extra row — expands downward */}
            {showAllUpdates && (
              <div className="flex gap-3">
                {RECENT_UPDATES.slice(3).map((doc, idx) => (
                  <UpdateCard key={idx + 3} doc={doc} onOpenDoc={onOpenDoc} />
                ))}
                {RECENT_UPDATES.slice(3).length < 3 && Array.from({ length: 3 - RECENT_UPDATES.slice(3).length }).map((_, i) => (
                  <div key={`empty-${i}`} className="flex-1 min-w-0" />
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
