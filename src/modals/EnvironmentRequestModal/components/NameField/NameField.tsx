import type { ChangeEvent } from 'react';
import { memo } from 'react';
import { ENV_REQUEST_MODAL_IDS } from '../../EnvironmentRequestModal.testids';
import { FieldGroup, FieldInput, FieldLabel } from '../components.shared.styles';

interface NameFieldProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const NameFieldComponent = ({ value, onChange }: NameFieldProps) => (
  <FieldGroup>
    <FieldLabel htmlFor="env-name">שם הגוף</FieldLabel>
    <FieldInput
      id="env-name"
      data-testid={ENV_REQUEST_MODAL_IDS.nameInput}
      type="text"
      value={value}
      onChange={onChange}
      placeholder="הזן שם הגוף..."
      dir="rtl"
    />
  </FieldGroup>
);

export const NameField = memo(NameFieldComponent);
