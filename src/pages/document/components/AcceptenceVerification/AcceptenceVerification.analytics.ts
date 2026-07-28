import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'אישור קבלה';

const ACTIONS = {
  ACCEPTANCE_SENT: 'שליחת אישור קבלה',
} as const;

export const useAcceptenceVerificationAnalytics = () => {
  const trackAcceptanceSent = () => {
    analytics.trackEvent({ category: ANALYTICS_CATEGORY, action: ACTIONS.ACCEPTANCE_SENT });
  };

  return { trackAcceptanceSent };
};
