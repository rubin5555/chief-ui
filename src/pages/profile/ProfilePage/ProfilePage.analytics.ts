import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'דף פרופיל';

const ACTIONS = {
  TAB_CHANGED: 'מעבר בין לשוניות',
} as const;

export const useProfilePageAnalytics = () => {
  const trackTabChanged = (tabId: string) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.TAB_CHANGED,
      label: `לשונית: ${tabId}`,
    });
  };

  return {
    trackTabChanged,
  };
};
