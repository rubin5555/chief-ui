import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HE_MONTHS = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
const HE_DAYS   = ['א׳','ב׳','ג׳','ד׳','ה׳','ו׳','ש׳']; // Sun → Sat

function parseDate(v: string): Date | null {
  if (!v) return null;
  const d = new Date(v + 'T00:00:00');
  return isNaN(d.getTime()) ? null : d;
}

function toIso(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function formatDisplay(v: string): string {
  const d = parseDate(v);
  if (!d) return '';
  return `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()}`;
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'בחר תאריך',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const today      = new Date();
  const parsed     = parseDate(value);
  const [open, setOpen]       = useState(false);
  const [openUp, setOpenUp]   = useState(false);
  const [viewYear, setViewYear]   = useState(parsed?.getFullYear()  ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsed?.getMonth()     ?? today.getMonth());

  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef   = useRef<HTMLDivElement>(null);

  // Sync view when value changes externally
  useEffect(() => {
    const d = parseDate(value);
    if (d) { setViewYear(d.getFullYear()); setViewMonth(d.getMonth()); }
  }, [value]);

  // Close on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
        popupRef.current   && !popupRef.current.contains(e.target as Node)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const handleOpen = () => {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setOpenUp(rect.bottom + 290 > window.innerHeight);
    }
    setOpen(o => !o);
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  // Build calendar grid (Sun-first)
  const firstDow   = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMon  = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMon }, (_, i) => i + 1),
  ];

  const selectDay = (day: number) => {
    onChange(toIso(viewYear, viewMonth, day));
    setOpen(false);
  };

  const selectedDay =
    parsed && parsed.getFullYear() === viewYear && parsed.getMonth() === viewMonth
      ? parsed.getDate()
      : null;

  const isToday = (day: number) =>
    today.getDate() === day &&
    today.getMonth() === viewMonth &&
    today.getFullYear() === viewYear;

  return (
    <div className="relative w-full">
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        className="w-full px-2 py-1 text-xs rounded-lg border border-gray-100 bg-gray-50 hover:border-gray-300 focus:outline-none focus:border-[#1B3A6B] text-right transition-colors"
        dir="ltr"
      >
        <span className={value ? 'text-gray-700' : 'text-gray-400'}>
          {value ? formatDisplay(value) : placeholder}
        </span>
      </button>

      {open && (
        <div
          ref={popupRef}
          className={`absolute left-0 right-0 bg-white rounded-xl shadow-xl border border-gray-100 p-3 z-[999999] ${openUp ? 'bottom-full mb-1' : 'top-full mt-1'}`}
          dir="rtl"
        >
          {/* Month / year nav */}
          <div className="flex items-center justify-between mb-2 px-1">
            <button type="button" onClick={nextMonth}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors">
              <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
            </button>
            <span className="text-xs font-semibold text-gray-800 select-none">
              {HE_MONTHS[viewMonth]} {viewYear}
            </span>
            <button type="button" onClick={prevMonth}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors">
              <ChevronLeft className="w-3.5 h-3.5 text-gray-500" />
            </button>
          </div>

          {/* Day-of-week headers */}
          <div className="grid grid-cols-7 mb-1">
            {HE_DAYS.map(d => (
              <span key={d} className="text-center text-[10px] text-gray-400 py-0.5 select-none">{d}</span>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-0.5">
            {cells.map((day, i) =>
              day === null ? (
                <span key={`e-${i}`} />
              ) : (
                <button
                  key={day}
                  type="button"
                  onClick={() => selectDay(day)}
                  className={[
                    'aspect-square flex items-center justify-center text-[11px] rounded-full transition-colors',
                    day === selectedDay
                      ? 'bg-[#1B3A6B] text-white font-semibold'
                      : isToday(day)
                      ? 'border border-[#1B3A6B] text-[#1B3A6B] font-medium hover:bg-blue-50'
                      : 'text-gray-700 hover:bg-blue-50',
                  ].join(' ')}
                >
                  {day}
                </button>
              )
            )}
          </div>

          {/* Clear */}
          {value && (
            <button
              type="button"
              onClick={() => { onChange(''); setOpen(false); }}
              className="w-full mt-2 text-[10px] text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg py-1 transition-colors"
            >
              נקה תאריך
            </button>
          )}
        </div>
      )}
    </div>
  );
}
