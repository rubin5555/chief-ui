import { PROFILE_FALLBACK, useProfile } from '@/api/profile';
import { ContentEditorProvider } from '@/components/ui/ContentEditor';
import { CollabProvider } from '@/context/CollabContext';
import { useDocumentTree } from '@/hooks/useDocumentTree';
import { useDocumentOverrides } from '../../hooks/useDocumentOverrides';
import { useDocumentTrash } from '../../hooks/useDocumentTrash';
import type { DocumentDto } from '../../types';
import { ComparisonBar } from '../ComparisonBar';
import { BarRow } from '../components.shared.styles';
import { DocumentActionsSlot } from '../DocumentActionsSlot';
import { DocumentMetadataPill } from '../DocumentMetadataPill';
import { DocumentSidebar } from '../DocumentSidebar';
import { PaperCanvas } from '../PaperCanvas';
import { BodyRow } from './DocumentCanvas.styles';
import { DOCUMENT_CANVAS_IDS } from './DocumentCanvas.testids';

export interface DocumentCanvasProps {
  data: DocumentDto;
}

// Composition shell for main's page skeleton (Edit.tsx:3664-4151): full-width
// chrome bars stacked above a body row of sidebar + paper.
//
// It owns only the state both columns need — the tree, the per-node overrides and
// the trash — and hands each out as a whole hook object. Everything that belongs
// to one column (which modal is open, what's expanded, the zoom level) lives
// there instead.
//
// Only mounts once `data` is loaded (DocumentPage gates on that), so
// useDocumentTree's initial-state seed is never stuck on an empty array from a
// render that ran before the document arrived.
export const DocumentCanvas = ({ data }: DocumentCanvasProps) => {
  const tree = useDocumentTree(data.subjects);
  const overrides = useDocumentOverrides(data);
  const trash = useDocumentTrash(tree);

  // Real-time collab needs a real signed-in user id, which dev has no auth/
  // session concept for yet — reuses the same useProfile()/PROFILE_FALLBACK
  // identity ProfilePage already passes as TemplatesPanel's currentUserId, rather
  // than inventing a separate placeholder. ContentEditorProvider degrades to
  // local-only activation with no lock gating or remote cursors if it's absent.
  const { data: profileData } = useProfile();
  const profile = profileData ?? PROFILE_FALLBACK;

  const canvasBody = (
    <ContentEditorProvider>
      {/* Renders nothing here — it portals the document's action toolbar into the
          navbar, and owns the modals that toolbar opens. */}
      <DocumentActionsSlot overrides={overrides} />

      <BarRow>
        <DocumentMetadataPill header={overrides.header} />
      </BarRow>

      <BarRow>
        <ComparisonBar />
      </BarRow>

      <BodyRow data-testid={DOCUMENT_CANVAS_IDS.root}>
        <DocumentSidebar tree={tree} trash={trash} overrides={overrides} />
        <PaperCanvas tree={tree} overrides={overrides} trash={trash} />
      </BodyRow>
    </ContentEditorProvider>
  );

  return profile.id ? (
    <CollabProvider userId={profile.id}>{canvasBody}</CollabProvider>
  ) : (
    canvasBody
  );
};
