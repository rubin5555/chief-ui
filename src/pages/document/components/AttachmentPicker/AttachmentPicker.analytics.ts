import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'קבצים מצורפים';

const ACTIONS = {
  FILES_ATTACHED: 'צירוף קבצים',
  FILE_REMOVED: 'מחיקת קובץ מצורף',
} as const;

export const useAttachmentPickerAnalytics = () => {
  const trackFilesAttached = (count: number) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.FILES_ATTACHED,
      label: `${count} קבצים`,
    });
  };

  const trackFileRemoved = () => {
    analytics.trackEvent({ category: ANALYTICS_CATEGORY, action: ACTIONS.FILE_REMOVED });
  };

  return { trackFilesAttached, trackFileRemoved };
};
