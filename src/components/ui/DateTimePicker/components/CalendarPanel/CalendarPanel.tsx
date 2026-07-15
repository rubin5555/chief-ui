import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ChangeEvent, KeyboardEvent, Ref } from 'react';
import {
  ApplyBtn,
  ClearBtn,
  DayBtn,
  DayGrid,
  Dropdown,
  MonthLabel,
  MonthNavBtn,
  MonthNavRow,
  NowBtn,
  PanelFooter,
  TimeColon,
  TimeInput,
  TimeRow,
  WeekdayLabel,
  WeekdayRow,
} from '../../DateTimePicker.styles';
import { DATE_TIME_PICKER_IDS } from '../../DateTimePicker.testids';
import type { CalendarDay, DropPos } from '../../DateTimePicker.utils';
import { dayKey, isSameDay, MONTH_LABELS, WEEKDAY_LABELS } from '../../DateTimePicker.utils';

interface CalendarPanelProps {
  dropRef: Ref<HTMLDivElement>;
  dropPos: DropPos;
  viewMonth: Date;
  days: CalendarDay[];
  selectedDate: Date | null;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectDay: (day: Date) => () => void;
  hourInput: string;
  minuteInput: string;
  onHourChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onHourBlur: () => void;
  onMinuteChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onMinuteBlur: () => void;
  onTimeInputKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onClear: () => void;
  onNow: () => void;
  onApply: () => void;
}

export const CalendarPanel = ({
  dropRef,
  dropPos,
  viewMonth,
  days,
  selectedDate,
  onPrevMonth,
  onNextMonth,
  onSelectDay,
  hourInput,
  minuteInput,
  onHourChange,
  onHourBlur,
  onMinuteChange,
  onMinuteBlur,
  onTimeInputKeyDown,
  onClear,
  onNow,
  onApply,
}: CalendarPanelProps) => {
  const today = new Date();

  return (
    <Dropdown ref={dropRef} data-testid={DATE_TIME_PICKER_IDS.dropdown} style={dropPos}>
      <MonthNavRow>
        <MonthNavBtn
          type="button"
          data-testid={DATE_TIME_PICKER_IDS.prevMonth}
          aria-label="חודש קודם"
          onClick={onPrevMonth}
        >
          <ChevronRight size={16} />
        </MonthNavBtn>
        <MonthLabel>
          {MONTH_LABELS[viewMonth.getMonth()]} {viewMonth.getFullYear()}
        </MonthLabel>
        <MonthNavBtn
          type="button"
          data-testid={DATE_TIME_PICKER_IDS.nextMonth}
          aria-label="חודש הבא"
          onClick={onNextMonth}
        >
          <ChevronLeft size={16} />
        </MonthNavBtn>
      </MonthNavRow>

      <WeekdayRow>
        {WEEKDAY_LABELS.map((label) => (
          <WeekdayLabel key={label}>{label}</WeekdayLabel>
        ))}
      </WeekdayRow>

      <DayGrid>
        {days.map(({ date, inMonth }) => (
          <DayBtn
            key={dayKey(date)}
            type="button"
            data-testid={DATE_TIME_PICKER_IDS.day(dayKey(date))}
            $inMonth={inMonth}
            $isToday={isSameDay(date, today)}
            $isSelected={!!selectedDate && isSameDay(date, selectedDate)}
            onClick={onSelectDay(date)}
          >
            {date.getDate()}
          </DayBtn>
        ))}
      </DayGrid>

      <TimeRow>
        <TimeInput
          value={hourInput}
          data-testid={DATE_TIME_PICKER_IDS.hourInput}
          onChange={onHourChange}
          onBlur={onHourBlur}
          onKeyDown={onTimeInputKeyDown}
          inputMode="numeric"
          aria-label="שעה"
        />
        <TimeColon>:</TimeColon>
        <TimeInput
          value={minuteInput}
          data-testid={DATE_TIME_PICKER_IDS.minuteInput}
          onChange={onMinuteChange}
          onBlur={onMinuteBlur}
          onKeyDown={onTimeInputKeyDown}
          inputMode="numeric"
          aria-label="דקות"
        />
      </TimeRow>

      <PanelFooter>
        <ClearBtn type="button" data-testid={DATE_TIME_PICKER_IDS.clearBtn} onClick={onClear}>
          נקה
        </ClearBtn>
        <NowBtn type="button" data-testid={DATE_TIME_PICKER_IDS.nowBtn} onClick={onNow}>
          עכשיו
        </NowBtn>
        <ApplyBtn type="button" data-testid={DATE_TIME_PICKER_IDS.applyBtn} onClick={onApply}>
          אישור
        </ApplyBtn>
      </PanelFooter>
    </Dropdown>
  );
};
