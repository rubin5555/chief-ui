import { memo } from 'react';
import { MultiSelectDropdown } from '@/components/ui/MultiSelectDropdown';
import { DEPARTMENT_OPTIONS, TEMPLATE_OPTIONS } from '../../EnvironmentRequestModal.constants';
import { FieldGrid, FieldGroup, FieldLabel } from '../../EnvironmentRequestModal.styles';
import { ENV_REQUEST_MODAL_IDS } from '../../EnvironmentRequestModal.testids';

interface TemplatesAndDepartmentsFieldsProps {
  templates: string[];
  departments: string[];
  onTemplatesChange: (templates: string[]) => void;
  onDepartmentsChange: (departments: string[]) => void;
}

const TemplatesAndDepartmentsFieldsComponent = ({
  templates,
  departments,
  onTemplatesChange,
  onDepartmentsChange,
}: TemplatesAndDepartmentsFieldsProps) => (
  <FieldGrid>
    <FieldGroup>
      <FieldLabel>בחירת תבניות</FieldLabel>
      <MultiSelectDropdown
        data-testid={ENV_REQUEST_MODAL_IDS.templatesSelect}
        options={TEMPLATE_OPTIONS}
        selected={templates}
        onChange={onTemplatesChange}
        placeholder="בחר תבניות..."
      />
    </FieldGroup>
    <FieldGroup>
      <FieldLabel>בחירת מחלקות</FieldLabel>
      <MultiSelectDropdown
        data-testid={ENV_REQUEST_MODAL_IDS.departmentsSelect}
        options={DEPARTMENT_OPTIONS}
        selected={departments}
        onChange={onDepartmentsChange}
        placeholder="בחר מחלקות..."
      />
    </FieldGroup>
  </FieldGrid>
);

export const TemplatesAndDepartmentsFields = memo(TemplatesAndDepartmentsFieldsComponent);
