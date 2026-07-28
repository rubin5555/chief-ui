import { analytics } from '@/analytics';
import type { EditDocDetailsMode } from './EditDocDetailsModal.constants';

const ANALYTICS_CATEGORY = 'פרטי מסמך';

const ACTIONS = {
  DETAILS_SAVED: 'שמירת פרטי מסמך',
  REVIEW_CONTINUED: 'המשך מסקירת פרטים לסבב',
} as const;

export const useEditDocDetailsModalAnalytics = () => {
  const trackDetailsSaved = (mode: EditDocDetailsMode) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.DETAILS_SAVED,
      label: mode,
    });
  };

  // Whether anything was edited on the way through is the question the warning
  // exists to answer — if nobody ever edits here, the review step is a click.
  const trackReviewContinued = (isDirty: boolean) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.REVIEW_CONTINUED,
      label: isDirty ? 'עם שינויים' : 'ללא שינויים',
    });
  };

  return { trackDetailsSaved, trackReviewContinued };
};
