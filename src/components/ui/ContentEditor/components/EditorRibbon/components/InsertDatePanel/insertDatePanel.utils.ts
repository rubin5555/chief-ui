export interface CalendarMonth {
  year: number;
  month: number;
}

export interface CalendarDate extends CalendarMonth {
  day: number;
}

export const buildMonthCells = ({ year, month }: CalendarMonth): (number | null)[] => {
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return [
    ...Array.from({ length: firstDayOfWeek }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
};

export const shiftMonth = ({ year, month }: CalendarMonth, delta: number): CalendarMonth => {
  const next = month + delta;
  if (next < 0) return { year: year - 1, month: 11 };
  if (next > 11) return { year: year + 1, month: 0 };
  return { year, month: next };
};

export const isSameMonth = (a: CalendarMonth, b: CalendarMonth) =>
  a.year === b.year && a.month === b.month;

const pad = (value: number | string) => String(value).padStart(2, '0');

export const formatDateTime = (date: CalendarDate, time: string) =>
  `${pad(date.day)}.${pad(date.month + 1)}.${date.year}  ${time}`;

export const nowAsTime = () => {
  const now = new Date();
  return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
};

export const splitTime = (time: string) => {
  const [hours = '00', minutes = '00'] = time.split(':');
  return { hours, minutes };
};

export const joinTime = (hours: string, minutes: string) => `${hours}:${minutes}`;
