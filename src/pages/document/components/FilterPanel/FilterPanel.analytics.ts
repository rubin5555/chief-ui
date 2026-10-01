import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'סינון סעיפים';

const ACTIONS = {
  PANEL_OPENED: 'פתיחת סינון סעיפים',
  FILTER_APPLIED: 'שינוי סינון לפי סטטוס',
  FILTER_CLEARED: 'ניקוי סינון',
} as const;

export const useFilterPanelAnalytics = () => {
  const trackPanelOpened = () => {
    analytics.trackEvent({ category: ANALYTICS_CATEGORY, action: ACTIONS.PANEL_OPENED });
  };

  const trackFilterApplied = (statuses: string[]) => {
    if (statuses.length === 0) {
      analytics.trackEvent({ category: ANALYTICS_CATEGORY, action: ACTIONS.FILTER_CLEARED });
      return;
    }

    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.FILTER_APPLIED,
      label: `סטטוסים: ${statuses.join(', ')}`,
    });
  };

  return {
    trackPanelOpened,
    trackFilterApplied,
  };
};
