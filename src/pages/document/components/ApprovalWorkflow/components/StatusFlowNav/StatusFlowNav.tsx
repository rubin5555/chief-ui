import { ChevronLeft } from 'lucide-react';
import { AdvanceBtn, FlowLabel, FlowNavRoot, RevertBtn, RevertIcon } from './StatusFlowNav.styles';
import { STATUS_FLOW_NAV_IDS } from './StatusFlowNav.testids';

export interface StatusFlowNavProps {
  advanceLabel: string | null;
  revertLabel: string | null;
  onAdvance: () => void;
  onRevert: () => void;
}

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
