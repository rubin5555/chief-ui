import { expect, test } from '@playwright/test';
import { SEARCHABLE_MULTI_SELECT_IDS } from '../../../src/components/ui/SearchableMultiSelect/SearchableMultiSelect.testids';
import { CLASSIFIED_VIEWERS_MODAL_IDS } from '../../../src/pages/document/components/ClassifiedViewersModal/ClassifiedViewersModal.testids';
import { DOC_HEADER_CARD_IDS } from '../../../src/pages/document/components/DocHeaderCard/DocHeaderCard.testids';
import { DOCUMENT_CANVAS_IDS } from '../../../src/pages/document/components/DocumentCanvas/DocumentCanvas.testids';
import { DOCUMENT_OUTLINE_TREE_IDS } from '../../../src/pages/document/components/DocumentOutlineTree/DocumentOutlineTree.testids';
import { EDITABLE_SECTION_BODY_IDS } from '../../../src/pages/document/components/EditableSectionBody/EditableSectionBody.testids';
import { SECTION_CHAT_IDS } from '../../../src/pages/document/components/SectionChat/SectionChat.testids';
import { SECTION_MENU_IDS } from '../../../src/pages/document/components/SectionMenu/SectionMenu.testids';
import { DOCUMENT_PAGE_IDS } from '../../../src/pages/document/DocumentPage/DocumentPage.testids';

test('renders the seeded document with its header and outline tree', async ({ page }) => {
  await page.goto('/document/d1');

  await expect(page.getByTestId(DOCUMENT_PAGE_IDS.root)).toBeVisible();
  await expect(page.getByTestId(DOC_HEADER_CARD_IDS.title)).toHaveText('נוהל בטיחות 2026');
  await expect(page.getByTestId(DOCUMENT_OUTLINE_TREE_IDS.subject('s1'))).toBeVisible();
  await expect(page.getByTestId(DOCUMENT_CANVAS_IDS.subject('s1'))).toBeVisible();
});

test('collapses and expands a subject in the outline tree', async ({ page }) => {
  await page.goto('/document/d1');

  const toggle = page.getByTestId(DOCUMENT_OUTLINE_TREE_IDS.subjectToggle('s1'));
  const firstSection = page.getByTestId(DOCUMENT_OUTLINE_TREE_IDS.section('s1-1'));

  await expect(firstSection).toBeVisible();
  await toggle.click();
  await expect(firstSection).toBeHidden();
  await toggle.click();
  await expect(firstSection).toBeVisible();
});

test('activating a section mounts a real, focusable TinyMCE editor', async ({ page }) => {
  // Confirms the section body is genuinely live rich-text editing (Phase 2's
  // goal), not a mock — a raw-keystroke round trip through TinyMCE's own
  // onEditorChange isn't asserted here since that event's internal flush
  // timing is an undocumented TinyMCE heuristic (traced to anywhere from
  // under a second to several seconds), not something this app controls;
  // the existing e2e suite avoids depending on it too (see
  // DataImportModal.spec.ts's chip-drop test, which drives ContentEditor's
  // onChange directly instead of via simulated typing).
  await page.goto('/document/d1');

  const sectionContent = page.getByTestId(EDITABLE_SECTION_BODY_IDS.content('s1-1'));
  await sectionContent.click();

  const editable = sectionContent.locator('[contenteditable="true"]');
  await expect(editable).toBeVisible();
  await editable.click();
  await expect(editable).toBeFocused();
});

test('inserting a table via the TinyMCE toolbar produces real table HTML, undoable with Ctrl+Z', async ({
  page,
}) => {
  // Phase 3: in-document tables ride entirely on ContentEditor's already-registered
  // TinyMCE table plugin/toolbar button — no SectionTableView-style custom state to
  // wire up. Table-menu clicks (unlike raw typing) trigger TinyMCE's non-typing
  // AddUndo path immediately, so no debounce/flush-timing wait is needed here.
  await page.goto('/document/d1');

  const sectionContent = page.getByTestId(EDITABLE_SECTION_BODY_IDS.content('s1-1'));
  await sectionContent.click();

  const editable = sectionContent.locator('[contenteditable="true"]');
  await expect(editable).toBeVisible();

  await page.getByRole('button', { name: 'Table' }).click();
  await page.getByRole('menuitem', { name: 'Table', exact: true }).click();
  await page.locator('[aria-label="2 columns, 2 rows"]').click();

  await expect(editable.locator('table')).toBeVisible();
  await expect(editable.locator('td')).toHaveCount(4);

  await page.keyboard.press('Control+z');
  await expect(editable.locator('table')).toHaveCount(0);
});

test('posting a section comment renders it in the chat panel', async ({ page }) => {
  await page.goto('/document/d1');

  await page.getByTestId(SECTION_CHAT_IDS.trigger('s1-1')).click();
  await expect(page.getByTestId(SECTION_CHAT_IDS.panel('s1-1'))).toBeVisible();

  await page.getByTestId(SECTION_CHAT_IDS.input).fill('הודעת בדיקה');
  await page.getByTestId(SECTION_CHAT_IDS.sendBtn).click();

  // The stub mutation carries the same simulated network latency as every
  // other src/api/*.ts resource (STUB_DELAY_MS in stubLink.ts) — assertions
  // auto-retry rather than using a fixed wait.
  const message = page.locator('[data-testid^="section-chat-message-"]');
  await expect(message).toHaveCount(1);
  await expect(message).toContainText('הודעת בדיקה');
  await expect(page.getByTestId(SECTION_CHAT_IDS.input)).toHaveValue('');
});

test('hiding a section via the section menu replaces its body with a hidden notice', async ({
  page,
}) => {
  await page.goto('/document/d1');

  await page.getByTestId(SECTION_MENU_IDS.trigger('s1-1')).click();
  await page.getByTestId(SECTION_MENU_IDS.toggleHiddenAction).click();

  const sectionBody = page.getByTestId(EDITABLE_SECTION_BODY_IDS.root('s1-1'));
  await expect(sectionBody).toContainText('סעיף מוסתר');
  await expect(page.getByTestId(EDITABLE_SECTION_BODY_IDS.content('s1-1'))).toHaveCount(0);

  // Toggling back from the menu (still labeled for "show" now) restores it.
  await page.getByTestId(SECTION_MENU_IDS.trigger('s1-1')).click();
  await page.getByTestId(SECTION_MENU_IDS.toggleHiddenAction).click();
  await expect(page.getByTestId(EDITABLE_SECTION_BODY_IDS.content('s1-1'))).toBeVisible();
});

test('classifying a section opens the viewers picker and gates its content', async ({ page }) => {
  await page.goto('/document/d1');

  await page.getByTestId(SECTION_MENU_IDS.trigger('s1-2')).click();
  await page.getByTestId(SECTION_MENU_IDS.toggleClassifiedAction).click();

  // Turning classification on immediately opens the viewers picker.
  const viewersModal = page.getByTestId(CLASSIFIED_VIEWERS_MODAL_IDS.root);
  await expect(viewersModal).toBeVisible();

  const firstCheckbox = page.getByTestId(CLASSIFIED_VIEWERS_MODAL_IDS.checkbox('p1'));
  await firstCheckbox.click();
  await expect(firstCheckbox).toBeChecked();

  await page.getByTestId(CLASSIFIED_VIEWERS_MODAL_IDS.closeBtn).click();
  await expect(viewersModal).not.toBeVisible();

  // The section body is now gated behind a classification notice, not the editor.
  const sectionBody = page.getByTestId(EDITABLE_SECTION_BODY_IDS.root('s1-2'));
  await expect(sectionBody).toContainText('תוכן ממודר');
  await expect(page.getByTestId(EDITABLE_SECTION_BODY_IDS.content('s1-2'))).toHaveCount(0);
});

test('editing section approvers through the permissions view', async ({ page }) => {
  await page.goto('/document/d1');

  await page.getByTestId(SECTION_MENU_IDS.trigger('s1-1')).click();
  await page.getByTestId(SECTION_MENU_IDS.approversAction).click();

  const select = page.getByTestId(SECTION_MENU_IDS.permissionsSelect);
  await expect(select).toBeVisible();
  await select.click();
  await page.getByTestId(SEARCHABLE_MULTI_SELECT_IDS.option('אבי כהן')).click();

  await expect(select).toContainText('אבי כהן');
});

test('deleting a section from the section menu removes it from the tree', async ({ page }) => {
  await page.goto('/document/d1');

  const sectionBody = page.getByTestId(EDITABLE_SECTION_BODY_IDS.root('s1-1'));
  await expect(sectionBody).toBeVisible();

  await page.getByTestId(SECTION_MENU_IDS.trigger('s1-1')).click();
  await page.getByTestId(SECTION_MENU_IDS.deleteAction).click();

  await expect(sectionBody).toHaveCount(0);
});
