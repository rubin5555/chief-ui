import { expect, test } from '@playwright/test';
import { SELECT_IDS } from '../../../../src/components/ui/Select/Select.testids';
import { APPROVAL_DETAILS_MODAL_IDS } from '../../../../src/pages/document/components/ApprovalDetailsModal/ApprovalDetailsModal.testids';
import { APPROVAL_ROTATION_IDS } from '../../../../src/pages/document/components/ApprovalRotation/ApprovalRotation.testids';
import { STATUS_FLOW_NAV_IDS } from '../../../../src/pages/document/components/ApprovalWorkflow/components/StatusFlowNav/StatusFlowNav.testids';
import { DOC_STATUS_HEADER_IDS } from '../../../../src/pages/document/components/DocumentSidebar/components/DocStatusHeader/DocStatusHeader.testids';
import { EDIT_DOC_DETAILS_MODAL_IDS } from '../../../../src/pages/document/components/EditDocDetailsModal/EditDocDetailsModal.testids';
import { SIGNATURE_TEXTAREA_IDS } from '../../../../src/pages/document/components/SignaturesSection/components/SignatureTextarea/SignatureTextarea.testids';

// Configuring the approval round, rebuilt to main's own dialog (Edit.tsx:2900):
// one rank that cascades into a chain, a timeline of who signs at each step, and
// the חמ״לים that have to confirm receipt.

// src/api/approvals.ts APPROVAL_RANKS_FALLBACK, in order.
const FIRST_RANK = 'סא״ל';
const THIRD_RANK = 'תא״ל';
const SECOND_RANK = 'אל״ם';
const USER = 'כהן א.';
const OTHER_USER = 'לוי מ.';

const openRoundConfig = async (page: import('@playwright/test').Page) => {
  await page.goto('/document/d1');

  // A document nobody has signed never reaches the round — see
  // SignaturesSection.spec.ts for that gate.
  await page.getByTestId(SIGNATURE_TEXTAREA_IDS.field(0)).fill('בברכה, כהן');

  const advance = page.getByTestId(STATUS_FLOW_NAV_IDS.advanceBtn);
  await advance.click();
  await advance.click();
  await expect(page.getByTestId(DOC_STATUS_HEADER_IDS.title)).toHaveText('מסמך בהכנה');
  await advance.click();
  await page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.submitBtn).click();

  await expect(page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.root)).toBeVisible();
};

test('picking a rank builds the chain of every rank below it', async ({ page }) => {
  await openRoundConfig(page);

  // Nothing to send until a rank has been picked.
  await expect(page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.submitBtn)).toBeDisabled();
  await expect(page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.timeline)).toHaveCount(0);

  await page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.rankSelect).click();
  await page.getByTestId(SELECT_IDS.option(THIRD_RANK)).click();

  // Approval is a chain: the two ranks under the one picked come with it.
  await expect(page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.stage(FIRST_RANK))).toBeVisible();
  await expect(page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.stage(SECOND_RANK))).toBeVisible();
  await expect(page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.stage(THIRD_RANK))).toBeVisible();
  await expect(page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.submitBtn)).toBeEnabled();

  // Dropping back to the lowest rank shortens the round to that one step.
  await page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.rankSelect).click();
  await page.getByTestId(SELECT_IDS.option(FIRST_RANK)).click();
  await expect(page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.stage(SECOND_RANK))).toHaveCount(0);
});

test('a rank takes two named approvers, then stops offering', async ({ page }) => {
  await openRoundConfig(page);

  await page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.rankSelect).click();
  await page.getByTestId(SELECT_IDS.option(FIRST_RANK)).click();

  await page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.addApprover(FIRST_RANK)).click();
  await page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.approverOption(FIRST_RANK, USER)).click();
  await expect(
    page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.approverChip(FIRST_RANK, USER)),
  ).toBeVisible();

  // Whoever is already on the rank is no longer offered for it.
  await page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.addApprover(FIRST_RANK)).click();
  await expect(
    page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.approverOption(FIRST_RANK, USER)),
  ).toHaveCount(0);
  await page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.approverOption(FIRST_RANK, OTHER_USER)).click();

  // Two is the cap, and the link goes rather than greying out.
  await expect(page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.addApprover(FIRST_RANK))).toHaveCount(0);

  await page
    .getByTestId(APPROVAL_DETAILS_MODAL_IDS.approverChip(FIRST_RANK, USER))
    .getByRole('button')
    .click();
  await expect(
    page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.approverChip(FIRST_RANK, USER)),
  ).toHaveCount(0);
  await expect(page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.addApprover(FIRST_RANK))).toBeVisible();
});

test('the חמ״ל picker counts what is ticked and shows who is in each', async ({ page }) => {
  await openRoundConfig(page);

  const trigger = page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.hmlSelect);
  await expect(trigger).toHaveText('בחר חמ״לים');
  await trigger.click();

  // Expanding a group is a way of reading it, not of choosing it.
  await page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.hmlExpand('north')).click();
  await expect(page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.hmlPanel)).toContainText('רנ"ג כהן א.');
  await expect(trigger).toHaveText('בחר חמ״לים');

  await page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.hmlOption('north')).click();
  await page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.hmlOption('south')).click();
  await page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.hmlDone).click();

  await expect(page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.hmlPanel)).toHaveCount(0);
  await expect(trigger).toHaveText('נבחרו 2 חמ״לים');
});

test('the configured round is what the rotation opens on', async ({ page }) => {
  await openRoundConfig(page);

  await page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.rankSelect).click();
  await page.getByTestId(SELECT_IDS.option(SECOND_RANK)).click();
  await page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.addApprover(FIRST_RANK)).click();
  await page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.approverOption(FIRST_RANK, USER)).click();

  await page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.submitBtn).click();

  // Both ranks reached the round, in order, with the named approver on the first.
  await expect(page.getByTestId(APPROVAL_ROTATION_IDS.stageDot(0))).toBeVisible();
  await expect(page.getByTestId(APPROVAL_ROTATION_IDS.stageDot(1))).toBeVisible();
  await expect(page.getByTestId(APPROVAL_ROTATION_IDS.notes)).toHaveAttribute(
    'placeholder',
    `הערות ${USER}...`,
  );
});
