import { Plus } from 'lucide-react';
import type { MouseEvent } from 'react';
import type { ColumnDef } from '@/components/ui/GridTable';
import { colors, gray } from '@/styles/theme';
import { SelectionCheckbox } from '../../components/SelectionCheckbox';
import type { HamalGroup, PersonMember } from '../../PeoplePicker.constants';
import {
  CheckboxCell,
  CountLabel,
  ExpandBtn,
  ExpandChevron,
  NameCell,
} from '../tabs.shared.styles';
import { IconActionBtn } from './HamalTab.styles';
import { HAMAL_TAB_IDS } from './HamalTab.testids';

interface HamalColumnsDeps {
  selectedIds: Set<string>;
  addedGroupIds: Set<string>;
  expandedId: string | null;
  addMemberGroupId: string | null;
  extraMembers: Record<string, PersonMember[]>;
  onCheckClick: (id: string, isAdded: boolean) => (event: MouseEvent) => void;
  onAddMemberClick: (id: string) => (event: MouseEvent) => void;
  onToggleExpand: (id: string) => (event: MouseEvent) => void;
}

export const hamalColumns = ({
  selectedIds,
  addedGroupIds,
  expandedId,
  addMemberGroupId,
  extraMembers,
  onCheckClick,
  onAddMemberClick,
  onToggleExpand,
}: HamalColumnsDeps): ColumnDef<HamalGroup>[] => [
  {
    key: 'select',
    width: '28px',
    cell: (group) => (
      <CheckboxCell
        data-testid={HAMAL_TAB_IDS.rowCheckbox(group.id)}
        onClick={onCheckClick(group.id, addedGroupIds.has(group.id))}
      >
        <SelectionCheckbox
          isSelected={selectedIds.has(group.id)}
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
        <CountLabel>({group.members.length + (extraMembers[group.id]?.length ?? 0)})</CountLabel>
      </NameCell>
    ),
  },
  {
    key: 'addMember',
    width: '28px',
    cell: (group) => (
      <IconActionBtn
        type="button"
        data-testid={HAMAL_TAB_IDS.rowAddMember(group.id)}
        onClick={onAddMemberClick(group.id)}
      >
        <Plus size={14} color={addMemberGroupId === group.id ? colors.primary : gray[400]} />
      </IconActionBtn>
    ),
  },
  {
    key: 'actions',
    width: '28px',
    cell: (group) => (
      <ExpandBtn
        type="button"
        data-testid={HAMAL_TAB_IDS.rowExpand(group.id)}
        onClick={onToggleExpand(group.id)}
      >
        <ExpandChevron size={14} color={gray[400]} $isExpanded={expandedId === group.id} />
      </ExpandBtn>
    ),
  },
];
