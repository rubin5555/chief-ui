import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'הפצת מסמך';

const ACTIONS = {
  DISTRIBUTE_SENT: 'הפצת מסמך הושלמה',
} as const;

export const useDistributeDocAnalytics = () => {
  // No recipient count to report: who a distributed document reaches is settled
  // by the approval round, not by this dialog (see DistributeDoc's doc comment).
  const trackDistributeSent = () => {
    analytics.trackEvent({ category: ANALYTICS_CATEGORY, action: ACTIONS.DISTRIBUTE_SENT });
  };

  return { trackDistributeSent };
};
