import { expect, test } from '@playwright/test';
import { CATALOG_PAGE_IDS } from '../../../src/pages/catalog/CatalogPage/CatalogPage.testids';
import { CATALOG_SIDEBAR_IDS } from '../../../src/pages/catalog/components/CatalogSidebar/CatalogSidebar.testids';
import { DOCUMENT_CATALOG_IDS } from '../../../src/pages/catalog/components/DocumentCatalog/DocumentCatalog.testids';

const A_DEPARTMENT = 'מחלקת משאבי אנוש';

test('`/` lands on the catalog', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/catalog/);
  await expect(page.getByTestId(CATALOG_PAGE_IDS.root)).toBeVisible();
});

test('the catalog waits for a department before showing anything', async ({ page }) => {
  await page.goto('/catalog');
  await expect(page.getByTestId(CATALOG_PAGE_IDS.emptyState)).toBeVisible();
  await expect(page.getByTestId(DOCUMENT_CATALOG_IDS.root)).toBeHidden();
});

test('picking a department opens its catalog and puts it in the URL', async ({ page }) => {
  await page.goto('/catalog');

  await page.getByTestId(CATALOG_SIDEBAR_IDS.section('myEnvironment')).click();
  await page.getByTestId(CATALOG_SIDEBAR_IDS.subItem(A_DEPARTMENT)).click();

  await expect(page.getByTestId(DOCUMENT_CATALOG_IDS.root)).toBeVisible();
  // Read the param rather than pattern-match the URL: the router encodes a
  // space as `+`, which `encodeURIComponent` writes as `%20`.
  await expect.poll(() => new URL(page.url()).searchParams.get('dept')).toBe(A_DEPARTMENT);
});

test('only the params that differ from their default reach the URL', async ({ page }) => {
  await page.goto('/catalog');
  await expect(page).toHaveURL(/\/catalog$/);

  await page.getByTestId(CATALOG_SIDEBAR_IDS.section('myEnvironment')).click();
  await page.getByTestId(CATALOG_SIDEBAR_IDS.subItem(A_DEPARTMENT)).click();

  // Picking a department writes all sixteen params, fifteen of them their own
  // default. `stripSearchParams` keeps every one of those out of the URL.
  await expect.poll(() => [...new URL(page.url()).searchParams.keys()]).toEqual(['dept']);
});

test('a department in the URL opens straight into its folders', async ({ page }) => {
  await page.goto(`/catalog?dept=${encodeURIComponent(A_DEPARTMENT)}`);

  // No effect syncs this after the fact — the sidebar knows which view to draw
  // on its first render.
  await expect(page.getByTestId(CATALOG_SIDEBAR_IDS.folderView)).toBeVisible();
  await expect(page.getByTestId(CATALOG_SIDEBAR_IDS.navView)).toBeHidden();
});

test('going back to the menu keeps the department selected', async ({ page }) => {
  await page.goto(`/catalog?dept=${encodeURIComponent(A_DEPARTMENT)}`);

  await page.getByTestId(CATALOG_SIDEBAR_IDS.backToMenu).click();

  await expect(page.getByTestId(CATALOG_SIDEBAR_IDS.navView)).toBeVisible();
  await expect(page.getByTestId(DOCUMENT_CATALOG_IDS.root)).toBeVisible();
});
