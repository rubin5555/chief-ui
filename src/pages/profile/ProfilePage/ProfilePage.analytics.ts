import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'דף פרופיל';

const ACTIONS = {
  TAB_CHANGED: 'מעבר בין לשוניות',
  NEW_LIST_OPENED: 'פתיחת מודאל רשימה חדשה',
  SIGNATURE_MODAL_OPENED: 'פתיחת מודאל חתימה חדשה',
  ENVIRONMENT_MODAL_OPENED: 'פתיחת מודאל בקשת סביבה',
  SPELL_CHECK_OPENED: 'פתיחת מודאל בדיקת איות',
} as const;

export const useProfilePageAnalytics = () => {
  const trackTabChanged = (tabId: string) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.TAB_CHANGED,
      label: `לשונית: ${tabId}`,
    });
  };

  const trackMailingListOpened = () => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.NEW_LIST_OPENED,
    });
  };

  const trackSignatureModalOpened = () => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.SIGNATURE_MODAL_OPENED,
    });
  };

  const trackEnvironmentModalOpened = () => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.ENVIRONMENT_MODAL_OPENED,
    });
  };

  const trackSpellCheckOpened = () => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.SPELL_CHECK_OPENED,
    });
  };

  return {
    trackTabChanged,
    trackMailingListOpened,
    trackSignatureModalOpened,
    trackEnvironmentModalOpened,
    trackSpellCheckOpened,
  };
};
