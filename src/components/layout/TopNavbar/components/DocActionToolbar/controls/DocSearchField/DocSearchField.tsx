import { Search, X } from 'lucide-react';
import { type ChangeEvent, type KeyboardEvent, useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { gray } from '@/styles/theme';
import { SEARCH_DEBOUNCE_MS } from '../../DocActionToolbar.constants';
import { SearchCloseButton, SearchField, SearchFieldInput } from '../../DocActionToolbar.styles';
import { DOC_ACTION_TOOLBAR_IDS } from '../../DocActionToolbar.testids';

interface DocSearchFieldProps {
  onChange: (query: string) => void;
  onClose: () => void;
}

// Owns its own keystroke-level value/debounce so typing here only re-renders
// this field, not the whole toolbar — only the debounced query bubbles up.
export const DocSearchField = ({ onChange, onClose }: DocSearchFieldProps) => {
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value);

  const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') onClose();
  };

  return (
    <SearchField>
      <Search size={12} color={gray[500]} />
      <SearchFieldInput
        autoFocus
        data-testid={DOC_ACTION_TOOLBAR_IDS.searchInput}
        value={value}
        onChange={onInputChange}
        onKeyDown={onInputKeyDown}
        placeholder="חיפוש במסמך..."
        dir="rtl"
      />
      <SearchCloseButton
        type="button"
        data-testid={DOC_ACTION_TOOLBAR_IDS.searchClose}
        onClick={onClose}
      >
        <X size={12} color={gray[500]} />
      </SearchCloseButton>
    </SearchField>
  );
};
