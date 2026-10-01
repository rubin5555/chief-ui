import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'הפצת מסמך';

const ACTIONS = {
  DISTRIBUTE_SENT: 'הפצת מסמך הושלמה',
} as const;

export const useDistributeDocAnalytics = () => {
  const trackDistributeSent = () => {
    analytics.trackEvent({ category: ANALYTICS_CATEGORY, action: ACTIONS.DISTRIBUTE_SENT });
  };

  return { trackDistributeSent };
};
