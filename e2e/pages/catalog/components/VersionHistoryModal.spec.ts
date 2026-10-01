import type { Locator, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { CATALOG_MODAL_IDS } from '../../../../src/pages/catalog/components/DocumentCatalog/components/catalogModals.testids';
import { DOCUMENT_CATALOG_IDS } from '../../../../src/pages/catalog/components/DocumentCatalog/DocumentCatalog.testids';

const A_DEPARTMENT = 'מחלקת משאבי אנוש';
const PARENT_DOC = 'r1';
const PARENT_DOC_NAME = 'פקודת בטיחות מרחב א׳';

const ALL_VERSIONS = 5;
const IN_APPROVAL = 'בסבב אישורים';
const IN_APPROVAL_VERSIONS = 2;

const openHistory = async (page: Page): Promise<Locator> => {
  await page.goto(`/catalog?dept=${encodeURIComponent(A_DEPARTMENT)}`);
  await expect(page.getByTestId(DOCUMENT_CATALOG_IDS.table)).toBeVisible();
  await page.getByTestId(DOCUMENT_CATALOG_IDS.rowHistory(PARENT_DOC)).click();

  const dialog = page.getByTestId(CATALOG_MODAL_IDS.history);
  await expect(dialog).toBeVisible();
  return dialog;
};

const versionRows = (dialog: Locator) => dialog.locator('[data-index]');

// Whether each edge of the element reads back as the element — an edge that
// answers with something else has been clipped by an ancestor, which a bounding
// box cannot tell you, because clipping does not shrink it. Edge midpoints
// rather than corners: a rounded corner is genuinely not the element.
const isWhollyVisible = (locator: Locator) =>
  locator.evaluate((el) => {
    const box = el.getBoundingClientRect();
    const midX = box.left + box.width / 2;
    const midY = box.top + box.height / 2;
    const edges: [number, number][] = [
      [midX, box.top + 2],
      [midX, box.bottom - 2],
      [box.left + 2, midY],
      [box.right - 2, midY],
    ];
    return edges.every(([x, y]) => el.contains(document.elementFromPoint(x, y)));
  });

test('the dialog says what it is and which document it is about', async ({ page }) => {
  const dialog = await openHistory(page);

  await expect(dialog).toContainText('היסטוריית גרסאות');
  await expect(dialog).toContainText(PARENT_DOC_NAME);
});

test('the status panel opens whole, and not cut off by the dialog', async ({ page }) => {
  const dialog = await openHistory(page);
  await page.getByTestId(CATALOG_MODAL_IDS.historyStatusFilter).click();

  const panel = page.getByTestId(CATALOG_MODAL_IDS.historyStatusPanel);
  await expect(panel).toBeVisible();
  await expect(panel).toBeInViewport({ ratio: 1 });
  expect(await isWhollyVisible(panel)).toBe(true);

  // Every status the versions carry is offered, all of it on screen.
  await expect(panel.locator('label')).toHaveCount(3);
  expect(await isWhollyVisible(panel.locator('label').last())).toBe(true);

  // …and it belongs to the dialog, so picking in it does not dismiss it.
  await expect(dialog).toBeVisible();
});

test('a status narrows the versions, and clearing brings them all back', async ({ page }) => {
  const dialog = await openHistory(page);
  await expect(versionRows(dialog)).toHaveCount(ALL_VERSIONS);

  const chip = page.getByTestId(CATALOG_MODAL_IDS.historyStatusFilter);
  await chip.click();
  await page.getByTestId(CATALOG_MODAL_IDS.historyStatusOption(IN_APPROVAL)).click();

  await expect(versionRows(dialog)).toHaveCount(IN_APPROVAL_VERSIONS);
  await expect(chip).toContainText('סטטוס (1)');

  // The X inside the chip clears the filter without reopening the panel.
  await chip.locator('svg').last().click();
  await expect(versionRows(dialog)).toHaveCount(ALL_VERSIONS);
  await expect(chip).toContainText('סינון לפי סטטוס');
});

test('the panel closes on a click away, and the dialog stays', async ({ page }) => {
  const dialog = await openHistory(page);
  await page.getByTestId(CATALOG_MODAL_IDS.historyStatusFilter).click();

  const panel = page.getByTestId(CATALOG_MODAL_IDS.historyStatusPanel);
  await expect(panel).toBeVisible();

  await dialog.getByText(PARENT_DOC_NAME).click();
  await expect(panel).toHaveCount(0);
  await expect(dialog).toBeVisible();
});
