import { Fragment } from 'react';
import { APPROVAL_DETAILS_MODAL_IDS } from '../../ApprovalDetailsModal.testids';
import { Connector, TimelineRoot } from './ApproverTimeline.styles';
import { ApproverStage } from './components/ApproverStage';

export interface ApproverTimelineProps {
  ranks: string[];
  usersByRank: Record<string, string[]>;
  approverUsers: string[];
  onAddUser: (rank: string, user: string) => void;
  onRemoveUser: (rank: string, user: string) => void;
}

export const ApproverTimeline = ({
  ranks,
  usersByRank,
  approverUsers,
  onAddUser,
  onRemoveUser,
}: ApproverTimelineProps) => (
  <TimelineRoot data-testid={APPROVAL_DETAILS_MODAL_IDS.timeline}>
    {ranks.map((rank, index) => (
      <Fragment key={rank}>
        <ApproverStage
          rank={rank}
          users={usersByRank[rank] ?? []}
          approverUsers={approverUsers}
          onAddUser={onAddUser}
          onRemoveUser={onRemoveUser}
        />
        {index < ranks.length - 1 && <Connector aria-hidden="true" />}
      </Fragment>
    ))}
  </TimelineRoot>
);
