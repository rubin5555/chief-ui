import type { ChangeEvent } from 'react';
import { FieldInput, FieldLabel, FieldRow, FieldValue } from './DocLetterheadField.styles';
import { DOC_LETTERHEAD_FIELD_IDS } from './DocLetterheadField.testids';

export interface DocLetterheadFieldProps {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  readOnly: boolean;
  onChange: (value: string) => void;
}

// One labelled line of the letterhead (main's DocHeaderField, Edit.tsx:517).
//
// Read-only renders a span rather than a disabled input: on a distributed
// document these are printed facts, and an input — even one you can't type in —
// still reads as something you might be able to fill in. The placeholder shows
// through in that state too, which is main's behaviour and keeps an empty line
// from collapsing.
export const DocLetterheadField = ({
  id,
  label,
  value,
  placeholder,
  readOnly,
  onChange,
}: DocLetterheadFieldProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value);

  return (
    <FieldRow>
      <FieldLabel>{label}</FieldLabel>
      {readOnly ? (
        <FieldValue>{value || placeholder || ''}</FieldValue>
      ) : (
        <FieldInput
          value={value}
          placeholder={placeholder}
          dir="rtl"
          aria-label={label}
          data-testid={DOC_LETTERHEAD_FIELD_IDS.input(id)}
          onChange={handleChange}
        />
      )}
    </FieldRow>
  );
};
