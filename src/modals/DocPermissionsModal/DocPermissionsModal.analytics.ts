import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'הרשאות מסמך';

const ACTIONS = {
  LEVEL_VIEWED: 'צפייה ברמת הרשאה',
  MEMBERS_CHANGED: 'שינוי מורשים',
} as const;

export const useDocPermissionsModalAnalytics = () => {
  const trackLevelViewed = (levelLabel: string) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.LEVEL_VIEWED,
      label: levelLabel,
    });
  };

  const trackMembersChanged = (levelLabel: string, count: number) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.MEMBERS_CHANGED,
      label: `${levelLabel}: ${count} מורשים`,
    });
  };

  return { trackLevelViewed, trackMembersChanged };
};
