import { expect, test } from '@playwright/test';
import { EDITOR_RIBBON_IDS } from '../../../src/components/ui/ContentEditor/components/EditorRibbon/EditorRibbon.testids';
import { DOC_PERMISSIONS_MODAL_IDS } from '../../../src/modals/DocPermissionsModal/DocPermissionsModal.testids';
import { CLASSIFIED_VIEWERS_MODAL_IDS } from '../../../src/pages/document/components/ClassifiedViewersModal/ClassifiedViewersModal.testids';
import { DOCUMENT_METADATA_PILL_IDS } from '../../../src/pages/document/components/DocumentMetadataPill/DocumentMetadataPill.testids';
import { OUTLINE_SECTION_ROW_IDS } from '../../../src/pages/document/components/DocumentOutlineTree/components/OutlineSectionRow/OutlineSectionRow.testids';
import { OUTLINE_SUBJECT_ROW_IDS } from '../../../src/pages/document/components/DocumentOutlineTree/components/OutlineSubjectRow/OutlineSubjectRow.testids';
import { DOCUMENT_PAGE_SKELETON_IDS } from '../../../src/pages/document/components/DocumentPageSkeleton/DocumentPageSkeleton.testids';
import { EDITABLE_SECTION_BODY_IDS } from '../../../src/pages/document/components/EditableSectionBody/EditableSectionBody.testids';
import { PAPER_CANVAS_IDS } from '../../../src/pages/document/components/PaperCanvas/PaperCanvas.testids';
import { SECTION_CHAT_IDS } from '../../../src/pages/document/components/SectionChat/SectionChat.testids';
import { SECTION_MENU_IDS } from '../../../src/pages/document/components/SectionMenu/SectionMenu.testids';
import { SUBJECT_BLOCK_IDS } from '../../../src/pages/document/components/SubjectBlock/SubjectBlock.testids';
import { DOCUMENT_PAGE_IDS } from '../../../src/pages/document/DocumentPage/DocumentPage.testids';

import { clickCentred } from '../../support/interactions';

test('renders the seeded document with its header and outline tree', async ({ page }) => {
  await page.goto('/document/d1');

  await expect(page.getByTestId(DOCUMENT_PAGE_IDS.root)).toBeVisible();

  await expect(page.getByTestId(DOCUMENT_METADATA_PILL_IDS.title)).toContainText(
    'נוהל בטיחות 2026',
  );
  await expect(page.getByTestId(OUTLINE_SUBJECT_ROW_IDS.root('s1'))).toBeVisible();
  await expect(page.getByTestId(SUBJECT_BLOCK_IDS.root('s1'))).toBeVisible();
});

test('collapses and expands a subject in the outline tree', async ({ page }) => {
  await page.goto('/document/d1');

  const toggle = page.getByTestId(OUTLINE_SUBJECT_ROW_IDS.toggle('s1'));
  const firstSection = page.getByTestId(OUTLINE_SECTION_ROW_IDS.root('s1-1'));

  await expect(firstSection).toBeVisible();
  await toggle.click();
  await expect(firstSection).toBeHidden();
  await toggle.click();
  await expect(firstSection).toBeVisible();
});

test('activating a section mounts a real, focusable TinyMCE editor', async ({ page }) => {
  await page.goto('/document/d1');

  const sectionContent = page.getByTestId(EDITABLE_SECTION_BODY_IDS.content('s1-1'));
  await sectionContent.click();

  const editable = sectionContent.locator('[contenteditable="true"]');
  await expect(editable).toBeVisible();
  await editable.click();
  await expect(editable).toBeFocused();
});

test('inserting a table from the ribbon produces real table HTML, undoable with Ctrl+Z', async ({
  page,
}) => {
  await page.goto('/document/d1');

  const sectionContent = page.getByTestId(EDITABLE_SECTION_BODY_IDS.content('s1-1'));
  await sectionContent.click();

  const editable = sectionContent.locator('[contenteditable="true"]');
  await expect(editable).toBeVisible();

  await page.getByTestId(EDITOR_RIBBON_IDS.tableTrigger).click();
  await page.getByTestId(EDITOR_RIBBON_IDS.tableSizeCell(2, 2)).click();

  await expect(editable.locator('table')).toBeVisible();
  await expect(editable.locator('td')).toHaveCount(4);

  await page.keyboard.press('Control+z');
  await expect(editable.locator('table')).toHaveCount(0);
});

test('posting a section comment renders it in the chat panel', async ({ page }) => {
  await page.goto('/document/d1');

  await clickCentred(page.getByTestId(SECTION_CHAT_IDS.trigger('s1-1')));
  await expect(page.getByTestId(SECTION_CHAT_IDS.panel('s1-1'))).toBeVisible();

  await page.getByTestId(SECTION_CHAT_IDS.input).fill('הודעת בדיקה');
  await page.getByTestId(SECTION_CHAT_IDS.sendBtn).click();

  const messages = page.locator('[data-testid^="section-chat-message-"]');
  await expect(messages).toHaveCount(2);
  await expect(messages.first()).toContainText('איך אפשר לעזור בסעיף זה?');
  await expect(messages.last()).toContainText('הודעת בדיקה');
  await expect(page.getByTestId(SECTION_CHAT_IDS.input)).toHaveValue('');
});

test('the chat stays open while text is being marked in the document', async ({ page }) => {
  await page.goto('/document/d1');

  await clickCentred(page.getByTestId(SECTION_CHAT_IDS.trigger('s1-1')));
  const panel = page.getByTestId(SECTION_CHAT_IDS.panel('s1-1'));
  await expect(panel).toBeVisible();

  await page.getByTestId(SECTION_CHAT_IDS.markerToggle).click();
  await expect(panel).toContainText('סמן טקסט במסמך');

  await page.getByTestId(PAPER_CANVAS_IDS.paper).click({ position: { x: 4, y: 4 } });
  await expect(panel).toBeVisible();
});

test('opening a second section chat closes the first', async ({ page }) => {
  await page.goto('/document/d1');

  await clickCentred(page.getByTestId(SECTION_CHAT_IDS.trigger('s1-1')));
  await expect(page.getByTestId(SECTION_CHAT_IDS.panel('s1-1'))).toBeVisible();

  await clickCentred(page.getByTestId(SECTION_CHAT_IDS.trigger('s1-2')));
  await expect(page.getByTestId(SECTION_CHAT_IDS.panel('s1-2'))).toBeVisible();
  await expect(page.getByTestId(SECTION_CHAT_IDS.panel('s1-1'))).toHaveCount(0);
});

test('a section menu takes focus when it opens and keeps Tab inside it', async ({ page }) => {
  await page.goto('/document/d1');

  await clickCentred(page.getByTestId(SECTION_MENU_IDS.trigger('s1-1')));
  await expect(page.getByTestId(SECTION_MENU_IDS.approversAction)).toBeFocused();

  await page.keyboard.press('Shift+Tab');
  await expect(page.getByTestId(SECTION_MENU_IDS.deleteAction)).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(page.getByTestId(SECTION_MENU_IDS.panel('s1-1'))).toHaveCount(0);
  await expect(page.getByTestId(SECTION_MENU_IDS.trigger('s1-1'))).toBeFocused();
});

test('hiding a section via the section menu replaces its body with a hidden notice', async ({
  page,
}) => {
  await page.goto('/document/d1');

  await clickCentred(page.getByTestId(SECTION_MENU_IDS.trigger('s1-1')));
  await page.getByTestId(SECTION_MENU_IDS.toggleHiddenAction).click();

  const sectionBody = page.getByTestId(EDITABLE_SECTION_BODY_IDS.root('s1-1'));
  await expect(sectionBody).toContainText('סעיף מוסתר');
  await expect(page.getByTestId(EDITABLE_SECTION_BODY_IDS.content('s1-1'))).toHaveCount(0);

  await clickCentred(page.getByTestId(SECTION_MENU_IDS.trigger('s1-1')));
  await page.getByTestId(SECTION_MENU_IDS.toggleHiddenAction).click();
  await expect(page.getByTestId(EDITABLE_SECTION_BODY_IDS.content('s1-1'))).toBeVisible();
});

test('classifying a section opens the viewers picker and gates its content', async ({ page }) => {
  await page.goto('/document/d1');

  await clickCentred(page.getByTestId(SECTION_MENU_IDS.trigger('s1-2')));
  await page.getByTestId(SECTION_MENU_IDS.toggleClassifiedAction).click();

  const viewersModal = page.getByTestId(CLASSIFIED_VIEWERS_MODAL_IDS.root);
  await expect(viewersModal).toBeVisible();

  // The names used to inherit the document's 16px, because `GridTable` set no
  // body size and this column was the one that forgot to bring its own — so
  // they read larger than the search box directly above them.
  const nameSize = await page
    .getByTestId(CLASSIFIED_VIEWERS_MODAL_IDS.name('u1'))
    .evaluate((el) => getComputedStyle(el).fontSize);
  const searchSize = await page
    .getByTestId(CLASSIFIED_VIEWERS_MODAL_IDS.search)
    .evaluate((el) => getComputedStyle(el).fontSize);
  expect(nameSize).toBe(searchSize);

  const firstCheckbox = page.getByTestId(CLASSIFIED_VIEWERS_MODAL_IDS.checkbox('u1'));
  await firstCheckbox.click();
  await expect(firstCheckbox).toBeChecked();

  await page.getByTestId(CLASSIFIED_VIEWERS_MODAL_IDS.closeBtn).click();
  await expect(viewersModal).not.toBeVisible();

  const sectionBody = page.getByTestId(EDITABLE_SECTION_BODY_IDS.root('s1-2'));
  await expect(sectionBody).toContainText('תוכן ממודר');
  await expect(page.getByTestId(EDITABLE_SECTION_BODY_IDS.content('s1-2'))).toHaveCount(0);
});

test('a section asks for its approvers in the document permissions dialog', async ({ page }) => {
  await page.goto('/document/d1');

  await clickCentred(page.getByTestId(SECTION_MENU_IDS.trigger('s1-1')));
  await page.getByTestId(SECTION_MENU_IDS.approversAction).click();

  await expect(page.getByTestId(DOC_PERMISSIONS_MODAL_IDS.root)).toBeVisible();
  await expect(page.getByTestId(DOC_PERMISSIONS_MODAL_IDS.description)).toContainText(
    'יוכלו לאשר את הסעיף',
  );
  await expect(page.getByTestId(DOC_PERMISSIONS_MODAL_IDS.sectionRow('s1-1'))).toHaveAttribute(
    'aria-pressed',
    'true',
  );
});

test('deleting a section from the section menu removes it from the tree', async ({ page }) => {
  await page.goto('/document/d1');

  const sectionBody = page.getByTestId(EDITABLE_SECTION_BODY_IDS.root('s1-1'));
  await expect(sectionBody).toBeVisible();

  await clickCentred(page.getByTestId(SECTION_MENU_IDS.trigger('s1-1')));
  await page.getByTestId(SECTION_MENU_IDS.deleteAction).click();

  await expect(sectionBody).toHaveCount(0);
});

test('a section menu that fits does not scroll', async ({ page }) => {
  await page.goto('/document/d1');
  await clickCentred(page.getByTestId(SECTION_MENU_IDS.trigger('s1-1')));

  const overflow = await page
    .getByTestId(SECTION_MENU_IDS.panel('s1-1'))
    .evaluate((panel) => panel.scrollHeight - panel.clientHeight);
  expect(overflow).toBe(0);
});

test('the loading state is shaped like the document, not like a list panel', async ({ page }) => {
  await page.goto('/document/d1');

  const skeleton = page.getByTestId(DOCUMENT_PAGE_SKELETON_IDS.root);
  await expect(skeleton).toBeVisible();

  const paper = page.getByTestId(DOCUMENT_PAGE_SKELETON_IDS.paper);
  const skeletonWidth = (await paper.boundingBox())?.width;

  await expect(page.getByTestId(PAPER_CANVAS_IDS.paper)).toBeVisible();
  await expect(skeleton).toHaveCount(0);
  const loadedWidth = (await page.getByTestId(PAPER_CANVAS_IDS.paper).boundingBox())?.width;

  expect(skeletonWidth).toBe(loadedWidth);
});
