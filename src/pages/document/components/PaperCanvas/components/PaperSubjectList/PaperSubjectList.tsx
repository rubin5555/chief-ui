import type { FocusEvent, RefObject } from 'react';
import { useLayoutEffect, useRef, useState } from 'react';
import type { useDocumentTree } from '@/hooks/useDocumentTree';
import { outlineNodeSelector } from '../../../../document.constants';
import type { NumberedSubject } from '../../../../document.numbering';
import type { useDocumentOverrides } from '../../../../hooks/useDocumentOverrides';
import type { useDocumentTrash } from '../../../../hooks/useDocumentTrash';
import {
  findSubjectIndexForNode,
  revealNodeInPaper,
  useSectionNavigation,
} from '../../../SectionNavigation';
import { SIGNATURES_TOPIC_TITLE, SignaturesSection } from '../../../SignaturesSection';
import { SubjectBlock } from '../../../SubjectBlock';
import { VirtualList, VirtualSubject } from './PaperSubjectList.styles';
import { PAPER_SUBJECT_LIST_IDS } from './PaperSubjectList.testids';
import { usePaperSubjectVirtualizer } from './usePaperSubjectVirtualizer';
import { usePrintExpansion } from './usePrintExpansion';

export interface PaperSubjectListProps {
  subjects: NumberedSubject[];
  filteredSectionIds: Set<string>;
  searchMatchIds: Set<string>;
  tree: ReturnType<typeof useDocumentTree>;
  overrides: ReturnType<typeof useDocumentOverrides>;
  trash: ReturnType<typeof useDocumentTrash>;
  readOnly: boolean;
  isDistributed: boolean;
  scrollRef: RefObject<HTMLElement | null>;
  zoom: number;
}

export const PaperSubjectList = ({
  subjects,
  filteredSectionIds,
  searchMatchIds,
  tree,
  overrides,
  trash,
  readOnly,
  isDistributed,
  scrollRef,
  zoom,
}: PaperSubjectListProps) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const isPrinting = usePrintExpansion();

  const signaturesIndex = subjects.findIndex(
    ({ subject }) => subject.title === SIGNATURES_TOPIC_TITLE,
  );

  const nav = useSectionNavigation();
  const pendingRevealId = nav?.pendingRevealId ?? null;
  const revealIndex = pendingRevealId
    ? findSubjectIndexForNode(
        subjects.map(({ subject }) => subject),
        pendingRevealId,
      )
    : -1;

  const pinnedIndexes = [signaturesIndex, focusedIndex, revealIndex].filter((index) => index >= 0);

  const { measureElement, listHeight, items } = usePaperSubjectVirtualizer({
    ids: subjects.map(({ subject }) => subject.id),
    scrollRef,
    listRef,
    zoomFactor: zoom / 100,
    pinnedIndexes,
  });

  const isRevealMounted = revealIndex >= 0 && items.some((item) => item.index === revealIndex);
  const clearPendingReveal = nav?.clearPendingReveal;

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-run trigger, see above
  useLayoutEffect(() => {
    if (!pendingRevealId || !clearPendingReveal) return;
    const container = scrollRef.current;
    const target = document.querySelector(outlineNodeSelector(pendingRevealId));
    if (!container || !target) return;
    revealNodeInPaper(target, container);
    clearPendingReveal();
  }, [pendingRevealId, isRevealMounted, clearPendingReveal, scrollRef]);

  const renderSubject = ({ subject, firstSectionNumber }: NumberedSubject) =>
    subject.title === SIGNATURES_TOPIC_TITLE ? (
      <SignaturesSection
        key={subject.id}
        subject={subject}
        highlighted={searchMatchIds.has(subject.id)}
        tree={tree}
        readOnly={readOnly}
      />
    ) : (
      <SubjectBlock
        key={subject.id}
        subject={subject}
        firstSectionNumber={firstSectionNumber}
        filteredSectionIds={filteredSectionIds}
        searchMatchIds={searchMatchIds}
        tree={tree}
        overrides={overrides}
        trash={trash}
        readOnly={readOnly}
        isDistributed={isDistributed}
      />
    );

  if (isPrinting) return <>{subjects.map(renderSubject)}</>;

  const handleFocusCapture = (event: FocusEvent<HTMLDivElement>) => {
    const row = event.target.closest('[data-index]');
    setFocusedIndex(row ? Number(row.getAttribute('data-index')) : -1);
  };

  return (
    <VirtualList
      ref={listRef}
      $height={listHeight}
      onFocusCapture={handleFocusCapture}
      data-testid={PAPER_SUBJECT_LIST_IDS.root}
    >
      {items.map(({ key, index, top }) => (
        <VirtualSubject key={key} data-index={index} ref={measureElement} $top={top}>
          {renderSubject(subjects[index])}
        </VirtualSubject>
      ))}
    </VirtualList>
  );
};
