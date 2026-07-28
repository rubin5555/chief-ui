import { useState } from 'react';
import { PROFILE_FALLBACK, useProfile } from '@/api/profile';
import { ContentEditorProvider } from '@/components/ui/ContentEditor';
import { CollabProvider } from '@/context/CollabContext';
import { useDocumentTree } from '@/hooks/useDocumentTree';
import { DISTRIBUTED_STATUSES, EDITABLE_STATUSES } from '../../document.constants';
import { useDocumentOverrides } from '../../hooks/useDocumentOverrides';
import { useDocumentTrash } from '../../hooks/useDocumentTrash';
import type { DocumentDto } from '../../types';
import { ComparisonBar } from '../ComparisonBar';
import { BarRow } from '../components.shared.styles';
import { DocPermissionsProvider } from '../DocPermissionsModal';
import { DocumentActionsSlot } from '../DocumentActionsSlot';
import { DocumentMetadataPill } from '../DocumentMetadataPill';
import { DocumentSidebar } from '../DocumentSidebar';
import { PaperCanvas } from '../PaperCanvas';
import { SignatureGateProvider } from '../SignaturesSection';
import { SourceSystemsNotice } from '../SourceSystemsNotice';
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

  // Whether the emphasis card is shown lives here because its switch and its
  // rendering are in different columns: the sidebar's `+` menu turns it on, the
  // paper draws it.
  const [showEmphasis, setShowEmphasis] = useState(false);

  // Derived from the status, never stored: `isReadOnly` is what the status
  // *means*, not a second thing that could disagree with it. Both columns get the
  // same answer because it is worked out once, here, above both of them.
  const readOnly = !EDITABLE_STATUSES.has(overrides.status);
  const isDistributed = DISTRIBUTED_STATUSES.has(overrides.status);

  const handleAddEmphasis = () => setShowEmphasis(true);

  // Real-time collab needs a real signed-in user id, which dev has no auth/
  // session concept for yet — reuses the same useProfile()/PROFILE_FALLBACK
  // identity ProfilePage already passes as TemplatesPanel's currentUserId, rather
  // than inventing a separate placeholder. ContentEditorProvider degrades to
  // local-only activation with no lock gating or remote cursors if it's absent.
  const { data: profileData } = useProfile();
  const profile = profileData ?? PROFILE_FALLBACK;

  const canvasBody = (
    <ContentEditorProvider>
      {/* Wraps everything below because the permissions dialog is asked for from
          both ends of the page: the navbar toolbar's key, and a section's 3-dots
          menu four levels inside the paper. */}
      <DocPermissionsProvider isDistributed={isDistributed}>
        {/* Renders nothing here — it portals the document's action toolbar into
            the navbar, and owns the modals that toolbar opens. */}
        <DocumentActionsSlot overrides={overrides} />

        <BarRow>
          <DocumentMetadataPill header={overrides.header} />
        </BarRow>

        {/* main hides the provenance notice once the document is locked
            (Edit.tsx:3711) — where its content came from stops being actionable
            when you can no longer refresh it. */}
        {!readOnly && data.sourceSystems.length > 0 && (
          <BarRow>
            <SourceSystemsNotice systems={data.sourceSystems} />
          </BarRow>
        )}

        <BarRow>
          <ComparisonBar />
        </BarRow>

        {/* This provider wraps both columns because that is the span of what it
            connects: the approval flow that asks whether the document has been
            signed is in the sidebar, and the signatures it asks about are three
            levels inside the paper. */}
        <SignatureGateProvider>
          <BodyRow data-testid={DOCUMENT_CANVAS_IDS.root}>
            <DocumentSidebar
              tree={tree}
              trash={trash}
              overrides={overrides}
              readOnly={readOnly}
              isDistributed={isDistributed}
              onAddEmphasis={handleAddEmphasis}
            />
            <PaperCanvas
              tree={tree}
              overrides={overrides}
              trash={trash}
              readOnly={readOnly}
              isDistributed={isDistributed}
              showEmphasis={showEmphasis}
            />
          </BodyRow>
        </SignatureGateProvider>
      </DocPermissionsProvider>
    </ContentEditorProvider>
  );

  return profile.id ? (
    <CollabProvider userId={profile.id}>{canvasBody}</CollabProvider>
  ) : (
    canvasBody
  );
};
