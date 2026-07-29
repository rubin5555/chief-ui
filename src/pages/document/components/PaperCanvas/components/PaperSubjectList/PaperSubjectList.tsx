import type { FocusEvent, RefObject } from 'react';
import { useRef, useState } from 'react';
import type { useDocumentTree } from '@/hooks/useDocumentTree';
import type { useDocumentOverrides } from '../../../../hooks/useDocumentOverrides';
import type { useDocumentTrash } from '../../../../hooks/useDocumentTrash';
import { SIGNATURES_TOPIC_TITLE, SignaturesSection } from '../../../SignaturesSection';
import { SubjectBlock } from '../../../SubjectBlock';
import type { NumberedSubject } from '../../paperCanvas.utils';
import { VirtualList, VirtualSubject } from './PaperSubjectList.styles';
import { PAPER_SUBJECT_LIST_IDS } from './PaperSubjectList.testids';
import { usePaperSubjectVirtualizer } from './usePaperSubjectVirtualizer';
import { usePrintExpansion } from './usePrintExpansion';

export interface PaperSubjectListProps {
  subjects: NumberedSubject[];
  /** Sections whose status is currently filtered out, by id. */
  filteredSectionIds: Set<string>;
  /** Nodes matching the in-document search, by id. Empty when nothing is searched. */
  searchMatchIds: Set<string>;
  tree: ReturnType<typeof useDocumentTree>;
  overrides: ReturnType<typeof useDocumentOverrides>;
  trash: ReturnType<typeof useDocumentTrash>;
  readOnly: boolean;
  isDistributed: boolean;
  /** The scrolling editor column, which is what the topics are virtualized against. */
  scrollRef: RefObject<HTMLElement | null>;
  zoom: number;
}

/**
 * The document's topics, and only the ones the sheet currently has to hold.
 *
 * A topic is the unit here rather than a section: a topic is a `<section>` with
 * its own search outline and its own sections beneath it, and flattening the
 * three levels into one row list would cost that structure to virtualize rows
 * that are already cheap. What is expensive is a section — a rich-text editor, a
 * comment thread, an action row — and those all leave with the topic holding
 * them.
 *
 * Printing takes the other path entirely: `@media print` is set up to put this
 * document on paper, and a printer handed the on-screen window would get four
 * topics of a twelve-topic document.
 */
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

  // Two topics are not free to leave.
  //
  // `חתימות` registers the signature gate on mount, and that gate is what stops
  // an unsigned document entering an approval round — so it has to be mounted
  // whether or not anyone has scrolled to it. A rule the whole document obeys
  // can't depend on where the reader happens to be looking.
  //
  // The focused one stays because unmounting an editor mid-edit throws away the
  // caret, the selection, and anything typed since the last debounced commit.
  const signaturesIndex = subjects.findIndex(
    ({ subject }) => subject.title === SIGNATURES_TOPIC_TITLE,
  );
  const pinnedIndexes = [signaturesIndex, focusedIndex].filter((index) => index >= 0);

  const { measureElement, listHeight, items } = usePaperSubjectVirtualizer({
    ids: subjects.map(({ subject }) => subject.id),
    scrollRef,
    listRef,
    zoomFactor: zoom / 100,
    pinnedIndexes,
  });

  const renderSubject = ({ subject, firstSectionNumber }: NumberedSubject) =>
    // `חתימות` is drawn by SignaturesSection instead of the generic topic path —
    // main special-cases it the same way (Edit.tsx:4303), and it holds signature
    // blocks rather than sections. The match is on the title because that is all
    // main has to go on; renaming the topic turns it back into an ordinary one,
    // which is main's behaviour too.
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

  // Which topic holds focus, read off the DOM as focus lands rather than tracked
  // by every node that can take it: the answer is one attribute up the ancestor
  // chain, and everything editable in a topic is inside that element.
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
