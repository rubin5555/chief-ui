import { getRouteApi } from '@tanstack/react-router';
import { useRef } from 'react';
import { ContentEditorToolbar } from '@/components/ui/ContentEditor';
import type { useDocumentTree } from '@/hooks/useDocumentTree';
import { numberSubjects } from '../../document.numbering';
import type { useDocumentOverrides } from '../../hooks/useDocumentOverrides';
import type { useDocumentTrash } from '../../hooks/useDocumentTrash';
import { ActiveFilterChips } from '../ActiveFilterChips';
import { EmphasisBlock } from '../EmphasisBlock';
import { SectionChatProvider } from '../SectionChat';
import { useActiveSectionSpy } from '../SectionNavigation';
import { DocLetterhead } from './components/DocLetterhead';
import { PaperSubjectList } from './components/PaperSubjectList';
import { Centered, EditorScroll, Paper, PaperInner, StickyToolbar } from './PaperCanvas.styles';
import { PAPER_CANVAS_IDS } from './PaperCanvas.testids';
import { collectFilteredNodeIds, collectSearchMatchIds } from './paperCanvas.utils';

const routeApi = getRouteApi('/document/$id');

export interface PaperCanvasProps {
  tree: ReturnType<typeof useDocumentTree>;
  overrides: ReturnType<typeof useDocumentOverrides>;
  trash: ReturnType<typeof useDocumentTrash>;
  readOnly: boolean;
  isDistributed: boolean;
  showEmphasis: boolean;
}

// The scrolling editor column: a sticky toolbar, then the A4 sheet itself.
//
// `zoom` and `q` come from the route rather than local state so a zoomed or
// searched view is bookmarkable and survives a reload, per
// .claude/skills/router-state-splitting.md. The controls that set them live in the
// navbar's document-actions toolbar, in a different subtree entirely — the URL is
// what connects the two without a context or a lifted callback.
export const PaperCanvas = ({
  tree,
  overrides,
  trash,
  readOnly,
  isDistributed,
  showEmphasis,
}: PaperCanvasProps) => {
  const { zoom, statuses, q } = routeApi.useSearch();
  const scrollRef = useRef<HTMLElement>(null);

  // Reports which section the reader is on, for the outline to mark. It lives
  // here because this is the component that owns the scrolling element — the
  // thing the answer is read from.
  useActiveSectionSpy(scrollRef);

  const getStatus = (id: string) => overrides.getMeta(id).status;
  const filteredNodeIds = collectFilteredNodeIds(tree.subjects, getStatus, statuses);
  // Not debounced again here: DocSearchField already waits out the typing before
  // it writes `?q=`, so this walks the tree at most once per settled query. A
  // second debounce would only add a second delay to the same keystroke.
  const searchMatchIds = collectSearchMatchIds(tree.subjects, q);
  const numbered = numberSubjects(tree.subjects);

  return (
    // Every comment thread on the page hangs off a section in this sheet, and
    // they share one spot in the left margin — so opening one has to close the
    // rest. This is the only ancestor all of them have.
    <SectionChatProvider>
      <EditorScroll ref={scrollRef} data-testid={PAPER_CANVAS_IDS.root}>
        <Centered>
          <StickyToolbar>
            <ActiveFilterChips />
            {/* A locked document has nothing to format, so main drops the ribbon
              rather than disabling it (Edit.tsx:4130). */}
            {!readOnly && <ContentEditorToolbar />}
          </StickyToolbar>

          <Paper $zoom={zoom} data-testid={PAPER_CANVAS_IDS.paper}>
            <PaperInner>
              <DocLetterhead readOnly={readOnly} />

              {showEmphasis && <EmphasisBlock readOnly={readOnly} />}

              <PaperSubjectList
                subjects={numbered}
                filteredSectionIds={filteredNodeIds}
                searchMatchIds={searchMatchIds}
                tree={tree}
                overrides={overrides}
                trash={trash}
                readOnly={readOnly}
                isDistributed={isDistributed}
                scrollRef={scrollRef}
                zoom={zoom}
              />
            </PaperInner>
          </Paper>
        </Centered>
      </EditorScroll>
    </SectionChatProvider>
  );
};
