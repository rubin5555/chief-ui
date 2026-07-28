import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ChangeEvent, FormEvent } from 'react';
import { Fragment, useState } from 'react';
import type { HmlGroupDto } from '@/api/approvals';
import { SIGNATURES_FALLBACK, useSignatures } from '@/api/signatures';
import { Button } from '@/components/ui/Button';
import { FloatingPanel } from '@/components/ui/FloatingPanel';
import { Modal } from '@/components/ui/Modal';
import { useFloatingPanel } from '@/hooks/useFloatingPanel';
import type { ApprovalRoundConfig } from '../ApprovalDetailsModal';
import type { ApproverSignature } from '../SignaturesSection';
import {
  Card,
  CarouselHeader,
  CarouselNavBtn,
  CarouselTitle,
  DistributePromptBody,
  DistributePromptBox,
  DistributePromptTitle,
  FooterActions,
  HmlChip,
  HmlList,
  Notes,
  RejectBox,
  SignatureActionBtn,
  SignatureActions,
  SignatureBox,
  SignatureLabel,
  SignatureSection,
  StageLabel,
  TimelineConnector,
  TimelineDot,
  TimelineItem,
  TimelineLabel,
  TimelineRow,
  UserLabel,
} from './ApprovalRotation.styles';
import { APPROVAL_ROTATION_IDS } from './ApprovalRotation.testids';

type RotationView = 'carousel' | 'reject' | 'distribute';

export interface ApprovalRotationProps {
  docName: string;
  config: ApprovalRoundConfig;
  hmlGroups: HmlGroupDto[];
  onClose: () => void;
  onReject: (reason: string) => void;
  /**
   * Fired per approved stage, carrying who approved it. The document stamps them
   * into its signatures section — until now the picked signature was set and then
   * thrown away on the next line.
   */
  onApprove: (signature: ApproverSignature) => void;
  onDistribute: () => void;
}

const SIGNATURE_PANEL_WIDTH = 160;
const REJECT_FORM_ID = 'approval-rotation-reject-form';

// Re-derived from scratch against main's dual-index (selectedStageIdx shared
// across a rank/user axis and a separate HML axis) carousel — that shape was
// flagged as easy to get subtly wrong. Here, approval only ever acts on one
// index (activeStageIndex, the current approver stage) with a nested
// viewedUserIndex for browsing that stage's named users; HML groups are
// shown read-only, not part of the same axis at all. That removes the
// free-navigation/dual-index footgun rather than just modeling it more
// carefully.
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
  const sigPanel = useFloatingPanel<HTMLButtonElement>();

  const activeStage = stages[activeStageIndex];
  const noteKey = `${activeStageIndex}-${viewedUserIndex}`;
  const canGoPrevUser = viewedUserIndex > 0;
  const canGoNextUser = viewedUserIndex < activeStage.users.length - 1;

  const handleNotesChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setNotesByKey((prev) => ({ ...prev, [noteKey]: e.target.value }));

  const handlePrevUser = () => setViewedUserIndex((prev) => prev - 1);
  const handleNextUser = () => setViewedUserIndex((prev) => prev + 1);

  const handleOpenSignaturePanel = () => sigPanel.toggle(SIGNATURE_PANEL_WIDTH);
  const handlePickSignature = (name: string) => () => {
    setSignature(name);
    sigPanel.close();
  };
  const handleClearSignature = () => setSignature(null);

  const handleApprove = () => {
    setApprovedStageIndices((prev) => new Set(prev).add(activeStageIndex));
    // Reported before the local reset, and with `hasSignature` rather than the
    // name itself: the stamp shows the *rank and approver*, and the picked
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
  const handleRejectSubmit = (e: FormEvent) => {
    e.preventDefault();
    onReject(rejectReason);
  };
  const handleRejectReasonChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setRejectReason(e.target.value);

  const handleSkipDistribute = onClose;
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
        <>
          <TimelineRow>
            {stages.map((stage, index) => {
              const state = approvedStageIndices.has(index)
                ? 'approved'
                : index === activeStageIndex
                  ? 'active'
                  : 'idle';
              return (
                <Fragment key={stage.rank}>
                  <TimelineItem>
                    <TimelineDot
                      $state={state}
                      data-testid={APPROVAL_ROTATION_IDS.stageDot(index)}
                    />
                    <TimelineLabel $state={state}>{stage.rank}</TimelineLabel>
                  </TimelineItem>
                  {index < stages.length - 1 && <TimelineConnector />}
                </Fragment>
              );
            })}
          </TimelineRow>

          {configuredHmlGroups.length > 0 && (
            <HmlList>
              {configuredHmlGroups.map((group) => (
                <HmlChip key={group.id}>{group.name}</HmlChip>
              ))}
            </HmlList>
          )}

          <Card>
            <CarouselHeader>
              <CarouselNavBtn
                type="button"
                onClick={handleNextUser}
                disabled={!canGoNextUser}
                data-testid={APPROVAL_ROTATION_IDS.nextUserBtn}
              >
                <ChevronLeft size={16} />
              </CarouselNavBtn>
              <CarouselTitle>
                <StageLabel>{activeStage.rank}</StageLabel>
                <UserLabel>{activeStage.users[viewedUserIndex] ?? 'ללא שם'}</UserLabel>
              </CarouselTitle>
              <CarouselNavBtn
                type="button"
                onClick={handlePrevUser}
                disabled={!canGoPrevUser}
                data-testid={APPROVAL_ROTATION_IDS.prevUserBtn}
              >
                <ChevronRight size={16} />
              </CarouselNavBtn>
            </CarouselHeader>

            <Notes
              value={notesByKey[noteKey] ?? ''}
              onChange={handleNotesChange}
              placeholder={`הערות ${activeStage.users[viewedUserIndex] ?? ''}...`}
              dir="rtl"
              data-testid={APPROVAL_ROTATION_IDS.notes}
            />

            <SignatureSection>
              <SignatureLabel>חתימת המאשר</SignatureLabel>
              <SignatureBox>{signature ?? 'אין חתימה'}</SignatureBox>
              <SignatureActions>
                <SignatureActionBtn
                  ref={sigPanel.btnRef}
                  type="button"
                  onClick={handleOpenSignaturePanel}
                  data-testid={APPROVAL_ROTATION_IDS.signatureTrigger}
                >
                  בחירת חתימה
                </SignatureActionBtn>
                <SignatureActionBtn
                  type="button"
                  onClick={handleClearSignature}
                  data-testid={APPROVAL_ROTATION_IDS.clearSignatureBtn}
                >
                  נקה חתימה
                </SignatureActionBtn>
                {sigPanel.open && sigPanel.pos && (
                  <FloatingPanel
                    ref={sigPanel.panelRef}
                    $pos={sigPanel.pos}
                    $width={SIGNATURE_PANEL_WIDTH}
                  >
                    {signatureOptions.map((option) => (
                      <SignatureActionBtn
                        key={option.id}
                        type="button"
                        onClick={handlePickSignature(option.name)}
                        data-testid={APPROVAL_ROTATION_IDS.signatureOption(option.name)}
                      >
                        {option.name}
                      </SignatureActionBtn>
                    ))}
                  </FloatingPanel>
                )}
              </SignatureActions>
            </SignatureSection>
          </Card>
        </>
      )}

      {view === 'reject' && (
        <RejectBox id={REJECT_FORM_ID} onSubmit={handleRejectSubmit}>
          <Notes
            value={rejectReason}
            onChange={handleRejectReasonChange}
            placeholder="פרט את סיבת הדחייה..."
            dir="rtl"
            autoFocus
            data-testid={APPROVAL_ROTATION_IDS.rejectReason}
          />
          <FooterActions>
            <Button type="button" variant="ghost" onClick={handleCancelReject}>
              ביטול
            </Button>
            <Button
              type="submit"
              form={REJECT_FORM_ID}
              data-testid={APPROVAL_ROTATION_IDS.confirmRejectBtn}
            >
              דחייה
            </Button>
          </FooterActions>
        </RejectBox>
      )}

      {view === 'distribute' && (
        <DistributePromptBox>
          <DistributePromptTitle>הפצת המסמך</DistributePromptTitle>
          <DistributePromptBody>
            כל השלבים אושרו — האם ברצונך להפיץ את המסמך &quot;{docName}&quot;?
          </DistributePromptBody>
          <FooterActions>
            <Button
              type="button"
              variant="outline"
              onClick={handleSkipDistribute}
              data-testid={APPROVAL_ROTATION_IDS.distributeLaterBtn}
            >
              לא כרגע
            </Button>
            <Button
              type="button"
              onClick={handleDistributeNow}
              data-testid={APPROVAL_ROTATION_IDS.distributeNowBtn}
            >
              הפצת המסמך
            </Button>
          </FooterActions>
        </DistributePromptBox>
      )}
    </Modal>
  );
};
