import { Search } from 'lucide-react';
import type { ChangeEvent, ReactNode } from 'react';
import { SearchIcon, SearchInput, SearchInputWrap } from './ModalSearchInput.styles';

interface ModalSearchInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  onFocus?: () => void;
  onBlur?: () => void;
  trailing?: ReactNode;
  autoFocus?: boolean;
}

export const ModalSearchInput = ({
  value,
  onChange,
  placeholder,
  onFocus,
  onBlur,
  trailing,
  autoFocus,
}: ModalSearchInputProps) => (
  <SearchInputWrap>
    <SearchIcon>
      <Search size={14} />
    </SearchIcon>
    <SearchInput
      type="text"
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder={placeholder}
      autoComplete="new-password"
      autoFocus={autoFocus}
      dir="rtl"
      $hasTrailing={!!trailing}
    />
    {trailing}
  </SearchInputWrap>
);
