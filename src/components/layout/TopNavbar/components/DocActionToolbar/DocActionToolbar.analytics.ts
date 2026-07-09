import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'סרגל פעולות מסמך';

const ACTIONS = {
  FILTER_CLICKED: 'לחיצה על סינון',
  EDIT_DOC_CLICKED: 'לחיצה על עריכת פרטי מסמך',
  DUPLICATE_CLICKED: 'לחיצה על שכפול',
  PERMISSIONS_CLICKED: 'לחיצה על הרשאות מסמך',
  EXPORT_STARTED: 'ניסיון ייצוא מסמך',
  ZOOM_CHANGED: 'שינוי רמת זום',
  SEARCH_OPENED: 'פתיחת חיפוש במסמך',
  SEARCH_CLOSED: 'סגירת חיפוש במסמך',
} as const;

export const useDocActionToolbarAnalytics = () => {
  const trackFilterClicked = () => {
    analytics.trackEvent({ category: ANALYTICS_CATEGORY, action: ACTIONS.FILTER_CLICKED });
  };

  const trackEditDocClicked = () => {
    analytics.trackEvent({ category: ANALYTICS_CATEGORY, action: ACTIONS.EDIT_DOC_CLICKED });
  };

  const trackDuplicateClicked = () => {
    analytics.trackEvent({ category: ANALYTICS_CATEGORY, action: ACTIONS.DUPLICATE_CLICKED });
  };

  const trackPermissionsClicked = () => {
    analytics.trackEvent({ category: ANALYTICS_CATEGORY, action: ACTIONS.PERMISSIONS_CLICKED });
  };

  const trackExportStarted = (type: 'word' | 'pdf') => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.EXPORT_STARTED,
      label: `סוג: ${type}`,
    });
  };

  const trackZoomChanged = (zoom: number) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.ZOOM_CHANGED,
      label: `רמת זום: ${zoom}%`,
    });
  };

  const trackSearchToggled = (isOpen: boolean) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: isOpen ? ACTIONS.SEARCH_OPENED : ACTIONS.SEARCH_CLOSED,
    });
  };

  return {
    trackFilterClicked,
    trackEditDocClicked,
    trackDuplicateClicked,
    trackPermissionsClicked,
    trackExportStarted,
    trackZoomChanged,
    trackSearchToggled,
  };
};
