import type { ChangeEvent, KeyboardEvent } from 'react';
import { useRef, useState } from 'react';
import { useClickOutside } from '@/hooks/useClickOutside';
import { CalendarPanel } from './components/CalendarPanel';
import { CalendarIcon, Trigger, TriggerText } from './DateTimePicker.styles';
import { DATE_TIME_PICKER_IDS } from './DateTimePicker.testids';
import type { DropPos } from './DateTimePicker.utils';
import {
  buildCalendarGrid,
  clamp,
  computeDropPos,
  formatDateTimeLocal,
  formatDisplayValue,
  pad,
  parseDateTimeLocal,
} from './DateTimePicker.utils';

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
        <CalendarPanel
          dropRef={dropRef}
          dropPos={dropPos}
          calendarNav={{
            viewMonth,
            days,
            selectedDate,
            onPrevMonth,
            onNextMonth,
            onSelectDay,
          }}
          timeInputs={{
            hourInput,
            minuteInput,
            onHourChange,
            onHourBlur,
            onMinuteChange,
            onMinuteBlur,
            onTimeInputKeyDown,
          }}
          actions={{ onClear, onNow, onApply: closeDropdown }}
        />
      )}
    </>
  );
};
