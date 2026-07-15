import { analytics } from '@/analytics';
import type { SignatureType } from './SignaturesPanel';

const ANALYTICS_CATEGORY = 'פאנל חתימות';

const ACTIONS = {
  NEW_SIGNATURE: 'יצירת חתימה חדשה',
  SIGNATURE_MODAL_OPENED: 'פתיחת מודאל חתימה חדשה',
  EDIT_SIGNATURE: 'עריכת חתימה',
  DUPLICATE_SIGNATURE: 'שכפול חתימה',
  DELETE_SIGNATURE: 'מחיקת חתימה',
  SUB_TAB_CHANGED: 'מעבר בין סוגי חתימה',
  SEARCH_USED: 'חיפוש חתימות',
  FILTER_USED: 'סינון לפי אגף',
} as const;

const SIGNATURE_TYPE_LABELS: Record<SignatureType, string> = {
  distribution: 'תפוצה',
  personal: 'אישי',
  approver: 'מאשר',
};

export const useSignaturesPanelAnalytics = () => {
  const trackNewSignature = (type: SignatureType) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.NEW_SIGNATURE,
      label: `סוג: ${SIGNATURE_TYPE_LABELS[type]}`,
    });
  };

  const trackSignatureModalOpened = () => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.SIGNATURE_MODAL_OPENED,
    });
  };

  const trackEditSignature = (signatureName: string, type: SignatureType) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.EDIT_SIGNATURE,
      label: `${signatureName} | ${SIGNATURE_TYPE_LABELS[type]}`,
    });
  };

  const trackDuplicateSignature = (signatureName: string, type: SignatureType) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.DUPLICATE_SIGNATURE,
      label: `${signatureName} | ${SIGNATURE_TYPE_LABELS[type]}`,
    });
  };

  const trackDeleteSignature = (signatureName: string) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.DELETE_SIGNATURE,
      label: signatureName,
    });
  };

  const trackSubTabChanged = (type: SignatureType) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.SUB_TAB_CHANGED,
      label: `סוג: ${SIGNATURE_TYPE_LABELS[type]}`,
    });
  };

  const trackSearchUsed = (query: string) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.SEARCH_USED,
      label: `מחרוזת: ${query}`,
    });
  };

  const trackFilterUsed = (department: string) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.FILTER_USED,
      label: department,
    });
  };

  return {
    trackNewSignature,
    trackSignatureModalOpened,
    trackEditSignature,
    trackDuplicateSignature,
    trackDeleteSignature,
    trackSubTabChanged,
    trackSearchUsed,
    trackFilterUsed,
  };
};
