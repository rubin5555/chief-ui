import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'פאנל רשימות תפוצה';

const ACTIONS = {
  NEW_LIST: 'יצירת רשימת תפוצה חדשה',
  LIST_MODAL_OPENED: 'פתיחת מודאל רשימה חדשה',
  EDIT_LIST: 'עריכת רשימת תפוצה',
  DUPLICATE_LIST: 'שכפול רשימת תפוצה',
  DELETE_LIST: 'מחיקת רשימת תפוצה',
  SEARCH_USED: 'חיפוש רשימות',
  FILTER_USED: 'סינון לפי אגף',
} as const;

export const useListsPanelAnalytics = () => {
  const trackMailingList = () => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.NEW_LIST,
    });
  };

  const trackMailingListOpened = () => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.LIST_MODAL_OPENED,
    });
  };

  const trackEditList = (listName: string) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.EDIT_LIST,
      label: listName,
    });
  };

  const trackDuplicateList = (listName: string) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.DUPLICATE_LIST,
      label: listName,
    });
  };

  const trackDeleteList = (listName: string) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.DELETE_LIST,
      label: listName,
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
    trackMailingList,
    trackMailingListOpened,
    trackEditList,
    trackDuplicateList,
    trackDeleteList,
    trackSearchUsed,
    trackFilterUsed,
  };
};
