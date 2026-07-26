import { expect, test } from '@playwright/test';
import { SEARCHABLE_MULTI_SELECT_IDS } from '../../../../src/components/ui/SearchableMultiSelect/SearchableMultiSelect.testids';
import { ACCEPTENCE_VERIFICATION_IDS } from '../../../../src/pages/document/components/AcceptenceVerification/AcceptenceVerification.testids';
import { APPROVAL_DETAILS_MODAL_IDS } from '../../../../src/pages/document/components/ApprovalDetailsModal/ApprovalDetailsModal.testids';
import { APPROVAL_ROTATION_IDS } from '../../../../src/pages/document/components/ApprovalRotation/ApprovalRotation.testids';
import { APPROVAL_WORKFLOW_IDS } from '../../../../src/pages/document/components/ApprovalWorkflow/ApprovalWorkflow.testids';
import { DISTRIBUTE_DOC_IDS } from '../../../../src/pages/document/components/DistributeDoc/DistributeDoc.testids';

const RANK = 'סא״ל';
const USER = 'כהן א.';
const RECIPIENT = 'אבי כהן';
const STATUS_DRAFT = 'טיוטה';
const STATUS_IN_APPROVAL = 'בסבב אישורים';
const STATUS_IN_PREP = 'בהכנה';
const STATUS_OPERATIONAL = 'מבצעית';

const configureOneStageRound = async (page: import('@playwright/test').Page) => {
  await page.getByTestId(APPROVAL_WORKFLOW_IDS.primaryBtn).click();
  await page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.ranksSelect).click();
  await page.getByTestId(SEARCHABLE_MULTI_SELECT_IDS.option(RANK)).click();
  // Click the modal heading (not Escape, which also closes the Modal itself)
  // to dismiss the open dropdown before continuing.
  await page.getByRole('heading', { name: 'אישור המסמך' }).click();
  await page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.rankUsersSelect(RANK)).click();
  await page.getByTestId(SEARCHABLE_MULTI_SELECT_IDS.option(USER)).click();
  await page.getByRole('heading', { name: 'אישור המסמך' }).click();
  await page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.submitBtn).click();
};

test('starting an approval round moves the document into the rotation carousel', async ({
  page,
}) => {
  await page.goto('/document/d1');

  await expect(page.getByTestId(APPROVAL_WORKFLOW_IDS.statusChip)).toHaveText(STATUS_DRAFT);

  await configureOneStageRound(page);

  await expect(page.getByTestId(APPROVAL_ROTATION_IDS.root)).toBeVisible();
  await expect(page.getByTestId(APPROVAL_WORKFLOW_IDS.statusChip)).toHaveText(STATUS_IN_APPROVAL);
});

test('approving the only stage prompts to distribute, and distributing opens the share modal', async ({
  page,
}) => {
  await page.goto('/document/d1');
  await configureOneStageRound(page);

  await page.getByTestId(APPROVAL_ROTATION_IDS.approveBtn).click();
  await expect(page.getByTestId(APPROVAL_ROTATION_IDS.distributeNowBtn)).toBeVisible();

  await page.getByTestId(APPROVAL_ROTATION_IDS.distributeNowBtn).click();

  await expect(page.getByTestId(APPROVAL_WORKFLOW_IDS.statusChip)).toHaveText(STATUS_OPERATIONAL);
  await expect(page.getByTestId(DISTRIBUTE_DOC_IDS.root)).toBeVisible();

  const sendBtn = page.getByTestId(DISTRIBUTE_DOC_IDS.sendBtn);
  await expect(sendBtn).toBeDisabled();

  await page.getByTestId(DISTRIBUTE_DOC_IDS.recipientsSelect).click();
  await page.getByTestId(SEARCHABLE_MULTI_SELECT_IDS.option(RECIPIENT)).click();
  await page.getByRole('heading', { name: 'שיתוף המסמך' }).click();

  await expect(sendBtn).toBeEnabled();
  await sendBtn.click();
  await expect(page.getByTestId(DISTRIBUTE_DOC_IDS.root)).not.toBeVisible();
});

test('rejecting the round sends the document back to in-prep', async ({ page }) => {
  await page.goto('/document/d1');
  await configureOneStageRound(page);

  await page.getByTestId(APPROVAL_ROTATION_IDS.rejectBtn).click();
  await page.getByTestId(APPROVAL_ROTATION_IDS.rejectReason).fill('חסר מידע בסעיף 2');
  await page.getByTestId(APPROVAL_ROTATION_IDS.confirmRejectBtn).click();

  await expect(page.getByTestId(APPROVAL_ROTATION_IDS.root)).not.toBeVisible();
  await expect(page.getByTestId(APPROVAL_WORKFLOW_IDS.statusChip)).toHaveText(STATUS_IN_PREP);
});

test('acceptance verification (HML receipt confirmation) opens standalone and submits', async ({
  page,
}) => {
  await page.goto('/document/d1');

  await page.getByTestId(APPROVAL_WORKFLOW_IDS.acceptanceBtn).click();
  await expect(page.getByTestId(ACCEPTENCE_VERIFICATION_IDS.root)).toBeVisible();

  await page.getByTestId(ACCEPTENCE_VERIFICATION_IDS.approvedBy).fill('רס"ן כהן');
  await page.getByTestId(ACCEPTENCE_VERIFICATION_IDS.notes).fill('התקבל בהצלחה');
  await page.getByTestId(ACCEPTENCE_VERIFICATION_IDS.sendBtn).click();

  await expect(page.getByTestId(ACCEPTENCE_VERIFICATION_IDS.root)).not.toBeVisible();
});
