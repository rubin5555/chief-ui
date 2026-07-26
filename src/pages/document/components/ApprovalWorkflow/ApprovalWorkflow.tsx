import { useState } from 'react';
import { HML_GROUPS_FALLBACK, useHmlGroups } from '@/api/approvals';
import { AcceptenceVerification } from '../AcceptenceVerification';
import type { ApprovalRoundConfig } from '../ApprovalDetailsModal';
import { ApprovalDetailsModal } from '../ApprovalDetailsModal';
import { ApprovalRotation } from '../ApprovalRotation';
import { DistributeDoc } from '../DistributeDoc';
import { ActionsRow, PrimaryBtn, SecondaryBtn, StatusChip } from './ApprovalWorkflow.styles';
import { APPROVAL_WORKFLOW_IDS } from './ApprovalWorkflow.testids';

type FlowStep = 'idle' | 'details' | 'rotation' | 'distribute' | 'acceptance';

export const DOC_STATUS = {
  DRAFT: 'טיוטה',
  IN_PREP: 'בהכנה',
  IN_APPROVAL: 'בסבב אישורים',
  OPERATIONAL: 'מבצעית',
} as const;

export interface ApprovalWorkflowProps {
  docName: string;
  status: string;
  onStatusChange: (status: string) => void;
}

// Owns the whole draft -> approval-round -> distribution flow and every
// modal it opens (per .claude/skills/modal-placement.md) — the page/canvas
// only ever passes it status + a setter, never reaches into its internals.
export const ApprovalWorkflow = ({ docName, status, onStatusChange }: ApprovalWorkflowProps) => {
  const [step, setStep] = useState<FlowStep>('idle');
  const [roundConfig, setRoundConfig] = useState<ApprovalRoundConfig | null>(null);
  const { data } = useHmlGroups();
  const hmlGroups = data ?? HML_GROUPS_FALLBACK.hmlGroups;

  const isInApproval = status === DOC_STATUS.IN_APPROVAL;
  const isOperational = status === DOC_STATUS.OPERATIONAL;

  const handlePrimaryAction = () => {
    if (isOperational) setStep('distribute');
    else if (isInApproval && roundConfig) setStep('rotation');
    else setStep('details');
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

  const primaryLabel = isOperational
    ? 'שיתוף המסמך'
    : isInApproval
      ? 'המשך סבב אישורים'
      : 'התחלת סבב אישורים';

  return (
    <>
      <ActionsRow data-testid={APPROVAL_WORKFLOW_IDS.root}>
        <StatusChip data-testid={APPROVAL_WORKFLOW_IDS.statusChip}>{status}</StatusChip>
        <PrimaryBtn
          type="button"
          onClick={handlePrimaryAction}
          data-testid={APPROVAL_WORKFLOW_IDS.primaryBtn}
        >
          {primaryLabel}
        </PrimaryBtn>
        <SecondaryBtn
          type="button"
          onClick={handleOpenAcceptance}
          data-testid={APPROVAL_WORKFLOW_IDS.acceptanceBtn}
        >
          אישור קבלה (חמ״ל)
        </SecondaryBtn>
      </ActionsRow>

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
    </>
  );
};
