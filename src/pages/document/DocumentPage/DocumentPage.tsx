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

  // Keyed on the id rather than the `data` object: Apollo hands back a fresh
  // object on every cache update, and depending on that would re-fire the open
  // event for a document the reader never left.
  const openedId = data?.id;

  useEffect(() => {
    if (openedId) trackDocumentOpened(openedId);
  }, [openedId, trackDocumentOpened]);

  return (
    <PageRoot dir="rtl" data-testid={DOCUMENT_PAGE_IDS.root}>
      {/* `key` matters: the canvas seeds local state from `data` (the subject
          tree, status and header). A warm cache hit swaps `data` without ever
          flipping `loading`, so without a remount the canvas would keep serving
          the previously opened document. */}
      {loading || !data ? <DocumentPageSkeleton /> : <DocumentCanvas key={data.id} data={data} />}
    </PageRoot>
  );
};
