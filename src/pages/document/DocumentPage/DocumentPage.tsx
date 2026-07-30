import { getRouteApi } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useDocument } from '@/api/docs';
import { DocumentCanvas } from '../components/DocumentCanvas';
import { DocumentPageSkeleton } from '../components/DocumentPageSkeleton';
import { useDocumentPageAnalytics } from './DocumentPage.analytics';
import { PageRoot } from './DocumentPage.styles';
import { DOCUMENT_PAGE_IDS } from './DocumentPage.testids';

const routeApi = getRouteApi('/document/$id');

export const DocumentPage = () => {
  const { id } = routeApi.useParams();
  const { data, loading } = useDocument(id);
  const { trackDocumentOpened } = useDocumentPageAnalytics();

  // biome-ignore lint/correctness/useExhaustiveDependencies: see comment above
  useEffect(() => {
    if (data) trackDocumentOpened(data.id);
  }, [data]);

  return (
    <PageRoot dir="rtl" data-testid={DOCUMENT_PAGE_IDS.root}>
      {loading || !data ? <DocumentPageSkeleton /> : <DocumentCanvas data={data} />}
    </PageRoot>
  );
};
