import { useState } from 'react';
import type { HmlGroupDto } from '@/api/approvals';
import { SIGNATURES_FALLBACK, useSignatures } from '@/api/signatures';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import type { ApprovalRoundConfig } from '../ApprovalDetailsModal';
import type { ApproverSignature } from '../SignaturesSection';
import { useApprovalRotationAnalytics } from './ApprovalRotation.analytics';
import { FooterActions } from './ApprovalRotation.shared.styles';
import { APPROVAL_ROTATION_IDS } from './ApprovalRotation.testids';
import { DistributePrompt } from './components/DistributePrompt';
import { RejectForm } from './components/RejectForm';
import { RotationCarousel } from './components/RotationCarousel';

type RotationView = 'carousel' | 'reject' | 'distribute';

export interface ApprovalRotationProps {
  docName: string;
  config: ApprovalRoundConfig;
  hmlGroups: HmlGroupDto[];
  onClose: () => void;
  onReject: (reason: string) => void;
  /**
   * Fired per approved stage, carrying who approved it. The document stamps them
   * into its signatures section.
   */
  onApprove: (signature: ApproverSignature) => void;
  onDistribute: () => void;
}

// Owns the round's state and which of its three views is showing; each view is its
// own component under components/.
//
// Re-derived from scratch against main's dual-index carousel (a selectedStageIdx
// shared across a rank/user axis and a separate HML axis), which was flagged as
// easy to get subtly wrong. Here approval only ever acts on one index — the
// current stage — with a nested viewedUserIndex for browsing that stage's named
// users, and HML groups are shown read-only rather than being part of the same
// axis at all. That removes the free-navigation footgun instead of modelling it
// more carefully.
export const ApprovalRotation = ({
  docName,
  config,
  hmlGroups,
  onClose,
  onReject,
  onApprove,
  onDistribute,
}: ApprovalRotationProps) => {
  const { data } = useSignatures();
  const signatures = data ?? SIGNATURES_FALLBACK.signatures;
  const signatureOptions =
    signatures.approver.length > 0 ? signatures.approver : signatures.distribution;

  const { stages } = config;
  const configuredHmlGroups = hmlGroups.filter((group) => config.hmlGroupIds.includes(group.id));

  const [view, setView] = useState<RotationView>('carousel');
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [viewedUserIndex, setViewedUserIndex] = useState(0);
  const [approvedStageIndices, setApprovedStageIndices] = useState<Set<number>>(new Set());
  const [notesByKey, setNotesByKey] = useState<Record<string, string>>({});
  const [signature, setSignature] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const { trackStageApproved, trackRoundRejected } = useApprovalRotationAnalytics();

  const activeStage = stages[activeStageIndex];
  // Keyed by stage *and* user: notes belong to the person, not to the stage, and
  // paging between two approvers must not show one the other's remarks.
  const noteKey = `${activeStageIndex}-${viewedUserIndex}`;

  const handleNoteChange = (note: string) =>
    setNotesByKey((prev) => ({ ...prev, [noteKey]: note }));
  const handlePrevUser = () => setViewedUserIndex((prev) => prev - 1);
  const handleNextUser = () => setViewedUserIndex((prev) => prev + 1);
  const handlePickSignature = (name: string) => setSignature(name);
  const handleClearSignature = () => setSignature(null);

  // The section-fix note is written in the section's own chat thread, which is in
  // the document behind this dialog — so the only thing to do here is get out of
  // the way. Closing is honest about that; opening a second dialog on top would
  // not be.
  const handleAddFixNote = () => onClose();

  const handleApprove = () => {
    setApprovedStageIndices((prev) => new Set(prev).add(activeStageIndex));
    trackStageApproved(activeStage.rank, signature !== null);
    // Reported before the local reset, and with `hasSignature` rather than the
    // name itself: the stamp shows the rank and approver, and the picked
    // signature only decides whether a handwritten mark is drawn over it.
    onApprove({
      rank: activeStage.rank,
      name: activeStage.users[viewedUserIndex] ?? activeStage.rank,
      hasSignature: signature !== null,
    });
    setSignature(null);

    const nextIndex = activeStageIndex + 1;
    if (nextIndex < stages.length) {
      setActiveStageIndex(nextIndex);
      setViewedUserIndex(0);
    } else {
      setView('distribute');
    }
  };

  const handleOpenReject = () => setView('reject');
  const handleCancelReject = () => setView('carousel');
  const handleRejectSubmit = () => {
    trackRoundRejected();
    onReject(rejectReason);
  };

  const handleDistributeNow = () => {
    onClose();
    onDistribute();
  };

  return (
    <Modal
      title="סבב אישורים"
      onClose={onClose}
      width={560}
      maxHeight="85vh"
      data-testid={APPROVAL_ROTATION_IDS.root}
      footer={
        // Only the carousel uses the modal's footer; the other two views carry
        // their own buttons, because in both cases the buttons answer a question
        // the view itself is asking.
        view === 'carousel' ? (
          <FooterActions>
            <Button type="button" variant="ghost" onClick={onClose}>
              ביטול
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleOpenReject}
              data-testid={APPROVAL_ROTATION_IDS.rejectBtn}
            >
              דחה
            </Button>
            <Button
              type="button"
              onClick={handleApprove}
              data-testid={APPROVAL_ROTATION_IDS.approveBtn}
            >
              אשר
            </Button>
          </FooterActions>
        ) : undefined
      }
    >
      {view === 'carousel' && (
        <RotationCarousel
          stages={stages}
          hmlGroups={configuredHmlGroups}
          activeStageIndex={activeStageIndex}
          approvedStageIndices={approvedStageIndices}
          viewedUserIndex={viewedUserIndex}
          note={notesByKey[noteKey] ?? ''}
          signature={signature}
          signatureOptions={signatureOptions}
          onNoteChange={handleNoteChange}
          onPrevUser={handlePrevUser}
          onNextUser={handleNextUser}
          onPickSignature={handlePickSignature}
          onClearSignature={handleClearSignature}
          onAddFixNote={handleAddFixNote}
        />
      )}

      {view === 'reject' && (
        <RejectForm
          reason={rejectReason}
          onReasonChange={setRejectReason}
          onSubmit={handleRejectSubmit}
          onCancel={handleCancelReject}
        />
      )}

      {view === 'distribute' && (
        <DistributePrompt
          docName={docName}
          onDistributeNow={handleDistributeNow}
          onDistributeLater={onClose}
        />
      )}
    </Modal>
  );
};
