import { lazy, Suspense } from 'react';
import type { HmlGroupDto } from '@/api/approvals';
import { chunkGuard } from '../../../../../../utils/chunkRecovery';
import type { DocumentHeader } from '../../../../types';
import type { ApprovalRoundConfig } from '../../../ApprovalDetailsModal';
import type { ApproverSignature } from '../../../SignaturesSection';
import type { ApprovalFlowStep } from '../../approvalWorkflow.types';

const AcceptenceVerification = lazy(
  chunkGuard(() =>
    import('../../../AcceptenceVerification').then((m) => ({ default: m.AcceptenceVerification })),
  ),
);
const ApprovalDetailsModal = lazy(
  chunkGuard(() =>
    import('../../../ApprovalDetailsModal').then((m) => ({ default: m.ApprovalDetailsModal })),
  ),
);
const ApprovalRotation = lazy(
  chunkGuard(() =>
    import('../../../ApprovalRotation').then((m) => ({ default: m.ApprovalRotation })),
  ),
);
const DistributeDoc = lazy(
  chunkGuard(() => import('../../../DistributeDoc').then((m) => ({ default: m.DistributeDoc }))),
);
const EditDocDetailsModal = lazy(
  chunkGuard(() =>
    import('../../../EditDocDetailsModal').then((m) => ({ default: m.EditDocDetailsModal })),
  ),
);
const ApprovalDirtyWarningModal = lazy(
  chunkGuard(() =>
    import('../../../EditDocDetailsModal/components/ApprovalDirtyWarningModal').then((m) => ({
      default: m.ApprovalDirtyWarningModal,
    })),
  ),
);
const DistributeConfirmModal = lazy(
  chunkGuard(() =>
    import('../DistributeConfirmModal').then((m) => ({ default: m.DistributeConfirmModal })),
  ),
);
const DistributeProgressToast = lazy(
  chunkGuard(() =>
    import('../DistributeProgressToast').then((m) => ({ default: m.DistributeProgressToast })),
  ),
);

export interface ApprovalFlowModalsProps {
  step: ApprovalFlowStep;
  header: DocumentHeader;
  status: string;
  hmlGroups: HmlGroupDto[];
  roundConfig: ApprovalRoundConfig | null;
  isDistributing: boolean;
  onClose: () => void;
  onSaveHeader: (header: DocumentHeader) => void;
  onReviewContinue: (isDirty: boolean) => void;
  onDirtyWarningBack: () => void;
  onDirtyWarningContinue: () => void;
  onDetailsSubmit: (config: ApprovalRoundConfig) => void;
  onReject: (reason: string) => void;
  onApprove: (signature: ApproverSignature) => void;
  onDistributeFromRotation: () => void;
  onConfirmDistribute: () => void;
  onSent: () => void;
  onCloseToast: () => void;
}

export const ApprovalFlowModals = ({
  step,
  header,
  status,
  hmlGroups,
  roundConfig,
  isDistributing,
  onClose,
  onSaveHeader,
  onReviewContinue,
  onDirtyWarningBack,
  onDirtyWarningContinue,
  onDetailsSubmit,
  onReject,
  onApprove,
  onDistributeFromRotation,
  onConfirmDistribute,
  onSent,
  onCloseToast,
}: ApprovalFlowModalsProps) => (
  <Suspense fallback={null}>
    {step === 'review' && (
      <EditDocDetailsModal
        mode="approval"
        header={header}
        docStatus={status}
        onClose={onClose}
        onSave={onSaveHeader}
        onContinue={onReviewContinue}
      />
    )}

    {step === 'dirtyWarning' && (
      <ApprovalDirtyWarningModal onBack={onDirtyWarningBack} onContinue={onDirtyWarningContinue} />
    )}

    {step === 'details' && <ApprovalDetailsModal onClose={onClose} onSubmit={onDetailsSubmit} />}

    {step === 'rotation' && roundConfig && (
      <ApprovalRotation
        docName={header.name}
        config={roundConfig}
        hmlGroups={hmlGroups}
        onClose={onClose}
        onReject={onReject}
        onApprove={onApprove}
        onDistribute={onDistributeFromRotation}
      />
    )}

    {step === 'distributeConfirm' && (
      <DistributeConfirmModal
        docName={header.name}
        onConfirm={onConfirmDistribute}
        onClose={onClose}
      />
    )}

    {step === 'distribute' && (
      <DistributeDoc docName={header.name} onClose={onClose} onSend={onSent} />
    )}

    {step === 'acceptance' && <AcceptenceVerification onClose={onClose} onSend={onClose} />}

    {isDistributing && <DistributeProgressToast onClose={onCloseToast} />}
  </Suspense>
);
