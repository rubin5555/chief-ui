import { lazy, Suspense, useState } from 'react';
import { HML_GROUPS_FALLBACK, useHmlGroups } from '@/api/approvals';
import { Button } from '@/components/ui/Button';
import { DISTRIBUTED_STATUSES, EDITABLE_STATUSES } from '../../document.constants';
import type { ApprovalRoundConfig } from '../ApprovalDetailsModal';
import { AcceptanceRow } from './ApprovalWorkflow.styles';
import { APPROVAL_WORKFLOW_IDS } from './ApprovalWorkflow.testids';
import { getNextStatus, getPrevStatus } from './approvalWorkflow.utils';
import { StatusFlowNav } from './components/StatusFlowNav';

const AcceptenceVerification = lazy(() =>
  import('../AcceptenceVerification').then((m) => ({ default: m.AcceptenceVerification })),
);
const ApprovalDetailsModal = lazy(() =>
  import('../ApprovalDetailsModal').then((m) => ({ default: m.ApprovalDetailsModal })),
);
const ApprovalRotation = lazy(() =>
  import('../ApprovalRotation').then((m) => ({ default: m.ApprovalRotation })),
);
const DistributeDoc = lazy(() =>
  import('../DistributeDoc').then((m) => ({ default: m.DistributeDoc })),
);

type FlowStep = 'idle' | 'details' | 'rotation' | 'distribute' | 'acceptance';

export const DOC_STATUS = {
  DRAFT: 'טיוטה',
  IN_PREP: 'בהכנה',
  IN_APPROVAL: 'בסבב אישורים',
  AWAITING_DISTRIBUTION: 'ממתין להפצה',
  OPERATIONAL: 'מבצעית',
} as const;

export interface ApprovalWorkflowProps {
  docName: string;
  status: string;
  onStatusChange: (status: string) => void;
}

// Owns the whole draft -> approval-round -> distribution flow and every modal it
// opens (per .claude/skills/modal-placement.md) — the sidebar only ever passes it
// status + a setter, never reaches into its internals.
//
// It renders no chrome itself beyond StatusFlowNav's two buttons: which status
// comes next, and whether pressing forward opens a modal or just writes the new
// status, is this component's business because it is the one holding the modals.
export const ApprovalWorkflow = ({ docName, status, onStatusChange }: ApprovalWorkflowProps) => {
  const [step, setStep] = useState<FlowStep>('idle');
  const [roundConfig, setRoundConfig] = useState<ApprovalRoundConfig | null>(null);
  const { data } = useHmlGroups();
  const hmlGroups = data ?? HML_GROUPS_FALLBACK.hmlGroups;

  const isInApproval = status === DOC_STATUS.IN_APPROVAL;
  const isAwaitingDistribution = status === DOC_STATUS.AWAITING_DISTRIBUTION;
  const isDistributed = DISTRIBUTED_STATUSES.has(status);
  const nextStatus = getNextStatus(status);
  const prevStatus = getPrevStatus(status);

  // main's gate on both buttons (Edit.tsx:3862): a locked document offers no
  // status moves, except while in an approval round — where the whole point is
  // to approve or reject it.
  const canStep = EDITABLE_STATUSES.has(status) || isInApproval;

  const advanceLabel = isAwaitingDistribution
    ? 'הפץ מסמך'
    : !canStep || !nextStatus
      ? null
      : isInApproval
        ? 'אישור/דחיית המסמך'
        : nextStatus === DOC_STATUS.IN_APPROVAL
          ? 'העבר לסבב אישורים'
          : `העבר ל${nextStatus}`;

  const revertLabel = isAwaitingDistribution
    ? 'החזר לעריכה'
    : !canStep || !prevStatus
      ? null
      : isInApproval
        ? 'החזר לעריכה'
        : `החזר למסמך ${prevStatus}`;

  const handleAdvance = () => {
    if (isAwaitingDistribution) setStep('distribute');
    // A round has to be configured before it can be approved or rejected. main
    // falls back to a hardcoded set of stages here; this opens the configuration
    // modal instead, so what you approve is a round that actually exists.
    else if (isInApproval) setStep(roundConfig ? 'rotation' : 'details');
    else if (nextStatus === DOC_STATUS.IN_APPROVAL) setStep('details');
    else if (nextStatus) onStatusChange(nextStatus);
  };

  const handleRevert = () => {
    if (isAwaitingDistribution) onStatusChange(DOC_STATUS.IN_PREP);
    else if (prevStatus) onStatusChange(prevStatus);
  };

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

      <Suspense fallback={null}>
        {step === 'details' && (
          <ApprovalDetailsModal onClose={handleClose} onSubmit={handleDetailsSubmit} />
        )}

        {step === 'rotation' && roundConfig && (
          <ApprovalRotation
            docName={docName}
            config={roundConfig}
            hmlGroups={hmlGroups}
            onClose={handleClose}
            onReject={handleReject}
            onDistribute={handleDistributeFromRotation}
          />
        )}

        {step === 'distribute' && (
          <DistributeDoc docName={docName} onClose={handleClose} onSend={handleClose} />
        )}

        {step === 'acceptance' && (
          <AcceptenceVerification onClose={handleClose} onSend={handleClose} />
        )}
      </Suspense>
    </>
  );
};
