import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'תפריט ניווט ראשי';

const ACTIONS = {
  PANEL_OPENED: 'פתיחת תפריט הדרכה',
  FAQ_OPENED: 'פתיחת שאלות נפוצות',
  FAQ_ITEM_TOGGLED: 'הרחבת שאלה נפוצה',
  COURSE_OPENED: 'פתיחת לומדה',
} as const;

export const useTrainingMenuAnalytics = () => {
  const trackPanelOpened = () => {
    analytics.trackEvent({ category: ANALYTICS_CATEGORY, action: ACTIONS.PANEL_OPENED });
  };

  const trackFaqOpened = () => {
    analytics.trackEvent({ category: ANALYTICS_CATEGORY, action: ACTIONS.FAQ_OPENED });
  };

  const trackFaqItemToggled = (question: string) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.FAQ_ITEM_TOGGLED,
      label: question,
    });
  };

  const trackCourseOpened = () => {
    analytics.trackEvent({ category: ANALYTICS_CATEGORY, action: ACTIONS.COURSE_OPENED });
  };

  return { trackPanelOpened, trackFaqOpened, trackFaqItemToggled, trackCourseOpened };
};
