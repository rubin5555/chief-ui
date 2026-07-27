import { Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { IconButtonRoot } from '@/components/ui/IconButton';
import { useThemeToggleAnalytics } from './ThemeToggle.analytics';
import { THEME_STORAGE_KEY } from './ThemeToggle.constants';
import { THEME_TOGGLE_IDS } from './ThemeToggle.testids';

const getIsDark = () => {
  const explicit = document.documentElement.getAttribute('data-theme');
  if (explicit === 'dark') return true;
  if (explicit === 'light') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(getIsDark);
  const { trackThemeToggled } = useThemeToggleAnalytics();

  const onToggle = () => {
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(THEME_STORAGE_KEY, next);
    setIsDark(!isDark);
    trackThemeToggled(next);
  };

  return (
    <IconButtonRoot
      type="button"
      $isActive={false}
      aria-label={isDark ? 'עבור למצב בהיר' : 'עבור למצב כהה'}
      data-testid={THEME_TOGGLE_IDS.trigger}
      onClick={onToggle}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </IconButtonRoot>
  );
};
