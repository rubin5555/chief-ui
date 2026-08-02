import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'קטלוג מסמכים';

const ACTIONS = {
  CHANGE_TAB: 'מעבר בין לשוניות',
  CHANGE_DIST_SUB_TAB: 'מעבר בין תת-לשוניות הפצה',
  SEARCH: 'חיפוש בקטלוג',
  CHANGE_PAGE: 'מעבר עמוד',
  OPEN_DOC: 'פתיחת מסמך',
  TOGGLE_CHILDREN: 'הצגת מסמכי בן',
  OPEN_RECEIPTS: 'צפייה בווידוא קבלה',
  RESHARE: 'שיתוף מחדש',
  OPEN_TRASH: 'פתיחת סל מחזור',
} as const;

export const useDocumentCatalogAnalytics = () => {
  const trackTabChanged = (tab: string) => {
    analytics.trackEvent({ category: ANALYTICS_CATEGORY, action: ACTIONS.CHANGE_TAB, label: tab });
  };

  const trackDistSubTabChanged = (label: string) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.CHANGE_DIST_SUB_TAB,
      label,
    });
  };

  // Fired off the debounced value, not each keystroke, so one search is one event.
  const trackSearch = (query: string) => {
    if (!query) return;
    analytics.trackEvent({ category: ANALYTICS_CATEGORY, action: ACTIONS.SEARCH, label: query });
  };

  const trackPageChanged = (page: number) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.CHANGE_PAGE,
      label: `עמוד ${page}`,
    });
  };

  const trackDocOpened = (name: string) => {
    analytics.trackEvent({ category: ANALYTICS_CATEGORY, action: ACTIONS.OPEN_DOC, label: name });
  };

  const trackChildrenToggled = (name: string) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.TOGGLE_CHILDREN,
      label: name,
    });
  };

  const trackReceiptsOpened = (name: string) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.OPEN_RECEIPTS,
      label: name,
    });
  };

  const trackReshare = (name: string) => {
    analytics.trackEvent({ category: ANALYTICS_CATEGORY, action: ACTIONS.RESHARE, label: name });
  };

  const trackTrashOpened = () => {
    analytics.trackEvent({ category: ANALYTICS_CATEGORY, action: ACTIONS.OPEN_TRASH });
  };

  return {
    trackTabChanged,
    trackDistSubTabChanged,
    trackSearch,
    trackPageChanged,
    trackDocOpened,
    trackChildrenToggled,
    trackReceiptsOpened,
    trackReshare,
    trackTrashOpened,
  };
};
