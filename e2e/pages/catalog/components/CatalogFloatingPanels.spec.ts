import type { Locator, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { DATE_TIME_PICKER_IDS } from '../../../../src/components/ui/DateTimePicker/DateTimePicker.testids';
import { DOCUMENT_CATALOG_IDS } from '../../../../src/pages/catalog/components/DocumentCatalog/DocumentCatalog.testids';

const A_DEPARTMENT = 'מחלקת משאבי אנוש';
const CATALOG_URL = `/catalog?dept=${encodeURIComponent(A_DEPARTMENT)}`;
const A_DOC = 'r1';
// The bottom entry of the distributed shelf's row menu.
const LAST_DISTRIBUTED_ACTION = 'שיתוף המסמך';

// A panel is "cut" when part of it is off-screen — which is what happens to one
// positioned inside a container that hides its overflow, or hung below a
// trigger with less room under it than the panel needs.
const expectWhollyOnScreen = async (page: Page, panel: Locator) => {
  const box = await panel.boundingBox();
  const viewport = page.viewportSize();
  if (!box || !viewport) throw new Error('the panel has no layout');

  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
  expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);
};

test.beforeEach(async ({ page }) => {
  await page.goto(CATALOG_URL);
  await expect(page.getByTestId(DOCUMENT_CATALOG_IDS.table)).toBeVisible();
});

test('the filter panel opens fully on screen', async ({ page }) => {
  await page.getByTestId(DOCUMENT_CATALOG_IDS.filterBtn).click();

  const panel = page.getByTestId(DOCUMENT_CATALOG_IDS.filterPanel);
  await expect(panel).toBeVisible();
  await expectWhollyOnScreen(page, panel);
});

test('a row menu taller than the screen scrolls instead of running off it', async ({ page }) => {
  // The distributed shelf's menu is fourteen items — around 540px, more than
  // the room either above or below a row in the middle of a 720px viewport.
  await page.getByTestId(DOCUMENT_CATALOG_IDS.rowMenu(A_DOC)).click();

  const menu = page.getByTestId(DOCUMENT_CATALOG_IDS.rowMenuPanel);
  await expect(menu).toBeVisible();
  await expectWhollyOnScreen(page, menu);

  // What "not cut" means for a menu that genuinely cannot fit: the last entry
  // is still reachable, by scrolling the menu rather than the page.
  const lastAction = menu.getByRole('button', { name: LAST_DISTRIBUTED_ACTION });
  await lastAction.scrollIntoViewIfNeeded();
  await expect(lastAction).toBeVisible();
});

test('the new-document dropdown opens fully on screen', async ({ page }) => {
  await page.goto(`${CATALOG_URL}&tab=drafts`);
  await page.getByTestId(DOCUMENT_CATALOG_IDS.newDocBtn).click();

  const panel = page.getByTestId(DOCUMENT_CATALOG_IDS.newDocOption);
  await expect(panel).toBeVisible();
  await expectWhollyOnScreen(page, panel);
});

test('picking a date leaves the filter panel open', async ({ page }) => {
  await page.getByTestId(DOCUMENT_CATALOG_IDS.filterBtn).click();
  await page.getByTestId(DOCUMENT_CATALOG_IDS.filterDate('from')).click();

  const calendar = page.getByTestId(DATE_TIME_PICKER_IDS.dropdown);
  await expect(calendar).toBeVisible();

  await calendar.getByTestId(DATE_TIME_PICKER_IDS.nowBtn).click();

  // The calendar portals out to `body`, so this click lands outside the filter
  // panel's own subtree. Read as a click away it closed the panel — and took
  // the calendar down with it, so the date could never be set.
  await expect(page.getByTestId(DOCUMENT_CATALOG_IDS.filterPanel)).toBeVisible();
  await expect(page.getByTestId(DOCUMENT_CATALOG_IDS.filterDate('from'))).not.toHaveText('מ-');
  await expect(page).toHaveURL(/from=/);
});
