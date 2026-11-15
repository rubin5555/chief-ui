import { expect, test } from '@playwright/test';
import { EDIT_DOC_DETAILS_MODAL_IDS } from '../../../../src/modals/EditDocDetailsModal/EditDocDetailsModal.testids';
import { CATALOG_MODAL_IDS } from '../../../../src/pages/catalog/components/DocumentCatalog/components/catalogModals.testids';
import { DOCUMENT_CATALOG_IDS } from '../../../../src/pages/catalog/components/DocumentCatalog/DocumentCatalog.testids';

const A_DEPARTMENT = 'מחלקת משאבי אנוש';
const DRAFTS_URL = `/catalog?dept=${encodeURIComponent(A_DEPARTMENT)}&tab=drafts`;

test.beforeEach(async ({ page }) => {
  await page.goto(DRAFTS_URL);
  await expect(page.getByTestId(DOCUMENT_CATALOG_IDS.newDocBtn)).toBeVisible();
});

test('a new document opens the details dialog with its facts editable', async ({ page }) => {
  await page.getByTestId(DOCUMENT_CATALOG_IDS.newDocBtn).click();
  await page.getByTestId(DOCUMENT_CATALOG_IDS.newDocOption).click();

  const dialog = page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.root);
  await expect(dialog).toBeVisible();

  // The five facts are editable here and read-only in every other mode.
  await expect(page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.identityGrid)).toBeVisible();
  await expect(page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.factsGrid)).toBeHidden();
  await expect(page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.displayNameInput)).toBeVisible();
  await expect(page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.summaryInput)).toBeVisible();
});

test('the classification tag only appears for the levels that carry one', async ({ page }) => {
  await page.getByTestId(DOCUMENT_CATALOG_IDS.newDocBtn).click();
  await page.getByTestId(DOCUMENT_CATALOG_IDS.newDocOption).click();

  const tag = page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.classificationTagSelect);
  await expect(tag).toBeHidden();

  await page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.classificationSelect).click();
  await page.getByRole('option', { name: 'סודי ביותר', exact: true }).click();

  await expect(tag).toBeVisible();
});

test('duplicating seeds the same dialog from the document that was picked', async ({ page }) => {
  await page.getByTestId(DOCUMENT_CATALOG_IDS.newDocBtn).click();
  await page.getByTestId(DOCUMENT_CATALOG_IDS.duplicateDocOption).click();

  const picker = page.getByTestId(CATALOG_MODAL_IDS.duplicateSearch);
  await expect(picker).toBeVisible();

  await page.getByTestId(CATALOG_MODAL_IDS.duplicateSearchRow('r1')).click();

  await expect(picker).toBeHidden();
  await expect(page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.nameInput)).toHaveValue(
    'פקודת בטיחות מרחב א׳',
  );
});

test('the picker searches the distributed and archive shelves', async ({ page }) => {
  await page.getByTestId(DOCUMENT_CATALOG_IDS.newDocBtn).click();
  await page.getByTestId(DOCUMENT_CATALOG_IDS.duplicateDocOption).click();

  await page.getByTestId(CATALOG_MODAL_IDS.duplicateSearchInput).fill('לאלאלאלא');
  await expect(page.getByText('לא נמצאו מסמכים')).toBeVisible();
});

test('creating a document confirms and the confirmation dismisses', async ({ page }) => {
  await page.getByTestId(DOCUMENT_CATALOG_IDS.newDocBtn).click();
  await page.getByTestId(DOCUMENT_CATALOG_IDS.newDocOption).click();

  await page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.nameInput).fill('פקודה חדשה');
  await page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.submitBtn).click();

  const toast = page.getByTestId(CATALOG_MODAL_IDS.docCreatedToast);
  await expect(toast).toBeVisible();

  await toast.getByRole('button', { name: 'סגירה' }).click();
  await expect(toast).toBeHidden();
});
