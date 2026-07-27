import { analytics } from '@/analytics';
import type { AddActionId } from './components/SidebarFabRow';

const ANALYTICS_CATEGORY = 'סרגל צד מסמך';

// The ids are internal; what a report should show is what the user picked.
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
  // One action with the choice as its label rather than four actions: what is
  // worth knowing is the shape of the menu's usage, and that reads better as a
  // single breakdown.
  const trackAddActionChosen = (action: AddActionId) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.ADD_ACTION_CHOSEN,
      label: ADD_ACTION_LABEL[action],
    });
  };

  // Both of these fire on completion, not on opening the dialog — the count is
  // the point, and a dialog that was opened and closed again imported nothing.
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
