import { analytics } from '@/analytics';
import type { SectionStatus } from '../../types';

const ANALYTICS_CATEGORY = 'סטטוס סעיף';

const ACTIONS = {
  STATUS_CHANGED: 'שינוי סטטוס סעיף',
  FIX_REQUESTED: 'בקשת תיקון סעיף',
  FIX_APPLIED: 'סעיף הועבר לתיקון',
} as const;

const STATUS_LABEL: Record<SectionStatus, string> = {
  editing: 'בעריכה',
  pending: 'ממתין לאישור',
  approved: 'מאושר',
  fix: 'לתיקון',
  idle: 'לא בעבודה',
};

export const useSectionBlockAnalytics = () => {
  const trackStatusChanged = (status: SectionStatus) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.STATUS_CHANGED,
      label: STATUS_LABEL[status],
    });
  };

  // Asking and completing are separate events on purpose: the gap between them is
  // how many people press `לתיקון` and then never say what needs fixing, which is
  // the one thing this flow can quietly fail at.
  const trackFixRequested = () => {
    analytics.trackEvent({ category: ANALYTICS_CATEGORY, action: ACTIONS.FIX_REQUESTED });
  };

  const trackFixApplied = () => {
    analytics.trackEvent({ category: ANALYTICS_CATEGORY, action: ACTIONS.FIX_APPLIED });
  };

  return { trackStatusChanged, trackFixRequested, trackFixApplied };
};
