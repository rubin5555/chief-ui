import type { SectionStatus } from '../../../../types';
import {
  ActionsRow,
  ButtonPair,
  PrimaryStatusBtn,
  SecondaryStatusBtn,
} from './SectionStatusActions.styles';
import { SECTION_STATUS_ACTIONS_IDS } from './SectionStatusActions.testids';

export interface SectionStatusActionsProps {
  sectionId: string;
  status: SectionStatus;
  onStatusChange: (status: SectionStatus) => void;
  /** Sends the section back for changes; the reason is written in its chat thread. */
  onRequestFix: () => void;
}

// The status controls at the foot of a section (main, Edit.tsx:4600).
//
// Three shapes, one per stage: a section being written offers to submit it, one
// awaiting approval offers both answers, and one already settled offers only the
// way back to editing. `idle` falls into that last group — it has never been
// submitted, but "reopen" is still the only move that makes sense.
export const SectionStatusActions = ({
  sectionId,
  status,
  onStatusChange,
  onRequestFix,
}: SectionStatusActionsProps) => {
  const handleSubmit = () => onStatusChange('pending');
  const handleApprove = () => onStatusChange('approved');
  const handleReopen = () => onStatusChange('editing');

  return (
    <ActionsRow data-testid={SECTION_STATUS_ACTIONS_IDS.root(sectionId)}>
      {status === 'editing' ? (
        <PrimaryStatusBtn
          type="button"
          data-testid={SECTION_STATUS_ACTIONS_IDS.submitBtn(sectionId)}
          onClick={handleSubmit}
        >
          העברה לאישור
        </PrimaryStatusBtn>
      ) : status === 'pending' ? (
        <ButtonPair>
          <SecondaryStatusBtn
            type="button"
            data-testid={SECTION_STATUS_ACTIONS_IDS.fixBtn(sectionId)}
            onClick={onRequestFix}
          >
            לתיקון
          </SecondaryStatusBtn>
          <PrimaryStatusBtn
            type="button"
            data-testid={SECTION_STATUS_ACTIONS_IDS.approveBtn(sectionId)}
            onClick={handleApprove}
          >
            לאישור
          </PrimaryStatusBtn>
        </ButtonPair>
      ) : (
        <SecondaryStatusBtn
          type="button"
          data-testid={SECTION_STATUS_ACTIONS_IDS.reopenBtn(sectionId)}
          onClick={handleReopen}
        >
          החזר לעריכה
        </SecondaryStatusBtn>
      )}
    </ActionsRow>
  );
};
