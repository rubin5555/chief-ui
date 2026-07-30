import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HE_DAYS, HE_MONTHS } from '../../InsertDatePanel.constants';
import type { CalendarDate, CalendarMonth } from '../../insertDatePanel.utils';
import { buildMonthCells, isSameMonth, shiftMonth } from '../../insertDatePanel.utils';
import {
  DayCell,
  DayGrid,
  EmptyCell,
  MonthHeader,
  MonthLabel,
  MonthNavButton,
  WeekDay,
  WeekHeader,
} from './CalendarMonthGrid.styles';

export interface CalendarMonthGridProps {
  view: CalendarMonth;
  selected: CalendarDate | null;
  today: CalendarDate;
  onViewChange: (view: CalendarMonth) => void;
  onSelect: (date: CalendarDate) => void;
}

const ICON_SIZE = 16;

// One month of days. Which month is shown and which date is chosen are the
// panel's, not this component's — it reads them and reports clicks, so the two
// facts don't end up living in two places.
export const CalendarMonthGrid = ({
  view,
  selected,
  today,
  onViewChange,
  onSelect,
}: CalendarMonthGridProps) => {
  const cells = buildMonthCells(view);

  // In RTL the chevron pointing right is the one going forward, which is why the
  // "next" control sits first in source order (main, Edit.tsx:1630).
  const handleStep = (delta: number) => () => onViewChange(shiftMonth(view, delta));

  const handleSelect = (day: number) => () => onSelect({ ...view, day });

  const isSelected = (day: number) =>
    !!selected && isSameMonth(selected, view) && selected.day === day;

  const isToday = (day: number) => isSameMonth(today, view) && today.day === day;

  return (
    <>
      <MonthHeader>
        <MonthNavButton type="button" aria-label="החודש הבא" onClick={handleStep(1)}>
          <ChevronRight size={ICON_SIZE} aria-hidden="true" />
        </MonthNavButton>
        <MonthLabel>
          {HE_MONTHS[view.month]} {view.year}
        </MonthLabel>
        <MonthNavButton type="button" aria-label="החודש הקודם" onClick={handleStep(-1)}>
          <ChevronLeft size={ICON_SIZE} aria-hidden="true" />
        </MonthNavButton>
      </MonthHeader>

      <WeekHeader>
        {HE_DAYS.map((day) => (
          <WeekDay key={day}>{day}</WeekDay>
        ))}
      </WeekHeader>

      <DayGrid>
        {cells.map((day, index) =>
          day === null ? (
            // Leading blanks have no identity beyond their position, and the row
            // they pad is fixed for the month being shown.
            // biome-ignore lint/suspicious/noArrayIndexKey: position is the only identity a blank has
            <EmptyCell key={`blank-${index}`} />
          ) : (
            <DayCell
              key={day}
              type="button"
              $selected={isSelected(day)}
              $today={isToday(day)}
              onClick={handleSelect(day)}
            >
              {day}
            </DayCell>
          ),
        )}
      </DayGrid>
    </>
  );
};
