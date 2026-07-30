import { expect, test } from '@playwright/test';
import { DOC_ACTION_TOOLBAR_IDS } from '../../../../src/components/layout/TopNavbar/components/DocActionToolbar/DocActionToolbar.testids';
import { PAPER_CANVAS_IDS } from '../../../../src/pages/document/components/PaperCanvas/PaperCanvas.testids';

// The toolbar is built as navbar chrome but filled by the document page, which
// portals it up through NavToolbarSlot. These cover the seam: a control in the
// navbar subtree changing state that the paper — a different subtree — reads back
// out of the URL.

test('the document toolbar mounts into the navbar, not the page body', async ({ page }) => {
  await page.goto('/document/d1');

  const toolbar = page.getByTestId(DOC_ACTION_TOOLBAR_IDS.root);
  await expect(toolbar).toBeVisible();

  // Portalled into the navbar's leading group, where main puts it
  // (TopNavbar.tsx:1250) — not left behind in the page it's declared in.
  await expect(page.locator(`nav >> [data-testid="${DOC_ACTION_TOOLBAR_IDS.root}"]`)).toBeVisible();
});

test('zooming writes the level to the URL and stops at the bounds', async ({ page }) => {
  await page.goto('/document/d1');

  const zoomValue = page.getByTestId(DOC_ACTION_TOOLBAR_IDS.zoomValue);
  await expect(zoomValue).toHaveValue('100');

  await page.getByTestId(DOC_ACTION_TOOLBAR_IDS.zoomIn).click();
  await expect(page).toHaveURL(/zoom=110/);
  await expect(zoomValue).toHaveValue('110');

  // The paper scales with it — the control and the sheet are in different subtrees
  // and share nothing but the search param.
  await expect(page.getByTestId(PAPER_CANVAS_IDS.paper)).toHaveCSS('zoom', '1.1');

  // ZOOM_MIN is 50: six presses from 110 would reach 50 exactly, and a seventh must
  // hold there rather than falling back to the schema's default.
  for (let i = 0; i < 7; i++) await page.getByTestId(DOC_ACTION_TOOLBAR_IDS.zoomOut).click();

  await expect(zoomValue).toHaveValue('50');
  await expect(page).toHaveURL(/zoom=50/);
});

test('the zoom level can be typed straight in, and is clamped on commit', async ({ page }) => {
  await page.goto('/document/d1');

  const zoomValue = page.getByTestId(DOC_ACTION_TOOLBAR_IDS.zoomValue);
  await zoomValue.fill('175');
  await zoomValue.press('Enter');

  await expect(page).toHaveURL(/zoom=175/);
  await expect(page.getByTestId(PAPER_CANVAS_IDS.paper)).toHaveCSS('zoom', '1.75');

  // Past ZOOM_MAX the owner pins it, and the field falls back to what was
  // actually applied rather than to what was asked for.
  await zoomValue.fill('900');
  await zoomValue.press('Enter');
  await expect(zoomValue).toHaveValue('200');
  await expect(page).toHaveURL(/zoom=200/);

  // Escape abandons a half-typed number instead of committing it.
  await zoomValue.fill('60');
  await zoomValue.press('Escape');
  await expect(zoomValue).toHaveValue('200');
});

test('a bookmarked zoom level is restored on load', async ({ page }) => {
  await page.goto('/document/d1?zoom=75');

  await expect(page.getByTestId(DOC_ACTION_TOOLBAR_IDS.zoomValue)).toHaveValue('75');
  await expect(page.getByTestId(PAPER_CANVAS_IDS.paper)).toHaveCSS('zoom', '0.75');
});

test('an out-of-range zoom in the URL falls back to the default', async ({ page }) => {
  await page.goto('/document/d1?zoom=4000');

  await expect(page.getByTestId(DOC_ACTION_TOOLBAR_IDS.zoomValue)).toHaveValue('100');
});

test('the search field publishes its query to the URL, and clears on close', async ({ page }) => {
  await page.goto('/document/d1');

  await page.getByTestId(DOC_ACTION_TOOLBAR_IDS.searchToggle).click();
  await page.getByTestId(DOC_ACTION_TOOLBAR_IDS.searchInput).fill('בטיחות');

  // Debounced by 300ms, so the URL trails the keystrokes on purpose.
  await expect(page).toHaveURL(/q=/, { timeout: 2000 });

  await page.getByTestId(DOC_ACTION_TOOLBAR_IDS.searchClose).click();
  await expect(page.getByTestId(DOC_ACTION_TOOLBAR_IDS.searchInput)).toHaveCount(0);
  await expect(page).not.toHaveURL(/q=%D7%91/);
});

test('a bookmarked query opens the search field already filled', async ({ page }) => {
  await page.goto('/document/d1?q=%D7%91%D7%98%D7%99%D7%97%D7%95%D7%AA');

  const input = page.getByTestId(DOC_ACTION_TOOLBAR_IDS.searchInput);
  await expect(input).toBeVisible();
  await expect(input).toHaveValue('בטיחות');
});
