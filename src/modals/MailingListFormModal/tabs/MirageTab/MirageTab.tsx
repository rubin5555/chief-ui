import { X } from 'lucide-react';
import { MIRAGE_GROUPS_FALLBACK, useMirageGroups } from '@/api/mirageGroups';
import { GridTable, GridTableRow } from '@/components/ui/GridTable';
import { InlineSpinner } from '@/components/ui/InlineSpinner';
import { SearchSlot } from '@/context/SearchSlotContext';
import { useSearch } from '@/hooks/useSearch';
import { gray } from '@/styles/theme';
import { ExpandedMemberBlock } from '../../components/ExpandedMemberBlock';
import { ModalSearchInput } from '../../components/ModalSearchInput';
import { SelectionCheckbox } from '../../components/SelectionCheckbox';
import type { Member, MirageGroup } from '../../MailingListFormModal.constants';
import { ColHeader } from '../../MailingListFormModal.shared.styles';
import { TabImportBar } from '../components/TabImportBar';
import { useTabSelection } from '../hooks/useTabSelection';
import {
  CheckboxCell,
  ClearBtn,
  CountLabel,
  EmptyState,
  ExpandBtn,
  ExpandChevron,
  NameCell,
  TabRoot,
} from '../tabs.shared.styles';
import { MIRAGE_TAB_IDS } from './MirageTab.testids';

const MIRAGE_GRID = '28px 1fr 24px';

interface MirageTabProps {
  addedGroupIds: Set<string>;
  onImport: (groups: Member[], groupIds: string[]) => void;
}

export const MirageTab = ({ addedGroupIds, onImport }: MirageTabProps) => {
  const { selected, expanded, handleRowClick, handleCheckClick, handleToggleExpand } =
    useTabSelection();
  const { search, debouncedSearch, onSearchChange, onClearSearch } = useSearch();

  const { data, loading: mirageGroupsLoading } = useMirageGroups();
  const mirageGroups = data ?? MIRAGE_GROUPS_FALLBACK.mirageGroups;

  const onImportSelected = () => {
    const groups = mirageGroups.filter((g) => selected.set.has(g.id));
    const members: Member[] = groups
      .filter((g) => !addedGroupIds.has(g.id))
      .map((g) => ({
        id: `mrz-${g.id}`,
        name: g.name,
        idNumber: '',
        environment: g.environment,
        isGroup: true,
        groupType: g.type,
        groupMembers: g.members,
      }));
    onImport(
      members,
      groups.map((g) => g.id),
    );
    selected.reset();
    onClearSearch();
  };

  const filtered = mirageGroups.filter(
    (g) =>
      g.name.includes(debouncedSearch) ||
      g.type.includes(debouncedSearch) ||
      g.environment.includes(debouncedSearch),
  );

  return (
    <TabRoot>
      <SearchSlot>
        <ModalSearchInput
          value={search}
          onChange={onSearchChange}
          placeholder="חיפוש קבוצה..."
          trailing={
            search && (
              <ClearBtn type="button" onClick={onClearSearch}>
                <X size={14} />
              </ClearBtn>
            )
          }
        />
      </SearchSlot>

      {mirageGroupsLoading ? (
        <InlineSpinner />
      ) : (
        <GridTable
          columns={MIRAGE_GRID}
          headers={[null, <ColHeader $align="right">שם הקבוצה</ColHeader>, null]}
          items={filtered}
          getRowKey={(group) => group.id}
          emptyState={<EmptyState>לא נמצאו קבוצות</EmptyState>}
          renderRow={(group: MirageGroup) => {
            const isSelected = selected.set.has(group.id);
            const isAdded = addedGroupIds.has(group.id);
            const isExpanded = expanded === group.id;

            return (
              <GridTableRow
                isSelected={isSelected}
                isAdded={isAdded}
                onClick={handleRowClick(group.id, isAdded)}
                expansion={isExpanded ? <ExpandedMemberBlock members={group.members} /> : null}
              >
                <CheckboxCell
                  data-testid={MIRAGE_TAB_IDS.rowCheckbox(group.id)}
                  onClick={handleCheckClick(group.id, isAdded)}
                >
                  <SelectionCheckbox isSelected={isSelected} isAdded={isAdded} />
                </CheckboxCell>
                <NameCell>
                  {group.name}
                  <CountLabel>({group.members.length})</CountLabel>
                </NameCell>
                <ExpandBtn
                  type="button"
                  data-testid={MIRAGE_TAB_IDS.rowExpand(group.id)}
                  onClick={handleToggleExpand(group.id)}
                >
                  <ExpandChevron size={14} color={gray[400]} $isExpanded={isExpanded} />
                </ExpandBtn>
              </GridTableRow>
            );
          }}
        />
      )}

      <TabImportBar
        count={selected.set.size}
        noun="קבוצות"
        data-testid={MIRAGE_TAB_IDS.importBtn}
        onImport={onImportSelected}
      />
    </TabRoot>
  );
};
