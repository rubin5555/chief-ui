import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'פרופיל - תוכן ראשי';

const ACTIONS = {
  TAB_CHANGE: 'מעבר בין לשוניות',
} as const;

export const useProfileContentAnalytics = () => {
  const trackTabChange = (tabId: string, tabLabel: string) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.TAB_CHANGE,
      label: `${tabLabel} (${tabId})`,
    });
  };

  return { trackTabChange };
};
