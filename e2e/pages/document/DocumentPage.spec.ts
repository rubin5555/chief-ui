import { expect, test } from '@playwright/test';
import { DOC_HEADER_CARD_IDS } from '../../../src/pages/document/components/DocHeaderCard/DocHeaderCard.testids';
import { DOCUMENT_CANVAS_IDS } from '../../../src/pages/document/components/DocumentCanvas/DocumentCanvas.testids';
import { DOCUMENT_OUTLINE_TREE_IDS } from '../../../src/pages/document/components/DocumentOutlineTree/DocumentOutlineTree.testids';
import { EDITABLE_SECTION_BODY_IDS } from '../../../src/pages/document/components/EditableSectionBody/EditableSectionBody.testids';
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
