import { expect, test } from '@playwright/test';
import { APPROVAL_DETAILS_MODAL_IDS } from '../../../../src/pages/document/components/ApprovalDetailsModal/ApprovalDetailsModal.testids';
import { STATUS_FLOW_NAV_IDS } from '../../../../src/pages/document/components/ApprovalWorkflow/components/StatusFlowNav/StatusFlowNav.testids';
import { DOCUMENT_METADATA_PILL_IDS } from '../../../../src/pages/document/components/DocumentMetadataPill/DocumentMetadataPill.testids';
import { APPROVAL_DIRTY_WARNING_IDS } from '../../../../src/pages/document/components/EditDocDetailsModal/components/ApprovalDirtyWarningModal/ApprovalDirtyWarningModal.testids';
import { EDIT_DOC_DETAILS_MODAL_IDS } from '../../../../src/pages/document/components/EditDocDetailsModal/EditDocDetailsModal.testids';
import { SIGNATURE_TEXTAREA_IDS } from '../../../../src/pages/document/components/SignaturesSection/components/SignatureTextarea/SignatureTextarea.testids';

// main's approval-mode review step: the same details dialog, but its footer
// carries the flow on instead of saving and closing.

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
