import { Trash2 } from 'lucide-react';
import type { MouseEvent } from 'react';
import type { ColumnDef } from '@/components/ui/GridTable';
import { SubTable } from '@/components/ui/SubTable';
import type { Member, PersonMember } from '../../PeoplePicker.constants';
import {
  CellText,
  ExpandBtn,
  ExpandIcon,
  MemberName,
  MemberNameCell,
  MemberSublabel,
  RemoveBtn,
  SubMemberCell,
  SubMemberName,
} from './MembersPanel.styles';
import { MEMBERS_PANEL_IDS } from './MembersPanel.testids';

const GROUP_MEMBER_COLUMNS: ColumnDef<PersonMember>[] = [
  { key: 'spacer', width: '28px' },
  {
    key: 'name',
    width: '1fr',
    header: 'שם מלא',
    align: 'right',
    cell: (person) => <SubMemberName>{person.name}</SubMemberName>,
  },
  {
    key: 'idNumber',
    width: '64px',
    header: 'ת.ז.',
    cell: (person) => <SubMemberCell $tabular>{person.idNumber}</SubMemberCell>,
  },
  {
    key: 'organization',
    width: '80px',
    header: 'ארגון',
    cell: (person) => <SubMemberCell>{person.environment}</SubMemberCell>,
  },
  { key: 'actions', width: '32px' },
];

const groupMemberKey = (person: PersonMember, index: number) => person.idNumber || index;

export const GroupMemberTable = ({ members }: { members: PersonMember[] }) => (
  <SubTable columns={GROUP_MEMBER_COLUMNS} items={members} getRowKey={groupMemberKey} />
);

interface MemberColumnsDeps {
  expandedId: string | null;
  onExpandClick: (id: string) => (event: MouseEvent) => void;
  onRemoveGroup: (id: string) => (event: MouseEvent) => void;
  onRemoveMember: (id: string) => () => void;
}

// Groups and people share these five columns and differ only in what each cell
// holds — a group leads with an expand chevron and hides its id, a person leads
// with an empty gutter. Branching per cell keeps the two shapes in one grid
// instead of two row components that have to be kept the same width by hand.
export const memberColumns = ({
  expandedId,
  onExpandClick,
  onRemoveGroup,
  onRemoveMember,
}: MemberColumnsDeps): ColumnDef<Member>[] => [
  {
    key: 'expand',
    width: '28px',
    cell: (member) =>
      member.isGroup ? (
        <ExpandBtn
          type="button"
          data-testid={MEMBERS_PANEL_IDS.rowExpand(member.id)}
          onClick={onExpandClick(member.id)}
        >
          <ExpandIcon size={14} $isExpanded={expandedId === member.id} />
        </ExpandBtn>
      ) : null,
  },
  {
    key: 'name',
    width: '1fr',
    header: 'שם',
    align: 'right',
    cell: (member) => (
      <MemberNameCell>
        <MemberName $weight={member.isGroup ? 600 : undefined}>{member.name}</MemberName>
        {member.isGroup
          ? member.groupType && (
              <MemberSublabel>
                {member.groupType} · {member.groupMembers?.length ?? 0} חברים
              </MemberSublabel>
            )
          : member.subLabel && <MemberSublabel>{member.subLabel}</MemberSublabel>}
      </MemberNameCell>
    ),
  },
  {
    key: 'idNumber',
    width: '80px',
    header: 'ת.ז.',
    cell: (member) => (member.isGroup ? null : <CellText $tabular>{member.idNumber}</CellText>),
  },
  {
    key: 'organization',
    width: '80px',
    header: 'ארגון',
    cell: (member) => <CellText>{member.environment}</CellText>,
  },
  {
    key: 'actions',
    width: '32px',
    cell: (member) => (
      <RemoveBtn
        type="button"
        data-testid={MEMBERS_PANEL_IDS.rowRemove(member.id)}
        onClick={member.isGroup ? onRemoveGroup(member.id) : onRemoveMember(member.id)}
      >
        <Trash2 size={14} />
      </RemoveBtn>
    ),
  },
];
