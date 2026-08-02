import { expect, test } from '@playwright/test';
import { PROFILE_SIDEBAR_IDS } from '../../../../src/pages/profile/components/ProfileSidebar/ProfileSidebar.testids';

test.beforeEach(async ({ page }) => {
  await page.goto('/profile');
  await page.waitForSelector(`[data-testid="${PROFILE_SIDEBAR_IDS.root}"]`);
});

test('sidebar renders user info', async ({ page }) => {
  await expect(page.getByTestId(PROFILE_SIDEBAR_IDS.userInfo)).toBeVisible();
});

test('permissions section screenshot', async ({ page }) => {
  await expect(page.getByTestId(PROFILE_SIDEBAR_IDS.permissions)).toHaveScreenshot(
    'permissions-section.png',
  );
});

test('departments section screenshot', async ({ page }) => {
  await expect(page.getByTestId(PROFILE_SIDEBAR_IDS.departments)).toHaveScreenshot(
    'departments-section.png',
  );
});

test('env section screenshot', async ({ page }) => {
  await expect(page.getByTestId(PROFILE_SIDEBAR_IDS.env)).toHaveScreenshot('env-section.png');
});
