import { SubTable, SubTableRow } from '@/components/ui/SubTable';
import type { PersonMember } from '../../PeoplePicker.constants';
import { MEMBER_EXPAND_GRID } from '../../PeoplePicker.constants';
import {
  ColCenter,
  ColRight,
  MemberCell,
  MemberExpandedBlock,
  MemberNameCell,
} from './ExpandedMemberBlock.styles';

interface ExpandedMemberBlockProps {
  members: PersonMember[];
}

export const ExpandedMemberBlock = ({ members }: ExpandedMemberBlockProps) => (
  <MemberExpandedBlock>
    <SubTable
      columns={MEMBER_EXPAND_GRID}
      headers={[
        null,
        <ColRight>שם מלא</ColRight>,
        <ColCenter>תעודת זהות</ColCenter>,
        <ColCenter>ארגון</ColCenter>,
      ]}
      items={members}
      getRowKey={(m, i) => m.idNumber || i}
      renderRow={(m: PersonMember) => (
        <SubTableRow>
          <span />
          <MemberNameCell>{m.name}</MemberNameCell>
          <MemberCell $tabular>{m.idNumber}</MemberCell>
          <MemberCell>{m.environment}</MemberCell>
        </SubTableRow>
      )}
    />
  </MemberExpandedBlock>
);
