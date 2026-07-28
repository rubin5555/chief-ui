import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'השוואת גרסאות';

const ACTIONS = {
  COMPARISON_STARTED: 'התחלת השוואה לגרסה',
  VIEW_TOGGLED: 'שינוי תצוגת השוואה',
} as const;

export const useComparisonBarAnalytics = () => {
  const trackComparisonStarted = (versionLabel: string) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.COMPARISON_STARTED,
      label: versionLabel,
    });
  };

  // Both toggles report through one action with the toggle as its label: what is
  // worth knowing is which of the two views people actually reach for.
  const trackViewToggled = (view: 'הסתרת תוכן מחוק' | 'הצגת מרקור טקסט', isOn: boolean) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.VIEW_TOGGLED,
      label: `${view} — ${isOn ? 'הופעל' : 'כובה'}`,
    });
  };

  return { trackComparisonStarted, trackViewToggled };
};
