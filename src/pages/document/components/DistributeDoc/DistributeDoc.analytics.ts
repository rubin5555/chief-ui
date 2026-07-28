import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'הפצת מסמך';

const ACTIONS = {
  DISTRIBUTE_SENT: 'הפצת מסמך הושלמה',
} as const;

export const useDistributeDocAnalytics = () => {
  const trackDistributeSent = (recipientCount: number) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.DISTRIBUTE_SENT,
      label: `${recipientCount} נמענים`,
    });
  };

  return { trackDistributeSent };
};
