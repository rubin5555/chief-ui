import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'קטלוג — סרגל צדדי';

const ACTIONS = {
  SELECT_DEPARTMENT: 'בחירת אגף',
  SELECT_FOLDER: 'בחירת תיקייה',
  CLEAR_FOLDER: 'ניקוי סינון תיקייה',
  BACK_TO_MENU: 'חזרה לתפריט',
  OPEN_COMMAND_PAGE: 'פתיחת עמוד פקודה ראשית',
} as const;

export const useCatalogSidebarAnalytics = () => {
  const trackDepartmentSelected = (dept: string) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.SELECT_DEPARTMENT,
      label: dept,
    });
  };

  const trackFolderSelected = (folder: string | null, sub: string | null) => {
    if (!folder && !sub) {
      analytics.trackEvent({ category: ANALYTICS_CATEGORY, action: ACTIONS.CLEAR_FOLDER });
      return;
    }
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.SELECT_FOLDER,
      label: sub ? `${folder ?? '—'} / ${sub}` : (folder ?? '—'),
    });
  };

  const trackBackToMenu = () => {
    analytics.trackEvent({ category: ANALYTICS_CATEGORY, action: ACTIONS.BACK_TO_MENU });
  };

  const trackCommandPageOpened = (org: string) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.OPEN_COMMAND_PAGE,
      label: org,
    });
  };

  return {
    trackDepartmentSelected,
    trackFolderSelected,
    trackBackToMenu,
    trackCommandPageOpened,
  };
};
