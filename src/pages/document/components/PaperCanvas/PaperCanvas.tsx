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

  useActiveSectionSpy(scrollRef, zoom);

  const getStatus = (id: string) => overrides.getMeta(id).status;
  const filteredNodeIds = collectFilteredNodeIds(tree.subjects, getStatus, statuses);

  const searchMatchIds = collectSearchMatchIds(tree.subjects, q);
  const numbered = numberSubjects(tree.subjects);

  return (
    <SectionChatProvider>
      <EditorScroll ref={scrollRef} $zoom={zoom} data-testid={PAPER_CANVAS_IDS.root}>
        <Centered>
          <StickyToolbar $zoom={zoom}>
            <ActiveFilterChips />

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
