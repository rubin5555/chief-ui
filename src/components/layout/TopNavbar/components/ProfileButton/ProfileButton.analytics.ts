import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'תפריט ניווט ראשי';

const ACTIONS = {
  PROFILE_OPENED: 'מעבר לאזור אישי',
} as const;

export const useProfileButtonAnalytics = () => {
  const trackProfileOpened = () => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.PROFILE_OPENED,
    });
  };

  return { trackProfileOpened };
};
