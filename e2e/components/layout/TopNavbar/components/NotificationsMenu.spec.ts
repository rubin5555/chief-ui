import { expect, test } from '@playwright/test';
import { NOTIFICATIONS } from '../../../../../src/components/layout/TopNavbar/components/NotificationsMenu/NotificationsMenu.constants';
import { NOTIFICATIONS_MENU_IDS } from '../../../../../src/components/layout/TopNavbar/components/NotificationsMenu/NotificationsMenu.testids';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector(`[data-testid="${NOTIFICATIONS_MENU_IDS.trigger}"]`);
});

test('opens the panel and lists notifications', async ({ page }) => {
  await page.getByTestId(NOTIFICATIONS_MENU_IDS.trigger).click();
  await expect(page.getByTestId(NOTIFICATIONS_MENU_IDS.panel)).toBeVisible();

  for (const notification of NOTIFICATIONS) {
    await expect(page.getByTestId(NOTIFICATIONS_MENU_IDS.item(notification.id))).toBeVisible();
  }
});

test('mark all as read is clickable', async ({ page }) => {
  await page.getByTestId(NOTIFICATIONS_MENU_IDS.trigger).click();
  await page.getByTestId(NOTIFICATIONS_MENU_IDS.markAllRead).click();
  await expect(page.getByTestId(NOTIFICATIONS_MENU_IDS.panel)).toBeVisible();
});
