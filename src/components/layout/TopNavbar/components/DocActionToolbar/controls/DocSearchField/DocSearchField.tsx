import { Search, X } from 'lucide-react';
import { type ChangeEvent, type KeyboardEvent, useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { gray } from '@/styles/theme';
import { SEARCH_DEBOUNCE_MS } from '../../DocActionToolbar.constants';
import { SearchCloseButton, SearchField, SearchFieldInput } from '../../DocActionToolbar.styles';
import { DOC_ACTION_TOOLBAR_IDS } from '../../DocActionToolbar.testids';

interface DocSearchFieldProps {
  initialValue: string;
  onChange: (query: string) => void;
  onClose: () => void;
}

export const DocSearchField = ({ initialValue, onChange, onClose }: DocSearchFieldProps) => {
  const [value, setValue] = useState(initialValue);
  const debouncedValue = useDebounce(value, SEARCH_DEBOUNCE_MS);

  // biome-ignore lint/correctness/useExhaustiveDependencies: see comment above
  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue]);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value);

  const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') onClose();
  };

  return (
    <SearchField>
      <Search size={12} color={gray[500]} />
      <SearchFieldInput
        autoFocus
        aria-label="חיפוש במסמך"
        data-testid={DOC_ACTION_TOOLBAR_IDS.searchInput}
        value={value}
        onChange={onInputChange}
        onKeyDown={onInputKeyDown}
        placeholder="חיפוש במסמך..."
        dir="rtl"
      />
      <SearchCloseButton
        type="button"
        aria-label="סגירת חיפוש"
        data-testid={DOC_ACTION_TOOLBAR_IDS.searchClose}
        onClick={onClose}
      >
        <X size={12} color={gray[500]} />
      </SearchCloseButton>
    </SearchField>
  );
};
