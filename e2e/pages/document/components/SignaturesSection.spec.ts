import { expect, test } from '@playwright/test';
import { SEARCHABLE_MULTI_SELECT_IDS } from '../../../../src/components/ui/SearchableMultiSelect/SearchableMultiSelect.testids';
import { APPROVAL_DETAILS_MODAL_IDS } from '../../../../src/pages/document/components/ApprovalDetailsModal/ApprovalDetailsModal.testids';
import { APPROVAL_ROTATION_IDS } from '../../../../src/pages/document/components/ApprovalRotation/ApprovalRotation.testids';
import { STATUS_FLOW_NAV_IDS } from '../../../../src/pages/document/components/ApprovalWorkflow/components/StatusFlowNav/StatusFlowNav.testids';
import { DISTRIBUTE_DOC_IDS } from '../../../../src/pages/document/components/DistributeDoc/DistributeDoc.testids';
import { DOC_STATUS_HEADER_IDS } from '../../../../src/pages/document/components/DocumentSidebar/components/DocStatusHeader/DocStatusHeader.testids';
import { EDIT_DOC_DETAILS_MODAL_IDS } from '../../../../src/pages/document/components/EditDocDetailsModal/EditDocDetailsModal.testids';
import { APPROVER_STAMP_LIST_IDS } from '../../../../src/pages/document/components/SignaturesSection/components/ApproverStampList/ApproverStampList.testids';
import { APPROVER_STAMP_IDS } from '../../../../src/pages/document/components/SignaturesSection/components/ApproverStampList/components/ApproverStamp/ApproverStamp.testids';
import { SIGNATURE_TEMPLATES_MODAL_IDS } from '../../../../src/pages/document/components/SignaturesSection/components/SignatureTemplatesModal/SignatureTemplatesModal.testids';
import { SIGNATURE_TEXTAREA_IDS } from '../../../../src/pages/document/components/SignaturesSection/components/SignatureTextarea/SignatureTextarea.testids';
import { SIGNATURES_SECTION_IDS } from '../../../../src/pages/document/components/SignaturesSection/SignaturesSection.testids';

const RANK = 'סא״ל';
const USER = 'כהן א.';

// The `חתימות` topic, and the gate that stops an unsigned document entering an
// approval round.

/** Two presses from the seeded `טיוטה` to `בהכנה`, where the next press asks for a round. */
const advanceToApprovalStep = async (page: import('@playwright/test').Page) => {
  const advance = page.getByTestId(STATUS_FLOW_NAV_IDS.advanceBtn);
  await advance.click();
  await advance.click();
  await expect(page.getByTestId(DOC_STATUS_HEADER_IDS.title)).toHaveText('מסמך בהכנה');
};

test('the signatures topic renders as a signature block, not as sections', async ({ page }) => {
  await page.goto('/document/d1');

  const section = page.getByTestId(SIGNATURES_SECTION_IDS.root);
  await expect(section).toBeVisible();
  // One empty block to start with, and both of main's header actions.
  await expect(page.getByTestId(SIGNATURE_TEXTAREA_IDS.field(0))).toHaveValue('');
  await expect(page.getByTestId(SIGNATURES_SECTION_IDS.templatesBtn)).toBeVisible();
  await expect(page.getByTestId(SIGNATURES_SECTION_IDS.addBtn)).toBeVisible();

  await page.getByTestId(SIGNATURES_SECTION_IDS.addBtn).click();
  await expect(page.getByTestId(SIGNATURE_TEXTAREA_IDS.field(1))).toBeVisible();
});

test('a template fills the first empty block rather than appending another', async ({ page }) => {
  await page.goto('/document/d1');

  await page.getByTestId(SIGNATURES_SECTION_IDS.templatesBtn).click();
  await expect(page.getByTestId(SIGNATURE_TEMPLATES_MODAL_IDS.root)).toBeVisible();

  // sig-1 is 'חתימת מאשר ראשי' in src/api/signatures.ts.
  await page.getByTestId(SIGNATURE_TEMPLATES_MODAL_IDS.template('sig-1')).click();
  await expect(page.getByTestId(SIGNATURE_TEMPLATES_MODAL_IDS.root)).not.toBeVisible();

  const first = page.getByTestId(SIGNATURE_TEXTAREA_IDS.field(0));
  await expect(first).toContainText('מאשר ראשי');
  // Filled in place: still one block, not two.
  await expect(page.getByTestId(SIGNATURE_TEXTAREA_IDS.field(1))).toHaveCount(0);
});

test('an unsigned document is refused an approval round, and says why', async ({ page }) => {
  await page.goto('/document/d1');

  await advanceToApprovalStep(page);
  await page.getByTestId(STATUS_FLOW_NAV_IDS.advanceBtn).click();

  // The gate is on the review step's `המשך`, where main puts it — so the details
  // dialog opens and then refuses to hand the flow on.
  await page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.submitBtn).click();

  // The round-configuration dialog never opens; the signatures block asks to be
  // filled in instead.
  await expect(page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.root)).toHaveCount(0);
  await expect(page.getByTestId(SIGNATURES_SECTION_IDS.requiredWarning)).toHaveText(
    '⚠נדרש לחתום על מסמך זה',
  );

  // The red border is on the field itself, with no box around the section.
  await expect(page.getByTestId(SIGNATURE_TEXTAREA_IDS.field(0))).toHaveCSS(
    'border-top-color',
    // docColors.warningStrong, #9b1c1c
    'rgb(155, 28, 28)',
  );

  // Typing clears the warning, and the round then opens.
  await page.getByTestId(SIGNATURE_TEXTAREA_IDS.field(0)).fill('בברכה, כהן');
  await expect(page.getByTestId(SIGNATURES_SECTION_IDS.requiredWarning)).toHaveCount(0);

  await page.getByTestId(STATUS_FLOW_NAV_IDS.advanceBtn).click();
  await page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.submitBtn).click();
  await expect(page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.root)).toBeVisible();
});

test('approving a stage stamps the approver into the signatures block', async ({ page }) => {
  await page.goto('/document/d1');

  await page.getByTestId(SIGNATURE_TEXTAREA_IDS.field(0)).fill('בברכה, כהן');
  await advanceToApprovalStep(page);
  await page.getByTestId(STATUS_FLOW_NAV_IDS.advanceBtn).click();
  await page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.submitBtn).click();

  await page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.ranksSelect).click();
  await page.getByTestId(SEARCHABLE_MULTI_SELECT_IDS.option(RANK)).click();
  await page.getByRole('heading', { name: 'אישור המסמך' }).click();
  await page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.rankUsersSelect(RANK)).click();
  await page.getByTestId(SEARCHABLE_MULTI_SELECT_IDS.option(USER)).click();
  await page.getByRole('heading', { name: 'אישור המסמך' }).click();
  await page.getByTestId(APPROVAL_DETAILS_MODAL_IDS.submitBtn).click();

  await expect(page.getByTestId(APPROVER_STAMP_LIST_IDS.root)).toHaveCount(0);

  await page.getByTestId(APPROVAL_ROTATION_IDS.approveBtn).click();
  await page.getByTestId(APPROVAL_ROTATION_IDS.distributeNowBtn).click();
  await page.getByTestId(`${DISTRIBUTE_DOC_IDS.root}-close`).click();

  // The stamp carries the rank and the approver, and no handwritten mark — no
  // signature was picked for this approval.
  const stamp = page.getByTestId(APPROVER_STAMP_IDS.root(USER));
  await expect(stamp).toContainText(`${RANK} — ${USER}`);
  await expect(stamp).toContainText('אושר');
  await expect(page.getByTestId(APPROVER_STAMP_IDS.mark(USER))).toHaveCount(0);
});

test('renaming the signatures topic turns it back into an ordinary one', async ({ page }) => {
  await page.goto('/document/d1');

  // The special case is keyed on the title, which is all main has to go on — so
  // this is a real consequence rather than a quirk of the implementation.
  await page
    .getByTestId(SIGNATURES_SECTION_IDS.root)
    .getByRole('textbox', { name: 'שם הנושא' })
    .fill('נספח ז׳');

  await expect(page.getByTestId(SIGNATURES_SECTION_IDS.root)).toHaveCount(0);
});
