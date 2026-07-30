import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'צ׳אט סעיף';

const ACTIONS = {
  PANEL_OPENED: 'פתיחת צ׳אט סעיף',
  MESSAGE_SENT: 'שליחת הודעה',
  QUOTE_MARKED: 'סימון ציטוט',
  QUOTE_JUMPED: 'מעבר לטקסט המצוטט',
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

  const trackQuoteMarked = () => {
    analytics.trackEvent({ category: ANALYTICS_CATEGORY, action: ACTIONS.QUOTE_MARKED });
  };

  // Whether the passage was still findable, which is the only interesting thing
  // about the jump — a rising miss rate would mean quotes are going stale.
  const trackQuoteJumped = (found: boolean) => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.QUOTE_JUMPED,
      label: found ? 'נמצא' : 'לא נמצא',
    });
  };

  return { trackPanelOpened, trackMessageSent, trackQuoteMarked, trackQuoteJumped };
};
