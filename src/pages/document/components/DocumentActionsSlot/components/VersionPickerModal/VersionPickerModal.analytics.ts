import { analytics } from '@/analytics';

// Kept here rather than on ComparisonBar, which used to own this picker: the bar
// now only draws a comparison that is already running, and the moment a
// comparison *starts* is the click on a row in this list.
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
