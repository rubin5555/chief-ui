import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HE_MONTHS = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
const HE_DAYS   = ['א׳','ב׳','ג׳','ד׳','ה׳','ו׳','ש׳']; // Sun → Sat

function nowTime(): string {
  const n = new Date();
  return `${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`;
}

function parseDateTime(v: string): { date: Date | null; time: string } {
  if (!v) return { date: null, time: nowTime() };
  const [datePart, timePart = nowTime()] = v.split('T');
  const d = new Date(datePart + 'T00:00:00');
  return {
    date: isNaN(d.getTime()) ? null : d,
    time: timePart.slice(0, 5) || nowTime(),
  };
}

function toIso(year: number, month: number, day: number, time: string): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${time}`;
}

function formatDisplay(v: string): string {
  const { date, time } = parseDateTime(v);
  if (!date) return '';
  return `${String(date.getDate()).padStart(2,'0')}.${String(date.getMonth()+1).padStart(2,'0')}.${date.getFullYear()},  ${time}`;
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

  const [open, setOpen]       = useState(false);
  const [openUp, setOpenUp]   = useState(false);
  const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({});

  const [viewYear,  setViewYear]  = useState(parsed.date?.getFullYear()  ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsed.date?.getMonth()     ?? today.getMonth());

  const [selYear,  setSelYear]  = useState<number | null>(parsed.date?.getFullYear()  ?? null);
  const [selMonth, setSelMonth] = useState<number | null>(parsed.date?.getMonth()     ?? null);
  const [selDay,   setSelDay]   = useState<number | null>(parsed.date?.getDate()      ?? null);

  // time as free-text HH:mm string; defaults to current time
  const [time, setTime] = useState<string>(parsed.time);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef   = useRef<HTMLDivElement>(null);

  // Sync when value changes externally
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
    setTime(p.time);
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
      const goUp = rect.bottom + 320 > window.innerHeight;
      setOpenUp(goUp);
      setPopupStyle(
        goUp
          ? { position: 'fixed', bottom: window.innerHeight - rect.top + 4, left: rect.left, width: rect.width, zIndex: 999999 }
          : { position: 'fixed', top: rect.bottom + 4, left: rect.left, width: rect.width, zIndex: 999999 }
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

  const selectDay = (day: number) => {
    setSelYear(viewYear); setSelMonth(viewMonth); setSelDay(day);
    onChange(toIso(viewYear, viewMonth, day, time));
  };

  const handleTimeChange = (v: string) => {
    // Allow only digits and colon, max 5 chars
    const cleaned = v.replace(/[^\d:]/g, '').slice(0, 5);
    setTime(cleaned);
    if (selYear !== null && selMonth !== null && selDay !== null) {
      onChange(toIso(selYear, selMonth, selDay, cleaned));
    }
  };

  const handleTimeBlur = () => {
    // Auto-format: if user typed "930" → "09:30", "9" → "09:00" etc.
    let v = time.replace(/[^\d]/g, '');
    if (v.length === 0) { setTime(nowTime()); return; }
    if (v.length <= 2) {
      const hh = v.padStart(2, '0');
      const formatted = `${hh}:00`;
      setTime(formatted);
      if (selYear !== null && selMonth !== null && selDay !== null)
        onChange(toIso(selYear, selMonth, selDay, formatted));
    } else {
      const hh = v.slice(0, 2).padStart(2, '0');
      const mm = v.slice(2, 4).padStart(2, '0');
      const formatted = `${hh}:${mm}`;
      setTime(formatted);
      if (selYear !== null && selMonth !== null && selDay !== null)
        onChange(toIso(selYear, selMonth, selDay, formatted));
    }
  };

  return (
    <div className="relative w-full">
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        className={[
          'w-full px-2 py-1 text-xs rounded-lg border bg-white hover:border-gray-300 focus:outline-none transition-colors text-right',
          open ? 'border-[#1B3A6B] ring-1 ring-[#1B3A6B]/20' : 'border-gray-200',
        ].join(' ')}
        dir="ltr"
      >
        <span className={value ? 'text-gray-700' : 'text-gray-400'}>
          {value ? formatDisplay(value) : placeholder}
        </span>
      </button>

      {/* Popup */}
      {open && (
        <div
          ref={popupRef}
          dir="rtl"
          style={popupStyle}
          className="bg-white rounded-xl shadow-xl border border-gray-100"
        >
          {/* ── Calendar ── */}
          <div className="p-3">
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
                      isSelected(day)
                        ? 'border-2 border-[#1B3A6B] text-[#1B3A6B] font-semibold bg-white'
                        : isToday(day)
                        ? 'border border-dashed border-[#1B3A6B]/40 text-[#1B3A6B] font-medium hover:bg-blue-50'
                        : 'text-gray-700 hover:bg-blue-50',
                    ].join(' ')}
                  >
                    {day}
                  </button>
                )
              )}
            </div>
          </div>

          {/* ── Separator ── */}
          <div className="border-t border-gray-100 mx-3" />

          {/* ── Time input ── */}
          <div className="px-3 py-2.5 flex items-center gap-2" dir="rtl">
            <span className="text-[11px] text-gray-500 flex-shrink-0">שעה</span>
            <input
              type="text"
              inputMode="numeric"
              value={time}
              onChange={e => handleTimeChange(e.target.value)}
              onBlur={handleTimeBlur}
              placeholder={nowTime()}
              dir="ltr"
              className="flex-1 text-center text-sm font-medium text-gray-700 px-2 py-1 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#1B3A6B] focus:ring-1 focus:ring-[#1B3A6B]/20 transition-colors placeholder-gray-300"
            />
          </div>

          {/* Clear */}
          {value && (
            <>
              <div className="border-t border-gray-100 mx-3" />
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  setSelYear(null); setSelMonth(null); setSelDay(null);
                  setTime(nowTime());
                  setOpen(false);
                }}
                className="w-full text-[10px] text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-b-xl py-2 transition-colors"
              >
                נקה
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
