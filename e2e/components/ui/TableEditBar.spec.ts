import type { Locator, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { EDITOR_RIBBON_IDS } from '../../../src/components/ui/ContentEditor/components/EditorRibbon/EditorRibbon.testids';
import { TABLE_PROPS_MODAL_IDS } from '../../../src/components/ui/ContentEditor/components/TableEditBar/components/TablePropsModal/TablePropsModal.testids';
import { TABLE_EDIT_BAR_IDS } from '../../../src/components/ui/ContentEditor/components/TableEditBar/TableEditBar.testids';
import { SELECT_IDS } from '../../../src/components/ui/Select/Select.testids';
import { EDITABLE_SECTION_BODY_IDS } from '../../../src/pages/document/components/EditableSectionBody/EditableSectionBody.testids';

const BAR_GAP = 6;

const EDGE_MARGIN = 8;

const ZOOMS = [50, 100, 200];

// Opening a section scrolls the page to it, and a scroll shuts any open ribbon
// panel — so let the page come to rest before reaching for the toolbar.
const settleScroll = (page: Page) =>
  page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        let timer = 0;
        const finish = () => {
          window.removeEventListener('scroll', onScroll, true);
          resolve();
        };
        const onScroll = () => {
          window.clearTimeout(timer);
          timer = window.setTimeout(finish, 200);
        };
        window.addEventListener('scroll', onScroll, true);
        timer = window.setTimeout(finish, 200);
      }),
  );

const insertTable = async (page: Page): Promise<Locator> => {
  const sectionContent = page.getByTestId(EDITABLE_SECTION_BODY_IDS.content('s1-1'));
  await sectionContent.click();

  const editable = sectionContent.locator('[contenteditable="true"]');
  await expect(editable).toBeVisible();
  await editable.click();

  const trigger = page.getByTestId(EDITOR_RIBBON_IDS.tableTrigger);
  await expect(trigger).toBeEnabled();
  await settleScroll(page);
  await trigger.click();
  await page.getByTestId(EDITOR_RIBBON_IDS.tableSizeCell(2, 2)).click();
  await expect(page.getByTestId(TABLE_EDIT_BAR_IDS.root)).toBeVisible();

  return editable.locator('table');
};

const boxOf = async (locator: Locator) => {
  const box = await locator.boundingBox();
  if (!box) throw new Error('element has no box');
  return box;
};

// The buttons are drawn at screen scale while the table is drawn at the page's,
// so the bar is only ever as big as what it holds — and a bar forced to the
// table's width is both the wrong size and, once it wraps, the wrong height.
test('the bar is the size of its own buttons at every zoom', async ({ page }) => {
  const sizes: Record<number, { width: number; height: number }> = {};

  for (const zoom of ZOOMS) {
    await page.goto(`/document/d1?zoom=${zoom}`);
    const table = await insertTable(page);
    await table.scrollIntoViewIfNeeded();

    const viewport = page.viewportSize() ?? { width: 0, height: 0 };
    const tableBox = await boxOf(table);
    const barBox = await boxOf(page.getByTestId(TABLE_EDIT_BAR_IDS.root));
    sizes[zoom] = { width: barBox.width, height: barBox.height };

    // Under the table, or over it when there was no room under — never adrift
    // from it, and never off the screen.
    const under = Math.abs(barBox.y - (tableBox.y + tableBox.height + BAR_GAP));
    const over = Math.abs(tableBox.y - (barBox.y + barBox.height + BAR_GAP));
    expect(Math.min(under, over), `zoom ${zoom}%`).toBeLessThan(1);
    expect(barBox.y, `zoom ${zoom}%`).toBeGreaterThanOrEqual(0);
    expect(barBox.y + barBox.height, `zoom ${zoom}%`).toBeLessThanOrEqual(viewport.height);

    // Right edge to right edge, unless the screen edge got there first.
    const tableRight = tableBox.x + tableBox.width;
    const barRight = barBox.x + barBox.width;
    if (tableRight <= viewport.width - EDGE_MARGIN) {
      expect(barRight, `zoom ${zoom}%`).toBeCloseTo(tableRight, 0);
    } else {
      expect(barRight, `zoom ${zoom}%`).toBeLessThanOrEqual(viewport.width - EDGE_MARGIN + 1);
    }
  }

  for (const zoom of ZOOMS) {
    expect(sizes[zoom].width, `zoom ${zoom}%`).toBeCloseTo(sizes[100].width, 0);
    expect(sizes[zoom].height, `zoom ${zoom}%`).toBeCloseTo(sizes[100].height, 0);
  }
});

test('table properties are asked for in the app, and land on the table', async ({ page }) => {
  await page.goto('/document/d1');
  const table = await insertTable(page);

  await page.getByTestId(TABLE_EDIT_BAR_IDS.action('table-props')).click();

  const dialog = page.getByTestId(TABLE_PROPS_MODAL_IDS.root);
  await expect(dialog).toContainText('מאפייני טבלה');

  await page.getByTestId(TABLE_PROPS_MODAL_IDS.field('table-width')).fill('50%');
  await page.getByTestId(TABLE_PROPS_MODAL_IDS.captionToggle).click();
  await page.getByTestId(TABLE_PROPS_MODAL_IDS.saveBtn).click();

  await expect(dialog).toHaveCount(0);
  await expect(table).toHaveCSS('width', /.+/);
  expect(await table.evaluate((el) => el.style.width)).toBe('50%');
  await expect(table.locator('caption')).toHaveCount(1);
});

test('cell properties turn the cell into a header without leaving the app', async ({ page }) => {
  await page.goto('/document/d1');
  const table = await insertTable(page);

  await page.getByTestId(TABLE_EDIT_BAR_IDS.action('cell-props')).click();

  const dialog = page.getByTestId(TABLE_PROPS_MODAL_IDS.root);
  await expect(dialog).toContainText('מאפייני תא');

  await page.getByTestId(TABLE_PROPS_MODAL_IDS.field('cell-type')).click();
  await page.getByTestId(SELECT_IDS.option('כותרת לתא')).click();
  await page.getByTestId(TABLE_PROPS_MODAL_IDS.saveBtn).click();

  await expect(dialog).toHaveCount(0);
  await expect(table.locator('th')).toHaveCount(1);
});

test('the dialog leaves the section holding its editor', async ({ page }) => {
  await page.goto('/document/d1');
  await insertTable(page);

  await page.getByTestId(TABLE_EDIT_BAR_IDS.action('table-props')).click();
  await expect(page.getByTestId(TABLE_PROPS_MODAL_IDS.root)).toBeVisible();

  // Deactivating the field would take the editor, the bar and the dialog with
  // it — the dialog is part of the toolbar, not a click away from it.
  await expect(page.getByTestId(TABLE_EDIT_BAR_IDS.root)).toBeVisible();
  await page.getByTestId(TABLE_PROPS_MODAL_IDS.cancelBtn).click();
  await expect(page.getByTestId(TABLE_EDIT_BAR_IDS.root)).toBeVisible();
});
