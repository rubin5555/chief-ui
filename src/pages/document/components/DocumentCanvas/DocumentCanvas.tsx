import { useState } from 'react';
import { PROFILE_FALLBACK, useProfile } from '@/api/profile';
import { ContentEditorProvider } from '@/components/ui/ContentEditor';
import { CollabProvider } from '@/context/CollabContext';
import { useDocumentTree } from '@/hooks/useDocumentTree';
import { DocPermissionsProvider } from '@/modals/DocPermissionsModal';
import { DISTRIBUTED_STATUSES, EDITABLE_STATUSES } from '../../document.constants';
import { useDocumentOverrides } from '../../hooks/useDocumentOverrides';
import { useDocumentTrash } from '../../hooks/useDocumentTrash';
import type { DocumentDto } from '../../types';
import { ComparisonBar } from '../ComparisonBar';
import { BarRow, BodyRow } from '../components.shared.styles';
import { DocumentActionsSlot } from '../DocumentActionsSlot';
import { DocumentMetadataPill } from '../DocumentMetadataPill';
import { DocumentSidebar } from '../DocumentSidebar';
import { PaperCanvas } from '../PaperCanvas';
import { SectionNavigationProvider } from '../SectionNavigation';
import { SignatureGateProvider } from '../SignaturesSection';
import { SourceSystemsNotice } from '../SourceSystemsNotice';
import { DOCUMENT_CANVAS_IDS } from './DocumentCanvas.testids';

export interface DocumentCanvasProps {
  data: DocumentDto;
}

export const DocumentCanvas = ({ data }: DocumentCanvasProps) => {
  const tree = useDocumentTree(data.subjects);
  const overrides = useDocumentOverrides(data);
  const trash = useDocumentTrash(tree);

  const [showEmphasis, setShowEmphasis] = useState(false);

  const readOnly = !EDITABLE_STATUSES.has(overrides.status);
  const isDistributed = DISTRIBUTED_STATUSES.has(overrides.status);

  const handleAddEmphasis = () => setShowEmphasis(true);

  const { data: profileData } = useProfile();
  const profile = profileData ?? PROFILE_FALLBACK;

  const canvasBody = (
    <ContentEditorProvider>
      <DocPermissionsProvider isDistributed={isDistributed}>
        <DocumentActionsSlot overrides={overrides} />

        <BarRow>
          <DocumentMetadataPill header={overrides.header} />
        </BarRow>

        {!readOnly && data.sourceSystems.length > 0 && (
          <BarRow>
            <SourceSystemsNotice systems={data.sourceSystems} />
          </BarRow>
        )}

        <BarRow>
          <ComparisonBar />
        </BarRow>

        <SectionNavigationProvider>
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
        </SectionNavigationProvider>
      </DocPermissionsProvider>
    </ContentEditorProvider>
  );

  return profile.id ? (
    <CollabProvider userId={profile.id}>{canvasBody}</CollabProvider>
  ) : (
    canvasBody
  );
};
