import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'סיידבר פרופיל';

const ACTIONS = {
  ENVIRONMENT_MODAL_OPENED: 'פתיחת מודאל בקשת סביבה',
} as const;

export const useProfileSidebarAnalytics = () => {
  const trackEnvironmentModalOpened = () => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.ENVIRONMENT_MODAL_OPENED,
    });
  };

  return {
    trackEnvironmentModalOpened,
  };
};
