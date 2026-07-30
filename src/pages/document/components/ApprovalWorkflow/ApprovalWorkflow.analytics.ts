import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'תהליך אישור מסמך';

const ACTIONS = {
  STATUS_ADVANCED: 'קידום סטטוס מסמך',
  STATUS_REVERTED: 'החזרת סטטוס מסמך',
  ROUND_BLOCKED_UNSIGNED: 'סבב אישורים נחסם — מסמך לא חתום',
} as const;

export const useApprovalWorkflowAnalytics = () => {
  const trackStatusAdvanced = (toStatus: string) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.STATUS_ADVANCED,
      label: toStatus,
    });
  };

  const trackStatusReverted = (toStatus: string) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.STATUS_REVERTED,
      label: toStatus,
    });
  };

  const trackRoundBlockedUnsigned = () => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.ROUND_BLOCKED_UNSIGNED,
    });
  };

  return { trackStatusAdvanced, trackStatusReverted, trackRoundBlockedUnsigned };
};
