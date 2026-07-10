import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'תפריט ניווט ראשי';

const ACTIONS = {
  PANEL_OPENED: 'פתיחת תפריט התראות',
  MARK_ALL_READ: 'סימון כל ההתראות כנקראו',
} as const;

export const useNotificationsMenuAnalytics = () => {
  const trackPanelOpened = () => {
    analytics.trackEvent({ category: ANALYTICS_CATEGORY, action: ACTIONS.PANEL_OPENED });
  };

  const trackMarkAllRead = () => {
    analytics.trackEvent({ category: ANALYTICS_CATEGORY, action: ACTIONS.MARK_ALL_READ });
  };

  return { trackPanelOpened, trackMarkAllRead };
};
