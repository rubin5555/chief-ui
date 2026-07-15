import { memo } from 'react';
import { Select } from '@/components/ui/Select';
import { BODY_TYPE_OPTIONS } from '../../EnvironmentRequestModal.constants';
import { FieldGroup, FieldLabel } from '../../EnvironmentRequestModal.styles';
import { ENV_REQUEST_MODAL_IDS } from '../../EnvironmentRequestModal.testids';

interface BodyTypeFieldProps {
  value: string;
  onChange: (bodyType: string) => void;
}

const BodyTypeFieldComponent = ({ value, onChange }: BodyTypeFieldProps) => (
  <FieldGroup>
    <FieldLabel htmlFor="env-body-type">סוג הגוף</FieldLabel>
    <Select
      id="env-body-type"
      data-testid={ENV_REQUEST_MODAL_IDS.bodyTypeSelect}
      options={BODY_TYPE_OPTIONS}
      value={value}
      onChange={onChange}
      placeholder="בחר סוג גוף..."
    />
  </FieldGroup>
);

export const BodyTypeField = memo(BodyTypeFieldComponent);
