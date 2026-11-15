import { expect, test } from '@playwright/test';
import { SUPPORT_MENU_IDS } from '../../src/components/layout/TopNavbar/components/SupportMenu/SupportMenu.testids';
import { ORG_CONTACTS } from '../../src/modals/ContactPermissionsModal/ContactPermissionsModal.constants';
import { CONTACT_PERMISSIONS_MODAL_IDS } from '../../src/modals/ContactPermissionsModal/ContactPermissionsModal.testids';

test.beforeEach(async ({ page }) => {
  await page.goto('/profile');
  await page.getByTestId(SUPPORT_MENU_IDS.trigger).click();
  await page.getByTestId(SUPPORT_MENU_IDS.permissionsOption).click();
  await page.waitForSelector(`[data-testid="${CONTACT_PERMISSIONS_MODAL_IDS.root}"]`);
});

test('lists every organization with a chat action', async ({ page }) => {
  for (const org of ORG_CONTACTS) {
    await expect(page.getByTestId(CONTACT_PERMISSIONS_MODAL_IDS.orgRow(org.id))).toBeVisible();
    await expect(page.getByTestId(CONTACT_PERMISSIONS_MODAL_IDS.chatButton(org.id))).toBeVisible();
  }
});

test('chat button for an org is clickable', async ({ page }) => {
  const [firstOrg] = ORG_CONTACTS;
  await page.getByTestId(CONTACT_PERMISSIONS_MODAL_IDS.chatButton(firstOrg.id)).click();
  await expect(page.getByTestId(CONTACT_PERMISSIONS_MODAL_IDS.root)).toBeVisible();
});
