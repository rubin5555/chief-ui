import { Check } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { DATA_IMPORT_IDS } from '../../DataImportModal.testids';
import type { DataImportPicker } from '../../useDataImportPicker';
import { PickerSearchInput } from '../PickerSearchInput';
import {
  CheckBox,
  ConfirmBtn,
  ConfirmSection,
  EmptyResults,
  InstanceList,
  InstanceRow,
  PickerCard,
  SearchSection,
} from './InstancePicker.styles';

interface InstancePickerProps {
  picker: DataImportPicker;
}

export const InstancePicker = ({ picker }: InstancePickerProps) => {
  const selectedCount = picker.selectedInstances.length;
  const debouncedSearch = useDebounce(picker.instanceSearch);
  const filteredInstances =
    picker.selectedOperation?.instances.filter((instance) => instance.includes(debouncedSearch)) ??
    [];

  const handleInstanceToggle = (instance: string) => () => picker.toggleInstance(instance);

  return (
    <PickerCard>
      <SearchSection>
        <PickerSearchInput
          value={picker.instanceSearch}
          onChange={picker.setInstanceSearch}
          placeholder="חיפוש ישות..."
          autoFocus
          data-testid={DATA_IMPORT_IDS.instanceSearchInput}
        />
      </SearchSection>
      <InstanceList>
        {filteredInstances.length > 0 ? (
          filteredInstances.map((instance) => {
            const isChecked = picker.selectedInstances.includes(instance);
            return (
              <InstanceRow
                key={instance}
                type="button"
                $isChecked={isChecked}
                onClick={handleInstanceToggle(instance)}
                data-testid={DATA_IMPORT_IDS.instanceRow(instance)}
              >
                <span>{instance}</span>
                <CheckBox $isChecked={isChecked}>
                  {isChecked && <Check size={10} strokeWidth={3} />}
                </CheckBox>
              </InstanceRow>
            );
          })
        ) : (
          <EmptyResults>
            <p>אין תוצאות</p>
          </EmptyResults>
        )}
      </InstanceList>
      <ConfirmSection>
        <ConfirmBtn
          type="button"
          $isEnabled={selectedCount > 0}
          onClick={picker.closeInstancePanel}
          data-testid={DATA_IMPORT_IDS.instanceConfirmBtn}
        >
          {selectedCount > 0 ? `אישור  ·  ${selectedCount} נבחרו` : 'בחר ישות'}
        </ConfirmBtn>
      </ConfirmSection>
    </PickerCard>
  );
};
