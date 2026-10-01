export const pad = (value: number) => String(value).padStart(2, '0');

export const clamp = (min: number, max: number, value: number) =>
  Math.min(max, Math.max(min, value));

export const parseDateTimeLocal = (value: string): Date | null => {
  if (!value) return null;
  const [datePart, timePart] = value.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hours, minutes] = (timePart ?? '00:00').split(':').map(Number);
  const date = new Date(year, month - 1, day, hours, minutes);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatDateTimeLocal = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;

export const formatDateLocal = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const formatDisplayValue = (date: Date): string =>
  `${formatDisplayDate(date)} ${pad(date.getHours())}:${pad(date.getMinutes())}`;

export const formatDisplayDate = (date: Date): string =>
  `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;

export const dayKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const WEEKDAY_LABELS = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];

export const MONTH_LABELS = [
  'ינואר',
  'פברואר',
  'מרץ',
  'אפריל',
  'מאי',
  'יוני',
  'יולי',
  'אוגוסט',
  'ספטמבר',
  'אוקטובר',
  'נובמבר',
  'דצמבר',
];

export interface CalendarDay {
  date: Date;
  inMonth: boolean;
}

export const buildCalendarGrid = (viewMonth: Date): CalendarDay[] => {
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const startOffset = new Date(year, month, 1).getDay();
  const gridStart = new Date(year, month, 1 - startOffset);

  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
    return { date, inMonth: date.getMonth() === month };
  });
};

export interface DropPos {
  top?: number;
  bottom?: number;
  left: number;
}

const PANEL_WIDTH = 280;
const PANEL_HEIGHT = 360;
const EDGE_MARGIN = 8;
const GAP = 4;

export const computeDropPos = (rect: DOMRect): DropPos => {
  const spaceBelow = window.innerHeight - rect.bottom - GAP - EDGE_MARGIN;
  const spaceAbove = rect.top - GAP - EDGE_MARGIN;
  const left = clamp(EDGE_MARGIN, window.innerWidth - PANEL_WIDTH - EDGE_MARGIN, rect.left);

  if (spaceBelow < PANEL_HEIGHT && spaceAbove > spaceBelow) {
    return { bottom: window.innerHeight - rect.top + GAP, left };
  }
  return { top: rect.bottom + GAP, left };
};
