import { Search } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { SearchFieldIcon, SearchFieldInput, SearchFieldWrap } from './DialogSearchField.styles';

export interface DialogSearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  'data-testid'?: string;
}

/**
 * The search field a dialog uses, as opposed to `ui/SearchBar` — which is the
 * navbar's frosted pill and reads as a piece of chrome when it lands inside a
 * modal. This is main's plain bordered field: a white box, a hairline that
 * turns navy on focus, and the magnifier pinned to the leading edge.
 */
export const DialogSearchField = ({
  value,
  onChange,
  placeholder = 'חיפוש...',
  autoFocus,
  'data-testid': testId,
}: DialogSearchFieldProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value);

  return (
    <SearchFieldWrap>
      <SearchFieldIcon>
        <Search size={16} />
      </SearchFieldIcon>
      <SearchFieldInput
        autoFocus={autoFocus}
        dir="rtl"
        value={value}
        placeholder={placeholder}
        data-testid={testId}
        onChange={handleChange}
      />
    </SearchFieldWrap>
  );
};
