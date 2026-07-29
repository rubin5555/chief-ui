import { expect, test } from '@playwright/test';
import { DOC_ACTION_TOOLBAR_IDS } from '../../../../src/components/layout/TopNavbar/components/DocActionToolbar/DocActionToolbar.testids';
import { DOCUMENT_METADATA_PILL_IDS } from '../../../../src/pages/document/components/DocumentMetadataPill/DocumentMetadataPill.testids';
import { ADD_MENU_IDS } from '../../../../src/pages/document/components/DocumentSidebar/components/SidebarFabRow/components/AddMenu/AddMenu.testids';
import { SIDEBAR_FAB_ROW_IDS } from '../../../../src/pages/document/components/DocumentSidebar/components/SidebarFabRow/SidebarFabRow.testids';
import { EDITABLE_SECTION_BODY_IDS } from '../../../../src/pages/document/components/EditableSectionBody/EditableSectionBody.testids';
import { EDIT_DOC_DETAILS_MODAL_IDS } from '../../../../src/pages/document/components/EditDocDetailsModal/EditDocDetailsModal.testids';
import { FILTER_PANEL_IDS } from '../../../../src/pages/document/components/FilterPanel/FilterPanel.testids';
import { IMPORT_DOC_MODAL_IDS } from '../../../../src/pages/document/components/ImportDocModal/ImportDocModal.testids';
import { RESTORE_MODAL_IDS } from '../../../../src/pages/document/components/RestoreModal/RestoreModal.testids';
import { SECTION_MENU_IDS } from '../../../../src/pages/document/components/SectionMenu/SectionMenu.testids';
import { SUBJECT_BLOCK_IDS } from '../../../../src/pages/document/components/SubjectBlock/SubjectBlock.testids';
import { clickCentred } from '../../../support/interactions';

// The metadata pill itself is inert, exactly as main's is (Edit.tsx:3689) — details
// are edited from the navbar's document-actions toolbar, which the page portals up
// there via DocumentActionsSlot.
test('editing document details updates the header, with a dirty warning', async ({ page }) => {
  await page.goto('/document/d1');

  await page.getByTestId(DOC_ACTION_TOOLBAR_IDS.editDoc).click();
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

  // main reaches the importer from the `+` at the foot of the sidebar, alongside
  // the other three things you can add to a document (Edit.tsx:287).
  await page.getByTestId(ADD_MENU_IDS.trigger).click();
  await page.getByTestId(ADD_MENU_IDS.action('import')).click();
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

  await page.getByTestId(SIDEBAR_FAB_ROW_IDS.restoreBtn).click();
  await expect(page.getByTestId(RESTORE_MODAL_IDS.root)).toBeVisible();
  await expect(page.getByTestId(RESTORE_MODAL_IDS.emptyState)).not.toBeVisible();

  // The preview shows what each deleted section said, so it can be recognised
  // before it is chosen — and choosing is possible from either column.
  await expect(page.getByTestId(RESTORE_MODAL_IDS.previewRow('s1-1'))).toBeVisible();

  // Nothing is chosen yet, so the button says what to do rather than offering to
  // do nothing.
  const confirm = page.getByTestId(RESTORE_MODAL_IDS.restoreBtn);
  await expect(confirm).toHaveText('בחר סעיפים');
  await expect(confirm).toBeDisabled();

  await page.getByTestId(RESTORE_MODAL_IDS.row('s1-1')).click();
  await expect(confirm).toHaveText('שחזר סעיף');
  await confirm.click();

  await expect(page.getByTestId(RESTORE_MODAL_IDS.root)).not.toBeVisible();
  await expect(sectionBody).toBeVisible();
});

// main's paper toolbar holds the editor ribbon and the active-filter chips only
// (Edit.tsx:4106-4129); the filter trigger belongs to the navbar's document-actions
// toolbar, which the page fills through DocumentActionsSlot.
test('status filter hides sections that do not match the selected status', async ({ page }) => {
  await page.goto('/document/d1');

  // s1-1 is seeded 'approved' (DOCUMENT_SECTION_META in src/api/docs.ts), so
  // filtering to 'pending' — a status no section under s1 carries — should
  // hide it without clearing the filter.
  await page.getByTestId(FILTER_PANEL_IDS.trigger).click();
  await expect(page.getByTestId(FILTER_PANEL_IDS.panel)).toBeVisible();

  // Ticking an option only stages it; main commits on סנן (Edit.tsx:2518), and the
  // panel closes with it.
  await page.getByTestId(FILTER_PANEL_IDS.option('pending')).click();
  await expect(page).not.toHaveURL(/statuses=pending/);

  await page.getByTestId(FILTER_PANEL_IDS.applyBtn).click();
  await expect(page).toHaveURL(/statuses=pending/);
  await expect(page.getByTestId(FILTER_PANEL_IDS.panel)).toHaveCount(0);
  await expect(page.getByTestId(EDITABLE_SECTION_BODY_IDS.root('s1-1'))).toHaveCount(0);

  // Reopening seeds the staged selection from the URL, so נקה + סנן is how you get
  // back to an unfiltered document.
  await page.getByTestId(FILTER_PANEL_IDS.trigger).click();
  await page.getByTestId(FILTER_PANEL_IDS.clearBtn).click();
  await page.getByTestId(FILTER_PANEL_IDS.applyBtn).click();

  await expect(page).not.toHaveURL(/statuses=pending/);
  await expect(page.getByTestId(EDITABLE_SECTION_BODY_IDS.root('s1-1'))).toBeVisible();
});
