import { X } from 'lucide-react';
import type { ChangeEvent, MouseEvent } from 'react';
import { NAME_SEARCH_OPTIONS_FALLBACK, useNameSearchOptions } from '@/api/nameSearchOptions';
import { DateTimePicker } from '@/components/ui/DateTimePicker';
import { Toggle } from '@/components/ui/Toggle';
import { useDebounce } from '@/hooks/useDebounce';
import type { SourceOperation } from '../../DataImportModal.constants';
import { DATA_IMPORT_IDS } from '../../DataImportModal.testids';
import type { DataImportPicker } from '../../hooks/useDataImportPicker';
import { PickerSearchInput } from '../PickerSearchInput';
import {
  ClearNameBtn,
  NameDropdown,
  NameDropdownScroll,
  NameField,
  NameOption,
  NoResults,
  ParamLabel,
  ParamsBody,
  QuantityInput,
  QuantityRow,
  SelectedName,
  ToggleRow,
} from './OperationParams.styles';

interface OperationParamsProps {
  operation: SourceOperation;
  picker: DataImportPicker;
}

const NAME_DROPDOWN_BLUR_DELAY_MS = 150;

export const OperationParams = ({ operation, picker }: OperationParamsProps) => {
  const params = picker.getParams(operation.id);
  const nameSearch = picker.nameSearchByOperation[operation.id] ?? '';
  const debouncedNameSearch = useDebounce(nameSearch);
  const isNameDropdownOpen = picker.nameDropdownOperationId === operation.id;

  const { data } = useNameSearchOptions();
  const nameSearchOptions = data ?? NAME_SEARCH_OPTIONS_FALLBACK.nameSearchOptions;

  const filteredNames = nameSearchOptions.filter(
    (name) => debouncedNameSearch.trim() === '' || name.includes(debouncedNameSearch.trim()),
  );

  const handleNameSearchChange = (value: string) => {
    picker.setNameSearch(operation.id, value);
    picker.setNameDropdownOperationId(operation.id);
  };
  const handleNameSearchFocus = () => picker.setNameDropdownOperationId(operation.id);
  const handleNameSearchBlur = () =>
    setTimeout(() => picker.setNameDropdownOperationId(null), NAME_DROPDOWN_BLUR_DELAY_MS);
  const handleNamePick = (name: string) => (e: MouseEvent) => {
    e.preventDefault();
    picker.pickName(operation.id, name);
  };
  const handleNameClear = () => picker.patchParams(operation.id, { name: '' });
  const handleDateChange = (value: string) => picker.patchParams(operation.id, { date: value });
  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) =>
    picker.patchParams(operation.id, { quantity: e.target.value.replace(/[^\d]/g, '') });
  const handleQuestionChange = (checked: boolean) =>
    picker.patchParams(operation.id, { question: checked });

  return (
    <ParamsBody>
      <NameField>
        <PickerSearchInput
          value={nameSearch}
          onChange={handleNameSearchChange}
          onFocus={handleNameSearchFocus}
          onBlur={handleNameSearchBlur}
          placeholder="חיפוש שם..."
          data-testid={DATA_IMPORT_IDS.nameSearchInput(operation.id)}
        />
        {isNameDropdownOpen && (
          <NameDropdown>
            <NameDropdownScroll>
              {filteredNames.length > 0 ? (
                filteredNames.map((name) => (
                  <NameOption
                    key={name}
                    type="button"
                    $isSelected={params.name === name}
                    onMouseDown={handleNamePick(name)}
                    data-testid={DATA_IMPORT_IDS.nameOption(name)}
                  >
                    <span>{name}</span>
                  </NameOption>
                ))
              ) : (
                <NoResults>אין תוצאות</NoResults>
              )}
            </NameDropdownScroll>
          </NameDropdown>
        )}
        {params.name && (
          <SelectedName data-testid={DATA_IMPORT_IDS.selectedName(operation.id)}>
            <span>{params.name}</span>
            <ClearNameBtn type="button" onClick={handleNameClear} aria-label="ניקוי שם">
              <X size={12} />
            </ClearNameBtn>
          </SelectedName>
        )}
      </NameField>

      <div>
        <ParamLabel>תאריך</ParamLabel>
        <DateTimePicker value={params.date} onChange={handleDateChange} aria-label="תאריך" />
      </div>

      <QuantityRow>
        <ParamLabel>כמות</ParamLabel>
        <QuantityInput
          type="text"
          inputMode="numeric"
          value={params.quantity}
          onChange={handleQuantityChange}
          placeholder="הכנס מספר"
          dir="ltr"
          data-testid={DATA_IMPORT_IDS.quantityInput(operation.id)}
        />
      </QuantityRow>

      <ToggleRow>
        <ParamLabel>שאלה</ParamLabel>
        <Toggle
          checked={params.question}
          onChange={handleQuestionChange}
          aria-label="שאלה"
          data-testid={DATA_IMPORT_IDS.questionToggle(operation.id)}
        />
      </ToggleRow>
    </ParamsBody>
  );
};
