import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'סבב אישורים';

const ACTIONS = {
  STAGE_APPROVED: 'אישור שלב',
  ROUND_REJECTED: 'דחיית מסמך',
} as const;

export const useApprovalRotationAnalytics = () => {
  const trackStageApproved = (rank: string, hasSignature: boolean) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.STAGE_APPROVED,
      label: `${rank} — ${hasSignature ? 'עם חתימה' : 'ללא חתימה'}`,
    });
  };

  const trackRoundRejected = () => {
    analytics.trackEvent({ category: ANALYTICS_CATEGORY, action: ACTIONS.ROUND_REJECTED });
  };

  return { trackStageApproved, trackRoundRejected };
};
