import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { FloatingPanel } from '@/components/ui/FloatingPanel';
import { useDebounce } from '@/hooks/useDebounce';
import type { Pos } from '@/hooks/useFloatingPanel';
import { gray } from '@/styles/theme';
import {
  PopoverBodySection,
  PopoverCloseBtn,
  PopoverHeader,
  PopoverTitle,
} from '../components/ManualAddPanel/ManualAddPanel.styles';
import { PersonSearchField } from '../components/PersonSearchField';
import type { NetworkPerson, PersonMember } from '../MailingListModal.constants';
import { PEOPLE_POOL } from '../MailingListModal.constants';
import { toPersonMember } from '../utils/toPersonMember';
import { HAMAL_TAB_IDS } from './HamalTab.testids';

const noop = () => {};

interface HamalAddMemberPanelProps {
  pos: Pos;
  /** Id numbers already in the group — excluded from search results. */
  existingIdNumbers: string[];
  onSelect: (member: PersonMember) => void;
  onClose: () => void;
}

// Floating "הוסף חבר לקבוצה" popover anchored to a group row's + button.
// Owns its search state; remounts per open so the query always starts empty.
export const HamalAddMemberPanel = ({
  pos,
  existingIdNumbers,
  onSelect,
  onClose,
}: HamalAddMemberPanelProps) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [onClose]);

  const onQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value);

  const handleSelect = (person: NetworkPerson) => {
    onSelect(toPersonMember(person));
    setQuery('');
  };

  const results: NetworkPerson[] = PEOPLE_POOL.filter(
    (p) =>
      !existingIdNumbers.includes(p.idNumber) &&
      (p.name.includes(debouncedQuery) || p.idNumber.includes(debouncedQuery)),
  ).slice(0, 8);

  return (
    <FloatingPanel ref={panelRef} $pos={pos} $width={280}>
      <PopoverHeader>
        <PopoverTitle>הוסף חבר לקבוצה</PopoverTitle>
        <PopoverCloseBtn
          type="button"
          data-testid={HAMAL_TAB_IDS.addMemberCloseBtn}
          onClick={onClose}
        >
          <X size={14} color={gray[400]} />
        </PopoverCloseBtn>
      </PopoverHeader>
      <PopoverBodySection>
        <PersonSearchField
          query={query}
          onQueryChange={onQueryChange}
          onFocus={noop}
          onBlur={noop}
          resultsOpen
          results={results}
          onSelectResult={handleSelect}
          showManualAdd={false}
        />
      </PopoverBodySection>
    </FloatingPanel>
  );
};
