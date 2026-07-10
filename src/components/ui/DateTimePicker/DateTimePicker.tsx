import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import { useRef, useState } from 'react';
import { useClickOutside } from '@/hooks/useClickOutside';
import {
  ApplyBtn,
  CalendarIcon,
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
  Trigger,
  TriggerText,
  WeekdayLabel,
  WeekdayRow,
} from './DateTimePicker.styles';
import { DATE_TIME_PICKER_IDS } from './DateTimePicker.testids';
import {
  buildCalendarGrid,
  clamp,
  dayKey,
  formatDateTimeLocal,
  formatDisplayValue,
  isSameDay,
  MONTH_LABELS,
  pad,
  parseDateTimeLocal,
  WEEKDAY_LABELS,
} from './DateTimePicker.utils';

interface DropPos {
  top?: number;
  bottom?: number;
  left: number;
}

const PANEL_WIDTH = 280;
const PANEL_HEIGHT = 360;
const EDGE_MARGIN = 8;
const GAP = 4;

const computeDropPos = (rect: DOMRect): DropPos => {
  const spaceBelow = window.innerHeight - rect.bottom - GAP - EDGE_MARGIN;
  const spaceAbove = rect.top - GAP - EDGE_MARGIN;
  const left = clamp(EDGE_MARGIN, window.innerWidth - PANEL_WIDTH - EDGE_MARGIN, rect.left);

  // flip upward when there isn't enough room below but there's more room above — mirrors
  // the same rule Select's dropdown uses so both floating panels behave consistently
  if (spaceBelow < PANEL_HEIGHT && spaceAbove > spaceBelow) {
    return { bottom: window.innerHeight - rect.top + GAP, left };
  }
  return { top: rect.bottom + GAP, left };
};

interface DateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  'aria-label'?: string;
  'data-testid'?: string;
}

export const DateTimePicker = ({
  value,
  onChange,
  id,
  'aria-label': ariaLabel,
  'data-testid': testId,
}: DateTimePickerProps) => {
  const selectedDate = parseDateTimeLocal(value);
  const [isOpen, setIsOpen] = useState(false);
  const [dropPos, setDropPos] = useState<DropPos | null>(null);
  const [viewMonth, setViewMonth] = useState(() => selectedDate ?? new Date());
  const [hourInput, setHourInput] = useState('');
  const [minuteInput, setMinuteInput] = useState('');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const base = testId ?? DATE_TIME_PICKER_IDS.root;

  const closeDropdown = () => setIsOpen(false);
  useClickOutside([triggerRef, dropRef], closeDropdown, isOpen);

  const openDropdown = () => {
    if (triggerRef.current) setDropPos(computeDropPos(triggerRef.current.getBoundingClientRect()));
    const anchor = selectedDate ?? new Date();
    setViewMonth(anchor);
    setHourInput(pad(anchor.getHours()));
    setMinuteInput(pad(anchor.getMinutes()));
    setIsOpen(true);
  };

  const onTriggerClick = () => (isOpen ? closeDropdown() : openDropdown());

  const commit = (date: Date) => onChange(formatDateTimeLocal(date));

  const onSelectDay = (day: Date) => () => {
    const hours = clamp(0, 23, Number(hourInput) || 0);
    const minutes = clamp(0, 59, Number(minuteInput) || 0);
    commit(new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours, minutes));
  };

  const onPrevMonth = () => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  const onNextMonth = () => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));

  // Typing a time before any day is picked only primes the local inputs — it's applied once
  // a day is actually selected (see onSelectDay), since there's no date to attach it to yet.
  const applyTime = (hours: number, minutes: number) => {
    if (!selectedDate) return;
    commit(
      new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        hours,
        minutes,
      ),
    );
  };

  const onHourChange = (e: ChangeEvent<HTMLInputElement>) =>
    setHourInput(e.target.value.replace(/\D/g, '').slice(0, 2));
  const onHourBlur = () => {
    const hours = clamp(0, 23, Number(hourInput) || 0);
    setHourInput(pad(hours));
    applyTime(hours, Number(minuteInput) || 0);
  };

  const onMinuteChange = (e: ChangeEvent<HTMLInputElement>) =>
    setMinuteInput(e.target.value.replace(/\D/g, '').slice(0, 2));
  const onMinuteBlur = () => {
    const minutes = clamp(0, 59, Number(minuteInput) || 0);
    setMinuteInput(pad(minutes));
    applyTime(Number(hourInput) || 0, minutes);
  };

  const onTimeInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') e.currentTarget.blur();
  };

  const onNow = () => {
    const now = new Date();
    setViewMonth(now);
    setHourInput(pad(now.getHours()));
    setMinuteInput(pad(now.getMinutes()));
    commit(now);
  };

  const onClear = () => {
    onChange('');
    closeDropdown();
  };

  const days = buildCalendarGrid(viewMonth);
  const today = new Date();

  return (
    <>
      <Trigger
        ref={triggerRef}
        type="button"
        id={id}
        data-testid={base}
        aria-label={ariaLabel}
        $isPlaceholder={!selectedDate}
        onClick={onTriggerClick}
      >
        <CalendarIcon size={14} />
        <TriggerText>
          {selectedDate ? formatDisplayValue(selectedDate) : 'בחר תאריך ושעה'}
        </TriggerText>
      </Trigger>

      {isOpen && dropPos && (
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
            <ApplyBtn
              type="button"
              data-testid={DATE_TIME_PICKER_IDS.applyBtn}
              onClick={closeDropdown}
            >
              אישור
            </ApplyBtn>
          </PanelFooter>
        </Dropdown>
      )}
    </>
  );
};
