import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'תפריט ניווט ראשי';

const ACTIONS = {
  MODE_CHANGED: 'שינוי מצב מציאות',
} as const;

export const useRealityModeSwitchAnalytics = () => {
  const trackModeChanged = (mode: string) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.MODE_CHANGED,
      label: `מצב: ${mode}`,
    });
  };

  return { trackModeChanged };
};
