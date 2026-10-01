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
