import { Button } from '@/components/ui/Button';
import { FooterActions } from '../../ApprovalRotation.shared.styles';
import { APPROVAL_ROTATION_IDS } from '../../ApprovalRotation.testids';
import {
  DistributePromptBody,
  DistributePromptBox,
  DistributePromptTitle,
} from './DistributePrompt.styles';

export interface DistributePromptProps {
  docName: string;
  onDistributeNow: () => void;
  onDistributeLater: () => void;
}

// What the round ends on once every stage has approved: an offer to distribute
// now, and an equally valid way to decline. `לא כרגע` is outlined rather than
// ghosted because deciding to wait is a real answer, not a dismissal.
export const DistributePrompt = ({
  docName,
  onDistributeNow,
  onDistributeLater,
}: DistributePromptProps) => (
  <DistributePromptBox>
    <DistributePromptTitle>הפצת המסמך</DistributePromptTitle>
    <DistributePromptBody>
      כל השלבים אושרו — האם ברצונך להפיץ את המסמך &quot;{docName}&quot;?
    </DistributePromptBody>
    <FooterActions>
      <Button
        type="button"
        variant="outline"
        onClick={onDistributeLater}
        data-testid={APPROVAL_ROTATION_IDS.distributeLaterBtn}
      >
        לא כרגע
      </Button>
      <Button
        type="button"
        onClick={onDistributeNow}
        data-testid={APPROVAL_ROTATION_IDS.distributeNowBtn}
      >
        הפצת המסמך
      </Button>
    </FooterActions>
  </DistributePromptBox>
);
