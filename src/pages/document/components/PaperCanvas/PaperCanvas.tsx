import { getRouteApi } from '@tanstack/react-router';
import { ContentEditorToolbar } from '@/components/ui/ContentEditor';
import type { useDocumentTree } from '@/hooks/useDocumentTree';
import type { useDocumentOverrides } from '../../hooks/useDocumentOverrides';
import type { useDocumentTrash } from '../../hooks/useDocumentTrash';
import { ActiveFilterChips } from '../ActiveFilterChips';
import { SubjectBlock } from '../SubjectBlock';
import { Centered, EditorScroll, Paper, PaperInner, StickyToolbar } from './PaperCanvas.styles';
import { PAPER_CANVAS_IDS } from './PaperCanvas.testids';
import { collectFilteredNodeIds, numberSubjects } from './paperCanvas.utils';

const routeApi = getRouteApi('/document/$id');

export interface PaperCanvasProps {
  tree: ReturnType<typeof useDocumentTree>;
  overrides: ReturnType<typeof useDocumentOverrides>;
  trash: ReturnType<typeof useDocumentTrash>;
}

// The scrolling editor column: a sticky toolbar, then the A4 sheet itself.
//
// `zoom` comes from the route rather than local state so a zoomed view is
// bookmarkable and survives a reload, per
// .claude/skills/router-state-splitting.md. The control that sets it lives in the
// navbar's document-actions toolbar, in a different subtree entirely — the URL is
// what connects the two without a context or a lifted callback.
export const PaperCanvas = ({ tree, overrides, trash }: PaperCanvasProps) => {
  const { zoom, statuses } = routeApi.useSearch();

  const getStatus = (id: string) => overrides.getMeta(id).status;
  const filteredNodeIds = collectFilteredNodeIds(tree.subjects, getStatus, statuses);
  const numbered = numberSubjects(tree.subjects);

  return (
    <EditorScroll data-testid={PAPER_CANVAS_IDS.root}>
      <Centered>
        <StickyToolbar>
          <ActiveFilterChips />
          <ContentEditorToolbar />
        </StickyToolbar>

        <Paper $zoom={zoom} data-testid={PAPER_CANVAS_IDS.paper}>
          <PaperInner>
            {numbered.map(({ subject, firstSectionNumber }) => (
              <SubjectBlock
                key={subject.id}
                subject={subject}
                firstSectionNumber={firstSectionNumber}
                filteredSectionIds={filteredNodeIds}
                tree={tree}
                overrides={overrides}
                trash={trash}
              />
            ))}
          </PaperInner>
        </Paper>
      </Centered>
    </EditorScroll>
  );
};
