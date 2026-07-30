import { Search } from 'lucide-react';
import { useState } from 'react';
import { DOC_ACTION_TOOLBAR_IDS } from '../../DocActionToolbar.testids';
import { IconAction } from '../controls.shared.styles';
import { DocSearchField } from '../DocSearchField';

const noop = () => {};

interface SearchControlProps {
  value: string;
  onToggle: (isOpen: boolean) => void;
  onSearchChange?: (query: string) => void;
}

export const SearchControl = ({ value, onToggle, onSearchChange }: SearchControlProps) => {
  const [searchActive, setSearchActive] = useState(() => value !== '');

  const onOpen = () => {
    setSearchActive(true);
    onToggle(true);
  };

  const onClose = () => {
    setSearchActive(false);
    onToggle(false);
    onSearchChange?.('');
  };

  if (searchActive) {
    return (
      <DocSearchField initialValue={value} onChange={onSearchChange ?? noop} onClose={onClose} />
    );
  }

  return (
    <IconAction
      type="button"
      title="חיפוש במסמך"
      aria-label="חיפוש במסמך"
      data-testid={DOC_ACTION_TOOLBAR_IDS.searchToggle}
      onClick={onOpen}
    >
      <Search size={16} />
    </IconAction>
  );
};
