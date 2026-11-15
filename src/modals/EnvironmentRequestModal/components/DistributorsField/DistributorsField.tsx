import { memo } from 'react';
import { SearchableMultiSelect } from '@/components/ui/SearchableMultiSelect';
import { ENV_PEOPLE_OPTIONS } from '../../EnvironmentRequestModal.constants';
import { ENV_REQUEST_MODAL_IDS } from '../../EnvironmentRequestModal.testids';
import { FieldGroup, FieldLabel } from '../components.shared.styles';

interface DistributorsFieldProps {
  value: string[];
  onChange: (distributors: string[]) => void;
}

const DistributorsFieldComponent = ({ value, onChange }: DistributorsFieldProps) => (
  <FieldGroup>
    <FieldLabel>מפיצי המסמך</FieldLabel>
    <SearchableMultiSelect
      data-testid={ENV_REQUEST_MODAL_IDS.distributorsSelect}
      options={ENV_PEOPLE_OPTIONS}
      selected={value}
      onChange={onChange}
      placeholder="בחר מפיצים..."
    />
  </FieldGroup>
);

export const DistributorsField = memo(DistributorsFieldComponent);
