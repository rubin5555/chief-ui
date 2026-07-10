import { useQuery } from '@apollo/client';
import { Trash2, X } from 'lucide-react';
import { type FormEvent, type RefObject, useState } from 'react';
import {
  GET_NETWORK_PEOPLE_QUERY,
  type GetNetworkPeopleResult,
  NETWORK_PEOPLE_FALLBACK,
} from '@/api/networkPeople';
import { FloatingPanel } from '@/components/ui/FloatingPanel';
import { useDebounce } from '@/hooks/useDebounce';
import type { Pos } from '@/hooks/useFloatingPanel';
import { gray } from '@/styles/theme';
import {
  PickedList,
  PickedListLabel,
  PickedMemberName,
  PickedRemoveBtn,
  PopoverBodySection,
  PopoverCloseBtn,
  PopoverHeader,
  PopoverInput,
  PopoverLabel,
  PopoverPickedRow,
  PopoverSaveBtn,
  PopoverTitle,
} from '../components/ManualAddPanel/ManualAddPanel.styles';
import { PersonSearchField } from '../components/PersonSearchField';
import type { NetworkPerson, PersonMember } from '../MailingListModal.constants';
import { toPersonMember } from '../utils/toPersonMember';
import { HAMAL_TAB_IDS } from './HamalTab.testids';

const noop = () => {};

interface HamalCreateGroupPanelProps {
  panelRef: RefObject<HTMLDivElement | null>;
  pos: Pos;
  onClose: () => void;
}

// Floating "קבוצה חדשה" form. Owns its draft state; it is mounted only while
// open, so every open starts from a clean slate without explicit resets.
export const HamalCreateGroupPanel = ({ panelRef, pos, onClose }: HamalCreateGroupPanelProps) => {
  const [name, setName] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const debouncedMemberSearch = useDebounce(memberSearch);
  const [picked, setPicked] = useState<PersonMember[]>([]);

  const { data } = useQuery<GetNetworkPeopleResult>(GET_NETWORK_PEOPLE_QUERY);
  const peoplePool = data?.networkPeople ?? NETWORK_PEOPLE_FALLBACK.networkPeople;

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);
  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setMemberSearch(e.target.value);

  const onPickMember = (person: NetworkPerson) => {
    setPicked((prev) => [...prev, toPersonMember(person)]);
    setMemberSearch('');
  };

  const handleRemovePicked = (i: number) => () =>
    setPicked((prev) => prev.filter((_, j) => j !== i));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onClose();
  };

  const results: NetworkPerson[] = peoplePool
    .filter(
      (p) =>
        debouncedMemberSearch &&
        (p.name.includes(debouncedMemberSearch) || p.idNumber.includes(debouncedMemberSearch)),
    )
    .filter((p) => !picked.some((pk) => pk.idNumber === p.idNumber))
    .slice(0, 8);

  return (
    <FloatingPanel ref={panelRef} $pos={pos} $width={320}>
      <PopoverHeader>
        <PopoverTitle>קבוצה חדשה</PopoverTitle>
        <PopoverCloseBtn
          type="button"
          data-testid={HAMAL_TAB_IDS.createGroupCloseBtn}
          onClick={onClose}
        >
          <X size={16} color={gray[400]} />
        </PopoverCloseBtn>
      </PopoverHeader>
      <form onSubmit={onSubmit}>
        <PopoverBodySection $pad="0 12px">
          <PopoverLabel>שם הקבוצה</PopoverLabel>
          <PopoverInput
            type="text"
            value={name}
            onChange={onNameChange}
            placeholder="הזן שם קבוצה..."
            autoComplete="new-password"
            dir="rtl"
          />
        </PopoverBodySection>
        <PopoverBodySection $pad="8px 12px">
          <PersonSearchField
            query={memberSearch}
            onQueryChange={onSearchChange}
            onFocus={noop}
            onBlur={noop}
            resultsOpen
            results={results}
            onSelectResult={onPickMember}
            showManualAdd={false}
          />
        </PopoverBodySection>
        {picked.length > 0 && (
          <PickedList>
            <PickedListLabel>נוספו לקבוצה</PickedListLabel>
            {picked.map((m, i) => (
              <PopoverPickedRow key={m.idNumber || i}>
                <PickedRemoveBtn
                  type="button"
                  data-testid={HAMAL_TAB_IDS.removePickedBtn(m.idNumber || i)}
                  onClick={handleRemovePicked(i)}
                >
                  <Trash2 size={12} color={gray[300]} />
                </PickedRemoveBtn>
                <PickedMemberName>{m.name}</PickedMemberName>
              </PopoverPickedRow>
            ))}
          </PickedList>
        )}
        <PopoverBodySection $pad="8px 12px">
          <PopoverSaveBtn
            type="submit"
            data-testid={HAMAL_TAB_IDS.createGroupSaveBtn}
            disabled={!name.trim()}
          >
            צור קבוצה
          </PopoverSaveBtn>
        </PopoverBodySection>
      </form>
    </FloatingPanel>
  );
};
