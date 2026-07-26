import { expect, test } from '@playwright/test';
import { DOC_HEADER_CARD_IDS } from '../../../src/pages/document/components/DocHeaderCard/DocHeaderCard.testids';
import { DOCUMENT_CANVAS_IDS } from '../../../src/pages/document/components/DocumentCanvas/DocumentCanvas.testids';
import { DOCUMENT_OUTLINE_TREE_IDS } from '../../../src/pages/document/components/DocumentOutlineTree/DocumentOutlineTree.testids';
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
