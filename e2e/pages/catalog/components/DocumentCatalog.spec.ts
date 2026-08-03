import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { DOC_PERMISSIONS_MODAL_IDS } from '../../../../src/modals/DocPermissionsModal/DocPermissionsModal.testids';
import { CATALOG_MODAL_IDS } from '../../../../src/pages/catalog/components/DocumentCatalog/components/catalogModals.testids';
import { DOCUMENT_CATALOG_IDS } from '../../../../src/pages/catalog/components/DocumentCatalog/DocumentCatalog.testids';
import { TRASH_CATALOG_IDS } from '../../../../src/pages/catalog/components/TrashCatalog/TrashCatalog.constants';

const A_DEPARTMENT = 'מחלקת משאבי אנוש';
const CATALOG_URL = `/catalog?dept=${encodeURIComponent(A_DEPARTMENT)}`;

// A distributed document that has children, so the expand chevron is drawn.
const PARENT_DOC = 'r1';
// A distribution-shelf document with both a receipt count and new viewers.
const DISTRIBUTION_DOC = 'p1';

const gotoShelf = async (page: Page, tab: string) => {
  await page.goto(`${CATALOG_URL}&tab=${tab}`);
  await expect(page.getByTestId(DOCUMENT_CATALOG_IDS.table)).toBeVisible();
};

test.beforeEach(async ({ page }) => {
  await page.goto(CATALOG_URL);
  await expect(page.getByTestId(DOCUMENT_CATALOG_IDS.table)).toBeVisible();
});

test('the distributed shelf is the one that opens', async ({ page }) => {
  await expect(page.getByTestId(DOCUMENT_CATALOG_IDS.rowMenu(PARENT_DOC))).toBeAttached();
});

test('switching shelf changes the table and the URL', async ({ page }) => {
  await page.getByTestId(DOCUMENT_CATALOG_IDS.tab('drafts')).click();

  await expect(page).toHaveURL(/tab=drafts/);
  // The trash button and the new-document split button only exist on drafts.
  await expect(page.getByTestId(DOCUMENT_CATALOG_IDS.trashBtn)).toBeVisible();
  await expect(page.getByTestId(DOCUMENT_CATALOG_IDS.newDocBtn)).toBeVisible();
});

test('the distribution shelf adds its sub-tabs', async ({ page }) => {
  await gotoShelf(page, 'distribution');
  await expect(page.getByTestId(DOCUMENT_CATALOG_IDS.distSubTab('הופצו'))).toBeVisible();
});

test('search narrows the table and survives a reload', async ({ page }) => {
  await page.getByTestId(DOCUMENT_CATALOG_IDS.search).fill('בטיחות');

  await expect(page).toHaveURL(/q=/);
  await page.reload();
  await expect(page.getByTestId(DOCUMENT_CATALOG_IDS.search)).toHaveValue('בטיחות');
});

test('a search that matches nothing shows the empty row', async ({ page }) => {
  await page.getByTestId(DOCUMENT_CATALOG_IDS.search).fill('לאלאלאלא');
  await expect(page.getByTestId(DOCUMENT_CATALOG_IDS.noDocs)).toBeVisible();
});

test('expanding a parent reveals its child documents', async ({ page }) => {
  await page.getByTestId(DOCUMENT_CATALOG_IDS.rowExpand(PARENT_DOC)).click();
  await expect(page.getByTestId(DOCUMENT_CATALOG_IDS.childRow('r1-a'))).toBeVisible();
});

test('the row menu opens and its entries match the shelf', async ({ page }) => {
  await page.getByTestId(DOCUMENT_CATALOG_IDS.rowMenu(PARENT_DOC)).click();

  await expect(page.getByRole('button', { name: 'ביטול מסמך' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'יצירת היררכית מסמכים' })).toBeVisible();
});

test('the row menu opens the permissions dialog for that row', async ({ page }) => {
  await page.getByTestId(DOCUMENT_CATALOG_IDS.rowMenu(PARENT_DOC)).click();
  await page.getByRole('button', { name: 'הרשאות ובקרה' }).click();

  // It used to read its document off `/document/$id`, which the catalog is not
  // matched against — so from here it rendered nothing at all.
  await expect(page.getByTestId(DOC_PERMISSIONS_MODAL_IDS.root)).toBeVisible();

  // The section tree is drawn from the document the dialog was opened for, so
  // reaching it proves the row's document actually loaded.
  await page.getByTestId(DOC_PERMISSIONS_MODAL_IDS.level('section-editors')).click();
  await expect(page.getByTestId(DOC_PERMISSIONS_MODAL_IDS.sectionTree)).toBeVisible();
});

test('the clock opens version history', async ({ page }) => {
  await page.getByTestId(DOCUMENT_CATALOG_IDS.rowHistory(PARENT_DOC)).click();
  await expect(page.getByTestId(CATALOG_MODAL_IDS.history)).toBeVisible();
});

test('a receipt count opens the per-חמ״ל breakdown', async ({ page }) => {
  await gotoShelf(page, 'distribution');
  await page.getByTestId(DOCUMENT_CATALOG_IDS.rowReceipt(DISTRIBUTION_DOC)).click();
  await expect(page.getByTestId(CATALOG_MODAL_IDS.receipts)).toBeVisible();
});

test('the hierarchy dialog refuses to save until a main document is picked', async ({ page }) => {
  await page.getByTestId(DOCUMENT_CATALOG_IDS.rowMenu(PARENT_DOC)).click();
  await page.getByRole('button', { name: 'יצירת היררכית מסמכים' }).click();

  const dialog = page.getByTestId(CATALOG_MODAL_IDS.hierarchy);
  await expect(dialog).toBeVisible();

  // Saving is fine while this document is the main one — it just has no
  // companions yet. Switching sides leaves nothing chosen, so it is not.
  await expect(dialog.getByRole('button', { name: 'שמור' })).toBeEnabled();
  await page.getByTestId(CATALOG_MODAL_IDS.hierarchyMode('companion')).click();
  await expect(dialog.getByRole('button', { name: 'שמור' })).toBeDisabled();
});

test('the recycle bin opens from drafts and comes back', async ({ page }) => {
  await gotoShelf(page, 'drafts');

  await page.getByTestId(DOCUMENT_CATALOG_IDS.trashBtn).click();
  await expect(page.getByTestId(TRASH_CATALOG_IDS.root)).toBeVisible();
  await expect(page).toHaveURL(/trash=true/);

  await page.getByTestId(TRASH_CATALOG_IDS.back).click();
  await expect(page.getByTestId(DOCUMENT_CATALOG_IDS.root)).toBeVisible();
});
