import type { FocusEvent, RefObject } from 'react';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { useDocumentTree } from '@/hooks/useDocumentTree';
import { outlineNodeSelector } from '../../../../document.constants';
import type { NumberedSubject } from '../../../../document.numbering';
import type { useDocumentOverrides } from '../../../../hooks/useDocumentOverrides';
import type { useDocumentTrash } from '../../../../hooks/useDocumentTrash';
import { SectionBlock } from '../../../SectionBlock';
import { revealNodeInPaper, useSectionNavigation } from '../../../SectionNavigation';
import { SignaturesSection } from '../../../SignaturesSection';
import { SubjectBlock } from '../../../SubjectBlock';
import { SubSectionBlock } from '../../../SubSectionBlock';
import {
  estimateNodeSize,
  type FlattenedPaperNode,
  flattenDocumentNodes,
} from './flattenDocumentNodes';
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: overrides.mergedSectionMeta tracks meta changes
  const nodes = useMemo(
    () => flattenDocumentNodes(subjects, filteredSectionIds, (id) => overrides.getMeta(id).hidden),
    [subjects, filteredSectionIds, overrides.mergedSectionMeta],
  );

  const signaturesIndex = nodes.findIndex((n) => n.type === 'signatures');

  const nav = useSectionNavigation();
  const pendingRevealId = nav?.pendingRevealId ?? null;
  const revealedNodeId = nav?.revealedNodeId ?? null;
  const targetRevealId = pendingRevealId ?? revealedNodeId;
  const revealIndex = targetRevealId ? nodes.findIndex((n) => n.id === targetRevealId) : -1;

  const pinnedIndexes = [signaturesIndex, focusedIndex, revealIndex].filter((index) => index >= 0);

  const { measureElement, listHeight, items } = usePaperSubjectVirtualizer({
    ids: nodes.map((n) => n.id),
    scrollRef,
    listRef,
    zoomFactor: zoom / 100,
    pinnedIndexes,
    estimateSize: (index) => estimateNodeSize(nodes[index]),
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

  const renderNode = (node: FlattenedPaperNode) => {
    switch (node.type) {
      case 'signatures':
        return (
          <SignaturesSection
            key={node.id}
            subject={node.subject}
            highlighted={searchMatchIds.has(node.id)}
            tree={tree}
            readOnly={readOnly}
          />
        );
      case 'subject':
        return (
          <SubjectBlock
            key={node.id}
            subject={node.subject}
            searchMatchIds={searchMatchIds}
            tree={tree}
            isFirst={node.isFirst}
          />
        );
      case 'section':
        return (
          <SectionBlock
            key={node.id}
            subjectId={node.subjectId}
            section={node.section}
            number={node.number}
            hasSubSections={node.hasSubSections}
            searchMatchIds={searchMatchIds}
            tree={tree}
            overrides={overrides}
            trash={trash}
            readOnly={readOnly}
            isDistributed={isDistributed}
          />
        );
      case 'subSection':
        return (
          <SubSectionBlock
            key={node.id}
            subjectId={node.subjectId}
            sectionId={node.sectionId}
            subSection={node.subSection}
            index={node.index}
            isLast={node.isLast}
            tree={tree}
            overrides={overrides}
            readOnly={readOnly}
          />
        );
    }
  };

  if (isPrinting) return <>{nodes.map(renderNode)}</>;

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
      {items.map(({ key, index, top }) => {
        const node = nodes[index];
        if (!node) return null;
        return (
          <VirtualSubject key={key} data-index={index} ref={measureElement} $top={top}>
            {renderNode(node)}
          </VirtualSubject>
        );
      })}
    </VirtualList>
  );
};
