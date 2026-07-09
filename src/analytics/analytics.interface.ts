export interface EventPayload {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

export interface AnalyticsTracker {
  trackEvent: (payload: EventPayload) => void;
  trackPageView: (url: string) => void;
}
