import { expect, test } from '@playwright/test';
import { DOC_ACTION_TOOLBAR_IDS } from '../../../../src/components/layout/TopNavbar/components/DocActionToolbar/DocActionToolbar.testids';
import { SEARCH_BAR_IDS } from '../../../../src/components/ui/SearchBar/SearchBar.testids';
import { EDIT_DOC_DETAILS_MODAL_IDS } from '../../../../src/modals/EditDocDetailsModal/EditDocDetailsModal.testids';
import { DOCUMENT_METADATA_PILL_IDS } from '../../../../src/pages/document/components/DocumentMetadataPill/DocumentMetadataPill.testids';
import { ADD_MENU_IDS } from '../../../../src/pages/document/components/DocumentSidebar/components/SidebarFabRow/components/AddMenu/AddMenu.testids';
import { SIDEBAR_FAB_ROW_IDS } from '../../../../src/pages/document/components/DocumentSidebar/components/SidebarFabRow/SidebarFabRow.testids';
import { EDITABLE_SECTION_BODY_IDS } from '../../../../src/pages/document/components/EditableSectionBody/EditableSectionBody.testids';
import { FILTER_PANEL_IDS } from '../../../../src/pages/document/components/FilterPanel/FilterPanel.testids';
import { IMPORT_DOC_MODAL_IDS } from '../../../../src/pages/document/components/ImportDocModal/ImportDocModal.testids';
import { RESTORE_MODAL_IDS } from '../../../../src/pages/document/components/RestoreModal/RestoreModal.testids';
import { SECTION_MENU_IDS } from '../../../../src/pages/document/components/SectionMenu/SectionMenu.testids';
import { SUBJECT_BLOCK_IDS } from '../../../../src/pages/document/components/SubjectBlock/SubjectBlock.testids';
import { clickCentred } from '../../../support/interactions';

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

  await page.getByTestId(ADD_MENU_IDS.trigger).click();
  await page.getByTestId(ADD_MENU_IDS.action('import')).click();
  await expect(page.getByTestId(IMPORT_DOC_MODAL_IDS.root)).toBeVisible();

  await page.getByTestId(IMPORT_DOC_MODAL_IDS.docRow('id1')).click();
  await expect(page.getByTestId(IMPORT_DOC_MODAL_IDS.back)).toBeVisible();

  await page.getByTestId(IMPORT_DOC_MODAL_IDS.sectionRow('is1')).click();
  await page.getByTestId(IMPORT_DOC_MODAL_IDS.importBtn).click();

  await expect(page.getByTestId(IMPORT_DOC_MODAL_IDS.root)).not.toBeVisible();

  const s1SectionTitles = page
    .getByTestId(SUBJECT_BLOCK_IDS.root('s1'))
    .getByRole('textbox', { name: 'שם הסעיף' });
  await expect(s1SectionTitles.last()).toHaveValue('מטרה ורקע');
});

test('the source picker searches its list and takes a pick from either column', async ({
  page,
}) => {
  await page.goto('/document/d1');
  await page.getByTestId(ADD_MENU_IDS.trigger).click();
  await page.getByTestId(ADD_MENU_IDS.action('import')).click();

  const search = page.getByTestId(SEARCH_BAR_IDS.input);

  await search.fill('רכש');
  await expect(page.getByTestId(IMPORT_DOC_MODAL_IDS.docRow('id4'))).toBeVisible();
  await expect(page.getByTestId(IMPORT_DOC_MODAL_IDS.docRow('id1'))).toHaveCount(0);

  await search.fill('אין כזה מסמך');
  await expect(page.getByTestId(IMPORT_DOC_MODAL_IDS.noDocs)).toBeVisible();

  await search.fill('');
  await page.getByTestId(IMPORT_DOC_MODAL_IDS.docRow('id1')).click();

  await page.getByTestId(IMPORT_DOC_MODAL_IDS.previewRow('is2')).click();
  await expect(page.getByTestId(IMPORT_DOC_MODAL_IDS.importBtn)).toHaveText('ייבא סעיף');

  await page.getByTestId(IMPORT_DOC_MODAL_IDS.back).click();
  await page.getByTestId(IMPORT_DOC_MODAL_IDS.docRow('id2')).click();
  await expect(page.getByTestId(IMPORT_DOC_MODAL_IDS.importBtn)).toHaveText('בחר סעיפים');
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

  await expect(page.getByTestId(RESTORE_MODAL_IDS.previewRow('s1-1'))).toBeVisible();

  const confirm = page.getByTestId(RESTORE_MODAL_IDS.restoreBtn);
  await expect(confirm).toHaveText('בחר סעיפים');
  await expect(confirm).toBeDisabled();

  await page.getByTestId(RESTORE_MODAL_IDS.row('s1-1')).click();
  await expect(confirm).toHaveText('שחזר סעיף');
  await confirm.click();

  await expect(page.getByTestId(RESTORE_MODAL_IDS.root)).not.toBeVisible();
  await expect(sectionBody).toBeVisible();
});

test('status filter hides sections that do not match the selected status', async ({ page }) => {
  await page.goto('/document/d1');

  await page.getByTestId(FILTER_PANEL_IDS.trigger).click();
  await expect(page.getByTestId(FILTER_PANEL_IDS.panel)).toBeVisible();

  await page.getByTestId(FILTER_PANEL_IDS.option('pending')).click();
  await expect(page).not.toHaveURL(/statuses=pending/);

  await page.getByTestId(FILTER_PANEL_IDS.applyBtn).click();
  await expect(page).toHaveURL(/statuses=pending/);
  await expect(page.getByTestId(FILTER_PANEL_IDS.panel)).toHaveCount(0);
  await expect(page.getByTestId(EDITABLE_SECTION_BODY_IDS.root('s1-1'))).toHaveCount(0);

  await page.getByTestId(FILTER_PANEL_IDS.trigger).click();
  await page.getByTestId(FILTER_PANEL_IDS.clearBtn).click();
  await page.getByTestId(FILTER_PANEL_IDS.applyBtn).click();

  await expect(page).not.toHaveURL(/statuses=pending/);
  await expect(page.getByTestId(EDITABLE_SECTION_BODY_IDS.root('s1-1'))).toBeVisible();
});
