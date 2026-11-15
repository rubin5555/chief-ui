import { useState } from 'react';
import { PERSONAL_LISTS_FALLBACK, usePersonalLists } from '@/api/personalLists';
import type { ColumnDef, RowConfig } from '@/components/ui/GridTable';
import { GridTable } from '@/components/ui/GridTable';
import { InlineSpinner } from '@/components/ui/InlineSpinner';
import { SearchSlot } from '@/context/SearchSlotContext';
import { useSearch } from '@/hooks/useSearch';
import { gray } from '@/styles/theme';
import { ExpandedMemberBlock } from '../../components/ExpandedMemberBlock';
import { ModalSearchInput } from '../../components/ModalSearchInput';
import { SelectionCheckbox } from '../../components/SelectionCheckbox';
import type { Member, PersonalList } from '../../PeoplePicker.constants';
import { deduplicateMembers } from '../../utils/deduplicateMembers';
import { TabImportBar } from '../components/TabImportBar';
import { useTabSelection } from '../hooks/useTabSelection';
import {
  CountLabel,
  EmptyState,
  ExpandBtn,
  ExpandChevron,
  NameCell,
  SubTabBar,
  SubTabBtn,
  SubTabIndicator,
  TabRoot,
} from '../tabs.shared.styles';
import { PERSONAL_TAB_IDS } from './PersonalTab.testids';

const listKey = (list: PersonalList) => list.id;

interface PersonalTabProps {
  addedListIds: Set<string>;
  onImport: (members: Member[], listIds: string[]) => void;
}

export const PersonalTab = ({ addedListIds, onImport }: PersonalTabProps) => {
  const [listTab, setListTab] = useState<'mine' | 'all'>('mine');
  const { selected, expanded, handleToggleExpand } = useTabSelection();
  const { search, debouncedSearch, onSearchChange } = useSearch();

  const { data, loading: personalListsLoading } = usePersonalLists();
  const personalLists = data ?? PERSONAL_LISTS_FALLBACK.personalLists;

  const onTabChange = (tab: 'mine' | 'all') => setListTab(tab);
  const handleTabChange = (tab: 'mine' | 'all') => () => onTabChange(tab);
  const handleRowClick = (id: string, isAdded: boolean) => () => {
    if (!isAdded) selected.toggle(id);
  };

  const onImportSelected = () => {
    const lists = personalLists.filter((l) => selected.set.has(l.id));
    const members = deduplicateMembers(
      lists.flatMap((l) => l.members),
      'prs',
    );
    onImport(
      members,
      lists.map((l) => l.id),
    );
    selected.reset();
  };

  const filtered = personalLists.filter(
    (l) => l.tab === listTab && (debouncedSearch === '' || l.name.includes(debouncedSearch)),
  );

  const columns: ColumnDef<PersonalList>[] = [
    {
      key: 'select',
      width: '28px',
      cell: (list) => (
        <SelectionCheckbox
          isSelected={selected.set.has(list.id)}
          isAdded={addedListIds.has(list.id)}
        />
      ),
    },
    {
      key: 'name',
      width: '1fr',
      header: 'שם הרשימה',
      align: 'right',
      cell: (list) => (
        <NameCell>
          {list.name}
          <CountLabel>({list.members.length})</CountLabel>
        </NameCell>
      ),
    },
    {
      key: 'actions',
      width: '24px',
      cell: (list) => (
        <ExpandBtn
          type="button"
          data-testid={PERSONAL_TAB_IDS.rowExpand(list.id)}
          onClick={handleToggleExpand(list.id)}
        >
          <ExpandChevron size={14} color={gray[400]} $isExpanded={expanded === list.id} />
        </ExpandBtn>
      ),
    },
  ];

  const rowConfig = (list: PersonalList): RowConfig => ({
    isSelected: selected.set.has(list.id),
    isAdded: addedListIds.has(list.id),
    onClick: handleRowClick(list.id, addedListIds.has(list.id)),
    expansion: expanded === list.id ? <ExpandedMemberBlock members={list.members} /> : null,
  });

  return (
    <TabRoot>
      <SubTabBar>
        {(['mine', 'all'] as const).map((tab) => (
          <SubTabBtn key={tab} $active={listTab === tab} onClick={handleTabChange(tab)}>
            {tab === 'mine' ? 'רשימות של המכלול שלי' : 'כלל רשימות התפוצה'}
            {listTab === tab && <SubTabIndicator />}
          </SubTabBtn>
        ))}
      </SubTabBar>

      <SearchSlot>
        <ModalSearchInput value={search} onChange={onSearchChange} placeholder="חיפוש רשימה..." />
      </SearchSlot>

      {personalListsLoading ? (
        <InlineSpinner />
      ) : (
        <GridTable
          columns={columns}
          items={filtered}
          getRowKey={listKey}
          row={rowConfig}
          emptyState={<EmptyState>לא נמצאו רשימות</EmptyState>}
        />
      )}

      <TabImportBar
        count={selected.set.size}
        noun="רשימות"
        data-testid={PERSONAL_TAB_IDS.importBtn}
        onImport={onImportSelected}
      />
    </TabRoot>
  );
};
