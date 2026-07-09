import { Search, X } from 'lucide-react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import { gray } from '@/styles/theme';
import { SearchCloseButton, SearchField, SearchFieldInput } from './DocActionToolbar.styles';
import { DOC_ACTION_TOOLBAR_IDS } from './DocActionToolbar.testids';

interface DocSearchFieldProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onClose: () => void;
}

export const DocSearchField = ({ value, onChange, onKeyDown, onClose }: DocSearchFieldProps) => (
  <SearchField>
    <Search size={12} color={gray[500]} />
    <SearchFieldInput
      autoFocus
      data-testid={DOC_ACTION_TOOLBAR_IDS.searchInput}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
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
