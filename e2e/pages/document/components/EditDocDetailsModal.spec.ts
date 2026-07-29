import { expect, test } from '@playwright/test';
import { DOC_ACTION_TOOLBAR_IDS } from '../../../../src/components/layout/TopNavbar/components/DocActionToolbar/DocActionToolbar.testids';
import { SELECT_IDS } from '../../../../src/components/ui/Select/Select.testids';
import { APPROVAL_DETAILS_MODAL_IDS } from '../../../../src/pages/document/components/ApprovalDetailsModal/ApprovalDetailsModal.testids';
import { STATUS_FLOW_NAV_IDS } from '../../../../src/pages/document/components/ApprovalWorkflow/components/StatusFlowNav/StatusFlowNav.testids';
import { DOCUMENT_METADATA_PILL_IDS } from '../../../../src/pages/document/components/DocumentMetadataPill/DocumentMetadataPill.testids';
import { APPROVAL_DIRTY_WARNING_IDS } from '../../../../src/pages/document/components/EditDocDetailsModal/components/ApprovalDirtyWarningModal/ApprovalDirtyWarningModal.testids';
import { EDIT_DOC_DETAILS_MODAL_IDS } from '../../../../src/pages/document/components/EditDocDetailsModal/EditDocDetailsModal.testids';
import { SIGNATURE_TEXTAREA_IDS } from '../../../../src/pages/document/components/SignaturesSection/components/SignatureTextarea/SignatureTextarea.testids';

// The document's details dialog: main's facts, its fields and its distribution
// options (Edit.tsx:2220), and its approval-mode review step, where the same
// dialog carries the flow on instead of saving and closing.

test('the dialog shows what the document is, what it says and how it goes out', async ({
  page,
}) => {
  await page.goto('/document/d1');
  await page.getByTestId(DOC_ACTION_TOOLBAR_IDS.editDoc).click();

  await expect(page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.root)).toContainText('פרטי המסמך');

  // Settled when the document was created, and drawn as facts rather than
  // controls — main never writes any of these.
  await expect(page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.fact('classification'))).toHaveText(
    'בלמ״ס',
  );
  await expect(page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.fact('orderNum'))).toHaveText('001');
  await expect(page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.fact('updateNum'))).toHaveText('1');

  // The seeded values main's dialog opens on.
  await expect(page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.docTypeSelect)).toContainText('פקודה');
  await expect(page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.folderSelect)).toContainText(
    'תיקיית מבצעים 2026',
  );
  await expect(page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.entityNameSelect)).toContainText(
    'פרויקט הגנה 2026',
  );

  // The distribution options are state, not decoration.
  const watermark = page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.optionToggle('watermark'));
  await expect(watermark).toHaveAttribute('aria-checked', 'false');
  await watermark.click();
  await expect(watermark).toHaveAttribute('aria-checked', 'true');

  const openToAll = page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.pdfAccessOption('all'));
  await openToAll.click();
  await expect(openToAll).toHaveAttribute('aria-pressed', 'true');
});

test('picking an Amazon level clears the name filed under the old one', async ({ page }) => {
  await page.goto('/document/d1');
  await page.getByTestId(DOC_ACTION_TOOLBAR_IDS.editDoc).click();

  const entityName = page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.entityNameSelect);
  await expect(entityName).toContainText('פרויקט הגנה 2026');

  await page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.entityTypeSelect).click();
  await page.getByTestId(SELECT_IDS.option('קומה')).click();

  // `פרויקט הגנה 2026` is not something that can be filed under a floor, so it
  // goes rather than standing as a pairing that doesn't exist.
  await expect(entityName).not.toContainText('פרויקט הגנה 2026');
  await entityName.click();
  await expect(page.getByTestId(SELECT_IDS.option('קומה 3'))).toBeVisible();
});

test('the details survive closing and reopening the dialog', async ({ page }) => {
  await page.goto('/document/d1');
  await page.getByTestId(DOC_ACTION_TOOLBAR_IDS.editDoc).click();

  await page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.optionToggle('distributeNatzura')).click();
  await page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.docTypeSelect).click();
  await page.getByTestId(SELECT_IDS.option('נוהל')).click();
  await page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.submitBtn).click();

  await page.getByTestId(DOC_ACTION_TOOLBAR_IDS.editDoc).click();
  // main keeps all of this in the dialog's own state, so reopening it shows the
  // defaults again and the edit is simply gone. Here it lives on the document.
  await expect(page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.docTypeSelect)).toContainText('נוהל');
  await expect(
    page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.optionToggle('distributeNatzura')),
  ).toHaveAttribute('aria-checked', 'true');
});

/** Sign the document, then walk it to where the next press asks for a round. */
const reachReviewStep = async (page: import('@playwright/test').Page) => {
  await page.getByTestId(SIGNATURE_TEXTAREA_IDS.field(0)).fill('בברכה, כהן');

  const advance = page.getByTestId(STATUS_FLOW_NAV_IDS.advanceBtn);
  await advance.click();
  await advance.click();
  await advance.click();

  await expect(page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.root)).toContainText(
    'העברה לסבב אישורים',
  );
};

test('an unchanged review goes straight to configuring the round', async ({ page }) => {
  await page.goto('/document/d1');
  await reachReviewStep(page);

  // Nothing was edited, so there is nothing to warn about.
  await page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.submitBtn).click();
  await expect(page.getByTestId(APPROVAL_DIRTY_WARNING_IDS.root)).toHaveCount(0);
  await expect(page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.root)).toBeVisible();
});

test('editing the details on the way through asks about it, and saves them', async ({ page }) => {
  await page.goto('/document/d1');
  await reachReviewStep(page);

  await page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.nameInput).fill('נוהל בטיחות 2027');
  await page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.submitBtn).click();

  const warning = page.getByTestId(APPROVAL_DIRTY_WARNING_IDS.root);
  await expect(warning).toContainText('שינוי ערכי המסמך יעודכנו רק במסמך הנוכחי');

  // Unlike main, the edit is actually saved — which is what makes that warning
  // true rather than a promise about changes it discards.
  await expect(page.getByTestId(DOCUMENT_METADATA_PILL_IDS.title)).toContainText(
    'נוהל בטיחות 2027',
  );

  await page.getByTestId(APPROVAL_DIRTY_WARNING_IDS.continueBtn).click();
  await expect(page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.root)).toBeVisible();
});

test('the warning can send you back to the details it is about', async ({ page }) => {
  await page.goto('/document/d1');
  await reachReviewStep(page);

  await page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.nameInput).fill('שם אחר');
  await page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.submitBtn).click();
  await page.getByTestId(APPROVAL_DIRTY_WARNING_IDS.backBtn).click();

  // Back on the details rather than out of the flow, with the round not started.
  await expect(page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.root)).toBeVisible();
  await expect(page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.root)).toHaveCount(0);
});
