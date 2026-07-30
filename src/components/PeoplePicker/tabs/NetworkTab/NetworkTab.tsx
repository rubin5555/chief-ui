import { useState } from 'react';
import type { DirectoryUser } from '@/api/users';
import { useUserSearch } from '@/api/users';
import { SearchSlot } from '@/context/SearchSlotContext';
import { useSearch } from '@/hooks/useSearch';
import { PersonSearchField } from '../../components/PersonSearchField';
import type { Member, NetworkFilter } from '../../PeoplePicker.constants';
import { NETWORK_FILTERS } from '../../PeoplePicker.constants';
import { PlaceholderText } from '../../PeoplePicker.styles';
import { SubTabBar, SubTabBtn, SubTabIndicator, TabRoot } from '../tabs.shared.styles';
import { NETWORK_TAB_IDS } from './NetworkTab.testids';

interface iNetworkTabProps {
  addedMemberIds: Set<string>;
  onAdd: (member: Member) => void;
  initialQuery?: string;
  autoFocus?: boolean;
}

export const NetworkTab = ({
  addedMemberIds,
  onAdd,
  initialQuery = '',
  autoFocus = false,
}: iNetworkTabProps) => {
  const [network, setNetwork] = useState<NetworkFilter>('sodibioti');
  const { search, debouncedSearch, onSearchChange, onClearSearch } = useSearch(300, initialQuery);
  const [resultsOpen, setResultsOpen] = useState(Boolean(initialQuery.trim()));

  const { data, loading } = useUserSearch({ query: debouncedSearch, network });

  const onNetworkChange = (val: NetworkFilter) => {
    setNetwork(val);
    onClearSearch();
    setResultsOpen(false);
  };

  const onQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e);
    setResultsOpen(true);
  };

  const onFocus = () => setResultsOpen(true);
  const onBlur = () => setTimeout(() => setResultsOpen(false), 150);

  const onSelectPerson = (person: DirectoryUser) => {
    onAdd({
      id: person.id,
      name: person.name,
      idNumber: person.idNumber,
      environment: person.environment,
      subLabel: person.networkLabel,
    });
    onClearSearch();
    setResultsOpen(false);
  };

  const handleNetworkChange = (val: NetworkFilter) => () => onNetworkChange(val);

  const results = (data ?? []).filter((person) => !addedMemberIds.has(person.id));

  const isSearching = loading || search !== debouncedSearch;

  return (
    <TabRoot data-testid={NETWORK_TAB_IDS.root}>
      <SubTabBar>
        {NETWORK_FILTERS.map(({ value, label }) => (
          <SubTabBtn key={value} $active={network === value} onClick={handleNetworkChange(value)}>
            {label}
            {network === value && <SubTabIndicator />}
          </SubTabBtn>
        ))}
      </SubTabBar>

      <SearchSlot>
        <PersonSearchField
          query={search}
          onQueryChange={onQueryChange}
          onFocus={onFocus}
          onBlur={onBlur}
          resultsOpen={resultsOpen}
          results={results}
          loading={isSearching}
          onSelectResult={onSelectPerson}
          showManualAdd={network === 'sodi'}
          onManualAdd={onAdd}
          autoFocus={autoFocus}
        />
      </SearchSlot>
      <PlaceholderText>{'חפש לפי שם או ת.ז. להוספה'}</PlaceholderText>
    </TabRoot>
  );
};
