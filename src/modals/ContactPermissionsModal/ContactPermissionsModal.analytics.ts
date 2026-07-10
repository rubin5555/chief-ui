import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'תפריט ניווט ראשי';

const ACTIONS = {
  CHAT_CLICKED: 'לחיצה על צ׳אט עם ארגון',
} as const;

export const useContactPermissionsModalAnalytics = () => {
  const trackChatClicked = (orgName: string) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.CHAT_CLICKED,
      label: `ארגון: ${orgName}`,
    });
  };

  return { trackChatClicked };
};
