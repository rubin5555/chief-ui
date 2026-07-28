import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'צ׳אט סעיף';

const ACTIONS = {
  PANEL_OPENED: 'פתיחת צ׳אט סעיף',
  MESSAGE_SENT: 'שליחת הודעה',
} as const;

export const useSectionChatAnalytics = () => {
  const trackPanelOpened = () => {
    analytics.trackEvent({ category: ANALYTICS_CATEGORY, action: ACTIONS.PANEL_OPENED });
  };

  // Whether the message carried a quote, never the message: comments are about a
  // specific document and are written by a named person.
  const trackMessageSent = (hasQuote: boolean) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.MESSAGE_SENT,
      label: hasQuote ? 'עם ציטוט' : 'ללא ציטוט',
    });
  };

  return { trackPanelOpened, trackMessageSent };
};
