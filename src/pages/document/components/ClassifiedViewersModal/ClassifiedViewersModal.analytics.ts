import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'צופים ממודרים';

const ACTIONS = {
  VIEWERS_CHANGED: 'שינוי רשימת צופים',
} as const;

export const useClassifiedViewersModalAnalytics = () => {
  // The count, never the names: who may read a classified section is exactly the
  // kind of thing that must not leave the app in an analytics label.
  const trackViewersChanged = (count: number) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.VIEWERS_CHANGED,
      label: `${count} צופים`,
    });
  };

  return { trackViewersChanged };
};
