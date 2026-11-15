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
