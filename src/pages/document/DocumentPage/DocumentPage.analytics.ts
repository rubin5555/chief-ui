import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'עמוד מסמך';

const ACTIONS = {
  DOCUMENT_OPENED: 'פתיחת מסמך',
} as const;

export const useDocumentPageAnalytics = () => {
  const trackDocumentOpened = (documentId: string) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.DOCUMENT_OPENED,
      label: `מסמך: ${documentId}`,
    });
  };

  return {
    trackDocumentOpened,
  };
};
