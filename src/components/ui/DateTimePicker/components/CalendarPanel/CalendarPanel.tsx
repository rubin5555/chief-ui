import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ChangeEvent, KeyboardEvent, Ref } from 'react';
import { DATE_TIME_PICKER_IDS } from '../../DateTimePicker.testids';
import type { CalendarDay, DropPos } from '../../DateTimePicker.utils';
import { dayKey, isSameDay, MONTH_LABELS, WEEKDAY_LABELS } from '../../DateTimePicker.utils';
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
} from './CalendarPanel.styles';

interface CalendarPanelProps {
  dropRef: Ref<HTMLDivElement>;
  dropPos: DropPos;
  calendarNav: {
    viewMonth: Date;
    days: CalendarDay[];
    selectedDate: Date | null;
    onPrevMonth: () => void;
    onNextMonth: () => void;
    onSelectDay: (day: Date) => () => void;
  };
  timeInputs: {
    hourInput: string;
    minuteInput: string;
    onHourChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onHourBlur: () => void;
    onMinuteChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onMinuteBlur: () => void;
    onTimeInputKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  };
  actions: {
    onClear: () => void;
    onNow: () => void;
    onApply: () => void;
  };
}

export const CalendarPanel = ({
  dropRef,
  dropPos,
  calendarNav,
  timeInputs,
  actions,
}: CalendarPanelProps) => {
  const today = new Date();

  return (
    <Dropdown ref={dropRef} data-testid={DATE_TIME_PICKER_IDS.dropdown} style={dropPos}>
      <MonthNavRow>
        <MonthNavBtn
          type="button"
          data-testid={DATE_TIME_PICKER_IDS.prevMonth}
          aria-label="חודש קודם"
          onClick={calendarNav.onPrevMonth}
        >
          <ChevronRight size={16} />
        </MonthNavBtn>
        <MonthLabel>
          {MONTH_LABELS[calendarNav.viewMonth.getMonth()]} {calendarNav.viewMonth.getFullYear()}
        </MonthLabel>
        <MonthNavBtn
          type="button"
          data-testid={DATE_TIME_PICKER_IDS.nextMonth}
          aria-label="חודש הבא"
          onClick={calendarNav.onNextMonth}
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
        {calendarNav.days.map(({ date, inMonth }) => (
          <DayBtn
            key={dayKey(date)}
            type="button"
            data-testid={DATE_TIME_PICKER_IDS.day(dayKey(date))}
            $inMonth={inMonth}
            $isToday={isSameDay(date, today)}
            $isSelected={!!calendarNav.selectedDate && isSameDay(date, calendarNav.selectedDate)}
            onClick={calendarNav.onSelectDay(date)}
          >
            {date.getDate()}
          </DayBtn>
        ))}
      </DayGrid>

      <TimeRow>
        <TimeInput
          value={timeInputs.hourInput}
          data-testid={DATE_TIME_PICKER_IDS.hourInput}
          onChange={timeInputs.onHourChange}
          onBlur={timeInputs.onHourBlur}
          onKeyDown={timeInputs.onTimeInputKeyDown}
          inputMode="numeric"
          aria-label="שעה"
        />
        <TimeColon>:</TimeColon>
        <TimeInput
          value={timeInputs.minuteInput}
          data-testid={DATE_TIME_PICKER_IDS.minuteInput}
          onChange={timeInputs.onMinuteChange}
          onBlur={timeInputs.onMinuteBlur}
          onKeyDown={timeInputs.onTimeInputKeyDown}
          inputMode="numeric"
          aria-label="דקות"
        />
      </TimeRow>

      <PanelFooter>
        <ClearBtn
          type="button"
          data-testid={DATE_TIME_PICKER_IDS.clearBtn}
          onClick={actions.onClear}
        >
          נקה
        </ClearBtn>
        <NowBtn type="button" data-testid={DATE_TIME_PICKER_IDS.nowBtn} onClick={actions.onNow}>
          עכשיו
        </NowBtn>
        <ApplyBtn
          type="button"
          data-testid={DATE_TIME_PICKER_IDS.applyBtn}
          onClick={actions.onApply}
        >
          אישור
        </ApplyBtn>
      </PanelFooter>
    </Dropdown>
  );
};
