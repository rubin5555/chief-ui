import { analytics } from '@/analytics';
import type { ModalMode } from './MailingListModal';

const ANALYTICS_CATEGORY = 'מודאל רשימת תפוצה';

const ACTIONS = {
  MODAL_OPENED: 'פתיחת מודאל',
  TAB_CHANGED: 'מעבר בין לשוניות ייבוא',
  MEMBER_REMOVED: 'הסרת חבר מהרשימה',
  SAVE_CLICKED: 'ניסיון שמירת רשימה',
  CANCELLED: 'סגירת מודאל ללא שמירה',
} as const;

export const useMailingListModalAnalytics = () => {
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
