import { expect, test } from '@playwright/test';
import { IMPORT_TABS } from '../../src/components/PeoplePicker/PeoplePicker.constants';
import { PEOPLE_PICKER_IDS } from '../../src/components/PeoplePicker/PeoplePicker.testids';
import { EXCEL_TAB_IDS } from '../../src/components/PeoplePicker/tabs/ExcelTab/ExcelTab.testids';
import { TAB_CARD_IDS } from '../../src/components/ui/TabCard/TabCard.testids';
import { MAILING_LIST_FORM_IDS } from '../../src/modals/MailingListFormModal/MailingListFormModal.testids';

const PLACEHOLDER_TEXT = 'בחר מקור ייבוא או חפש לפי שם';

test.beforeEach(async ({ page }) => {
  await page.goto('/profile');
  await page.getByTestId(TAB_CARD_IDS.card('רשימות תפוצה')).click();
  await page.getByRole('button', { name: '+ רשימה חדשה' }).click();
  await page.waitForSelector(`[data-testid="${MAILING_LIST_FORM_IDS.root}"]`);
});

test('opens with the form and tab bar visible', async ({ page }) => {
  await expect(page.getByTestId(MAILING_LIST_FORM_IDS.root)).toBeVisible();
  await expect(page.getByTestId(MAILING_LIST_FORM_IDS.nameInput)).toBeVisible();
  await expect(page.getByTestId(PEOPLE_PICKER_IDS.tabBar)).toBeVisible();
  await expect(page.getByTestId(PEOPLE_PICKER_IDS.membersPanel)).toBeVisible();
});

test('every import tab is reachable', async ({ page }) => {
  const tabBar = page.getByTestId(PEOPLE_PICKER_IDS.tabBar);
  const tabContent = page.getByTestId(PEOPLE_PICKER_IDS.tabContent);

  for (const { label } of IMPORT_TABS) {
    await tabBar.getByText(label).click();
    await expect(tabContent).not.toContainText(PLACEHOLDER_TEXT);
  }
});

test('closes on the cancel button', async ({ page }) => {
  await page.getByTestId(MAILING_LIST_FORM_IDS.cancelBtn).click();
  await expect(page.getByTestId(MAILING_LIST_FORM_IDS.root)).not.toBeVisible();
});

test('the Excel source is the same one the permissions dialog offers', async ({ page }) => {
  await page.getByTestId(PEOPLE_PICKER_IDS.tabBar).getByText('Excel').click();

  await expect(page.getByTestId(EXCEL_TAB_IDS.uploadBtn)).toContainText('ייבוא מאקסל');
  await expect(page.getByTestId(EXCEL_TAB_IDS.hint)).toContainText('עמודה A בלבד');
});
