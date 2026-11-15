import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'צופים ממודרים';

const ACTIONS = {
  VIEWERS_CHANGED: 'שינוי רשימת צופים',
} as const;

export const useClassifiedViewersModalAnalytics = () => {
  const trackViewersChanged = (count: number) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.VIEWERS_CHANGED,
      label: `${count} צופים`,
    });
  };

  return { trackViewersChanged };
};
