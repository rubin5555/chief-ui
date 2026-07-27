import { getRouteApi } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useDocument } from '@/api/docs';
import { PanelLoading } from '@/components/ui/PanelLoading';
import { DocumentCanvas } from '../components/DocumentCanvas';
import { useDocumentPageAnalytics } from './DocumentPage.analytics';
import { PageRoot } from './DocumentPage.styles';
import { DOCUMENT_PAGE_IDS } from './DocumentPage.testids';

const routeApi = getRouteApi('/document/$id');

// Thin page shell: owns which document is loaded, delegates everything else
// to DocumentCanvas — see .claude/skills/react-engineering.md's "No Monolith
// Pages" rule, the thing main's 2,195-line Edit component got wrong.
// DocumentCanvas (which owns useDocumentTree) only mounts once `data` is
// loaded, so the tree's initial-state seed is never stuck on a
// loading-time empty array.
export const DocumentPage = () => {
  const { id } = routeApi.useParams();
  const { data, loading } = useDocument(id);
  const { trackDocumentOpened } = useDocumentPageAnalytics();

  // trackDocumentOpened is a fresh function reference every render; only
  // re-fire the tracking pixel when the loaded document itself changes.
  // biome-ignore lint/correctness/useExhaustiveDependencies: see comment above
  useEffect(() => {
    if (data) trackDocumentOpened(data.id);
  }, [data]);

  return (
    <PageRoot dir="rtl" data-testid={DOCUMENT_PAGE_IDS.root}>
      {loading || !data ? <PanelLoading /> : <DocumentCanvas data={data} />}
    </PageRoot>
  );
};
