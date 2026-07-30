import { Fragment } from 'react';
import { APPROVAL_DETAILS_MODAL_IDS } from '../../ApprovalDetailsModal.testids';
import { Connector, TimelineRoot } from './ApproverTimeline.styles';
import { ApproverStage } from './components/ApproverStage';

export interface ApproverTimelineProps {
  /** The ranks in the round, lowest first — everything up to the one picked. */
  ranks: string[];
  usersByRank: Record<string, string[]>;
  approverUsers: string[];
  onAddUser: (rank: string, user: string) => void;
  onRemoveUser: (rank: string, user: string) => void;
}

/**
 * The round as it is being built (main, Edit.tsx:2962): one dot per rank the
 * document has to pass, in the order it passes them, each holding the people
 * named for it.
 *
 * This is the whole reason the rank field above it is a *single* select. Picking
 * "אלוף" doesn't mean only an אלוף approves — it means the document climbs to
 * there, so every rank below comes with it, and the timeline is where that
 * becomes visible.
 */
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
