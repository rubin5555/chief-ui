import { analytics } from '@/analytics';

const ANALYTICS_CATEGORY = 'תפריט ניווט ראשי';

const ACTIONS = {
  THEME_CHANGED: 'שינוי מצב תצוגה',
} as const;

export const useThemeToggleAnalytics = () => {
  const trackThemeToggled = (theme: 'light' | 'dark') => {
    analytics.trackEvent({
      category: ANALYTICS_CATEGORY,
      action: ACTIONS.THEME_CHANGED,
      label: theme === 'dark' ? 'מצב כהה' : 'מצב בהיר',
    });
  };

  return { trackThemeToggled };
};
