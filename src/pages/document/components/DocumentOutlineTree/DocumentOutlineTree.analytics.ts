import { analytics } from '@/analytics';
import type { OutlineDeleteTarget } from './DocumentOutlineTree.types';

const ANALYTICS_CATEGORY = 'עץ סעיפי מסמך';

const ACTIONS = {
  NODE_ADDED: 'הוספת סעיף',
  NODE_DELETED: 'מחיקת סעיף',
  NODES_REORDERED: 'שינוי סדר סעיפים',
  RENAME_STARTED: 'שינוי שם סעיף',
} as const;

const LEVEL_LABEL: Record<OutlineDeleteTarget['level'], string> = {
  subject: 'נושא',
  section: 'סעיף',
  subSection: 'תת סעיף',
};

type Level = OutlineDeleteTarget['level'];

export const useDocumentOutlineTreeAnalytics = () => {
  const trackNodeAdded = (level: Level) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.NODE_ADDED,
      label: LEVEL_LABEL[level],
    });
  };

  const trackNodeDeleted = (level: Level) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.NODE_DELETED,
      label: LEVEL_LABEL[level],
    });
  };

  const trackNodesReordered = (level: Level) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.NODES_REORDERED,
      label: LEVEL_LABEL[level],
    });
  };

  const trackRenameStarted = () => {
    analytics.trackEvent({ category: ANALYTICS_CATEGORY, action: ACTIONS.RENAME_STARTED });
  };

  return {
    trackNodeAdded,
    trackNodeDeleted,
    trackNodesReordered,
    trackRenameStarted,
  };
};
