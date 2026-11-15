import { X } from 'lucide-react';
import { MIRAGE_GROUPS_FALLBACK, useMirageGroups } from '@/api/mirageGroups';
import type { ColumnDef, RowConfig } from '@/components/ui/GridTable';
import { GridTable } from '@/components/ui/GridTable';
import { InlineSpinner } from '@/components/ui/InlineSpinner';
import { SearchSlot } from '@/context/SearchSlotContext';
import { useSearch } from '@/hooks/useSearch';
import { gray } from '@/styles/theme';
import { ExpandedMemberBlock } from '../../components/ExpandedMemberBlock';
import { ModalSearchInput } from '../../components/ModalSearchInput';
import { SelectionCheckbox } from '../../components/SelectionCheckbox';
import type { Member, MirageGroup } from '../../PeoplePicker.constants';
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

const groupKey = (group: MirageGroup) => group.id;

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

  const columns: ColumnDef<MirageGroup>[] = [
    {
      key: 'select',
      width: '28px',
      cell: (group) => (
        <CheckboxCell
          data-testid={MIRAGE_TAB_IDS.rowCheckbox(group.id)}
          onClick={handleCheckClick(group.id, addedGroupIds.has(group.id))}
        >
          <SelectionCheckbox
            isSelected={selected.set.has(group.id)}
            isAdded={addedGroupIds.has(group.id)}
          />
        </CheckboxCell>
      ),
    },
    {
      key: 'name',
      width: '1fr',
      header: 'שם הקבוצה',
      align: 'right',
      cell: (group) => (
        <NameCell>
          {group.name}
          <CountLabel>({group.members.length})</CountLabel>
        </NameCell>
      ),
    },
    {
      key: 'actions',
      width: '24px',
      cell: (group) => (
        <ExpandBtn
          type="button"
          data-testid={MIRAGE_TAB_IDS.rowExpand(group.id)}
          onClick={handleToggleExpand(group.id)}
        >
          <ExpandChevron size={14} color={gray[400]} $isExpanded={expanded === group.id} />
        </ExpandBtn>
      ),
    },
  ];

  const rowConfig = (group: MirageGroup): RowConfig => ({
    isSelected: selected.set.has(group.id),
    isAdded: addedGroupIds.has(group.id),
    onClick: handleRowClick(group.id, addedGroupIds.has(group.id)),
    expansion: expanded === group.id ? <ExpandedMemberBlock members={group.members} /> : null,
  });

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
          columns={columns}
          items={filtered}
          getRowKey={groupKey}
          row={rowConfig}
          emptyState={<EmptyState>לא נמצאו קבוצות</EmptyState>}
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
