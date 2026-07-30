import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { Fragment } from 'react';
import type { HmlGroupDto } from '@/api/approvals';
import type { SignatureDto } from '@/api/signatures';
import type { ApprovalRoundStageConfig } from '../../../ApprovalDetailsModal';
import { Notes } from '../../ApprovalRotation.shared.styles';
import { APPROVAL_ROTATION_IDS } from '../../ApprovalRotation.testids';
import { ApproverSignaturePicker } from './components/ApproverSignaturePicker';
import {
  Card,
  CarouselHeader,
  CarouselNavBtn,
  CarouselTitle,
  FixNoteLink,
  HmlChip,
  HmlList,
  PageDot,
  PageDots,
  StageLabel,
  TimelineConnector,
  TimelineDot,
  TimelineItem,
  TimelineLabel,
  TimelineRow,
  UserLabel,
} from './RotationCarousel.styles';

export interface RotationCarouselProps {
  stages: ApprovalRoundStageConfig[];
  hmlGroups: HmlGroupDto[];
  activeStageIndex: number;
  approvedStageIndices: Set<number>;
  viewedUserIndex: number;
  note: string;
  signature: string | null;
  signatureOptions: SignatureDto[];
  onNoteChange: (note: string) => void;
  onPrevUser: () => void;
  onNextUser: () => void;
  onPickSignature: (name: string) => void;
  onClearSignature: () => void;
  onAddFixNote: () => void;
}

// The approval round as an approver sees it: where the document is in the round,
// who is looking at it now, their notes, and their signature (main, Edit.tsx:2700).
//
// Navigation only ever moves along one axis — the named users inside the current
// stage. Stages advance by being approved, not by being browsed, which is what
// keeps this out of main's dual-index carousel.
export const RotationCarousel = ({
  stages,
  hmlGroups,
  activeStageIndex,
  approvedStageIndices,
  viewedUserIndex,
  note,
  signature,
  signatureOptions,
  onNoteChange,
  onPrevUser,
  onNextUser,
  onPickSignature,
  onClearSignature,
  onAddFixNote,
}: RotationCarouselProps) => {
  const activeStage = stages[activeStageIndex];
  const viewedUser = activeStage.users[viewedUserIndex];

  const handleNoteChange = (event: ChangeEvent<HTMLTextAreaElement>) =>
    onNoteChange(event.target.value);

  return (
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
                <TimelineDot $state={state} data-testid={APPROVAL_ROTATION_IDS.stageDot(index)} />
                <TimelineLabel $state={state}>{stage.rank}</TimelineLabel>
              </TimelineItem>
              {index < stages.length - 1 && <TimelineConnector />}
            </Fragment>
          );
        })}
      </TimelineRow>

      {hmlGroups.length > 0 && (
        <HmlList>
          {hmlGroups.map((group) => (
            <HmlChip key={group.id}>{group.name}</HmlChip>
          ))}
        </HmlList>
      )}

      <Card>
        <CarouselHeader>
          <CarouselNavBtn
            type="button"
            onClick={onNextUser}
            disabled={viewedUserIndex >= activeStage.users.length - 1}
            aria-label="המאשר הבא"
            data-testid={APPROVAL_ROTATION_IDS.nextUserBtn}
          >
            {/* The header is RTL, so this button sits on the right and its arrow
                has to point that way — main's `rotate-180` chevron
                (Edit.tsx:2741), and its mirror image below. */}
            <ChevronRight size={16} aria-hidden="true" />
          </CarouselNavBtn>
          <CarouselTitle>
            <StageLabel>{activeStage.rank}</StageLabel>
            <UserLabel>{viewedUser ?? 'ללא שם'}</UserLabel>
          </CarouselTitle>
          <CarouselNavBtn
            type="button"
            onClick={onPrevUser}
            disabled={viewedUserIndex === 0}
            aria-label="המאשר הקודם"
            data-testid={APPROVAL_ROTATION_IDS.prevUserBtn}
          >
            <ChevronLeft size={16} aria-hidden="true" />
          </CarouselNavBtn>
        </CarouselHeader>

        {/* Only worth drawing when there is more than one to page through. */}
        {activeStage.users.length > 1 && (
          <PageDots data-testid={APPROVAL_ROTATION_IDS.pageDots}>
            {activeStage.users.map((user, index) => (
              <PageDot key={user} $active={index === viewedUserIndex} />
            ))}
          </PageDots>
        )}

        <Notes
          value={note}
          onChange={handleNoteChange}
          placeholder={`הערות ${viewedUser ?? ''}...`}
          dir="rtl"
          aria-label="הערות המאשר"
          data-testid={APPROVAL_ROTATION_IDS.notes}
        />

        <FixNoteLink
          type="button"
          data-testid={APPROVAL_ROTATION_IDS.fixNoteLink}
          onClick={onAddFixNote}
        >
          הוספת הערה לתיקון סעיף
        </FixNoteLink>

        <ApproverSignaturePicker
          signature={signature}
          options={signatureOptions}
          onPick={onPickSignature}
          onClear={onClearSignature}
        />
      </Card>
    </>
  );
};
