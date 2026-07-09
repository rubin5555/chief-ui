import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { GridTable, GridTableRow } from '@/components/ui/GridTable';
import { SearchSlot } from '@/context/SearchSlotContext';
import { useSearch } from '@/hooks/useSearch';
import { useTabSelection } from '@/hooks/useTabSelection';
import { gray } from '@/styles/theme';
import { ExpandedMemberBlock } from '../components/ExpandedMemberBlock';
import { ColHeader } from '../components/MembersPanel/MembersPanel.styles';
import { ModalSearchInput } from '../components/ModalSearchInput';
import { SelectionCheckbox } from '../components/SelectionCheckbox';
import type { Member, PersonalList } from '../MailingListModal.constants';
import { PERSONAL_LISTS } from '../MailingListModal.constants';
import { deduplicateMembers } from '../utils/deduplicateMembers';
import { PERSONAL_TAB_IDS } from './PersonalTab.testids';
import {
  CountLabel,
  EmptyState,
  ExpandBtn,
  ExpandChevron,
  ImportBar,
  ImportBarLabel,
  NameCell,
  SubTabBar,
  SubTabBtn,
  SubTabIndicator,
  TabRoot,
} from './tabs.shared.styles';

const PERSONAL_GRID = '28px 1fr 24px';

interface PersonalTabProps {
  addedListIds: Set<string>;
  onImport: (members: Member[], listIds: string[]) => void;
}

export const PersonalTab = ({ addedListIds, onImport }: PersonalTabProps) => {
  const [listTab, setListTab] = useState<'mine' | 'all'>('mine');
  const { selected, expanded, handleToggleExpand } = useTabSelection();
  const { search, debouncedSearch, onSearchChange } = useSearch();

  const onTabChange = (tab: 'mine' | 'all') => setListTab(tab);
  const handleTabChange = (tab: 'mine' | 'all') => () => onTabChange(tab);
  const handleRowClick = (id: string, isAdded: boolean) => () => {
    if (!isAdded) selected.toggle(id);
  };

  const onImportSelected = () => {
    const lists = PERSONAL_LISTS.filter((l) => selected.set.has(l.id));
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

  const filtered = PERSONAL_LISTS.filter(
    (l) => l.tab === listTab && (debouncedSearch === '' || l.name.includes(debouncedSearch)),
  );

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

      <GridTable
        columns={PERSONAL_GRID}
        headers={[null, <ColHeader $align="right">שם הרשימה</ColHeader>, null]}
        items={filtered}
        getRowKey={(list) => list.id}
        emptyState={<EmptyState>לא נמצאו רשימות</EmptyState>}
        renderRow={(list: PersonalList) => {
          const isSelected = selected.set.has(list.id);
          const isAdded = addedListIds.has(list.id);
          const isExpanded = expanded === list.id;

          return (
            <GridTableRow
              isSelected={isSelected}
              isAdded={isAdded}
              onClick={handleRowClick(list.id, isAdded)}
              expansion={isExpanded ? <ExpandedMemberBlock members={list.members} /> : null}
            >
              <SelectionCheckbox isSelected={isSelected} isAdded={isAdded} />
              <NameCell>
                {list.name}
                <CountLabel>({list.members.length})</CountLabel>
              </NameCell>
              <ExpandBtn
                type="button"
                data-testid={PERSONAL_TAB_IDS.rowExpand(list.id)}
                onClick={handleToggleExpand(list.id)}
              >
                <ExpandChevron size={14} color={gray[400]} $isExpanded={isExpanded} />
              </ExpandBtn>
            </GridTableRow>
          );
        }}
      />

      {selected.set.size > 0 && (
        <ImportBar>
          <ImportBarLabel>{selected.set.size} רשימות נבחרו</ImportBarLabel>
          <Button
            type="button"
            size="xs"
            data-testid={PERSONAL_TAB_IDS.importBtn}
            onClick={onImportSelected}
          >
            הוסף לרשימה
          </Button>
        </ImportBar>
      )}
    </TabRoot>
  );
};
