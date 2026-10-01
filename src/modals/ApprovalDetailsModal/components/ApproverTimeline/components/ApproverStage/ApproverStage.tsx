import { APPROVAL_DETAILS_MODAL_IDS } from '../../../../ApprovalDetailsModal.testids';
import { MAX_APPROVERS_PER_RANK } from '../../../../approvalDetailsModal.constants';
import {
  ApproverChip,
  ChipName,
  ChipRemoveBtn,
  StageDot,
  StageLabel,
  StageRoot,
} from './ApproverStage.styles';
import { ApproverPicker } from './components/ApproverPicker';

export interface ApproverStageProps {
  rank: string;
  users: string[];
  approverUsers: string[];
  onAddUser: (rank: string, user: string) => void;
  onRemoveUser: (rank: string, user: string) => void;
}

export const ApproverStage = ({
  rank,
  users,
  approverUsers,
  onAddUser,
  onRemoveUser,
}: ApproverStageProps) => {
  const handleAdd = (user: string) => onAddUser(rank, user);
  const handleRemove = (user: string) => () => onRemoveUser(rank, user);

  return (
    <StageRoot data-testid={APPROVAL_DETAILS_MODAL_IDS.stage(rank)}>
      <StageDot aria-hidden="true" />
      <StageLabel>{rank}</StageLabel>

      {users.map((user) => (
        <ApproverChip key={user} data-testid={APPROVAL_DETAILS_MODAL_IDS.approverChip(rank, user)}>
          <ChipRemoveBtn
            type="button"
            aria-label={`הסרת ${user} מ${rank}`}
            onClick={handleRemove(user)}
          >
            ×
          </ChipRemoveBtn>
          <ChipName>{user}</ChipName>
        </ApproverChip>
      ))}

      {users.length < MAX_APPROVERS_PER_RANK && (
        <ApproverPicker
          rank={rank}
          options={approverUsers.filter((user) => !users.includes(user))}
          onPick={handleAdd}
        />
      )}
    </StageRoot>
  );
};
