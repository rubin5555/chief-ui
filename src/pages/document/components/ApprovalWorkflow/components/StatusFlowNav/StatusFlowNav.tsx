import { ChevronLeft } from 'lucide-react';
import { AdvanceBtn, FlowLabel, FlowNavRoot, RevertBtn, RevertIcon } from './StatusFlowNav.styles';
import { STATUS_FLOW_NAV_IDS } from './StatusFlowNav.testids';

export interface StatusFlowNavProps {
  /** `null` hides the button: at the end of the flow there is nowhere forward. */
  advanceLabel: string | null;
  revertLabel: string | null;
  onAdvance: () => void;
  onRevert: () => void;
}

// The two buttons that move a document along its status flow. Deliberately dumb:
// which status comes next, whether a press opens a modal or just writes the new
// status, and whether the pair should appear at all are all decided by
// ApprovalWorkflow, which owns those modals. This component only knows that one
// button goes forward and the other goes back.
export const StatusFlowNav = ({
  advanceLabel,
  revertLabel,
  onAdvance,
  onRevert,
}: StatusFlowNavProps) => (
  <FlowNavRoot data-testid={STATUS_FLOW_NAV_IDS.root}>
    {advanceLabel && (
      <AdvanceBtn type="button" data-testid={STATUS_FLOW_NAV_IDS.advanceBtn} onClick={onAdvance}>
        <FlowLabel>{advanceLabel}</FlowLabel>
        <ChevronLeft size={14} aria-hidden="true" />
      </AdvanceBtn>
    )}

    {revertLabel && (
      <RevertBtn type="button" data-testid={STATUS_FLOW_NAV_IDS.revertBtn} onClick={onRevert}>
        <FlowLabel>{revertLabel}</FlowLabel>
        <RevertIcon>
          <ChevronLeft size={12} aria-hidden="true" />
        </RevertIcon>
      </RevertBtn>
    )}
  </FlowNavRoot>
);
