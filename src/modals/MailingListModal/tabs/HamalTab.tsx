import { Plus, Trash2, X } from 'lucide-react';
import { type FormEvent, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { FloatingPanel } from '@/components/ui/FloatingPanel';
import { GridTable, GridTableRow } from '@/components/ui/GridTable';
import { SearchSlot } from '@/context/SearchSlotContext';
import { useDebounce } from '@/hooks/useDebounce';
import { useFloatingPanel } from '@/hooks/useFloatingPanel';
import { useSearch } from '@/hooks/useSearch';
import { useTabSelection } from '@/hooks/useTabSelection';
import { colors, gray } from '@/styles/theme';
import { ExpandedMemberBlock } from '../components/ExpandedMemberBlock';
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
import { ColHeader } from '../components/MembersPanel/MembersPanel.styles';
import { ModalSearchInput } from '../components/ModalSearchInput';
import { PersonSearchField } from '../components/PersonSearchField';
import { SelectionCheckbox } from '../components/SelectionCheckbox';
import type {
  HamalGroup,
  Member,
  NetworkPerson,
  PersonMember,
} from '../MailingListModal.constants';
import { HAMAL_GROUPS, PEOPLE_POOL } from '../MailingListModal.constants';
import { IconActionBtn } from './HamalTab.styles';
import { HAMAL_TAB_IDS } from './HamalTab.testids';
import {
  CheckboxCell,
  ClearBtn,
  CountLabel,
  EmptyState,
  ExpandBtn,
  ExpandChevron,
  ImportBar,
  ImportBarLabel,
  NameCell,
  TabRoot,
} from './tabs.shared.styles';

const HAMAL_GRID = '28px 1fr 28px 28px';

const noop = () => {};

const toPersonMember = (person: NetworkPerson): PersonMember => ({
  name: person.name,
  idNumber: person.idNumber,
  environment: person.environment,
});

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
  const [addMemberPos, setAddMemberPos] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [addMemberSearch, setAddMemberSearch] = useState('');
  const debouncedAddMemberSearch = useDebounce(addMemberSearch);
  const addMemberPanelRef = useRef<HTMLDivElement>(null);

  const [newName, setNewName] = useState('');
  const [newMemberSearch, setNewMemberSearch] = useState('');
  const debouncedNewMemberSearch = useDebounce(newMemberSearch);
  const [newPicked, setNewPicked] = useState<PersonMember[]>([]);
  const createPanel = useFloatingPanel();

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (addMemberPanelRef.current && !addMemberPanelRef.current.contains(e.target as Node))
        setAddMemberGroupId(null);
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  const onAddMemberClick = (groupId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setAddMemberPos({ top: r.bottom + 6, left: r.left - 260 + r.width });
    setAddMemberGroupId((prev) => (prev === groupId ? null : groupId));
    setAddMemberSearch('');
  };

  const handleAddMemberClick = (groupId: string) => (e: React.MouseEvent) =>
    onAddMemberClick(groupId, e);

  const onAddMemberSelect = (person: NetworkPerson) => {
    if (!addMemberGroupId) return;
    const newMember = toPersonMember(person);
    setExtraMembers((prev) => ({
      ...prev,
      [addMemberGroupId]: [...(prev[addMemberGroupId] ?? []), newMember],
    }));
    setAddMemberSearch('');
  };

  const onAddMemberSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setAddMemberSearch(e.target.value);

  const onCloseAddMemberPanel = () => setAddMemberGroupId(null);

  const onToggleCreate = () => {
    createPanel.toggle(320);
    setNewName('');
    setNewMemberSearch('');
    setNewPicked([]);
  };

  const onNewNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setNewName(e.target.value);
  const onNewSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNewMemberSearch(e.target.value);

  const onPickNewMember = (person: NetworkPerson) => {
    setNewPicked((prev) => [...prev, toPersonMember(person)]);
    setNewMemberSearch('');
  };

  const handleRemoveNewPicked = (i: number) => () =>
    setNewPicked((prev) => prev.filter((_, j) => j !== i));

  const onCreateGroupSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    createPanel.close();
  };

  const onImportSelected = () => {
    const groups = HAMAL_GROUPS.filter((g) => selected.set.has(g.id));
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

  const filtered = HAMAL_GROUPS.filter(
    (g) =>
      g.name.includes(debouncedSearch) ||
      g.type.includes(debouncedSearch) ||
      g.environment.includes(debouncedSearch),
  );

  const addMemberPool: NetworkPerson[] = PEOPLE_POOL.filter((p) => {
    if (!addMemberGroupId) return false;
    const group = HAMAL_GROUPS.find((g) => g.id === addMemberGroupId);
    if (!group) return false;
    const allIds = [...group.members, ...(extraMembers[addMemberGroupId] ?? [])].map(
      (m) => m.idNumber,
    );
    return (
      !allIds.includes(p.idNumber) &&
      (p.name.includes(debouncedAddMemberSearch) || p.idNumber.includes(debouncedAddMemberSearch))
    );
  }).slice(0, 8);

  const newSearchResults: NetworkPerson[] = PEOPLE_POOL.filter(
    (p) =>
      debouncedNewMemberSearch &&
      (p.name.includes(debouncedNewMemberSearch) || p.idNumber.includes(debouncedNewMemberSearch)),
  )
    .filter((p) => !newPicked.some((pk) => pk.idNumber === p.idNumber))
    .slice(0, 8);

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

      <GridTable
        columns={HAMAL_GRID}
        headers={[null, <ColHeader $align="right">שם הקבוצה</ColHeader>, null, null]}
        items={filtered}
        getRowKey={(group) => group.id}
        emptyState={<EmptyState>לא נמצאו קבוצות</EmptyState>}
        renderRow={(group: HamalGroup) => {
          const isSelected = selected.set.has(group.id);
          const isAdded = addedGroupIds.has(group.id);
          const isExpanded = expanded === group.id;
          const totalCount = group.members.length + (extraMembers[group.id]?.length ?? 0);

          return (
            <GridTableRow
              isSelected={isSelected}
              isAdded={isAdded}
              onClick={handleRowClick(group.id, isAdded)}
              expansion={
                isExpanded ? (
                  <ExpandedMemberBlock
                    members={[...group.members, ...(extraMembers[group.id] ?? [])]}
                  />
                ) : null
              }
            >
              <CheckboxCell
                data-testid={HAMAL_TAB_IDS.rowCheckbox(group.id)}
                onClick={handleCheckClick(group.id, isAdded)}
              >
                <SelectionCheckbox isSelected={isSelected} isAdded={isAdded} />
              </CheckboxCell>
              <NameCell>
                {group.name}
                <CountLabel>({totalCount})</CountLabel>
              </NameCell>
              <IconActionBtn
                type="button"
                data-testid={HAMAL_TAB_IDS.rowAddMember(group.id)}
                onClick={handleAddMemberClick(group.id)}
              >
                <Plus
                  size={14}
                  color={addMemberGroupId === group.id ? colors.primary : gray[400]}
                />
              </IconActionBtn>
              <ExpandBtn
                type="button"
                data-testid={HAMAL_TAB_IDS.rowExpand(group.id)}
                onClick={handleToggleExpand(group.id)}
              >
                <ExpandChevron size={14} color={gray[400]} $isExpanded={isExpanded} />
              </ExpandBtn>
            </GridTableRow>
          );
        }}
      />

      {selected.set.size > 0 && (
        <ImportBar>
          <ImportBarLabel>{selected.set.size} קבוצות נבחרו</ImportBarLabel>
          <Button
            type="button"
            size="xs"
            data-testid={HAMAL_TAB_IDS.importBtn}
            onClick={onImportSelected}
          >
            הוסף לרשימה
          </Button>
        </ImportBar>
      )}

      {addMemberGroupId && addMemberPos && (
        <FloatingPanel
          ref={addMemberPanelRef}
          style={{
            top: addMemberPos.top,
            left: addMemberPos.left,
            width: 280,
            maxHeight: 320,
          }}
        >
          <PopoverHeader>
            <PopoverTitle>הוסף חבר לקבוצה</PopoverTitle>
            <PopoverCloseBtn
              type="button"
              data-testid={HAMAL_TAB_IDS.addMemberCloseBtn}
              onClick={onCloseAddMemberPanel}
            >
              <X size={14} color={gray[400]} />
            </PopoverCloseBtn>
          </PopoverHeader>
          <PopoverBodySection>
            <PersonSearchField
              query={addMemberSearch}
              onQueryChange={onAddMemberSearchChange}
              onFocus={noop}
              onBlur={noop}
              resultsOpen
              results={addMemberPool}
              onSelectResult={onAddMemberSelect}
              showManualAdd={false}
            />
          </PopoverBodySection>
        </FloatingPanel>
      )}

      {createPanel.open && createPanel.pos && (
        <FloatingPanel
          ref={createPanel.panelRef}
          style={{ ...createPanel.pos, width: 320 }}
        >
          <PopoverHeader>
            <PopoverTitle>קבוצה חדשה</PopoverTitle>
            <PopoverCloseBtn
              type="button"
              data-testid={HAMAL_TAB_IDS.createGroupCloseBtn}
              onClick={createPanel.close}
            >
              <X size={16} color={gray[400]} />
            </PopoverCloseBtn>
          </PopoverHeader>
          <form onSubmit={onCreateGroupSubmit}>
            <PopoverBodySection $pad="0 12px">
              <PopoverLabel>שם הקבוצה</PopoverLabel>
              <PopoverInput
                type="text"
                value={newName}
                onChange={onNewNameChange}
                placeholder="הזן שם קבוצה..."
                autoComplete="new-password"
                dir="rtl"
              />
            </PopoverBodySection>
            <PopoverBodySection $pad="8px 12px">
              <PersonSearchField
                query={newMemberSearch}
                onQueryChange={onNewSearchChange}
                onFocus={noop}
                onBlur={noop}
                resultsOpen
                results={newSearchResults}
                onSelectResult={onPickNewMember}
                showManualAdd={false}
              />
            </PopoverBodySection>
            {newPicked.length > 0 && (
              <PickedList>
                <PickedListLabel>נוספו לקבוצה</PickedListLabel>
                {newPicked.map((m, i) => (
                  <PopoverPickedRow key={i}>
                    <PickedRemoveBtn
                      type="button"
                      data-testid={HAMAL_TAB_IDS.removePickedBtn(m.idNumber || i)}
                      onClick={handleRemoveNewPicked(i)}
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
                disabled={!newName.trim()}
              >
                צור קבוצה
              </PopoverSaveBtn>
            </PopoverBodySection>
          </form>
        </FloatingPanel>
      )}
    </TabRoot>
  );
};
