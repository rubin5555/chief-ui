import { useState } from 'react';
import { HML_GROUPS_FALLBACK, useHmlGroups } from '@/api/approvals';
import { Button } from '@/components/ui/Button';
import { DISTRIBUTED_STATUSES, EDITABLE_STATUSES } from '../../document.constants';
import type { DocumentHeader } from '../../types';
import type { ApprovalRoundConfig } from '../ApprovalDetailsModal';
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

// Owns the whole draft -> approval-round -> distribution flow and every modal it
// opens (per .claude/skills/modal-placement.md) — the sidebar only ever passes it
// status + a setter, never reaches into its internals.
//
// It renders no chrome itself beyond StatusFlowNav's two buttons: which status
// comes next, and whether pressing forward opens a modal or just writes the new
// status, is this component's business because it is the one holding the modals.
export const ApprovalWorkflow = ({
  header,
  status,
  onStatusChange,
  onHeaderChange,
}: ApprovalWorkflowProps) => {
  const [step, setStep] = useState<ApprovalFlowStep>('idle');
  const [roundConfig, setRoundConfig] = useState<ApprovalRoundConfig | null>(null);
  // Not a step: the toast outlives the dialog that started it, and distribution
  // carries on while you go back to reading the document.
  const [distributedTo, setDistributedTo] = useState<number | null>(null);
  const { data } = useHmlGroups();
  const hmlGroups = data ?? HML_GROUPS_FALLBACK.hmlGroups;
  const gate = useSignatureGate();
  const { trackStatusAdvanced, trackStatusReverted, trackRoundBlockedUnsigned } =
    useApprovalWorkflowAnalytics();

  const isInApproval = status === DOC_STATUS.IN_APPROVAL;
  const isAwaitingDistribution = status === DOC_STATUS.AWAITING_DISTRIBUTION;
  const isDistributed = DISTRIBUTED_STATUSES.has(status);
  const nextStatus = getNextStatus(status);

  // main's gate on both buttons (Edit.tsx:3862): a locked document offers no
  // status moves, except while in an approval round — where the whole point is
  // to approve or reject it.
  const canStep = EDITABLE_STATUSES.has(status) || isInApproval;

  const advanceLabel = getAdvanceLabel(status, canStep);
  const revertLabel = getRevertLabel(status, canStep);

  const handleAdvance = () => {
    // Distribution is the one step that can't be walked back, so it asks first.
    if (isAwaitingDistribution) setStep('distributeConfirm');
    // A round has to be configured before it can be approved or rejected. main
    // falls back to a hardcoded set of stages here; this opens the configuration
    // modal instead, so what you approve is a round that actually exists.
    else if (isInApproval) setStep(roundConfig ? 'rotation' : 'details');
    // The round opens with main's review step; the signature gate sits on *its*
    // continue button (Edit.tsx:4920), not here.
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

  // A document nobody has signed can't enter an approval round. The check is
  // synchronous and its answer is a return value, because the signatures live in
  // another subtree and this handler has to decide now.
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

  // The share dialog closes, and the toast takes over from it.
  const handleSent = (recipients: string[]) => {
    setDistributedTo(recipients.length);
    setStep('idle');
  };

  const handleCloseToast = () => setDistributedTo(null);

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

      {/* Confirming receipt is a *recipient's* action on an already-distributed
          document — its own copy says the details go to whoever distributed it —
          so it appears only once the document has been distributed, which is
          exactly when main leaves this part of the sidebar empty. main never
          reaches its own version of this modal from anywhere (its
          `setShowViduyKabalah(true)` has no call site), so there is no button of
          main's to match and none of main's buttons is displaced. */}
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
        distributedTo={distributedTo}
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
