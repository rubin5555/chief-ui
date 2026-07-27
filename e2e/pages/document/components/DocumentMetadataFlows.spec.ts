import { expect, test } from '@playwright/test';
import { DOCUMENT_METADATA_PILL_IDS } from '../../../../src/pages/document/components/DocumentMetadataPill/DocumentMetadataPill.testids';
import { EDITABLE_SECTION_BODY_IDS } from '../../../../src/pages/document/components/EditableSectionBody/EditableSectionBody.testids';
import { EDIT_DOC_DETAILS_MODAL_IDS } from '../../../../src/pages/document/components/EditDocDetailsModal/EditDocDetailsModal.testids';
import { FILTER_PANEL_IDS } from '../../../../src/pages/document/components/FilterPanel/FilterPanel.testids';
import { IMPORT_DOC_MODAL_IDS } from '../../../../src/pages/document/components/ImportDocModal/ImportDocModal.testids';
import { RESTORE_MODAL_IDS } from '../../../../src/pages/document/components/RestoreModal/RestoreModal.testids';
import { SECTION_MENU_IDS } from '../../../../src/pages/document/components/SectionMenu/SectionMenu.testids';
import { SUBJECT_BLOCK_IDS } from '../../../../src/pages/document/components/SubjectBlock/SubjectBlock.testids';
import { clickCentred } from '../../../support/interactions';

// TEMPORARILY DISABLED — has no trigger to click right now, not a broken flow.
// The metadata pill that replaced DocHeaderCard is inert, exactly as main's is
// (Edit.tsx:3689): main opens EditDocDetailsModal from the navbar's
// document-actions toolbar, which is built but not yet mounted. The next phase
// mounts it and this test comes straight back, pointed at that trigger.
test.fixme('editing document details updates the header, with a dirty warning', async ({
  page,
}) => {
  await page.goto('/document/d1');

  await page.locator('button[aria-label="עריכת פרטי מסמך"]').click();
  await expect(page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.root)).toBeVisible();
  await expect(page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.dirtyWarning)).not.toBeVisible();

  await page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.nameInput).fill('נוהל בטיחות מעודכן');
  await expect(page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.dirtyWarning)).toBeVisible();

  await page.getByTestId(EDIT_DOC_DETAILS_MODAL_IDS.submitBtn).click();
  await expect(page.getByTestId(DOCUMENT_METADATA_PILL_IDS.title)).toContainText(
    'נוהל בטיחות מעודכן',
  );
});

test('importing sections from another document adds them to the tree', async ({ page }) => {
  await page.goto('/document/d1');

  await page.getByText('ייבוא סעיפים').click();
  await expect(page.getByTestId(IMPORT_DOC_MODAL_IDS.root)).toBeVisible();

  await page.getByTestId(IMPORT_DOC_MODAL_IDS.docRow('id1')).click();
  // Checkboxes are keyed by section id, and the offered sections are main's
  // IMPORT_DOC_SECTIONS (is1..is5) — so `is1` is "מטרה ורקע".
  await page.getByTestId(IMPORT_DOC_MODAL_IDS.sectionCheckbox('is1')).click();
  await page.getByTestId(IMPORT_DOC_MODAL_IDS.importBtn).click();

  await expect(page.getByTestId(IMPORT_DOC_MODAL_IDS.root)).not.toBeVisible();
  // In-paper titles are editable inputs, not static headings — that is main's
  // design, and how you retitle a section. The imported section is appended to
  // the first subject, whose own heading happens to carry the same name, so scope
  // to that subject's section-level title fields and take the last one.
  const s1SectionTitles = page
    .getByTestId(SUBJECT_BLOCK_IDS.root('s1'))
    .getByRole('textbox', { name: 'שם הסעיף' });
  await expect(s1SectionTitles.last()).toHaveValue('מטרה ורקע');
});

test('deleting a section trashes it, and restoring brings it back', async ({ page }) => {
  await page.goto('/document/d1');

  const sectionBody = page.getByTestId(EDITABLE_SECTION_BODY_IDS.root('s1-1'));
  await expect(sectionBody).toBeVisible();

  await clickCentred(page.getByTestId(SECTION_MENU_IDS.trigger('s1-1')));
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

// TEMPORARILY DISABLED for the same reason as the edit-details test above: the
// trigger isn't mounted yet, the flow isn't broken. main's paper toolbar holds
// the editor ribbon and the active-filter chips only (Edit.tsx:4106-4129) — the
// filter button lives in the navbar's document-actions toolbar. The next phase
// mounts it and this test returns unchanged.
test.fixme('status filter hides sections that do not match the selected status', async ({
  page,
}) => {
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
