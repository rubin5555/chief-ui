import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'תהליך אישור מסמך';

const ACTIONS = {
  STATUS_ADVANCED: 'קידום סטטוס מסמך',
  STATUS_REVERTED: 'החזרת סטטוס מסמך',
  ROUND_BLOCKED_UNSIGNED: 'סבב אישורים נחסם — מסמך לא חתום',
} as const;

export const useApprovalWorkflowAnalytics = () => {
  // The destination, not the origin: what is worth knowing is where documents get
  // to, and how many stall before they get there.
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

  // Its own action rather than a label on the advance: this is a person being
  // stopped, and how often it happens says whether the signature step is
  // discoverable enough before they get here.
  const trackRoundBlockedUnsigned = () => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.ROUND_BLOCKED_UNSIGNED,
    });
  };

  return { trackStatusAdvanced, trackStatusReverted, trackRoundBlockedUnsigned };
};
