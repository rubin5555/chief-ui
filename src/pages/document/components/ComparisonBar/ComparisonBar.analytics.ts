import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'השוואת גרסאות';

// Starting a comparison is reported by the picker that starts it — see
// DocumentActionsSlot/components/VersionPickerModal/VersionPickerModal.analytics.ts,
// which shares this category.
const ACTIONS = {
  VIEW_TOGGLED: 'שינוי תצוגת השוואה',
} as const;

export const useComparisonBarAnalytics = () => {
  // Both toggles report through one action with the toggle as its label: what is
  // worth knowing is which of the two views people actually reach for.
  const trackViewToggled = (view: 'הסתרת תוכן מחוק' | 'הצגת מרקור טקסט', isOn: boolean) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.VIEW_TOGGLED,
      label: `${view} — ${isOn ? 'הופעל' : 'כובה'}`,
    });
  };

  return { trackViewToggled };
};
