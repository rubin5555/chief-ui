import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'השוואת גרסאות';

const ACTIONS = {
  COMPARISON_STARTED: 'התחלת השוואה לגרסה',
} as const;

export const useVersionPickerModalAnalytics = () => {
  const trackComparisonStarted = (versionLabel: string) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.COMPARISON_STARTED,
      label: versionLabel,
    });
  };

  return { trackComparisonStarted };
};
