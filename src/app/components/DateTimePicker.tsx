import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';

const HE_MONTHS = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
const HE_DAYS   = ['א','ב','ג','ד','ה','ו','ש'];

function nowIso(): string {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}-${String(n.getDate()).padStart(2,'0')}T${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`;
}

function parseDateTime(v: string): { date: Date | null; hh: string; mm: string } {
  if (!v) return { date: null, hh: String(new Date().getHours()).padStart(2,'0'), mm: String(new Date().getMinutes()).padStart(2,'0') };
  const [datePart, timePart = ''] = v.split('T');
  const d = new Date(datePart + 'T00:00:00');
  const [h = '00', m = '00'] = timePart.split(':');
  return {
    date: isNaN(d.getTime()) ? null : d,
    hh: h.padStart(2,'0'),
    mm: m.padStart(2,'0'),
  };
}

function toIso(year: number, month: number, day: number, hh: string, mm: string): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${hh}:${mm}`;
}

function formatDisplay(v: string): string {
  const { date, hh, mm } = parseDateTime(v);
  if (!date) return '';
  return `${String(date.getDate()).padStart(2,'0')}.${String(date.getMonth()+1).padStart(2,'0')}.${date.getFullYear()}  ${hh}:${mm}`;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = 'בחר תאריך ושעה',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const today  = new Date();
  const parsed = parseDateTime(value);

  const [open, setOpen]     = useState(false);
  const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({});

  const [viewYear,  setViewYear]  = useState(parsed.date?.getFullYear()  ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsed.date?.getMonth()     ?? today.getMonth());

  const [selYear,  setSelYear]  = useState<number | null>(parsed.date?.getFullYear()  ?? null);
  const [selMonth, setSelMonth] = useState<number | null>(parsed.date?.getMonth()     ?? null);
  const [selDay,   setSelDay]   = useState<number | null>(parsed.date?.getDate()      ?? null);

  const [hh, setHh] = useState(parsed.hh);
  const [mm, setMm] = useState(parsed.mm);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const p = parseDateTime(value);
    if (p.date) {
      setViewYear(p.date.getFullYear());
      setViewMonth(p.date.getMonth());
      setSelYear(p.date.getFullYear());
      setSelMonth(p.date.getMonth());
      setSelDay(p.date.getDate());
    } else {
      setSelYear(null); setSelMonth(null); setSelDay(null);
    }
    setHh(p.hh); setMm(p.mm);
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
      const goUp = rect.bottom + 370 > window.innerHeight;
      setPopupStyle(
        goUp
          ? { position: 'fixed', bottom: window.innerHeight - rect.top + 4, left: rect.left, zIndex: 999999 }
          : { position: 'fixed', top: rect.bottom + 4, left: rect.left, zIndex: 999999 }
      );
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

  const firstDow  = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMon = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMon }, (_, i) => i + 1),
  ];

  const isSelected = (day: number) =>
    selYear === viewYear && selMonth === viewMonth && selDay === day;

  const isToday = (day: number) =>
    today.getDate() === day && today.getMonth() === viewMonth && today.getFullYear() === viewYear;

  const emit = (y: number | null, mo: number | null, d: number | null, h: string, m: string) => {
    if (y !== null && mo !== null && d !== null) onChange(toIso(y, mo, d, h, m));
  };

  const selectDay = (day: number) => {
    setSelYear(viewYear); setSelMonth(viewMonth); setSelDay(day);
    emit(viewYear, viewMonth, day, hh, mm);
  };

  const changeHh = (v: string) => {
    const cleaned = v.replace(/\D/g, '').slice(0, 2);
    setHh(cleaned);
    emit(selYear, selMonth, selDay, cleaned, mm);
  };
  const changeMm = (v: string) => {
    const cleaned = v.replace(/\D/g, '').slice(0, 2);
    setMm(cleaned);
    emit(selYear, selMonth, selDay, hh, cleaned);
  };
  const blurHh = () => {
    const v = Math.min(23, Math.max(0, parseInt(hh, 10) || 0)).toString().padStart(2,'0');
    setHh(v); emit(selYear, selMonth, selDay, v, mm);
  };
  const blurMm = () => {
    const v = Math.min(59, Math.max(0, parseInt(mm, 10) || 0)).toString().padStart(2,'0');
    setMm(v); emit(selYear, selMonth, selDay, hh, v);
  };

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
          dir="rtl"
          style={{ ...popupStyle, width: 280 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100"
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
          <div className="grid grid-cols-7 px-3 gap-y-0.5">
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
                    isSelected(day)
                      ? 'border-2 border-[#1B3A6B] text-[#1B3A6B] font-bold'
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

          {/* Time input */}
          <div className="border-t border-gray-100 mx-3 mt-3" />
          <div className="px-4 py-3 flex flex-col items-center gap-2">
            <span className="text-xs text-gray-400 self-center">שעה</span>
            <div className="flex items-center gap-2 justify-center" dir="ltr">
              <input
                type="text"
                inputMode="numeric"
                value={hh}
                onChange={e => changeHh(e.target.value)}
                onBlur={blurHh}
                maxLength={2}
                className="w-9 h-9 text-center text-sm font-semibold text-gray-800 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-[#1B3A6B] focus:ring-1 focus:ring-[#1B3A6B]/20 transition-colors"
              />
              <span className="text-gray-400 text-lg font-light">:</span>
              <input
                type="text"
                inputMode="numeric"
                value={mm}
                onChange={e => changeMm(e.target.value)}
                onBlur={blurMm}
                maxLength={2}
                className="w-9 h-9 text-center text-sm font-semibold text-gray-800 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-[#1B3A6B] focus:ring-1 focus:ring-[#1B3A6B]/20 transition-colors"
              />
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export function nowDateTimeIso(): string {
  return nowIso();
}
