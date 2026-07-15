import type { ChangeEvent } from 'react';
import { memo } from 'react';
import {
  FieldGrid,
  FieldGroup,
  FieldInput,
  FieldLabel,
} from '../../EnvironmentRequestModal.styles';
import { ENV_REQUEST_MODAL_IDS } from '../../EnvironmentRequestModal.testids';

interface PhoneFieldsProps {
  mobilePhone: string;
  redPhone: string;
  onMobilePhoneChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onRedPhoneChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const PhoneFieldsComponent = ({
  mobilePhone,
  redPhone,
  onMobilePhoneChange,
  onRedPhoneChange,
}: PhoneFieldsProps) => (
  <FieldGrid>
    <FieldGroup>
      <FieldLabel htmlFor="env-mobile-phone">טלפון נייד ליצירת קשר</FieldLabel>
      <FieldInput
        id="env-mobile-phone"
        data-testid={ENV_REQUEST_MODAL_IDS.mobilePhoneInput}
        type="tel"
        value={mobilePhone}
        onChange={onMobilePhoneChange}
        placeholder="05X-XXXXXXX"
        dir="ltr"
      />
    </FieldGroup>
    <FieldGroup>
      <FieldLabel htmlFor="env-red-phone">טלפון אדום ליצירת קשר</FieldLabel>
      <FieldInput
        id="env-red-phone"
        data-testid={ENV_REQUEST_MODAL_IDS.redPhoneInput}
        type="tel"
        value={redPhone}
        onChange={onRedPhoneChange}
        placeholder="XXXX"
        dir="ltr"
      />
    </FieldGroup>
  </FieldGrid>
);

export const PhoneFields = memo(PhoneFieldsComponent);
