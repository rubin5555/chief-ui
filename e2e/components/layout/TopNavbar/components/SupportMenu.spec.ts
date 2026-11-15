import { expect, test } from '@playwright/test';
import { SUPPORT_MENU_IDS } from '../../../../../src/components/layout/TopNavbar/components/SupportMenu/SupportMenu.testids';
import { CONTACT_PERMISSIONS_MODAL_IDS } from '../../../../../src/modals/ContactPermissionsModal/ContactPermissionsModal.testids';

test.beforeEach(async ({ page }) => {
  await page.goto('/profile');
  await page.waitForSelector(`[data-testid="${SUPPORT_MENU_IDS.trigger}"]`);
});

test('opens the panel with permissions and chat options', async ({ page }) => {
  await page.getByTestId(SUPPORT_MENU_IDS.trigger).click();
  await expect(page.getByTestId(SUPPORT_MENU_IDS.panel)).toBeVisible();
  await expect(page.getByTestId(SUPPORT_MENU_IDS.permissionsOption)).toBeVisible();
  await expect(page.getByTestId(SUPPORT_MENU_IDS.chatOption)).toBeVisible();
});

test('permissions option opens the contact permissions modal and closes the panel', async ({
  page,
}) => {
  await page.getByTestId(SUPPORT_MENU_IDS.trigger).click();
  await page.getByTestId(SUPPORT_MENU_IDS.permissionsOption).click();

  await expect(page.getByTestId(CONTACT_PERMISSIONS_MODAL_IDS.root)).toBeVisible();
  await expect(page.getByTestId(SUPPORT_MENU_IDS.panel)).not.toBeVisible();
});
