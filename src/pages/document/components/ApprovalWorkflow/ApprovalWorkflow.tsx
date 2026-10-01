import { useState } from 'react';
import { HML_GROUPS_FALLBACK, useHmlGroups } from '@/api/approvals';
import { Button } from '@/components/ui/Button';
import type { ApprovalRoundConfig } from '@/modals/ApprovalDetailsModal';
import { DISTRIBUTED_STATUSES, EDITABLE_STATUSES } from '../../document.constants';
import type { DocumentHeader } from '../../types';
import { useSignatureGate } from '../SignaturesSection';
import { useApprovalWorkflowAnalytics } from './ApprovalWorkflow.analytics';
import { AcceptanceRow } from './ApprovalWorkflow.styles';
import { APPROVAL_WORKFLOW_IDS } from './ApprovalWorkflow.testids';
import type { ApprovalFlowStep } from './approvalWorkflow.types';
import {
  getAdvanceLabel,
  getNextStatus,
  getPrevStatus,
  getRevertLabel,
} from './approvalWorkflow.utils';
import { ApprovalFlowModals } from './components/ApprovalFlowModals';
import { StatusFlowNav } from './components/StatusFlowNav';

export const DOC_STATUS = {
  DRAFT: 'טיוטה',
  IN_PREP: 'בהכנה',
  IN_APPROVAL: 'בסבב אישורים',
  AWAITING_DISTRIBUTION: 'ממתין להפצה',
  OPERATIONAL: 'מבצעית',
} as const;

export interface ApprovalWorkflowProps {
  header: DocumentHeader;
  status: string;
  onStatusChange: (status: string) => void;
  onHeaderChange: (header: DocumentHeader) => void;
}

export const ApprovalWorkflow = ({
  header,
  status,
  onStatusChange,
  onHeaderChange,
}: ApprovalWorkflowProps) => {
  const [step, setStep] = useState<ApprovalFlowStep>('idle');
  const [roundConfig, setRoundConfig] = useState<ApprovalRoundConfig | null>(null);

  const [isDistributing, setIsDistributing] = useState(false);
  const { data } = useHmlGroups();
  const hmlGroups = data ?? HML_GROUPS_FALLBACK.hmlGroups;
  const gate = useSignatureGate();
  const { trackStatusAdvanced, trackStatusReverted, trackRoundBlockedUnsigned } =
    useApprovalWorkflowAnalytics();

  const isInApproval = status === DOC_STATUS.IN_APPROVAL;
  const isAwaitingDistribution = status === DOC_STATUS.AWAITING_DISTRIBUTION;
  const isDistributed = DISTRIBUTED_STATUSES.has(status);
  const nextStatus = getNextStatus(status);

  const canStep = EDITABLE_STATUSES.has(status) || isInApproval;

  const advanceLabel = getAdvanceLabel(status, canStep);
  const revertLabel = getRevertLabel(status, canStep);

  const handleAdvance = () => {
    if (isAwaitingDistribution) setStep('distributeConfirm');
    else if (isInApproval) setStep(roundConfig ? 'rotation' : 'details');
    else if (nextStatus === DOC_STATUS.IN_APPROVAL) setStep('review');
    else if (nextStatus) {
      trackStatusAdvanced(nextStatus);
      onStatusChange(nextStatus);
    }
  };

  const handleRevert = () => {
    const target = isAwaitingDistribution ? DOC_STATUS.IN_PREP : getPrevStatus(status);
    if (!target) return;
    trackStatusReverted(target);
    onStatusChange(target);
  };

  const handleReviewContinue = (isDirty: boolean) => {
    if (!gate.requireSignature()) {
      trackRoundBlockedUnsigned();
      setStep('idle');
      return;
    }
    setStep(isDirty ? 'dirtyWarning' : 'details');
  };

  const handleDirtyWarningBack = () => setStep('review');
  const handleDirtyWarningContinue = () => setStep('details');

  const handleConfirmDistribute = () => setStep('distribute');

  const handleSent = () => {
    setIsDistributing(true);
    setStep('idle');
  };

  const handleCloseToast = () => setIsDistributing(false);

  const handleOpenAcceptance = () => setStep('acceptance');
  const handleClose = () => setStep('idle');

  const handleDetailsSubmit = (config: ApprovalRoundConfig) => {
    setRoundConfig(config);
    onStatusChange(DOC_STATUS.IN_APPROVAL);
    setStep('rotation');
  };

  const handleReject = () => {
    onStatusChange(DOC_STATUS.IN_PREP);
    setStep('idle');
  };

  const handleDistributeFromRotation = () => {
    onStatusChange(DOC_STATUS.OPERATIONAL);
    setStep('distribute');
  };

  return (
    <>
      <StatusFlowNav
        advanceLabel={advanceLabel}
        revertLabel={revertLabel}
        onAdvance={handleAdvance}
        onRevert={handleRevert}
      />

      {isDistributed && (
        <AcceptanceRow>
          <Button
            type="button"
            variant="outline"
            onClick={handleOpenAcceptance}
            data-testid={APPROVAL_WORKFLOW_IDS.acceptanceBtn}
          >
            אישור קבלה (חמ״ל)
          </Button>
        </AcceptanceRow>
      )}

      <ApprovalFlowModals
        step={step}
        header={header}
        status={status}
        hmlGroups={hmlGroups}
        roundConfig={roundConfig}
        isDistributing={isDistributing}
        onClose={handleClose}
        onSaveHeader={onHeaderChange}
        onReviewContinue={handleReviewContinue}
        onDirtyWarningBack={handleDirtyWarningBack}
        onDirtyWarningContinue={handleDirtyWarningContinue}
        onDetailsSubmit={handleDetailsSubmit}
        onReject={handleReject}
        onApprove={gate.addApproverSignature}
        onDistributeFromRotation={handleDistributeFromRotation}
        onConfirmDistribute={handleConfirmDistribute}
        onSent={handleSent}
        onCloseToast={handleCloseToast}
      />
    </>
  );
};
