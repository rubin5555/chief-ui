import { expect, test } from '@playwright/test';
import { SELECT_IDS } from '../../../../src/components/ui/Select/Select.testids';
import { APPROVAL_DETAILS_MODAL_IDS } from '../../../../src/modals/ApprovalDetailsModal/ApprovalDetailsModal.testids';
import { DISTRIBUTE_DOC_IDS } from '../../../../src/modals/DistributeDoc/DistributeDoc.testids';
import { EDIT_DOC_DETAILS_MODAL_IDS } from '../../../../src/modals/EditDocDetailsModal/EditDocDetailsModal.testids';
import { ACCEPTENCE_VERIFICATION_IDS } from '../../../../src/pages/document/components/AcceptenceVerification/AcceptenceVerification.testids';
import { APPROVAL_ROTATION_IDS } from '../../../../src/pages/document/components/ApprovalRotation/ApprovalRotation.testids';
import { APPROVAL_WORKFLOW_IDS } from '../../../../src/pages/document/components/ApprovalWorkflow/ApprovalWorkflow.testids';
import { DISTRIBUTE_PROGRESS_TOAST_IDS } from '../../../../src/pages/document/components/ApprovalWorkflow/components/DistributeProgressToast/DistributeProgressToast.testids';
import { STATUS_FLOW_NAV_IDS } from '../../../../src/pages/document/components/ApprovalWorkflow/components/StatusFlowNav/StatusFlowNav.testids';
import { DOC_STATUS_HEADER_IDS } from '../../../../src/pages/document/components/DocumentSidebar/components/DocStatusHeader/DocStatusHeader.testids';
import { SIGNATURE_TEXTAREA_IDS } from '../../../../src/pages/document/components/SignaturesSection/components/SignatureTextarea/SignatureTextarea.testids';

const RANK = 'סא״ל';
const USER = 'כהן א.';

const statusText = (status: string) => `מסמך ${status}`;

const advanceToApprovalRound = async (page: import('@playwright/test').Page) => {
  const advance = page.getByTestId(STATUS_FLOW_NAV_IDS.advanceBtn);
  const title = page.getByTestId(DOC_STATUS_HEADER_IDS.title);

  await page.getByTestId(SIGNATURE_TEXTAREA_IDS.field(0)).fill('בברכה, כהן');

  await advance.click();
  await expect(title).toHaveText(statusText('טיוטה פנימית'));
  await advance.click();
  await expect(title).toHaveText(statusText('בהכנה'));
  await advance.click();

  await expect(page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.root)).toBeVisible();
  await page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.submitBtn).click();
};

const configureOneStageRound = async (page: import('@playwright/test').Page) => {
  await advanceToApprovalRound(page);

  await page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.rankSelect).click();
  await page.getByTestId(SELECT_IDS.option(RANK)).click();
  await page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.addApprover(RANK)).click();
  await page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.approverOption(RANK, USER)).click();
  await page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.submitBtn).click();
};

const distribute = async (page: import('@playwright/test').Page) => {
  await configureOneStageRound(page);
  await page.getByTestId(APPROVAL_ROTATION_IDS.approveBtn).click();
  await page.getByTestId(APPROVAL_ROTATION_IDS.distributeNowBtn).click();
};

test('stepping the document forward walks it through the status flow', async ({ page }) => {
  await page.goto('/document/d1');

  const title = page.getByTestId(DOC_STATUS_HEADER_IDS.title);
  await expect(title).toHaveText(statusText('טיוטה'));

  await expect(page.getByTestId(STATUS_FLOW_NAV_IDS.revertBtn)).toHaveCount(0);

  await page.getByTestId(STATUS_FLOW_NAV_IDS.advanceBtn).click();
  await expect(title).toHaveText(statusText('טיוטה פנימית'));

  await page.getByTestId(STATUS_FLOW_NAV_IDS.advanceBtn).click();
  await expect(title).toHaveText(statusText('בהכנה'));

  await page.getByTestId(STATUS_FLOW_NAV_IDS.revertBtn).click();
  await expect(title).toHaveText(statusText('טיוטה פנימית'));
});

test('starting an approval round moves the document into the rotation carousel', async ({
  page,
}) => {
  await page.goto('/document/d1');

  await configureOneStageRound(page);

  await expect(page.getByTestId(APPROVAL_ROTATION_IDS.root)).toBeVisible();
  await expect(page.getByTestId(DOC_STATUS_HEADER_IDS.title)).toHaveText(
    statusText('בסבב אישורים'),
  );
});

test('approving the only stage prompts to distribute, and distributing opens the share modal', async ({
  page,
}) => {
  await page.goto('/document/d1');
  await configureOneStageRound(page);

  await page.getByTestId(APPROVAL_ROTATION_IDS.approveBtn).click();
  await expect(page.getByTestId(APPROVAL_ROTATION_IDS.distributeNowBtn)).toBeVisible();

  await page.getByTestId(APPROVAL_ROTATION_IDS.distributeNowBtn).click();

  await expect(page.getByTestId(DOC_STATUS_HEADER_IDS.title)).toHaveText(statusText('מבצעית'));
  await expect(page.getByTestId(DISTRIBUTE_DOC_IDS.root)).toBeVisible();

  await expect(page.getByTestId(DISTRIBUTE_DOC_IDS.logo)).toBeVisible();
  await expect(page.getByTestId(DISTRIBUTE_DOC_IDS.body)).toContainText('מכותבים שלום,');

  const sendBtn = page.getByTestId(DISTRIBUTE_DOC_IDS.sendBtn);
  await sendBtn.click();
  await expect(page.getByTestId(DISTRIBUTE_DOC_IDS.root)).not.toBeVisible();

  const toast = page.getByTestId(DISTRIBUTE_PROGRESS_TOAST_IDS.root);
  await expect(toast).toContainText('הפצת המסמך מתבצעת');
  await expect(page.getByTestId(DISTRIBUTE_PROGRESS_TOAST_IDS.percent)).toHaveText('100%');
  await expect(toast).toContainText('המסמך הופץ בהצלחה');
  await expect(page.getByTestId(DISTRIBUTE_PROGRESS_TOAST_IDS.detail)).toHaveText(
    'הופץ לכ- 156 משתמשים',
  );

  await page.getByTestId(DISTRIBUTE_PROGRESS_TOAST_IDS.closeBtn).click();
  await expect(toast).toHaveCount(0);
});

test('rejecting the round sends the document back to in-prep', async ({ page }) => {
  await page.goto('/document/d1');
  await configureOneStageRound(page);

  await page.getByTestId(APPROVAL_ROTATION_IDS.rejectBtn).click();
  await page.getByTestId(APPROVAL_ROTATION_IDS.rejectReason).fill('חסר מידע בסעיף 2');
  await page.getByTestId(APPROVAL_ROTATION_IDS.confirmRejectBtn).click();

  await expect(page.getByTestId(APPROVAL_ROTATION_IDS.root)).not.toBeVisible();
  await expect(page.getByTestId(DOC_STATUS_HEADER_IDS.title)).toHaveText(statusText('בהכנה'));
});

test('a distributed document offers HML receipt confirmation, and nothing to edit', async ({
  page,
}) => {
  await page.goto('/document/d1');

  await expect(page.getByTestId(APPROVAL_WORKFLOW_IDS.acceptanceBtn)).toHaveCount(0);

  await distribute(page);

  await page.getByTestId(`${DISTRIBUTE_DOC_IDS.root}-close`).click();
  await expect(page.getByTestId(DISTRIBUTE_DOC_IDS.root)).not.toBeVisible();

  await expect(page.getByTestId(STATUS_FLOW_NAV_IDS.advanceBtn)).toHaveCount(0);
  await expect(page.getByTestId(STATUS_FLOW_NAV_IDS.revertBtn)).toHaveCount(0);

  await page.getByTestId(APPROVAL_WORKFLOW_IDS.acceptanceBtn).click();
  await expect(page.getByTestId(ACCEPTENCE_VERIFICATION_IDS.root)).toBeVisible();

  await page.getByTestId(ACCEPTENCE_VERIFICATION_IDS.approvedBy).fill('רס"ן כהן');
  await page.getByTestId(ACCEPTENCE_VERIFICATION_IDS.notes).fill('התקבל בהצלחה');
  await page.getByTestId(ACCEPTENCE_VERIFICATION_IDS.sendBtn).click();

  await expect(page.getByTestId(ACCEPTENCE_VERIFICATION_IDS.root)).not.toBeVisible();
});
