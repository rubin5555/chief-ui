import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { CONFIRM_DELETE_MODAL_IDS } from '../../src/pages/document/components/DocumentOutlineTree/components/ConfirmDeleteModal/ConfirmDeleteModal.testids';
import { OUTLINE_ROW_MENU_IDS } from '../../src/pages/document/components/DocumentOutlineTree/components/OutlineRowMenu/OutlineRowMenu.testids';

// A deploy that replaced the asset directory leaves an already-open tab asking
// for a chunk the server no longer has. Recreated here by answering one
// on-demand chunk with a 404 — the delete dialog's, which nothing else needs, so
// the rest of the page keeps working exactly as it would in the real case.
const MISSING_CHUNK = '**/*ConfirmDeleteModal*.chunk.js';

const markTab = (page: Page) =>
  page.evaluate(() => {
    (window as unknown as { __tabAlive?: boolean }).__tabAlive = true;
  });

const isTabAlive = (page: Page) =>
  page.evaluate(() => (window as unknown as { __tabAlive?: boolean }).__tabAlive === true);

const openDeleteDialog = async (page: Page) => {
  await page.getByTestId(OUTLINE_ROW_MENU_IDS.trigger('s1')).click();
  await page.getByTestId(OUTLINE_ROW_MENU_IDS.deleteAction).click();
};

const openDocument = async (page: Page) => {
  await page.goto('/document/d1');
  await expect(page.getByTestId(OUTLINE_ROW_MENU_IDS.trigger('s1'))).toBeVisible();
};

test('a chunk the server no longer has costs a reload, not a crash', async ({ page }) => {
  await openDocument(page);
  await markTab(page);
  expect(await isTabAlive(page)).toBe(true);

  await page.route(MISSING_CHUNK, (route) => route.fulfill({ status: 404, body: '' }));

  const reloaded = page.waitForEvent('load', { timeout: 15_000 });
  await openDeleteDialog(page);
  await reloaded;

  // The mark is wiped by a reload and by nothing else, so losing it is the proof.
  expect(await isTabAlive(page)).toBe(false);
  await expect(page.getByTestId(OUTLINE_ROW_MENU_IDS.trigger('s1'))).toBeVisible();
});

test('the reload happens once, so a broken deploy cannot spin', async ({ page }) => {
  await openDocument(page);
  await page.route(MISSING_CHUNK, (route) => route.fulfill({ status: 404, body: '' }));

  await openDeleteDialog(page);
  await expect(page.getByTestId(OUTLINE_ROW_MENU_IDS.trigger('s1'))).toBeVisible();
  await markTab(page);

  // Second attempt, still inside the cooldown: the chunk fails again and this
  // time the app has to live with it rather than reload on top of a reload.
  await openDeleteDialog(page);
  await page.waitForTimeout(3_000);

  expect(await isTabAlive(page)).toBe(true);
  await expect(page.getByTestId(CONFIRM_DELETE_MODAL_IDS.root)).toHaveCount(0);
});
