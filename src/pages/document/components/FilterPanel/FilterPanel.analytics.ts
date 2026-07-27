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

  // Applying an empty selection is what clearing the filter *is* here — main's סנן
  // button commits whatever is staged, including nothing — so the two report as
  // separate actions rather than one with an empty label.
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
