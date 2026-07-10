import { analytics } from '@/analytics';
import type { TemplateModalMode } from './TemplateModal.constants';

const ANALYTICS_CATEGORY = 'מודאל תבנית';

const ACTIONS = {
  MODAL_OPENED: 'פתיחת מודאל',
  SUBJECT_ADDED: 'הוספת נושא',
  SECTION_ADDED: 'הוספת סעיף',
  SUBSECTION_ADDED: 'הוספת תת סעיף',
  PERMISSIONS_CHANGED: 'שינוי הרשאות',
  FIELDS_IMPORTED: 'ייבוא שדות ממערכת מקור',
  FIELD_DRAGGED: 'גרירת שדה מיובא למסמך',
  SAVE_CLICKED: 'ניסיון שמירת תבנית',
  CANCELLED: 'סגירת מודאל ללא שמירה',
} as const;

export const useTemplateModalAnalytics = () => {
  const trackModalOpened = (mode: TemplateModalMode) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.MODAL_OPENED,
      label: `מצב: ${mode}`,
    });
  };

  const trackSubjectAdded = () => {
    analytics.trackEvent({ category: ANALYTICS_CATEGORY, action: ACTIONS.SUBJECT_ADDED });
  };

  const trackSectionAdded = () => {
    analytics.trackEvent({ category: ANALYTICS_CATEGORY, action: ACTIONS.SECTION_ADDED });
  };

  const trackSubSectionAdded = () => {
    analytics.trackEvent({ category: ANALYTICS_CATEGORY, action: ACTIONS.SUBSECTION_ADDED });
  };

  const trackPermissionsChanged = (role: 'approvers' | 'editors') => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.PERMISSIONS_CHANGED,
      label: role === 'approvers' ? 'מאשרים' : 'עורכים',
    });
  };

  const trackFieldsImported = (count: number) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.FIELDS_IMPORTED,
      label: `כמות: ${count}`,
    });
  };

  const trackFieldDragged = (fieldName: string) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.FIELD_DRAGGED,
      label: `שדה: ${fieldName}`,
    });
  };

  const trackSaveClicked = (mode: TemplateModalMode) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.SAVE_CLICKED,
      label: `מצב: ${mode}`,
    });
  };

  const trackCancelled = (mode: TemplateModalMode) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.CANCELLED,
      label: `מצב: ${mode}`,
    });
  };

  return {
    trackModalOpened,
    trackSubjectAdded,
    trackSectionAdded,
    trackSubSectionAdded,
    trackPermissionsChanged,
    trackFieldsImported,
    trackFieldDragged,
    trackSaveClicked,
    trackCancelled,
  };
};
