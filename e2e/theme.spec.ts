import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { THEME_STORAGE_KEY } from '../src/components/layout/TopNavbar/components/ThemeToggle/ThemeToggle.constants';

// What the browser paints its own widgets with — checkboxes, text fields,
// selects, scrollbars. It has to follow the theme the app is actually showing,
// not the one the machine happens to prefer.
const paintedScheme = (page: Page) =>
  page.evaluate(() => getComputedStyle(document.documentElement).colorScheme);

const openWithTheme = async (page: Page, theme: 'light' | 'dark') => {
  // Seeded before the page loads, the way the toggle leaves it — index.html
  // reads it back and stamps `data-theme` before the first paint.
  await page.addInitScript(([key, value]) => localStorage.setItem(key, value), [
    THEME_STORAGE_KEY,
    theme,
  ] as const);
  await page.goto('/catalog');
};

test.describe('on a machine set to dark', () => {
  test.use({ colorScheme: 'dark' });

  test('switching the app to light paints native controls light too', async ({ page }) => {
    await openWithTheme(page, 'light');

    // The bug this covers: `color-scheme: light dark` left the choice to the
    // machine, so a dark checkbox sat on a white filter panel.
    expect(await paintedScheme(page)).toBe('light');
  });

  test('leaving the app on the machine default paints them dark', async ({ page }) => {
    await page.goto('/catalog');
    expect(await paintedScheme(page)).toBe('dark');
  });
});

test.describe('on a machine set to light', () => {
  test.use({ colorScheme: 'light' });

  test('switching the app to dark paints native controls dark too', async ({ page }) => {
    await openWithTheme(page, 'dark');
    expect(await paintedScheme(page)).toBe('dark');
  });

  test('leaving the app on the machine default paints them light', async ({ page }) => {
    await page.goto('/catalog');
    expect(await paintedScheme(page)).toBe('light');
  });
});
