import { Search } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { SearchIconSlot, SearchInput, SearchWrap } from './PickerSearchInput.styles';

interface PickerSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  onFocus?: () => void;
  onBlur?: () => void;
  autoFocus?: boolean;
  'data-testid'?: string;
}

export const PickerSearchInput = ({
  value,
  onChange,
  placeholder,
  onFocus,
  onBlur,
  autoFocus,
  'data-testid': testId,
}: PickerSearchInputProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value);

  return (
    <SearchWrap>
      <SearchIconSlot>
        <Search size={12} />
      </SearchIconSlot>
      <SearchInput
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        dir="rtl"
        autoFocus={autoFocus}
        data-testid={testId}
      />
    </SearchWrap>
  );
};
