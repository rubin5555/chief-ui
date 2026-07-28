import { expect, test } from '@playwright/test';
import { TAB_CARD_IDS } from '../../src/components/ui/TabCard/TabCard.testids';
import { IMPORT_TABS } from '../../src/modals/MailingListFormModal/MailingListFormModal.constants';
import { MAILING_LIST_FORM_IDS } from '../../src/modals/MailingListFormModal/MailingListFormModal.testids';

const PLACEHOLDER_TEXT = 'בחר מקור ייבוא או חפש לפי שם';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByTestId(TAB_CARD_IDS.card('רשימות תפוצה')).click();
  await page.getByRole('button', { name: '+ רשימה חדשה' }).click();
  await page.waitForSelector(`[data-testid="${MAILING_LIST_FORM_IDS.root}"]`);
});

test('opens with the form and tab bar visible', async ({ page }) => {
  await expect(page.getByTestId(MAILING_LIST_FORM_IDS.root)).toBeVisible();
  await expect(page.getByTestId(MAILING_LIST_FORM_IDS.nameInput)).toBeVisible();
  await expect(page.getByTestId(MAILING_LIST_FORM_IDS.tabBar)).toBeVisible();
  await expect(page.getByTestId(MAILING_LIST_FORM_IDS.membersPanel)).toBeVisible();
});

test('every import tab is reachable', async ({ page }) => {
  const tabBar = page.getByTestId(MAILING_LIST_FORM_IDS.tabBar);
  const tabContent = page.getByTestId(MAILING_LIST_FORM_IDS.tabContent);

  for (const { label } of IMPORT_TABS) {
    await tabBar.getByText(label).click();
    await expect(tabContent).not.toContainText(PLACEHOLDER_TEXT);
  }
});

test('closes on the cancel button', async ({ page }) => {
  await page.getByTestId(MAILING_LIST_FORM_IDS.cancelBtn).click();
  await expect(page.getByTestId(MAILING_LIST_FORM_IDS.root)).not.toBeVisible();
});
