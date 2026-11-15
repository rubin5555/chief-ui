import { memo, useState } from 'react';
import type { RowConfig } from '@/components/ui/GridTable';
import { GridTable } from '@/components/ui/GridTable';
import type { Member } from '../../PeoplePicker.constants';
import { PEOPLE_PICKER_IDS } from '../../PeoplePicker.testids';
import { ExpandedBlock } from '../components.shared.styles';
import { GroupMemberTable, memberColumns } from './MembersPanel.columns';
import {
  EmptyMembersIcon,
  EmptyMembersState,
  EmptyMembersText,
  MemberCount,
  PanelHeader,
  PanelRoot,
  PanelTitle,
} from './MembersPanel.styles';

const memberKey = (member: Member) => member.id;

const emptyState = (
  <EmptyMembersState>
    <EmptyMembersIcon size={40} />
    <EmptyMembersText>
      הוסף נמענים לרשימה באמצעות
      <br />
      החיפוש או ייבוא מהפאנל הימני
    </EmptyMembersText>
  </EmptyMembersState>
);

interface MembersPanelProps {
  members: Member[];
  onRemove: (id: string) => void;
  title?: string;
}

const MembersPanelComponent = ({ members, onRemove, title = 'נמענים' }: MembersPanelProps) => {
  const [groupExpanded, setGroupExpanded] = useState<string | null>(null);
  const onToggleGroup = (id: string) => setGroupExpanded((prev) => (prev === id ? null : id));

  const uniqueIds = new Set(
    members.flatMap((m) =>
      m.isGroup ? (m.groupMembers ?? []).map((gm) => gm.idNumber) : [m.idNumber],
    ),
  );
  const totalCount = uniqueIds.size;

  const handleRowExpand = (id: string) => () => onToggleGroup(id);
  const handleExpandBtn = (id: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleGroup(id);
  };
  const handleRemoveBtn = (id: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(id);
  };
  const handleRemoveMember = (id: string) => () => onRemove(id);

  const columns = memberColumns({
    expandedId: groupExpanded,
    onExpandClick: handleExpandBtn,
    onRemoveGroup: handleRemoveBtn,
    onRemoveMember: handleRemoveMember,
  });

  const rowConfig = (member: Member): RowConfig => {
    if (!member.isGroup) return {};

    const isExpanded = groupExpanded === member.id;
    return {
      onClick: handleRowExpand(member.id),
      expansion:
        isExpanded && member.groupMembers ? (
          <ExpandedBlock>
            <GroupMemberTable members={member.groupMembers} />
          </ExpandedBlock>
        ) : null,
    };
  };

  return (
    <PanelRoot data-testid={PEOPLE_PICKER_IDS.membersPanel}>
      <PanelHeader>
        <PanelTitle>
          {title}
          {!!totalCount && <MemberCount> ({totalCount})</MemberCount>}
        </PanelTitle>
      </PanelHeader>

      <GridTable
        columns={columns}
        items={members}
        getRowKey={memberKey}
        row={rowConfig}
        emptyState={emptyState}
      />
    </PanelRoot>
  );
};

export const MembersPanel = memo(MembersPanelComponent);
