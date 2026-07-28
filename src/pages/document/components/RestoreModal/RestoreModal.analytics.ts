import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'שחזור סעיפים';

const ACTIONS = {
  RESTORE_SUBMITTED: 'ביצוע שחזור',
} as const;

export const useRestoreModalAnalytics = () => {
  // Only the completed restore is tracked. Ticking a checkbox is browsing, and a
  // restore dialog opened and closed again restored nothing.
  const trackRestoreSubmitted = (count: number) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.RESTORE_SUBMITTED,
      label: `${count} סעיפים`,
    });
  };

  return { trackRestoreSubmitted };
};
