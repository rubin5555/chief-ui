// matomo.adapter.ts
import type { AnalyticsTracker } from './analytics.interface';

export const MatomoAdapter: AnalyticsTracker = {
  trackEvent: ({ category, action, label, value }) => {
    if (typeof window !== 'undefined' && window._paq) {
      window._paq.push(['trackEvent', category, action, label, value]);
    } else {
      console.log(`[Matomo Log]: ${category} - ${action}`); // Fallback for local dev
    }
  },
  trackPageView: (url) => {
    if (typeof window !== 'undefined' && window._paq) {
      window._paq.push(['setCustomUrl', url]);
      window._paq.push(['trackPageView']);
    }
  },
};
