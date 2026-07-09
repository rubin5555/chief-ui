// matomo.adapter.ts
import type { AnalyticsTracker } from './analytics.interface';

export const MatomoAdapter: AnalyticsTracker = {
  trackEvent: ({ category, action, label, value }) => {
    if (typeof window !== 'undefined' && (window as any)._paq) {
      (window as any)._paq.push(['trackEvent', category, action, label, value]);
    } else {
      console.log(`[Matomo Log]: ${category} - ${action}`); // Fallback for local dev
    }
  },
  trackPageView: (url) => {
    if (typeof window !== 'undefined' && (window as any)._paq) {
      (window as any)._paq.push(['setCustomUrl', url]);
      (window as any)._paq.push(['trackPageView']);
    }
  },
};
