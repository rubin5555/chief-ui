import { Search } from 'lucide-react';
import { useState } from 'react';
import { IconAction } from '../../DocActionToolbar.styles';
import { DOC_ACTION_TOOLBAR_IDS } from '../../DocActionToolbar.testids';
import { DocSearchField } from '../DocSearchField';

const noop = () => {};

interface SearchControlProps {
  /**
   * The query the URL currently holds. Only read on mount — to seed the field and
   * to decide whether it starts open — because from then on this component is the
   * thing writing it, and re-reading it per keystroke would fight the debounce.
   */
  value: string;
  onToggle: (isOpen: boolean) => void;
  onSearchChange?: (query: string) => void;
}

// Whether the field is open is ephemeral chrome, so it stays local (main keeps it
// local too, TopNavbar.tsx:1130) — but a bookmarked `?q=` has to come back visible,
// which is what the lazy useState initialiser below is for. No effect needed: the
// initial URL is known on the first render.
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
