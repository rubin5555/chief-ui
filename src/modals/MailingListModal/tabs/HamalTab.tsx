import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { HAMAL_GROUPS_FALLBACK, useHamalGroups } from '@/api/hamalGroups';
import { Button } from '@/components/ui/Button';
import { GridTable } from '@/components/ui/GridTable';
import { InlineSpinner } from '@/components/ui/InlineSpinner';
import { SearchSlot } from '@/context/SearchSlotContext';
import { type Pos, useFloatingPanel } from '@/hooks/useFloatingPanel';
import { useSearch } from '@/hooks/useSearch';
import { ModalSearchInput } from '../components/ModalSearchInput';
import type { HamalGroup, Member, PersonMember } from '../MailingListModal.constants';
import { ColHeader } from '../MailingListModal.shared.styles';
import { HamalAddMemberPanel } from './HamalAddMemberPanel';
import { HamalCreateGroupPanel } from './HamalCreateGroupPanel';
import { HamalGroupRow } from './HamalGroupRow';
import { HAMAL_TAB_IDS } from './HamalTab.testids';
import { TabImportBar } from './TabImportBar';
import { ClearBtn, EmptyState, TabRoot } from './tabs.shared.styles';
import { useTabSelection } from './useTabSelection';

const HAMAL_GRID = '28px 1fr 28px 28px';

interface HamalTabProps {
  addedGroupIds: Set<string>;
  onImport: (groups: Member[], groupIds: string[]) => void;
}

export const HamalTab = ({ addedGroupIds, onImport }: HamalTabProps) => {
  const { selected, expanded, handleRowClick, handleCheckClick, handleToggleExpand } =
    useTabSelection();
  const { search, debouncedSearch, onSearchChange, onClearSearch } = useSearch();

  const [extraMembers, setExtraMembers] = useState<Record<string, PersonMember[]>>({});
  const [addMemberGroupId, setAddMemberGroupId] = useState<string | null>(null);
  const [addMemberPos, setAddMemberPos] = useState<Pos | null>(null);
  const createPanel = useFloatingPanel();

  const { data, loading: hamalGroupsLoading } = useHamalGroups();
  const hamalGroups = data ?? HAMAL_GROUPS_FALLBACK.hamalGroups;

  const onAddMemberClick = (groupId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setAddMemberPos({ top: r.bottom + 6, left: r.left - 260 + r.width, maxHeight: 320 });
    setAddMemberGroupId((prev) => (prev === groupId ? null : groupId));
  };

  const handleAddMemberClick = (groupId: string) => (e: React.MouseEvent) =>
    onAddMemberClick(groupId, e);

  const onAddMemberSelect = (member: PersonMember) => {
    if (!addMemberGroupId) return;
    setExtraMembers((prev) => ({
      ...prev,
      [addMemberGroupId]: [...(prev[addMemberGroupId] ?? []), member],
    }));
  };

  const onCloseAddMemberPanel = () => setAddMemberGroupId(null);

  const onToggleCreate = () => createPanel.toggle(320);

  const onImportSelected = () => {
    const groups = hamalGroups.filter((g) => selected.set.has(g.id));
    const members: Member[] = groups
      .filter((g) => !addedGroupIds.has(g.id))
      .map((g) => ({
        id: `hml-${g.id}`,
        name: g.name,
        idNumber: '',
        environment: g.environment,
        isGroup: true,
        groupType: g.type,
        groupMembers: [...g.members, ...(extraMembers[g.id] ?? [])],
      }));
    onImport(
      members,
      groups.map((g) => g.id),
    );
    selected.reset();
    onClearSearch();
  };

  const filtered = hamalGroups.filter(
    (g) =>
      g.name.includes(debouncedSearch) ||
      g.type.includes(debouncedSearch) ||
      g.environment.includes(debouncedSearch),
  );

  const openGroup = addMemberGroupId
    ? hamalGroups.find((g) => g.id === addMemberGroupId)
    : undefined;
  const existingIdNumbers = openGroup
    ? [...openGroup.members, ...(extraMembers[openGroup.id] ?? [])].map((m) => m.idNumber)
    : [];

  return (
    <TabRoot data-testid={HAMAL_TAB_IDS.root}>
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
        <Button
          ref={createPanel.btnRef}
          type="button"
          size="xs"
          data-testid={HAMAL_TAB_IDS.createGroupBtn}
          onClick={onToggleCreate}
        >
          <Plus size={14} />
          קבוצה
        </Button>
      </SearchSlot>

      {hamalGroupsLoading ? (
        <InlineSpinner />
      ) : (
        <GridTable
          columns={HAMAL_GRID}
          headers={[null, <ColHeader $align="right">שם הקבוצה</ColHeader>, null, null]}
          items={filtered}
          getRowKey={(group) => group.id}
          emptyState={<EmptyState>לא נמצאו קבוצות</EmptyState>}
          renderRow={(group: HamalGroup) => (
            <HamalGroupRow
              group={group}
              extraMembers={extraMembers[group.id] ?? []}
              isSelected={selected.set.has(group.id)}
              isAdded={addedGroupIds.has(group.id)}
              isExpanded={expanded === group.id}
              isAddMemberOpen={addMemberGroupId === group.id}
              onRowClick={handleRowClick(group.id, addedGroupIds.has(group.id))}
              onCheckClick={handleCheckClick(group.id, addedGroupIds.has(group.id))}
              onAddMemberClick={handleAddMemberClick(group.id)}
              onToggleExpand={handleToggleExpand(group.id)}
            />
          )}
        />
      )}

      <TabImportBar
        count={selected.set.size}
        noun="קבוצות"
        data-testid={HAMAL_TAB_IDS.importBtn}
        onImport={onImportSelected}
      />

      {addMemberGroupId && addMemberPos && (
        <HamalAddMemberPanel
          key={addMemberGroupId}
          pos={addMemberPos}
          existingIdNumbers={existingIdNumbers}
          onSelect={onAddMemberSelect}
          onClose={onCloseAddMemberPanel}
        />
      )}

      {createPanel.open && createPanel.pos && (
        <HamalCreateGroupPanel
          panelRef={createPanel.panelRef}
          pos={createPanel.pos}
          onClose={createPanel.close}
        />
      )}
    </TabRoot>
  );
};
