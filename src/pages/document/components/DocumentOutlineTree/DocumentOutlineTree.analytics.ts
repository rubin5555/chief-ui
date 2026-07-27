import { analytics } from '@/analytics';
import type { OutlineDeleteTarget } from './DocumentOutlineTree.types';

const ANALYTICS_CATEGORY = 'עץ סעיפי מסמך';

const ACTIONS = {
  NODE_ADDED: 'הוספת סעיף',
  NODE_DELETED: 'מחיקת סעיף',
  NODES_REORDERED: 'שינוי סדר סעיפים',
  RENAME_STARTED: 'שינוי שם סעיף',
} as const;

// Which level an event happened at, as the event's label — the interesting
// question about a tree edit is almost always "at what depth", and a label keeps
// that answerable without four near-identical actions per verb.
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

  // Reported on confirmation, not when the menu item is clicked: a delete that was
  // cancelled at the dialog didn't happen.
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

  // The rename is tracked when it is *asked for*, not when it commits: an edit
  // that ends in the unchanged title still tells you the name was unclear.
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
