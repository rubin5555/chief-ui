import { expect, test } from '@playwright/test';
import { TOP_NAVBAR_IDS } from '../../../src/components/layout/TopNavbar/TopNavbar.testids';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector(`[data-testid="${TOP_NAVBAR_IDS.root}"]`);
});

test('navbar screenshot', async ({ page }) => {
  await expect(page.getByTestId(TOP_NAVBAR_IDS.root)).toHaveScreenshot('navbar.png');
});

test('navbar slots are rendered', async ({ page }) => {
  await expect(page.getByTestId(TOP_NAVBAR_IDS.start)).toBeVisible();
  await expect(page.getByTestId(TOP_NAVBAR_IDS.end)).toBeVisible();
});
