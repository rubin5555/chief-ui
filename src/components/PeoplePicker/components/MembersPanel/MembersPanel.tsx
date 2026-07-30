import { Trash2 } from 'lucide-react';
import { memo, useState } from 'react';
import { GridTable, GridTableRow } from '@/components/ui/GridTable';
import { SubTable, SubTableRow } from '@/components/ui/SubTable';
import type { Member, PersonMember } from '../../PeoplePicker.constants';
import { MEMBERS_GRID, SUB_MEMBER_GRID } from '../../PeoplePicker.constants';
import { ColHeader } from '../../PeoplePicker.shared.styles';
import { PEOPLE_PICKER_IDS } from '../../PeoplePicker.testids';
import { ExpandedBlock } from '../components.shared.styles';
import {
  CellText,
  EmptyMembersIcon,
  EmptyMembersState,
  EmptyMembersText,
  ExpandBtn,
  ExpandIcon,
  MemberCount,
  MemberName,
  MemberNameCell,
  MemberSublabel,
  PanelHeader,
  PanelRoot,
  PanelTitle,
  RemoveBtn,
  SubMemberCell,
  SubMemberName,
} from './MembersPanel.styles';
import { MEMBERS_PANEL_IDS } from './MembersPanel.testids';

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

  return (
    <PanelRoot data-testid={PEOPLE_PICKER_IDS.membersPanel}>
      <PanelHeader>
        <PanelTitle>
          {title}
          {!!totalCount && <MemberCount> ({totalCount})</MemberCount>}
        </PanelTitle>
      </PanelHeader>

      <GridTable
        columns={MEMBERS_GRID}
        headers={[
          null,
          <ColHeader $align="right">שם</ColHeader>,
          <ColHeader>ת.ז.</ColHeader>,
          <ColHeader>ארגון</ColHeader>,
          null,
        ]}
        items={members}
        getRowKey={(member) => member.id}
        emptyState={
          <EmptyMembersState>
            <EmptyMembersIcon size={40} />
            <EmptyMembersText>
              הוסף נמענים לרשימה באמצעות
              <br />
              החיפוש או ייבוא מהפאנל הימני
            </EmptyMembersText>
          </EmptyMembersState>
        }
        renderRow={(member: Member) => {
          const isExpanded = groupExpanded === member.id;

          if (member.isGroup) {
            const memberCount = member.groupMembers?.length ?? 0;
            return (
              <GridTableRow
                onClick={handleRowExpand(member.id)}
                expansion={
                  isExpanded && member.groupMembers ? (
                    <ExpandedBlock>
                      <SubTable
                        columns={SUB_MEMBER_GRID}
                        headers={[
                          null,
                          <ColHeader $align="right">שם מלא</ColHeader>,
                          <ColHeader>ת.ז.</ColHeader>,
                          <ColHeader>ארגון</ColHeader>,
                          null,
                        ]}
                        items={member.groupMembers}
                        getRowKey={(m: PersonMember, i: number) => m.idNumber || i}
                        renderRow={(m: PersonMember) => (
                          <SubTableRow>
                            <span />
                            <SubMemberName>{m.name}</SubMemberName>
                            <SubMemberCell $tabular>{m.idNumber}</SubMemberCell>
                            <SubMemberCell>{m.environment}</SubMemberCell>
                            <span />
                          </SubTableRow>
                        )}
                      />
                    </ExpandedBlock>
                  ) : null
                }
              >
                <ExpandBtn
                  type="button"
                  data-testid={MEMBERS_PANEL_IDS.rowExpand(member.id)}
                  onClick={handleExpandBtn(member.id)}
                >
                  <ExpandIcon size={14} $isExpanded={isExpanded} />
                </ExpandBtn>
                <MemberNameCell>
                  <MemberName $weight={600}>{member.name}</MemberName>
                  {member.groupType && (
                    <MemberSublabel>
                      {member.groupType} · {memberCount} חברים
                    </MemberSublabel>
                  )}
                </MemberNameCell>
                <span />
                <CellText>{member.environment}</CellText>
                <RemoveBtn
                  type="button"
                  data-testid={MEMBERS_PANEL_IDS.rowRemove(member.id)}
                  onClick={handleRemoveBtn(member.id)}
                >
                  <Trash2 size={14} />
                </RemoveBtn>
              </GridTableRow>
            );
          }

          return (
            <GridTableRow>
              <span />
              <MemberNameCell>
                <MemberName>{member.name}</MemberName>
                {member.subLabel && <MemberSublabel>{member.subLabel}</MemberSublabel>}
              </MemberNameCell>
              <CellText $tabular>{member.idNumber}</CellText>
              <CellText>{member.environment}</CellText>
              <RemoveBtn
                type="button"
                data-testid={MEMBERS_PANEL_IDS.rowRemove(member.id)}
                onClick={handleRemoveMember(member.id)}
              >
                <Trash2 size={14} />
              </RemoveBtn>
            </GridTableRow>
          );
        }}
      />
    </PanelRoot>
  );
};

export const MembersPanel = memo(MembersPanelComponent);
