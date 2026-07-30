import type { ChangeEvent } from 'react';
import { joinTime, splitTime } from '../../insertDatePanel.utils';
import { TimeColon, TimeInput, TimeInputs } from './TimeRow.styles';

export interface TimeRowProps {
  value: string;
  onChange: (value: string) => void;
}

export const TimeRow = ({ value, onChange }: TimeRowProps) => {
  const { hours, minutes } = splitTime(value);

  const handleHoursChange = (event: ChangeEvent<HTMLInputElement>) =>
    onChange(joinTime(event.target.value.replace(/\D/g, '').slice(0, 2), minutes));

  const handleMinutesChange = (event: ChangeEvent<HTMLInputElement>) =>
    onChange(joinTime(hours, event.target.value.replace(/\D/g, '').slice(0, 2)));

  return (
    <TimeInputs>
      <TimeInput
        type="text"
        inputMode="numeric"
        maxLength={2}
        aria-label="שעות"
        value={hours}
        onChange={handleHoursChange}
      />
      <TimeColon>:</TimeColon>
      <TimeInput
        type="text"
        inputMode="numeric"
        maxLength={2}
        aria-label="דקות"
        value={minutes}
        onChange={handleMinutesChange}
      />
    </TimeInputs>
  );
};
