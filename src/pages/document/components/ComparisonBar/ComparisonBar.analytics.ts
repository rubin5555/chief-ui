import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'השוואת גרסאות';

const ACTIONS = {
  VIEW_TOGGLED: 'שינוי תצוגת השוואה',
} as const;

export const useComparisonBarAnalytics = () => {
  const trackViewToggled = (view: 'הסתרת תוכן מחוק' | 'הצגת מרקור טקסט', isOn: boolean) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.VIEW_TOGGLED,
      label: `${view} — ${isOn ? 'הופעל' : 'כובה'}`,
    });
  };

  return { trackViewToggled };
};
