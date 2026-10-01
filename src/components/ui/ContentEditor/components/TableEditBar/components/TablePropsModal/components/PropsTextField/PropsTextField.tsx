import type { ChangeEvent } from 'react';
import { PropsField } from '../PropsField';
import { FieldInput } from './PropsTextField.styles';

export interface PropsTextFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  'data-testid'?: string;
}

export const PropsTextField = ({
  label,
  value,
  placeholder,
  onChange,
  'data-testid': testId,
}: PropsTextFieldProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value);

  return (
    <PropsField label={label}>
      <FieldInput
        type="text"
        dir="rtl"
        value={value}
        placeholder={placeholder}
        aria-label={label}
        data-testid={testId}
        onChange={handleChange}
      />
    </PropsField>
  );
};
