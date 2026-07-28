import { getRouteApi } from '@tanstack/react-router';
import { ContentEditorToolbar } from '@/components/ui/ContentEditor';
import type { useDocumentTree } from '@/hooks/useDocumentTree';
import type { useDocumentOverrides } from '../../hooks/useDocumentOverrides';
import type { useDocumentTrash } from '../../hooks/useDocumentTrash';
import { ActiveFilterChips } from '../ActiveFilterChips';
import { EmphasisBlock } from '../EmphasisBlock';
import { SIGNATURES_TOPIC_TITLE, SignaturesSection } from '../SignaturesSection';
import { SubjectBlock } from '../SubjectBlock';
import { DocLetterhead } from './components/DocLetterhead';
import { Centered, EditorScroll, Paper, PaperInner, StickyToolbar } from './PaperCanvas.styles';
import { PAPER_CANVAS_IDS } from './PaperCanvas.testids';
import { collectFilteredNodeIds, collectSearchMatchIds, numberSubjects } from './paperCanvas.utils';

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

  const getStatus = (id: string) => overrides.getMeta(id).status;
  const filteredNodeIds = collectFilteredNodeIds(tree.subjects, getStatus, statuses);
  // Not debounced again here: DocSearchField already waits out the typing before
  // it writes `?q=`, so this walks the tree at most once per settled query. A
  // second debounce would only add a second delay to the same keystroke.
  const searchMatchIds = collectSearchMatchIds(tree.subjects, q);
  const numbered = numberSubjects(tree.subjects);

  return (
    <EditorScroll data-testid={PAPER_CANVAS_IDS.root}>
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

            {/* `חתימות` is drawn by SignaturesSection instead of the generic
                topic path — main special-cases it the same way (Edit.tsx:4303),
                and it holds signature blocks rather than sections. The match is
                on the title because that is all main has to go on; renaming the
                topic turns it back into an ordinary one, which is main's
                behaviour too. */}
            {numbered.map(({ subject, firstSectionNumber }) =>
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
                  filteredSectionIds={filteredNodeIds}
                  searchMatchIds={searchMatchIds}
                  tree={tree}
                  overrides={overrides}
                  trash={trash}
                  readOnly={readOnly}
                  isDistributed={isDistributed}
                />
              ),
            )}
          </PaperInner>
        </Paper>
      </Centered>
    </EditorScroll>
  );
};
