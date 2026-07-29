import { expect, test } from '@playwright/test';
import { CLASSIFIED_VIEWERS_MODAL_IDS } from '../../../src/pages/document/components/ClassifiedViewersModal/ClassifiedViewersModal.testids';
import { DOC_PERMISSIONS_MODAL_IDS } from '../../../src/pages/document/components/DocPermissionsModal/DocPermissionsModal.testids';
import { DOCUMENT_METADATA_PILL_IDS } from '../../../src/pages/document/components/DocumentMetadataPill/DocumentMetadataPill.testids';
import { OUTLINE_SECTION_ROW_IDS } from '../../../src/pages/document/components/DocumentOutlineTree/components/OutlineSectionRow/OutlineSectionRow.testids';
import { OUTLINE_SUBJECT_ROW_IDS } from '../../../src/pages/document/components/DocumentOutlineTree/components/OutlineSubjectRow/OutlineSubjectRow.testids';
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
  // The metadata pill shows the organisation inside the same element as the
  // name ("נוהל בטיחות 2026 (ארגון א׳)"), matching main's markup — hence
  // toContainText rather than an exact match.
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

  await clickCentred(page.getByTestId(SECTION_CHAT_IDS.trigger('s1-1')));
  await expect(page.getByTestId(SECTION_CHAT_IDS.panel('s1-1'))).toBeVisible();

  await page.getByTestId(SECTION_CHAT_IDS.input).fill('הודעת בדיקה');
  await page.getByTestId(SECTION_CHAT_IDS.sendBtn).click();

  // The stub mutation carries the same simulated network latency as every
  // other src/api/*.ts resource (STUB_DELAY_MS in stubLink.ts) — assertions
  // auto-retry rather than using a fixed wait.
  //
  // Two messages, not one: a thread nobody has posted to still opens with the
  // other side's prompt (main's CHAT_INIT, seeded in src/api/comments.ts), and
  // the posted message is appended after it.
  const messages = page.locator('[data-testid^="section-chat-message-"]');
  await expect(messages).toHaveCount(2);
  await expect(messages.first()).toContainText('איך אפשר לעזור בסעיף זה?');
  await expect(messages.last()).toContainText('הודעת בדיקה');
  await expect(page.getByTestId(SECTION_CHAT_IDS.input)).toHaveValue('');
});

test('the chat stays open while text is being marked in the document', async ({ page }) => {
  // The bubble is open so the reader can work in the document underneath it —
  // marking a passage to quote starts with a mousedown in the paper, which is
  // exactly what a dismiss-on-outside-click panel closes on.
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
  // Both bubbles live in the same strip of left margin, so two open at once
  // would be one on top of the other.
  await page.goto('/document/d1');

  await clickCentred(page.getByTestId(SECTION_CHAT_IDS.trigger('s1-1')));
  await expect(page.getByTestId(SECTION_CHAT_IDS.panel('s1-1'))).toBeVisible();

  await clickCentred(page.getByTestId(SECTION_CHAT_IDS.trigger('s1-2')));
  await expect(page.getByTestId(SECTION_CHAT_IDS.panel('s1-2'))).toBeVisible();
  await expect(page.getByTestId(SECTION_CHAT_IDS.panel('s1-1'))).toHaveCount(0);
});

test('a section menu takes focus when it opens and keeps Tab inside it', async ({ page }) => {
  // The menu is portalled to the body, so it is no longer next to its trigger in
  // the DOM — without this, Tab would walk straight past it into the page.
  await page.goto('/document/d1');

  await clickCentred(page.getByTestId(SECTION_MENU_IDS.trigger('s1-1')));
  await expect(page.getByTestId(SECTION_MENU_IDS.approversAction)).toBeFocused();

  // Tab off the last item wraps back to the first rather than leaving the menu.
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByTestId(SECTION_MENU_IDS.deleteAction)).toBeFocused();

  // Escape closes it and hands focus back to the button that opened it.
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

  // Toggling back from the menu (still labeled for "show" now) restores it.
  await clickCentred(page.getByTestId(SECTION_MENU_IDS.trigger('s1-1')));
  await page.getByTestId(SECTION_MENU_IDS.toggleHiddenAction).click();
  await expect(page.getByTestId(EDITABLE_SECTION_BODY_IDS.content('s1-1'))).toBeVisible();
});

test('classifying a section opens the viewers picker and gates its content', async ({ page }) => {
  await page.goto('/document/d1');

  await clickCentred(page.getByTestId(SECTION_MENU_IDS.trigger('s1-2')));
  await page.getByTestId(SECTION_MENU_IDS.toggleClassifiedAction).click();

  // Turning classification on immediately opens the viewers picker.
  const viewersModal = page.getByTestId(CLASSIFIED_VIEWERS_MODAL_IDS.root);
  await expect(viewersModal).toBeVisible();

  // u1 = the first entry in src/api/classifiedViewers.ts's pool (main's
  // CLASSIFIED_POOL), which this picker reads instead of the network roster.
  const firstCheckbox = page.getByTestId(CLASSIFIED_VIEWERS_MODAL_IDS.checkbox('u1'));
  await firstCheckbox.click();
  await expect(firstCheckbox).toBeChecked();

  await page.getByTestId(CLASSIFIED_VIEWERS_MODAL_IDS.closeBtn).click();
  await expect(viewersModal).not.toBeVisible();

  // The section body is now gated behind a classification notice, not the editor.
  const sectionBody = page.getByTestId(EDITABLE_SECTION_BODY_IDS.root('s1-2'));
  await expect(sectionBody).toContainText('תוכן ממודר');
  await expect(page.getByTestId(EDITABLE_SECTION_BODY_IDS.content('s1-2'))).toHaveCount(0);
});

test('a section asks for its approvers in the document permissions dialog', async ({ page }) => {
  await page.goto('/document/d1');

  await clickCentred(page.getByTestId(SECTION_MENU_IDS.trigger('s1-1')));
  await page.getByTestId(SECTION_MENU_IDS.approversAction).click();

  // Opened on מאשרי סעיף with this section already selected, so the permission
  // lands where it was asked for rather than on the whole document.
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
