import { fileURLToPath } from 'node:url';
import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { DOC_ACTION_TOOLBAR_IDS } from '../../../../src/components/layout/TopNavbar/components/DocActionToolbar/DocActionToolbar.testids';
import { PEOPLE_PICKER_IDS } from '../../../../src/components/PeoplePicker/PeoplePicker.testids';
import { EXCEL_TAB_IDS } from '../../../../src/components/PeoplePicker/tabs/ExcelTab/ExcelTab.testids';
import { DOC_PERMISSIONS_MODAL_IDS } from '../../../../src/pages/document/components/DocPermissionsModal/DocPermissionsModal.testids';

const SHEET_FIXTURE = fileURLToPath(
  new URL('../../../fixtures/personal-numbers.xlsx', import.meta.url),
);

const openPermissions = async (page: Page) => {
  await page.goto('/document/d1');
  await page.getByTestId(DOC_ACTION_TOOLBAR_IDS.permissions).click();
  await expect(page.getByTestId(DOC_PERMISSIONS_MODAL_IDS.root)).toBeVisible();
};

/** Picks someone out of the network directory, which is where a search lands. */
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

  // And back: leaving a permission doesn't empty it.
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

  // Open the first topic and select the first section under it.
  await page.getByTestId(DOC_PERMISSIONS_MODAL_IDS.subjectRow('s1')).click();
  const section = page.getByTestId(DOC_PERMISSIONS_MODAL_IDS.sectionRow('s1-1'));
  await section.click();
  await expect(section).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByTestId(DOC_PERMISSIONS_MODAL_IDS.clearSections)).toContainText('1 נבחרו');

  await addFromNetwork(page, 'שרה לוי');

  // The section now counts one, and unfolding it names her.
  const count = page.getByTestId(DOC_PERMISSIONS_MODAL_IDS.sectionMemberCount('s1-1'));
  await expect(count).toHaveText('1');
  await count.click();
  await expect(page.getByTestId(DOC_PERMISSIONS_MODAL_IDS.sectionTree)).toContainText('שרה לוי');
});

test('picking with no section selected says so instead of granting nothing', async ({ page }) => {
  await openPermissions(page);
  await page.getByTestId(DOC_PERMISSIONS_MODAL_IDS.level('section-editors')).click();

  await addFromNetwork(page, 'שרה לוי');

  // main drops these into a list the section tree cannot show, which reads as the
  // pick having been ignored. They are counted and named instead.
  await expect(page.getByTestId(DOC_PERMISSIONS_MODAL_IDS.unassigned)).toContainText('1 נבחרו');
});

test('the Excel source is offered here too, with its file picker and no search box', async ({
  page,
}) => {
  await openPermissions(page);

  await page.getByTestId(PEOPLE_PICKER_IDS.tabBar).getByText('Excel').click();

  await expect(page.getByTestId(EXCEL_TAB_IDS.uploadBtn)).toBeVisible();
  await expect(page.getByTestId(EXCEL_TAB_IDS.hint)).toContainText('עמודה A בלבד');
  // Nothing to search in a file that hasn't been handed over, so the row that
  // every other tab fills is out of the way rather than standing empty.
  await expect(page.getByTestId(PEOPLE_PICKER_IDS.searchBar)).toBeHidden();
});

test('uploading a sheet lists who was found, what failed, and grants only what is ticked', async ({
  page,
}) => {
  await openPermissions(page);
  await page.getByTestId(PEOPLE_PICKER_IDS.tabBar).getByText('Excel').click();

  // A real .xlsx, read in the browser — see e2e/fixtures/make-personal-numbers-xlsx.mjs
  // for what is in column A and why.
  await page.getByTestId(EXCEL_TAB_IDS.fileInput).setInputFiles(SHEET_FIXTURE);
  await expect(page.getByTestId(EXCEL_TAB_IDS.hint)).toHaveText('personal-numbers.xlsx');

  // Two lists: the people the numbers resolved to, and the cells that resolved
  // to nobody — the second is why the upload doesn't just import itself.
  await expect(page.getByTestId(EXCEL_TAB_IDS.foundList)).toContainText('אבי כהן');
  const failed = page.getByTestId(EXCEL_TAB_IDS.failedList);
  await expect(failed).toContainText('לא נמצא במערכת');
  await expect(failed).toContainText('מספר אישי לא תקין');

  // Everyone found arrives ticked, so unticking is what takes someone out.
  await page.getByTestId(EXCEL_TAB_IDS.foundRow('012345678')).click();
  await page.getByTestId(EXCEL_TAB_IDS.importBtn).click();

  const members = page.getByTestId(PEOPLE_PICKER_IDS.membersPanel);
  await expect(members).toContainText('שרה לוי');
  await expect(members).not.toContainText('אבי כהן');
});
