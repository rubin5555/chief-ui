import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'הגדרת סבב אישורים';

const ACTIONS = {
  ROUND_CONFIGURED: 'שמירת סבב אישורים',
} as const;

export const useApprovalDetailsModalAnalytics = () => {
  const trackRoundConfigured = (stageCount: number, hmlGroupCount: number) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.ROUND_CONFIGURED,
      label: `${stageCount} שלבים, ${hmlGroupCount} חמ״לים`,
    });
  };

  return { trackRoundConfigured };
};
