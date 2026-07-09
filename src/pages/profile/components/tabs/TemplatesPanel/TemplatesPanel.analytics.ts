import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'פאנל תבניות';

const ACTIONS = {
  NEW_TEMPLATE: 'יצירת תבנית חדשה',
  EDIT_TEMPLATE: 'עריכת תבנית',
  DUPLICATE_TEMPLATE: 'שכפול תבנית',
  DELETE_TEMPLATE: 'מחיקת תבנית',
  RESTORE_TEMPLATE: 'שחזור תבנית',
  PIN_TOGGLED: 'שינוי סימון נעיצה',
  SUB_TAB_CHANGED: 'מעבר בין לשוניות משנה',
  SEARCH_USED: 'חיפוש תבניות',
  FILTER_USED: 'סינון לפי אגף',
} as const;

export const useTemplatesPanelAnalytics = () => {
  const trackNewTemplate = () => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.NEW_TEMPLATE,
    });
  };

  const trackEditTemplate = (templateName: string) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.EDIT_TEMPLATE,
      label: templateName,
    });
  };

  const trackDuplicateTemplate = (templateName: string) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.DUPLICATE_TEMPLATE,
      label: templateName,
    });
  };

  const trackDeleteTemplate = (templateName: string) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.DELETE_TEMPLATE,
      label: templateName,
    });
  };

  const trackRestoreTemplate = (templateName: string) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.RESTORE_TEMPLATE,
      label: templateName,
    });
  };

  const trackPinToggled = (templateName: string, pinned: boolean) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.PIN_TOGGLED,
      label: `${templateName} | ${pinned ? 'נעוץ' : 'בוטל נעיצה'}`,
    });
  };

  const trackSubTabChanged = (tabId: string) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.SUB_TAB_CHANGED,
      label: `לשונית: ${tabId}`,
    });
  };

  const trackSearchUsed = (query: string) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.SEARCH_USED,
      label: `מחרוזת: ${query}`,
    });
  };

  const trackFilterUsed = (department: string) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.FILTER_USED,
      label: department,
    });
  };

  return {
    trackNewTemplate,
    trackEditTemplate,
    trackDuplicateTemplate,
    trackDeleteTemplate,
    trackRestoreTemplate,
    trackPinToggled,
    trackSubTabChanged,
    trackSearchUsed,
    trackFilterUsed,
  };
};
