import type { ColumnDef } from '@/components/ui/GridTable';
import { SubTable } from '@/components/ui/SubTable';
import type { PersonMember } from '../../PeoplePicker.constants';
import { MemberCell, MemberExpandedBlock, MemberNameCell } from './ExpandedMemberBlock.styles';

const COLUMNS: ColumnDef<PersonMember>[] = [
  { key: 'spacer', width: '28px' },
  {
    key: 'name',
    width: '1fr',
    header: 'שם מלא',
    align: 'right',
    cell: (member) => <MemberNameCell>{member.name}</MemberNameCell>,
  },
  {
    key: 'idNumber',
    width: '64px',
    header: 'תעודת זהות',
    cell: (member) => <MemberCell $tabular>{member.idNumber}</MemberCell>,
  },
  {
    key: 'organization',
    width: '80px',
    header: 'ארגון',
    cell: (member) => <MemberCell>{member.environment}</MemberCell>,
  },
];

const rowKey = (member: PersonMember, index: number) => member.idNumber || index;

interface ExpandedMemberBlockProps {
  members: PersonMember[];
}

export const ExpandedMemberBlock = ({ members }: ExpandedMemberBlockProps) => (
  <MemberExpandedBlock>
    <SubTable columns={COLUMNS} items={members} getRowKey={rowKey} />
  </MemberExpandedBlock>
);
