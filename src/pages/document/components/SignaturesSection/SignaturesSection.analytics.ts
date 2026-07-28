import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'חתימות מסמך';

const ACTIONS = {
  TEMPLATE_USED: 'שימוש בתבנית חתימה',
  SIGNATURE_ADDED: 'הוספת חתימה נוספת',
} as const;

export const useSignaturesSectionAnalytics = () => {
  // The templates exist to save typing a signature block by hand; whether they get
  // used is the only way to know if they earn their dialog.
  const trackTemplateUsed = () => {
    analytics.trackEvent({ category: ANALYTICS_CATEGORY, action: ACTIONS.TEMPLATE_USED });
  };

  const trackSignatureAdded = () => {
    analytics.trackEvent({ category: ANALYTICS_CATEGORY, action: ACTIONS.SIGNATURE_ADDED });
  };

  return { trackTemplateUsed, trackSignatureAdded };
};
