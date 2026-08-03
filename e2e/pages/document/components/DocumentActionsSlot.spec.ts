import { expect, test } from '@playwright/test';
import { DOC_ACTION_TOOLBAR_IDS } from '../../../../src/components/layout/TopNavbar/components/DocActionToolbar/DocActionToolbar.testids';
import { PAPER_CANVAS_IDS } from '../../../../src/pages/document/components/PaperCanvas/PaperCanvas.testids';

test('the document toolbar mounts into the navbar, not the page body', async ({ page }) => {
  await page.goto('/document/d1');

  const toolbar = page.getByTestId(DOC_ACTION_TOOLBAR_IDS.root);
  await expect(toolbar).toBeVisible();

  await expect(page.locator(`nav >> [data-testid="${DOC_ACTION_TOOLBAR_IDS.root}"]`)).toBeVisible();
});

test('zooming writes the level to the URL and stops at the bounds', async ({ page }) => {
  await page.goto('/document/d1');

  const zoomValue = page.getByTestId(DOC_ACTION_TOOLBAR_IDS.zoomValue);
  await expect(zoomValue).toHaveValue('100');

  await page.getByTestId(DOC_ACTION_TOOLBAR_IDS.zoomIn).click();
  await expect(page).toHaveURL(/zoom=110/);
  await expect(zoomValue).toHaveValue('110');

  await expect(page.getByTestId(PAPER_CANVAS_IDS.paper)).toHaveCSS('zoom', '1.1');

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

  await zoomValue.fill('900');
  await zoomValue.press('Enter');
  await expect(zoomValue).toHaveValue('200');
  await expect(page).toHaveURL(/zoom=200/);

  await zoomValue.fill('60');
  await zoomValue.press('Escape');
  await expect(zoomValue).toHaveValue('200');
});

test('a zoom level back at the default drops out of the URL again', async ({ page }) => {
  await page.goto('/document/d1?zoom=110');

  await page.getByTestId(DOC_ACTION_TOOLBAR_IDS.zoomOut).click();

  await expect(page.getByTestId(DOC_ACTION_TOOLBAR_IDS.zoomValue)).toHaveValue('100');
  await expect(page).not.toHaveURL(/zoom=/);
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
