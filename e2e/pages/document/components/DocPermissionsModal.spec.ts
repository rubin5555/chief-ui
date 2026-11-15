import { fileURLToPath } from 'node:url';
import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { DOC_ACTION_TOOLBAR_IDS } from '../../../../src/components/layout/TopNavbar/components/DocActionToolbar/DocActionToolbar.testids';
import { PEOPLE_PICKER_IDS } from '../../../../src/components/PeoplePicker/PeoplePicker.testids';
import { EXCEL_TAB_IDS } from '../../../../src/components/PeoplePicker/tabs/ExcelTab/ExcelTab.testids';
import { DOC_PERMISSIONS_MODAL_IDS } from '../../../../src/modals/DocPermissionsModal/DocPermissionsModal.testids';

const SHEET_FIXTURE = fileURLToPath(
  new URL('../../../fixtures/personal-numbers.xlsx', import.meta.url),
);

const openPermissions = async (page: Page) => {
  await page.goto('/document/d1');
  await page.getByTestId(DOC_ACTION_TOOLBAR_IDS.permissions).click();
  await expect(page.getByTestId(DOC_PERMISSIONS_MODAL_IDS.root)).toBeVisible();
};

const addFromNetwork = async (page: Page, name: string) => {
  await page.getByTestId(PEOPLE_PICKER_IDS.searchBar).getByRole('textbox').fill(name);
  await page.getByRole('button', { name: new RegExp(name) }).click();
};

test('opens on the first permission, with its wording and its sources', async ({ page }) => {
  await openPermissions(page);

  await expect(page.getByTestId(DOC_PERMISSIONS_MODAL_IDS.description)).toContainText(
    'יוכלו לצפות בתוכן הפקודה לאחר הפצתה',
  );
  await expect(page.getByTestId(PEOPLE_PICKER_IDS.sourcesPanel)).toBeVisible();
  await expect(page.getByTestId(PEOPLE_PICKER_IDS.membersPanel)).toBeVisible();
});

test('each permission states what it grants', async ({ page }) => {
  await openPermissions(page);

  await page.getByTestId(DOC_PERMISSIONS_MODAL_IDS.level('manage')).click();
  await expect(page.getByTestId(DOC_PERMISSIONS_MODAL_IDS.description)).toContainText(
    'לנהל את הפקודה כמו ״בעל פקודה״',
  );
});

test('a person granted one permission is not granted the others', async ({ page }) => {
  await openPermissions(page);

  await addFromNetwork(page, 'אבי כהן');
  const members = page.getByTestId(PEOPLE_PICKER_IDS.membersPanel);
  await expect(members).toContainText('אבי כהן');

  await page.getByTestId(DOC_PERMISSIONS_MODAL_IDS.level('manage')).click();
  await expect(members).not.toContainText('אבי כהן');

  await page.getByTestId(DOC_PERMISSIONS_MODAL_IDS.level('view-after')).click();
  await expect(members).toContainText('אבי כהן');
});

test('the section permissions swap the members list for the document sections', async ({
  page,
}) => {
  await openPermissions(page);

  await page.getByTestId(DOC_PERMISSIONS_MODAL_IDS.level('section-approvers')).click();

  const tree = page.getByTestId(DOC_PERMISSIONS_MODAL_IDS.sectionTree);
  await expect(tree).toBeVisible();
  await expect(page.getByTestId(PEOPLE_PICKER_IDS.membersPanel)).toBeHidden();
  await expect(tree).toContainText('בחר סעיפים לשיוך');
});

test('someone picked while a section is selected is granted it on that section', async ({
  page,
}) => {
  await openPermissions(page);
  await page.getByTestId(DOC_PERMISSIONS_MODAL_IDS.level('section-editors')).click();

  await page.getByTestId(DOC_PERMISSIONS_MODAL_IDS.subjectRow('s1')).click();
  const section = page.getByTestId(DOC_PERMISSIONS_MODAL_IDS.sectionRow('s1-1'));
  await section.click();
  await expect(section).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByTestId(DOC_PERMISSIONS_MODAL_IDS.clearSections)).toContainText('1 נבחרו');

  await addFromNetwork(page, 'שרה לוי');

  const count = page.getByTestId(DOC_PERMISSIONS_MODAL_IDS.sectionMemberCount('s1-1'));
  await expect(count).toHaveText('1');
  await count.click();
  await expect(page.getByTestId(DOC_PERMISSIONS_MODAL_IDS.sectionTree)).toContainText('שרה לוי');
});

test('picking with no section selected says so instead of granting nothing', async ({ page }) => {
  await openPermissions(page);
  await page.getByTestId(DOC_PERMISSIONS_MODAL_IDS.level('section-editors')).click();

  await addFromNetwork(page, 'שרה לוי');

  await expect(page.getByTestId(DOC_PERMISSIONS_MODAL_IDS.unassigned)).toContainText('1 נבחרו');
});

test('the Excel source is offered here too, with its file picker and no search box', async ({
  page,
}) => {
  await openPermissions(page);

  await page.getByTestId(PEOPLE_PICKER_IDS.tabBar).getByText('Excel').click();

  await expect(page.getByTestId(EXCEL_TAB_IDS.uploadBtn)).toBeVisible();
  await expect(page.getByTestId(EXCEL_TAB_IDS.hint)).toContainText('עמודה A בלבד');

  await expect(page.getByTestId(PEOPLE_PICKER_IDS.searchBar)).toBeHidden();
});

test('uploading a sheet lists who was found, what failed, and grants only what is ticked', async ({
  page,
}) => {
  await openPermissions(page);
  await page.getByTestId(PEOPLE_PICKER_IDS.tabBar).getByText('Excel').click();

  await page.getByTestId(EXCEL_TAB_IDS.fileInput).setInputFiles(SHEET_FIXTURE);
  await expect(page.getByTestId(EXCEL_TAB_IDS.hint)).toHaveText('personal-numbers.xlsx');

  await expect(page.getByTestId(EXCEL_TAB_IDS.foundList)).toContainText('אבי כהן');
  const failed = page.getByTestId(EXCEL_TAB_IDS.failedList);
  await expect(failed).toContainText('לא נמצא במערכת');
  await expect(failed).toContainText('מספר אישי לא תקין');

  await page.getByTestId(EXCEL_TAB_IDS.foundRow('012345678')).click();
  await page.getByTestId(EXCEL_TAB_IDS.importBtn).click();

  const members = page.getByTestId(PEOPLE_PICKER_IDS.membersPanel);
  await expect(members).toContainText('שרה לוי');
  await expect(members).not.toContainText('אבי כהן');
});

test('the network search asks the directory instead of sifting a copy of it', async ({ page }) => {
  await openPermissions(page);

  await page.getByTestId(PEOPLE_PICKER_IDS.searchBar).getByRole('textbox').fill('אבי');

  await expect(page.getByText('מחפש...')).toBeVisible();
  await expect(page.getByRole('button', { name: /אבי כהן/ })).toBeVisible();
});

test('the search results are mounted outside the column that clips its overflow', async ({
  page,
}) => {
  await openPermissions(page);

  await page.getByTestId(PEOPLE_PICKER_IDS.searchBar).getByRole('textbox').fill('אבי');
  const result = page.getByRole('button', { name: /אבי כהן/ });
  await expect(result).toBeVisible();

  const clipped = await result.evaluate(
    (element, id) => Boolean(element.closest(`[data-testid="${id}"]`)),
    PEOPLE_PICKER_IDS.sourcesPanel,
  );
  expect(clipped).toBe(false);
});
