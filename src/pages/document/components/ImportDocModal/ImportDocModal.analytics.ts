import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'ייבוא סעיפים';

const ACTIONS = {
  SOURCE_PICKED: 'בחירת מסמך מקור',
  IMPORT_SUBMITTED: 'ביצוע ייבוא',
} as const;

export const useImportDocModalAnalytics = () => {
  // The document's id, not its name: which source people actually reach for is
  // the answerable question, and an id answers it without carrying a title.
  const trackSourcePicked = (docId: string) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.SOURCE_PICKED,
      label: docId,
    });
  };

  // The count is what makes this answerable: whether people import one section or
  // a whole document decides whether the picker needs a "select all".
  const trackImportSubmitted = (count: number) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.IMPORT_SUBMITTED,
      label: `${count} סעיפים`,
    });
  };

  return { trackSourcePicked, trackImportSubmitted };
};
