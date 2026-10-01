import { Select } from '@/components/ui/Select';
import { ENTITY_NAMES, ENTITY_TYPE_OPTIONS } from '../../EditDocDetailsModal.constants';
import { EDIT_DOC_DETAILS_MODAL_IDS } from '../../EditDocDetailsModal.testids';
import { SelectorRow } from './EntitySelector.styles';

export interface EntitySelectorProps {
  entityType: string;
  entityName: string;
  onTypeChange: (entityType: string) => void;
  onNameChange: (entityName: string) => void;
}

export const EntitySelector = ({
  entityType,
  entityName,
  onTypeChange,
  onNameChange,
}: EntitySelectorProps) => {
  const handleTypeChange = (nextType: string) => {
    onTypeChange(nextType);
    if (nextType !== entityType) onNameChange('');
  };

  return (
    <SelectorRow>
      <Select
        options={ENTITY_TYPE_OPTIONS}
        value={entityType}
        onChange={handleTypeChange}
        data-testid={EDIT_DOC_DETAILS_MODAL_IDS.entityTypeSelect}
      />
      <Select
        options={ENTITY_NAMES[entityType] ?? []}
        value={entityName}
        placeholder="בחר שם"
        onChange={onNameChange}
        data-testid={EDIT_DOC_DETAILS_MODAL_IDS.entityNameSelect}
      />
    </SelectorRow>
  );
};
