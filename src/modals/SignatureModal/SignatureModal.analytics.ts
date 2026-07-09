import { analytics } from '@/analytics';
import type { SignatureType } from '@/pages/profile/components/tabs/SignaturesPanel';
import type { SignatureModalMode } from './SignatureModal.constants';

const ANALYTICS_CATEGORY = 'מודאל חתימה';

const ACTIONS = {
  MODAL_OPENED: 'פתיחת מודאל',
  TYPE_CHANGED: 'שינוי סוג חתימה',
  SAVE_CLICKED: 'ניסיון שמירת חתימה',
  CANCELLED: 'סגירת מודאל ללא שמירה',
} as const;

const SIGNATURE_TYPE_LABELS: Record<SignatureType, string> = {
  distribution: 'תפוצה',
  personal: 'אישי',
  approver: 'מאשר',
};

export const useSignatureModalAnalytics = () => {
  const trackModalOpened = (mode: SignatureModalMode) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.MODAL_OPENED,
      label: `מצב: ${mode}`,
    });
  };

  const trackTypeChanged = (type: SignatureType) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.TYPE_CHANGED,
      label: `סוג: ${SIGNATURE_TYPE_LABELS[type]}`,
    });
  };

  const trackSaveClicked = (mode: SignatureModalMode, type: SignatureType) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.SAVE_CLICKED,
      label: `מצב: ${mode} | סוג: ${SIGNATURE_TYPE_LABELS[type]}`,
    });
  };

  const trackCancelled = (mode: SignatureModalMode) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.CANCELLED,
      label: `מצב: ${mode}`,
    });
  };

  return {
    trackModalOpened,
    trackTypeChanged,
    trackSaveClicked,
    trackCancelled,
  };
};
