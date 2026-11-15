import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'ייבוא סעיפים';

const ACTIONS = {
  SOURCE_PICKED: 'בחירת מסמך מקור',
  IMPORT_SUBMITTED: 'ביצוע ייבוא',
} as const;

export const useImportDocModalAnalytics = () => {
  const trackSourcePicked = (docId: string) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.SOURCE_PICKED,
      label: docId,
    });
  };

  const trackImportSubmitted = (count: number) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.IMPORT_SUBMITTED,
      label: `${count} סעיפים`,
    });
  };

  return { trackSourcePicked, trackImportSubmitted };
};
