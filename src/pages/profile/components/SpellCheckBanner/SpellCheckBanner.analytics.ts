import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'באנר בדיקת איות';

const ACTIONS = {
  INSTALL_CLICKED: 'לחיצה על התקנת בדיקת איות',
} as const;

export const useSpellCheckBannerAnalytics = () => {
  const trackInstallClicked = () => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.INSTALL_CLICKED,
    });
  };

  return {
    trackInstallClicked,
  };
};
