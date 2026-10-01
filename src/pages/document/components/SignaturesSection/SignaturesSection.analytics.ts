import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'חתימות מסמך';

const ACTIONS = {
  TEMPLATE_USED: 'שימוש בתבנית חתימה',
  SIGNATURE_ADDED: 'הוספת חתימה נוספת',
} as const;

export const useSignaturesSectionAnalytics = () => {
  const trackTemplateUsed = () => {
    analytics.trackEvent({ category: ANALYTICS_CATEGORY, action: ACTIONS.TEMPLATE_USED });
  };

  const trackSignatureAdded = () => {
    analytics.trackEvent({ category: ANALYTICS_CATEGORY, action: ACTIONS.SIGNATURE_ADDED });
  };

  return { trackTemplateUsed, trackSignatureAdded };
};
