import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'סבב אישורים';

const ACTIONS = {
  STAGE_APPROVED: 'אישור שלב',
  ROUND_REJECTED: 'דחיית מסמך',
} as const;

export const useApprovalRotationAnalytics = () => {
  // Whether a signature was attached is the interesting half: an approval without
  // one is allowed, and how often that happens decides whether the picker is
  // doing its job.
  const trackStageApproved = (rank: string, hasSignature: boolean) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.STAGE_APPROVED,
      label: `${rank} — ${hasSignature ? 'עם חתימה' : 'ללא חתימה'}`,
    });
  };

  // The reason itself is never sent: it is free text about a specific document,
  // written by a named approver.
  const trackRoundRejected = () => {
    analytics.trackEvent({ category: ANALYTICS_CATEGORY, action: ACTIONS.ROUND_REJECTED });
  };

  return { trackStageApproved, trackRoundRejected };
};
