import { expect, test } from '@playwright/test';
import { DOC_HEADER_CARD_IDS } from '../../../../src/pages/document/components/DocHeaderCard/DocHeaderCard.testids';
import { EDITABLE_SECTION_BODY_IDS } from '../../../../src/pages/document/components/EditableSectionBody/EditableSectionBody.testids';
import { EDIT_DOC_DETAILS_MODAL_IDS } from '../../../../src/pages/document/components/EditDocDetailsModal/EditDocDetailsModal.testids';
import { FILTER_PANEL_IDS } from '../../../../src/pages/document/components/FilterPanel/FilterPanel.testids';
import { IMPORT_DOC_MODAL_IDS } from '../../../../src/pages/document/components/ImportDocModal/ImportDocModal.testids';
import { RESTORE_MODAL_IDS } from '../../../../src/pages/document/components/RestoreModal/RestoreModal.testids';
import { SECTION_MENU_IDS } from '../../../../src/pages/document/components/SectionMenu/SectionMenu.testids';

test('editing document details updates the header, with a dirty warning', async ({ page }) => {
  await page.goto('/document/d1');

  await page.locator('button[aria-label="עריכת פרטי מסמך"]').click();
  await expect(page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.root)).toBeVisible();
  await expect(page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.dirtyWarning)).not.toBeVisible();

  await page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.nameInput).fill('נוהל בטיחות מעודכן');
  await expect(page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.dirtyWarning)).toBeVisible();

  await page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.submitBtn).click();
  await expect(page.getByTestId(DOC_HEADER_CARD_IDS.title)).toHaveText('נוהל בטיחות מעודכן');
});

test('importing sections from another document adds them to the tree', async ({ page }) => {
  await page.goto('/document/d1');

  await page.getByText('ייבוא סעיפים').click();
  await expect(page.getByTestId(IMPORT_DOC_MODAL_IDS.root)).toBeVisible();

  await page.getByTestId(IMPORT_DOC_MODAL_IDS.docRow('id1')).click();
  await page.getByTestId(IMPORT_DOC_MODAL_IDS.sectionCheckbox('מטרת הנוהל')).click();
  await page.getByTestId(IMPORT_DOC_MODAL_IDS.importBtn).click();

  await expect(page.getByTestId(IMPORT_DOC_MODAL_IDS.root)).not.toBeVisible();
  await expect(page.getByRole('heading', { name: 'מטרת הנוהל' })).toBeVisible();
});

test('deleting a section trashes it, and restoring brings it back', async ({ page }) => {
  await page.goto('/document/d1');

  const sectionBody = page.getByTestId(EDITABLE_SECTION_BODY_IDS.root('s1-1'));
  await expect(sectionBody).toBeVisible();

  await page.getByTestId(SECTION_MENU_IDS.trigger('s1-1')).click();
  await page.getByTestId(SECTION_MENU_IDS.deleteAction).click();
  await expect(sectionBody).toHaveCount(0);

  await page.getByText(/שחזור סעיפים/).click();
  await expect(page.getByTestId(RESTORE_MODAL_IDS.root)).toBeVisible();
  await expect(page.getByTestId(RESTORE_MODAL_IDS.emptyState)).not.toBeVisible();

  await page.getByTestId(RESTORE_MODAL_IDS.checkbox('s1-1')).click();
  await page.getByTestId(RESTORE_MODAL_IDS.restoreBtn).click();

  await expect(page.getByTestId(RESTORE_MODAL_IDS.root)).not.toBeVisible();
  await expect(sectionBody).toBeVisible();
});

test('status filter hides sections that do not match the selected status', async ({ page }) => {
  await page.goto('/document/d1');

  // s1-1 is seeded 'approved' (DOCUMENT_SECTION_META in src/api/docs.ts), so
  // filtering to 'pending' — a status no section under s1 carries — should
  // hide it without clearing the filter.
  await page.getByTestId(FILTER_PANEL_IDS.trigger).click();
  await expect(page.getByTestId(FILTER_PANEL_IDS.panel)).toBeVisible();

  await page.getByTestId(FILTER_PANEL_IDS.option('pending')).click();
  await expect(page).toHaveURL(/statuses=pending/);
  await expect(page.getByTestId(EDITABLE_SECTION_BODY_IDS.root('s1-1'))).toHaveCount(0);

  // The panel stays open after checking an option (it's a multi-select, not
  // a single-pick dropdown), so the clear button is already visible here.
  await page.getByTestId(FILTER_PANEL_IDS.clearBtn).click();
  await expect(page).not.toHaveURL(/statuses=pending/);
  await expect(page.getByTestId(EDITABLE_SECTION_BODY_IDS.root('s1-1'))).toBeVisible();
});
