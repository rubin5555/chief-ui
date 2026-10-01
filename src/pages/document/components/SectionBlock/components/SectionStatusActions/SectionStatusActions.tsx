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
  onRequestFix: () => void;
}

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
