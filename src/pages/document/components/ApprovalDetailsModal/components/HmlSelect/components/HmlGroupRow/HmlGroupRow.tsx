import { Check, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { HmlGroupDto } from '@/api/approvals';
import { APPROVAL_DETAILS_MODAL_IDS } from '../../../../ApprovalDetailsModal.testids';
import {
  Checkbox,
  ExpandBtn,
  GroupName,
  GroupRow,
  MemberList,
  MemberName,
} from './HmlGroupRow.styles';

export interface HmlGroupRowProps {
  group: HmlGroupDto;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

/**
 * One חמ״ל, with its members a chevron away (main, Edit.tsx:3023).
 *
 * Whether the members are showing is this row's own business and stays here: it
 * is a way of reading the list, not part of what is being chosen, and nothing
 * above the row is any different for it being open.
 */
export const HmlGroupRow = ({ group, isSelected, onToggle }: HmlGroupRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => onToggle(group.id);
  const handleExpand = () => setIsExpanded((prev) => !prev);

  return (
    <div>
      <GroupRow>
        <Checkbox
          type="button"
          role="checkbox"
          aria-checked={isSelected}
          aria-label={group.name}
          $checked={isSelected}
          data-testid={APPROVAL_DETAILS_MODAL_IDS.hmlOption(group.id)}
          onClick={handleToggle}
        >
          {isSelected && <Check size={10} strokeWidth={3} aria-hidden="true" />}
        </Checkbox>
        <GroupName>{group.name}</GroupName>
        <ExpandBtn
          type="button"
          $open={isExpanded}
          aria-expanded={isExpanded}
          aria-label={`חברי ${group.name}`}
          data-testid={APPROVAL_DETAILS_MODAL_IDS.hmlExpand(group.id)}
          onClick={handleExpand}
        >
          <ChevronDown size={14} aria-hidden="true" />
        </ExpandBtn>
      </GroupRow>

      {isExpanded && (
        <MemberList>
          {group.users.map((user) => (
            <MemberName key={user}>{user}</MemberName>
          ))}
        </MemberList>
      )}
    </div>
  );
};
