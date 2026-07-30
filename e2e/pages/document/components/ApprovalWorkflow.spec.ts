import { expect, test } from '@playwright/test';
import { SELECT_IDS } from '../../../../src/components/ui/Select/Select.testids';
import { ACCEPTENCE_VERIFICATION_IDS } from '../../../../src/pages/document/components/AcceptenceVerification/AcceptenceVerification.testids';
import { APPROVAL_DETAILS_MODAL_IDS } from '../../../../src/pages/document/components/ApprovalDetailsModal/ApprovalDetailsModal.testids';
import { APPROVAL_ROTATION_IDS } from '../../../../src/pages/document/components/ApprovalRotation/ApprovalRotation.testids';
import { APPROVAL_WORKFLOW_IDS } from '../../../../src/pages/document/components/ApprovalWorkflow/ApprovalWorkflow.testids';
import { DISTRIBUTE_PROGRESS_TOAST_IDS } from '../../../../src/pages/document/components/ApprovalWorkflow/components/DistributeProgressToast/DistributeProgressToast.testids';
import { STATUS_FLOW_NAV_IDS } from '../../../../src/pages/document/components/ApprovalWorkflow/components/StatusFlowNav/StatusFlowNav.testids';
import { DISTRIBUTE_DOC_IDS } from '../../../../src/pages/document/components/DistributeDoc/DistributeDoc.testids';
import { DOC_STATUS_HEADER_IDS } from '../../../../src/pages/document/components/DocumentSidebar/components/DocStatusHeader/DocStatusHeader.testids';
import { EDIT_DOC_DETAILS_MODAL_IDS } from '../../../../src/pages/document/components/EditDocDetailsModal/EditDocDetailsModal.testids';
import { SIGNATURE_TEXTAREA_IDS } from '../../../../src/pages/document/components/SignaturesSection/components/SignatureTextarea/SignatureTextarea.testids';

const RANK = 'סא״ל';
const USER = 'כהן א.';

// The sidebar states the status as a sentence — `מסמך טיוטה` — rather than as a
// bare chip, which is main's wording (Edit.tsx:3800).
const statusText = (status: string) => `מסמך ${status}`;

/**
 * Walk the document from its seeded status up to the approval round.
 *
 * The seed document is `טיוטה`, which isn't a step in STATUS_FLOW at all, so the
 * first press enters the flow at its start rather than skipping ahead — three
 * presses in total before the round-configuration modal opens. That is main's
 * stepper, and it is why this isn't a single "start an approval round" button.
 */
const advanceToApprovalRound = async (page: import('@playwright/test').Page) => {
  const advance = page.getByTestId(STATUS_FLOW_NAV_IDS.advanceBtn);
  const title = page.getByTestId(DOC_STATUS_HEADER_IDS.title);

  // A document nobody has signed is refused the round outright — see
  // SignaturesSection.spec.ts for that gate on its own.
  await page.getByTestId(SIGNATURE_TEXTAREA_IDS.field(0)).fill('בברכה, כהן');

  await advance.click();
  await expect(title).toHaveText(statusText('טיוטה פנימית'));
  await advance.click();
  await expect(title).toHaveText(statusText('בהכנה'));
  await advance.click();

  // main puts a review of the document's details in front of the round
  // (Edit.tsx:2431); `המשך` is what carries the flow on.
  await expect(page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.root)).toBeVisible();
  await page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.submitBtn).click();
};

const configureOneStageRound = async (page: import('@playwright/test').Page) => {
  await advanceToApprovalRound(page);

  // RANK is the lowest rank, so the round it cascades to is one stage long.
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

  // Off-flow, so there is nowhere back to go and only one button appears.
  await expect(page.getByTestId(STATUS_FLOW_NAV_IDS.revertBtn)).toHaveCount(0);

  await page.getByTestId(STATUS_FLOW_NAV_IDS.advanceBtn).click();
  await expect(title).toHaveText(statusText('טיוטה פנימית'));

  // Now inside the flow: forward to `בהכנה`, back to where it came from.
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

  // main's dialog asks for nothing but the message — the document's own mark
  // beside it, and the ribbon that formats it (Edit.tsx:3103).
  await expect(page.getByTestId(DISTRIBUTE_DOC_IDS.logo)).toBeVisible();
  await expect(page.getByTestId(DISTRIBUTE_DOC_IDS.body)).toContainText('מכותבים שלום,');

  const sendBtn = page.getByTestId(DISTRIBUTE_DOC_IDS.sendBtn);
  await sendBtn.click();
  await expect(page.getByTestId(DISTRIBUTE_DOC_IDS.root)).not.toBeVisible();

  // The share dialog hands over to the corner toast, which ramps to 100% and then
  // reports roughly who it reached — main's own approximate figure, since nothing
  // in the flow resolves חמ״ל groups down to people.
  const toast = page.getByTestId(DISTRIBUTE_PROGRESS_TOAST_IDS.root);
  await expect(toast).toContainText('הפצת המסמך מתבצעת');
  await expect(page.getByTestId(DISTRIBUTE_PROGRESS_TOAST_IDS.percent)).toHaveText('100%');
  await expect(toast).toContainText('המסמך הופץ בהצלחה');
  await expect(page.getByTestId(DISTRIBUTE_PROGRESS_TOAST_IDS.detail)).toHaveText(
    'הופץ לכ- 156 משתמשים',
  );

  // Dismissable only once it has landed — there is nothing to do with a
  // half-distributed document.
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

  // Confirming receipt is a recipient's action on a document that has actually
  // been distributed, so it appears only once the document is `מבצעית` — before
  // that there is nothing to confirm receipt of.
  await expect(page.getByTestId(APPROVAL_WORKFLOW_IDS.acceptanceBtn)).toHaveCount(0);

  await distribute(page);
  // Modal's own header close, whose testid is derived from the dialog's.
  await page.getByTestId(`${DISTRIBUTE_DOC_IDS.root}-close`).click();
  await expect(page.getByTestId(DISTRIBUTE_DOC_IDS.root)).not.toBeVisible();

  // A distributed document is read-only: no status moves left in either direction.
  await expect(page.getByTestId(STATUS_FLOW_NAV_IDS.advanceBtn)).toHaveCount(0);
  await expect(page.getByTestId(STATUS_FLOW_NAV_IDS.revertBtn)).toHaveCount(0);

  await page.getByTestId(APPROVAL_WORKFLOW_IDS.acceptanceBtn).click();
  await expect(page.getByTestId(ACCEPTENCE_VERIFICATION_IDS.root)).toBeVisible();

  await page.getByTestId(ACCEPTENCE_VERIFICATION_IDS.approvedBy).fill('רס"ן כהן');
  await page.getByTestId(ACCEPTENCE_VERIFICATION_IDS.notes).fill('התקבל בהצלחה');
  await page.getByTestId(ACCEPTENCE_VERIFICATION_IDS.sendBtn).click();

  await expect(page.getByTestId(ACCEPTENCE_VERIFICATION_IDS.root)).not.toBeVisible();
});
