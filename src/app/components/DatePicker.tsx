import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';

const HE_MONTHS = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
const HE_DAYS   = ['א','ב','ג','ד','ה','ו','ש'];

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
  const [open, setOpen]         = useState(false);
  const [openUp, setOpenUp]     = useState(false);
  const [viewYear, setViewYear]   = useState(parsed?.getFullYear()  ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsed?.getMonth()     ?? today.getMonth());

  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const d = parseDate(value);
    if (d) { setViewYear(d.getFullYear()); setViewMonth(d.getMonth()); }
  }, [value]);

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
      setOpenUp(rect.bottom + 320 > window.innerHeight);
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
        className={[
          'w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg border bg-white hover:border-gray-300 focus:outline-none transition-colors',
          open ? 'border-[#1B3A6B] ring-1 ring-[#1B3A6B]/20' : 'border-gray-200',
        ].join(' ')}
        dir="ltr"
      >
        <CalendarDays className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <span className={`flex-1 text-right mr-2 ${value ? 'text-gray-700' : 'text-gray-400'}`}>
          {value ? formatDisplay(value) : placeholder}
        </span>
      </button>

      {open && (
        <div
          ref={popupRef}
          className={`absolute left-0 right-0 bg-white rounded-2xl shadow-xl border border-gray-100 z-[999999] ${openUp ? 'bottom-full mb-1' : 'top-full mt-1'}`}
          dir="rtl"
          style={{ minWidth: 260 }}
        >
          {/* Month / year nav */}
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <button type="button" onClick={nextMonth}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </button>
            <span className="text-sm font-bold text-gray-900 select-none">
              {HE_MONTHS[viewMonth]} {viewYear}
            </span>
            <button type="button" onClick={prevMonth}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Day-of-week headers */}
          <div className="grid grid-cols-7 px-3 mb-1">
            {HE_DAYS.map(d => (
              <span key={d} className="text-center text-xs text-gray-400 py-1 select-none">{d}</span>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 px-3 pb-3 gap-y-0.5">
            {cells.map((day, i) =>
              day === null ? (
                <span key={`e-${i}`} />
              ) : (
                <button
                  key={day}
                  type="button"
                  onClick={() => selectDay(day)}
                  className={[
                    'mx-auto w-9 h-9 flex items-center justify-center text-sm rounded-full transition-colors',
                    day === selectedDay
                      ? 'border-2 border-[#1B3A6B] bg-[#1B3A6B] text-white font-bold'
                      : isToday(day)
                      ? 'border-2 border-[#1B3A6B] text-[#1B3A6B] font-semibold hover:bg-blue-50'
                      : 'text-gray-800 hover:bg-gray-100',
                  ].join(' ')}
                >
                  {day}
                </button>
              )
            )}
          </div>

        </div>
      )}
    </div>
  );
}
