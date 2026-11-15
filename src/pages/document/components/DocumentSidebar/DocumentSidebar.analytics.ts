import { analytics } from '@/analytics';
import type { AddActionId } from './components/SidebarFabRow';

const ANALYTICS_CATEGORY = 'סרגל צד מסמך';

const ADD_ACTION_LABEL: Record<AddActionId, string> = {
  subject: 'נושא חדש',
  appendix: 'נספח',
  import: 'ייבוא סעיפים',
  emphasis: 'דגשים לכתיבה',
};

const ACTIONS = {
  ADD_ACTION_CHOSEN: 'בחירת פעולת הוספה',
  IMPORT_COMPLETED: 'ייבוא סעיפים הושלם',
  RESTORE_COMPLETED: 'שחזור סעיפים הושלם',
} as const;

export const useDocumentSidebarAnalytics = () => {
  const trackAddActionChosen = (action: AddActionId) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.ADD_ACTION_CHOSEN,
      label: ADD_ACTION_LABEL[action],
    });
  };

  const trackImportCompleted = (count: number) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.IMPORT_COMPLETED,
      label: `${count} סעיפים`,
    });
  };

  const trackRestoreCompleted = (count: number) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.RESTORE_COMPLETED,
      label: `${count} סעיפים`,
    });
  };

  return {
    trackAddActionChosen,
    trackImportCompleted,
    trackRestoreCompleted,
  };
};
