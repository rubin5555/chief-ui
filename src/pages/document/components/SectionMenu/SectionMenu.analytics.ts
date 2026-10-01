import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'תפריט סעיף';

const ACTIONS = {
  HIDDEN_TOGGLED: 'הסתרת/הצגת סעיף',
  CLASSIFIED_TOGGLED: 'הגדרת/ביטול סעיף ממודר',
  INSTRUCTIONS_SAVED: 'שמירת הנחיות לסעיף',
  FOOTNOTE_ADDED: 'הוספת הערת שוליים',
  SECTION_DELETED: 'מחיקת סעיף',
} as const;

export const useSectionMenuAnalytics = () => {
  const trackHiddenToggled = (isHidden: boolean) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.HIDDEN_TOGGLED,
      label: isHidden ? 'הסתרה' : 'הצגה',
    });
  };

  const trackClassifiedToggled = (isClassified: boolean) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.CLASSIFIED_TOGGLED,
      label: isClassified ? 'הגדרה כממודר' : 'ביטול סיווג',
    });
  };

  const trackInstructionsSaved = () => {
    analytics.trackEvent({ category: ANALYTICS_CATEGORY, action: ACTIONS.INSTRUCTIONS_SAVED });
  };

  const trackFootnoteAdded = () => {
    analytics.trackEvent({ category: ANALYTICS_CATEGORY, action: ACTIONS.FOOTNOTE_ADDED });
  };

  const trackSectionDeleted = () => {
    analytics.trackEvent({ category: ANALYTICS_CATEGORY, action: ACTIONS.SECTION_DELETED });
  };

  return {
    trackHiddenToggled,
    trackClassifiedToggled,
    trackInstructionsSaved,
    trackFootnoteAdded,
    trackSectionDeleted,
  };
};
