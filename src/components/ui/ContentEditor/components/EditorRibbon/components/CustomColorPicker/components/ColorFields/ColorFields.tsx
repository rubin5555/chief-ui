import type { ChangeEvent } from 'react';
import type { Rgb } from '../../customColorPicker.utils';
import { hexToRgb } from '../../customColorPicker.utils';
import { CHANNEL_LABELS, HEX_LENGTH, MAX_CHANNEL } from './ColorFields.constants';
import {
  ChannelInput,
  Field,
  FieldLabel,
  FieldsRow,
  HexHash,
  HexInput,
  HexShell,
} from './ColorFields.styles';

export interface ColorFieldsProps {
  hex: string;
  rgb: Rgb;
  onHexChange: (hex: string) => void;
  onRgbChange: (rgb: Rgb) => void;
}

export const ColorFields = ({ hex, rgb, onHexChange, onRgbChange }: ColorFieldsProps) => {
  const handleHexChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value.replace(/[^a-fA-F0-9]/g, '').slice(0, HEX_LENGTH);
    onHexChange(next);
    if (next.length !== HEX_LENGTH) return;
    const parsed = hexToRgb(`#${next}`);
    if (parsed) onRgbChange(parsed);
  };

  const handleChannelChange = (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
    const digits = Number(event.target.value.replace(/\D/g, '')) || 0;
    const next: Rgb = [...rgb];
    next[index] = Math.max(0, Math.min(MAX_CHANNEL, digits));
    onRgbChange(next);
  };

  return (
    <FieldsRow>
      <Field $grow={2}>
        <FieldLabel>הקסדצימלי</FieldLabel>
        <HexShell>
          <HexHash>#</HexHash>
          <HexInput value={hex} onChange={handleHexChange} aria-label="ערך הקסדצימלי" />
        </HexShell>
      </Field>

      {CHANNEL_LABELS.map((label, index) => (
        <Field key={label} $grow={1}>
          <FieldLabel>{label}</FieldLabel>
          <ChannelInput
            type="text"
            inputMode="numeric"
            aria-label={label}
            value={rgb[index]}
            onChange={handleChannelChange(index)}
          />
        </Field>
      ))}
    </FieldsRow>
  );
};
