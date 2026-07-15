import { Search } from 'lucide-react';
import { useState } from 'react';
import { IconAction } from '../../DocActionToolbar.styles';
import { DOC_ACTION_TOOLBAR_IDS } from '../../DocActionToolbar.testids';
import { DocSearchField } from '../DocSearchField';

const noop = () => {};

interface SearchControlProps {
  onToggle: (isOpen: boolean) => void;
  onSearchChange?: (query: string) => void;
}

export const SearchControl = ({ onToggle, onSearchChange }: SearchControlProps) => {
  const [searchActive, setSearchActive] = useState(false);

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
    return <DocSearchField onChange={onSearchChange ?? noop} onClose={onClose} />;
  }

  return (
    <IconAction
      type="button"
      title="חיפוש במסמך"
      data-testid={DOC_ACTION_TOOLBAR_IDS.searchToggle}
      onClick={onOpen}
    >
      <Search size={16} />
    </IconAction>
  );
};
