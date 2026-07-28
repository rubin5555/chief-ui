import { Plus } from 'lucide-react';
import type { MouseEvent } from 'react';
import { GridTableRow } from '@/components/ui/GridTable';
import { colors, gray } from '@/styles/theme';
import { ExpandedMemberBlock } from '../../../../components/ExpandedMemberBlock';
import { SelectionCheckbox } from '../../../../components/SelectionCheckbox';
import type { HamalGroup, PersonMember } from '../../../../MailingListFormModal.constants';
import {
  CheckboxCell,
  CountLabel,
  ExpandBtn,
  ExpandChevron,
  NameCell,
} from '../../../tabs.shared.styles';
import { IconActionBtn } from '../../HamalTab.styles';
import { HAMAL_TAB_IDS } from '../../HamalTab.testids';

interface HamalGroupRowProps {
  group: HamalGroup;
  extraMembers: PersonMember[];
  isSelected: boolean;
  isAdded: boolean;
  isExpanded: boolean;
  isAddMemberOpen: boolean;
  onRowClick: () => void;
  onCheckClick: (e: MouseEvent) => void;
  onAddMemberClick: (e: MouseEvent) => void;
  onToggleExpand: (e: MouseEvent) => void;
}

export const HamalGroupRow = ({
  group,
  extraMembers,
  isSelected,
  isAdded,
  isExpanded,
  isAddMemberOpen,
  onRowClick,
  onCheckClick,
  onAddMemberClick,
  onToggleExpand,
}: HamalGroupRowProps) => {
  const totalCount = group.members.length + extraMembers.length;

  return (
    <GridTableRow
      isSelected={isSelected}
      isAdded={isAdded}
      onClick={onRowClick}
      expansion={
        isExpanded ? <ExpandedMemberBlock members={[...group.members, ...extraMembers]} /> : null
      }
    >
      <CheckboxCell data-testid={HAMAL_TAB_IDS.rowCheckbox(group.id)} onClick={onCheckClick}>
        <SelectionCheckbox isSelected={isSelected} isAdded={isAdded} />
      </CheckboxCell>
      <NameCell>
        {group.name}
        <CountLabel>({totalCount})</CountLabel>
      </NameCell>
      <IconActionBtn
        type="button"
        data-testid={HAMAL_TAB_IDS.rowAddMember(group.id)}
        onClick={onAddMemberClick}
      >
        <Plus size={14} color={isAddMemberOpen ? colors.primary : gray[400]} />
      </IconActionBtn>
      <ExpandBtn
        type="button"
        data-testid={HAMAL_TAB_IDS.rowExpand(group.id)}
        onClick={onToggleExpand}
      >
        <ExpandChevron size={14} color={gray[400]} $isExpanded={isExpanded} />
      </ExpandBtn>
    </GridTableRow>
  );
};
