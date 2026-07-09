import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'מודאל בקשת סביבה';

const ACTIONS = {
  MODAL_OPENED: 'פתיחת מודאל',
  LOGO_UPLOADED: 'העלאת תמונת סביבה',
  SUBMIT_CLICKED: 'שליחת בקשת סביבה',
  CANCELLED: 'סגירת מודאל ללא שליחה',
} as const;

export const useEnvironmentRequestModalAnalytics = () => {
  const trackModalOpened = () => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.MODAL_OPENED,
    });
  };

  const trackLogoUploaded = () => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.LOGO_UPLOADED,
    });
  };

  const trackSubmitClicked = (bodyType: string) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.SUBMIT_CLICKED,
      label: `סוג גוף: ${bodyType || 'לא נבחר'}`,
    });
  };

  const trackCancelled = () => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.CANCELLED,
    });
  };

  return {
    trackModalOpened,
    trackLogoUploaded,
    trackSubmitClicked,
    trackCancelled,
  };
};
