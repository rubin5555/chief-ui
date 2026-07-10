import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'תפריט ניווט ראשי';

const ACTIONS = {
  PANEL_OPENED: 'פתיחת תפריט תמיכה',
  PERMISSIONS_REQUESTED: 'בקשת טיפול בהרשאות',
  SUPPORT_CHAT_OPENED: 'פתיחת צ׳אט תמיכה',
} as const;

export const useSupportMenuAnalytics = () => {
  const trackPanelOpened = () => {
    analytics.trackEvent({ category: ANALYTICS_CATEGORY, action: ACTIONS.PANEL_OPENED });
  };

  const trackPermissionsRequested = () => {
    analytics.trackEvent({ category: ANALYTICS_CATEGORY, action: ACTIONS.PERMISSIONS_REQUESTED });
  };

  const trackSupportChatOpened = () => {
    analytics.trackEvent({ category: ANALYTICS_CATEGORY, action: ACTIONS.SUPPORT_CHAT_OPENED });
  };

  return { trackPanelOpened, trackPermissionsRequested, trackSupportChatOpened };
};
