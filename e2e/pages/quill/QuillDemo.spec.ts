import type { Locator, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { EDITOR_RIBBON_IDS } from '../../../src/components/ui/ContentEditor/components/EditorRibbon/EditorRibbon.testids';
import { TABLE_PROPS_MODAL_IDS } from '../../../src/components/ui/ContentEditor/components/TableEditBar/components/TablePropsModal/TablePropsModal.testids';
import { TABLE_EDIT_BAR_IDS } from '../../../src/components/ui/ContentEditor/components/TableEditBar/TableEditBar.testids';
import { SELECT_IDS } from '../../../src/components/ui/Select/Select.testids';

// Drives EditorRibbon / TableFloatingToolbar controls against TinyQuillEditor on /quill.

const ribbon = (page: Page, id: string) => page.getByTestId(id);
const toggle = (page: Page, id: string) => page.getByTestId(EDITOR_RIBBON_IDS.toggle(id));

const open = async (page: Page, text = 'hello world'): Promise<Locator> => {
  await page.goto('/quill');
  const editable = page.getByTestId('quill-demo-content').locator('.ql-editor');
  await expect(toggle(page, 'bold')).toBeEnabled();
  await editable.click();
  await page.keyboard.press('Control+a');
  await page.keyboard.type(text);
  await page.keyboard.press('Control+a');
  return editable;
};

const pickColor = async (page: Page, id: string, color: string) => {
  await page.getByTestId(EDITOR_RIBBON_IDS.colorChevron(id)).click();
  await page.getByTestId(EDITOR_RIBBON_IDS.colorSwatch(id, color)).click();
};

// Selects `word` as a DOM range, then lets the editor see a mouseup as if the
// user had dragged over it.
const selectWord = (editable: Locator, word: string) =>
  editable.evaluate((root, w) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const at = n.textContent?.indexOf(w) ?? -1;
      if (at < 0) continue;
      const range = document.createRange();
      range.setStart(n, at);
      range.setEnd(n, at + w.length);
      getSelection()?.removeAllRanges();
      getSelection()?.addRange(range);
      document.dispatchEvent(new Event('selectionchange'));
      root.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      return;
    }
    throw new Error(`no "${w}" in editor`);
  }, word);

test('text formats write markup and read their state back', async ({ page }) => {
  const editable = await open(page);
  const cases = [
    ['bold', 'strong'],
    ['italic', 'em'],
    ['underline', 'u'],
    ['strikethrough', 's'],
  ] as const;
  for (const [id, tag] of cases) {
    await toggle(page, id).click();
    await expect(editable.locator(tag)).toHaveText('hello world');
    await expect(toggle(page, id)).toHaveAttribute('aria-pressed', 'true');
    await toggle(page, id).click();
    await expect(editable.locator(tag)).toHaveCount(0);
  }
});

test('text and highlight colours land on the selection', async ({ page }) => {
  const editable = await open(page);
  await pickColor(page, 'text', '#dc2626');
  await expect(editable.locator('span[style*="color"]').first()).toHaveCSS(
    'color',
    'rgb(220, 38, 38)',
  );
  await pickColor(page, 'highlight', '#86efac');
  await expect(editable.locator('[style*="background"]').first()).toHaveCSS(
    'background-color',
    'rgb(134, 239, 172)',
  );
});

test('lists toggle on and off', async ({ page }) => {
  const editable = await open(page);
  await toggle(page, 'list-ordered').click();
  await expect(editable.locator('li[data-list="ordered"]')).toHaveCount(1);
  await expect(toggle(page, 'list-ordered')).toHaveAttribute('aria-pressed', 'true');
  await toggle(page, 'list-unordered').click();
  await expect(editable.locator('li[data-list="bullet"]')).toHaveCount(1);
  await toggle(page, 'list-unordered').click();
  await expect(editable.locator('li')).toHaveCount(0);
});

test('alignment applies and reports the active button', async ({ page }) => {
  const editable = await open(page);
  for (const [id, value] of [
    ['align-center', 'center'],
    ['align-left', 'left'],
    ['align-justify', 'justify'],
    ['align-right', 'right'],
  ] as const) {
    await toggle(page, id).click();
    await expect(editable.locator('p').first()).toHaveCSS('text-align', value);
    await expect(toggle(page, id)).toHaveAttribute('aria-pressed', 'true');
  }
});

test('footnote drops a marker at the caret', async ({ page }) => {
  const editable = await open(page);
  await page.keyboard.press('End');
  await ribbon(page, EDITOR_RIBBON_IDS.footnote).click();
  await expect(editable.locator('sup')).toHaveText('1');
});

test('clear format strips inline formatting', async ({ page }) => {
  const editable = await open(page);
  await toggle(page, 'bold').click();
  await expect(editable.locator('strong')).toHaveCount(1);
  await ribbon(page, EDITOR_RIBBON_IDS.clearFormat).click();
  await expect(editable.locator('strong')).toHaveCount(0);
});

test('format painter carries bold onto the next selection', async ({ page }) => {
  const editable = await open(page, 'one two');
  await selectWord(editable, 'one');
  await toggle(page, 'bold').click();
  await expect(editable.locator('strong')).toHaveText('one');
  await selectWord(editable, 'one');
  await ribbon(page, EDITOR_RIBBON_IDS.formatPainter).click();
  await expect(ribbon(page, EDITOR_RIBBON_IDS.formatPainter)).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await selectWord(editable, 'two');
  await expect(editable.locator('strong')).toHaveText(['one', 'two']);
});

test('find and replace all rewrites every match', async ({ page }) => {
  const editable = await open(page, 'foo bar foo');
  await ribbon(page, EDITOR_RIBBON_IDS.findReplaceTrigger).click();
  await ribbon(page, EDITOR_RIBBON_IDS.findQuery).fill('foo');
  await ribbon(page, EDITOR_RIBBON_IDS.findQuery).press('Enter');
  await ribbon(page, EDITOR_RIBBON_IDS.replaceValue).fill('baz');
  await ribbon(page, EDITOR_RIBBON_IDS.replaceAll).click();
  await expect(editable).toHaveText('baz bar baz');
});

test('every table bar action works on Quill tables', async ({ page }) => {
  const editable = await open(page);
  await page.keyboard.press('End');
  await ribbon(page, EDITOR_RIBBON_IDS.tableTrigger).click();
  await page.getByTestId(EDITOR_RIBBON_IDS.tableSizeCell(2, 2)).click();
  await expect(page.getByTestId(TABLE_EDIT_BAR_IDS.root)).toBeVisible();

  const table = editable.locator('table');
  const rows = table.locator('tr');
  const firstRowCells = rows.first().locator('td,th');
  const act = (id: string) => page.getByTestId(TABLE_EDIT_BAR_IDS.action(id)).click();

  await expect(rows).toHaveCount(2);
  await act('row-after');
  await expect(rows).toHaveCount(3);
  await act('row-before');
  await expect(rows).toHaveCount(4);
  await act('row-delete');
  await expect(rows).toHaveCount(3);

  await expect(firstRowCells).toHaveCount(2);
  await act('col-after');
  await expect(firstRowCells).toHaveCount(3);
  await act('col-before');
  await expect(firstRowCells).toHaveCount(4);
  await act('col-delete');
  await expect(firstRowCells).toHaveCount(3);

  await table.locator('td').first().click();
  await act('merge');
  await expect(table.locator('[colspan="2"]')).toHaveCount(1);
  await act('split');
  await expect(table.locator('[colspan="2"]')).toHaveCount(0);

  await table.locator('td').first().click();
  await pickColor(page, 'fill', '#2563eb');
  await expect(table.locator('td').first()).toHaveCSS('background-color', 'rgb(37, 99, 235)');

  await act('table-props');
  await page.getByTestId(TABLE_PROPS_MODAL_IDS.field('table-width')).fill('50%');
  await page.getByTestId(TABLE_PROPS_MODAL_IDS.captionToggle).click();
  await page.getByTestId(TABLE_PROPS_MODAL_IDS.saveBtn).click();
  await expect(page.getByTestId(TABLE_PROPS_MODAL_IDS.root)).toHaveCount(0);
  expect(await table.evaluate((el) => (el as HTMLElement).style.width)).toBe('50%');
  await expect(table.locator('caption')).toHaveCount(1);

  await table.locator('td').first().click();
  await act('cell-props');
  await page.getByTestId(TABLE_PROPS_MODAL_IDS.field('cell-type')).click();
  await page.getByTestId(SELECT_IDS.option('כותרת לתא')).click();
  await page.getByTestId(TABLE_PROPS_MODAL_IDS.saveBtn).click();
  await expect(table.locator('th')).toHaveCount(1);

  await table.locator('td').first().click();
  await act('table-delete');
  await expect(editable.locator('table')).toHaveCount(0);
});

test('undo and redo walk the history', async ({ page }) => {
  const editable = await open(page);
  await toggle(page, 'bold').click();
  await expect(editable.locator('strong')).toHaveCount(1);
  await page.keyboard.press('Control+z');
  await expect(editable.locator('strong')).toHaveCount(0);
  await page.keyboard.press('Control+y');
  await expect(editable.locator('strong')).toHaveCount(1);
});

test('multi-cell drag selection highlights cells, applies bulk fill, and merges cells', async ({
  page,
}) => {
  const editable = await open(page);
  await page.keyboard.press('End');
  await ribbon(page, EDITOR_RIBBON_IDS.tableTrigger).click();
  await page.getByTestId(EDITOR_RIBBON_IDS.tableSizeCell(2, 2)).click();
  const table = editable.locator('table');
  const cells = table.locator('td');
  await expect(cells).toHaveCount(4);

  // Drag select from cell 0 to cell 1 (top row)
  const box0 = await cells.nth(0).boundingBox();
  const box1 = await cells.nth(1).boundingBox();
  if (box0 && box1) {
    await page.mouse.move(box0.x + box0.width / 2, box0.y + box0.height / 2);
    await page.mouse.down();
    await page.mouse.move(box1.x + box1.width / 2, box1.y + box1.height / 2);
    await page.mouse.up();
  }

  // Both cells should have the visual selection attribute
  await expect(table.locator('td[data-selected-cell="true"]')).toHaveCount(2);

  // Bulk fill color applies to both selected cells
  await pickColor(page, 'fill', '#2563eb');
  await expect(cells.nth(0)).toHaveCSS('background-color', 'rgb(37, 99, 235)');
  await expect(cells.nth(1)).toHaveCSS('background-color', 'rgb(37, 99, 235)');

  // Merge selected cells merges the 2 selected cells into 1 cell with colspan="2"
  await page.getByTestId(TABLE_EDIT_BAR_IDS.action('merge')).click();
  await expect(table.locator('[colspan="2"]')).toHaveCount(1);
  await expect(table.locator('td')).toHaveCount(3);
});
