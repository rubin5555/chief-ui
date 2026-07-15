import { memo } from 'react';
import { SearchableSelect } from '@/components/ui/SearchableSelect';
import { CREATOR_SLOTS, ENV_PEOPLE_OPTIONS } from '../../EnvironmentRequestModal.constants';
import {
  CreatorsStack,
  FieldGroup,
  FieldLabel,
  FieldSubLabel,
} from '../../EnvironmentRequestModal.styles';
import { ENV_REQUEST_MODAL_IDS } from '../../EnvironmentRequestModal.testids';

interface CreatorsFieldProps {
  value: string[];
  onChange: (index: number) => (v: string) => void;
}

const CreatorsFieldComponent = ({ value, onChange }: CreatorsFieldProps) => (
  <FieldGroup>
    <FieldLabel>
      יוצרי המסמכים
      <FieldSubLabel>(עד 3)</FieldSubLabel>
    </FieldLabel>
    <CreatorsStack>
      {CREATOR_SLOTS.map((index) => (
        <SearchableSelect
          key={index}
          data-testid={ENV_REQUEST_MODAL_IDS.creatorSelect(index)}
          options={ENV_PEOPLE_OPTIONS}
          value={value[index] ?? ''}
          onChange={onChange(index)}
          placeholder={`שם יוצר ${index + 1}...`}
        />
      ))}
    </CreatorsStack>
  </FieldGroup>
);

export const CreatorsField = memo(CreatorsFieldComponent);
