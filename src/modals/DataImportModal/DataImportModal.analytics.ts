import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'מודאל ייבוא ממערכת מקור';

const ACTIONS = {
  MODAL_OPENED: 'פתיחת מודאל',
  SYSTEM_SELECTED: 'בחירת מערכת מקור',
  OPERATION_SELECTED: 'בחירת פעולה',
  FIELDS_LINKED: 'קישור שדות מידע',
  FIELD_UNLINKED: 'הסרת שדה מידע',
  CLOSED: 'סגירת מודאל',
} as const;

export const useDataImportAnalytics = () => {
  const trackModalOpened = () => {
    analytics.trackEvent({ category: ANALYTICS_CATEGORY, action: ACTIONS.MODAL_OPENED });
  };

  const trackSystemSelected = (systemName: string) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.SYSTEM_SELECTED,
      label: `מערכת: ${systemName}`,
    });
  };

  const trackOperationSelected = (operationName: string) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.OPERATION_SELECTED,
      label: `פעולה: ${operationName}`,
    });
  };

  const trackFieldsLinked = (count: number) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.FIELDS_LINKED,
      label: `כמות: ${count}`,
    });
  };

  const trackFieldUnlinked = (fieldName: string) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.FIELD_UNLINKED,
      label: `שדה: ${fieldName}`,
    });
  };

  const trackClosed = (linkedCount: number) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.CLOSED,
      label: `שדות מקושרים: ${linkedCount}`,
    });
  };

  return {
    trackModalOpened,
    trackSystemSelected,
    trackOperationSelected,
    trackFieldsLinked,
    trackFieldUnlinked,
    trackClosed,
  };
};
