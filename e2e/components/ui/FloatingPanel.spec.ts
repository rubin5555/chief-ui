import { expect, test } from '@playwright/test';
import { SUPPORT_MENU_IDS } from '../../../src/components/layout/TopNavbar/components/SupportMenu/SupportMenu.testids';

const openPanel = async (page: import('@playwright/test').Page) => {
  await page.goto('/');
  await page.getByTestId(SUPPORT_MENU_IDS.trigger).click();
  const panel = page.getByTestId(SUPPORT_MENU_IDS.panel);
  await expect(panel).toBeVisible();
  return panel;
};

test('a panel unfolds rather than appearing all at once', async ({ page }) => {
  const panel = await openPanel(page);

  const name = await panel.evaluate((el) => getComputedStyle(el).animationName);
  expect(name).not.toBe('none');
});

test('a reader who asked for less motion gets none of it', async ({ page }) => {
  // Every motion helper in src/styles/animations.ts carries this guard, and a
  // floating panel is the one every dropdown, menu and popover in the app goes
  // through — so this is the cheapest place to catch the guard being dropped.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const panel = await openPanel(page);

  const name = await panel.evaluate((el) => getComputedStyle(el).animationName);
  expect(name).toBe('none');
});
