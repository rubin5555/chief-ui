import { expect, test } from '@playwright/test';
import { TAB_CARD_IDS } from '../../src/components/ui/TabCard/TabCard.testids';
import { IMPORT_TABS } from '../../src/modals/MailingListModal/MailingListModal.constants';
import { NEW_LIST_IDS } from '../../src/modals/MailingListModal/MailingListModal.testids';

const PLACEHOLDER_TEXT = 'בחר מקור ייבוא או חפש לפי שם';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByTestId(TAB_CARD_IDS.card('רשימות תפוצה')).click();
  await page.getByRole('button', { name: '+ רשימה חדשה' }).click();
  await page.waitForSelector(`[data-testid="${NEW_LIST_IDS.root}"]`);
});

test('opens with the form and tab bar visible', async ({ page }) => {
  await expect(page.getByTestId(NEW_LIST_IDS.root)).toBeVisible();
  await expect(page.getByTestId(NEW_LIST_IDS.nameInput)).toBeVisible();
  await expect(page.getByTestId(NEW_LIST_IDS.tabBar)).toBeVisible();
  await expect(page.getByTestId(NEW_LIST_IDS.membersPanel)).toBeVisible();
});

test('every import tab is reachable', async ({ page }) => {
  const tabBar = page.getByTestId(NEW_LIST_IDS.tabBar);
  const tabContent = page.getByTestId(NEW_LIST_IDS.tabContent);

  for (const { label } of IMPORT_TABS) {
    await tabBar.getByText(label).click();
    await expect(tabContent).not.toContainText(PLACEHOLDER_TEXT);
  }
});

test('closes on the cancel button', async ({ page }) => {
  await page.getByTestId(NEW_LIST_IDS.cancelBtn).click();
  await expect(page.getByTestId(NEW_LIST_IDS.root)).not.toBeVisible();
});
