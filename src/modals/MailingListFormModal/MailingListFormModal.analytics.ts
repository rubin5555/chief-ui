import { analytics } from '@/analytics';
import type { ModalMode } from './MailingListFormModal';

// Names the form specifically rather than mailing lists in general: the document
// permissions dialog draws people from the same sources, and two categories that
// both read "רשימת תפוצה" would pool creating a list together with granting
// access to a document under one number.
const ANALYTICS_CATEGORY = 'טופס רשימת תפוצה';

const ACTIONS = {
  MODAL_OPENED: 'פתיחת מודאל',
  TAB_CHANGED: 'מעבר בין לשוניות ייבוא',
  MEMBER_REMOVED: 'הסרת חבר מהרשימה',
  SAVE_CLICKED: 'ניסיון שמירת רשימה',
  CANCELLED: 'סגירת מודאל ללא שמירה',
} as const;

export const useMailingListFormModalAnalytics = () => {
  const trackModalOpened = (mode: ModalMode) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.MODAL_OPENED,
      label: `מצב: ${mode}`,
    });
  };

  const trackTabChanged = (tabId: string) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.TAB_CHANGED,
      label: `לשונית: ${tabId}`,
    });
  };

  const trackMemberRemoved = () => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.MEMBER_REMOVED,
    });
  };

  const trackSaveClicked = (mode: ModalMode, memberCount: number) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.SAVE_CLICKED,
      label: `מצב: ${mode} | מספר חברים: ${memberCount}`,
    });
  };

  const trackCancelled = (mode: ModalMode) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.CANCELLED,
      label: `מצב: ${mode}`,
    });
  };

  return {
    trackModalOpened,
    trackTabChanged,
    trackMemberRemoved,
    trackSaveClicked,
    trackCancelled,
  };
};
