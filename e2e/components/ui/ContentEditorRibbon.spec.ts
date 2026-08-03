import type { Locator, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { TEXT_COLORS } from '../../../src/components/ui/ContentEditor/components/EditorRibbon/EditorRibbon.constants';
import { EDITOR_RIBBON_IDS } from '../../../src/components/ui/ContentEditor/components/EditorRibbon/EditorRibbon.testids';
import { TABLE_EDIT_BAR_IDS } from '../../../src/components/ui/ContentEditor/components/TableEditBar/TableEditBar.testids';
import { EDITABLE_SECTION_BODY_IDS } from '../../../src/pages/document/components/EditableSectionBody/EditableSectionBody.testids';
import { PAPER_CANVAS_IDS } from '../../../src/pages/document/components/PaperCanvas/PaperCanvas.testids';

const openSection = async (page: Page): Promise<Locator> => {
  const sectionContent = page.getByTestId(EDITABLE_SECTION_BODY_IDS.content('s1-1'));
  await sectionContent.click();

  const editable = sectionContent.locator('[contenteditable="true"]');
  await expect(editable).toBeVisible();
  await editable.click();
  return editable;
};

const typeAndSelectAll = async (page: Page, text: string) => {
  await page.keyboard.type(text);
  await page.keyboard.press('Control+a');
};

test('the ribbon is dead until a field is open, and comes alive with one', async ({ page }) => {
  await page.goto('/document/d1');

  const bold = page.getByTestId(EDITOR_RIBBON_IDS.toggle('bold'));
  await expect(bold).toBeDisabled();

  await openSection(page);
  await expect(bold).toBeEnabled();
});

test('bold writes real markup, and the button reads its state back off the caret', async ({
  page,
}) => {
  await page.goto('/document/d1');
  const editable = await openSection(page);

  await typeAndSelectAll(page, 'שלום עולם');

  const bold = page.getByTestId(EDITOR_RIBBON_IDS.toggle('bold'));
  await expect(bold).toHaveAttribute('aria-pressed', 'false');

  await bold.click();
  await expect(editable.locator('strong')).toHaveText('שלום עולם');

  await expect(bold).toHaveAttribute('aria-pressed', 'true');

  await bold.click();
  await expect(editable.locator('strong')).toHaveCount(0);
  await expect(bold).toHaveAttribute('aria-pressed', 'false');
});

test('picking a colour from the palette applies it to the selection', async ({ page }) => {
  await page.goto('/document/d1');
  const editable = await openSection(page);

  await typeAndSelectAll(page, 'צבעוני');

  await page.getByTestId(EDITOR_RIBBON_IDS.colorChevron('text')).click();
  await page.getByTestId(EDITOR_RIBBON_IDS.colorSwatch('text', '#dc2626')).click();

  await expect(editable.locator('span[style*="rgb(220, 38, 38)"]')).toHaveText('צבעוני');
});

test('the selection survives a pick, so the next colour lands on it too', async ({ page }) => {
  await page.goto('/document/d1');
  const editable = await openSection(page);

  await typeAndSelectAll(page, 'צבעוני');

  await page.getByTestId(EDITOR_RIBBON_IDS.colorChevron('text')).click();
  await page.getByTestId(EDITOR_RIBBON_IDS.colorSwatch('text', '#dc2626')).click();
  await expect(editable.locator('span[style*="rgb(220, 38, 38)"]')).toHaveText('צבעוני');

  // No re-selecting in between. A swatch that took focus would drop the
  // highlight — and the browser would grey out what was left of it — so the
  // second colour would land on nothing.
  await page.getByTestId(EDITOR_RIBBON_IDS.colorChevron('text')).click();
  await page.getByTestId(EDITOR_RIBBON_IDS.colorSwatch('text', '#16a34a')).click();
  await expect(editable.locator('span[style*="rgb(22, 163, 74)"]')).toHaveText('צבעוני');
});

test('the palette offers the document colours and nothing else', async ({ page }) => {
  await page.goto('/document/d1');
  await openSection(page);

  await page.getByTestId(EDITOR_RIBBON_IDS.colorChevron('text')).click();

  const menu = page.getByTestId(EDITOR_RIBBON_IDS.colorMenu('text'));
  await expect(menu).toBeVisible();
  await expect(menu.getByRole('button')).toHaveCount(TEXT_COLORS.length);
});

test('every swatch fits inside the palette that holds it', async ({ page }) => {
  await page.goto('/document/d1');
  await openSection(page);

  await page.getByTestId(EDITOR_RIBBON_IDS.colorChevron('text')).click();
  const menu = page.getByTestId(EDITOR_RIBBON_IDS.colorMenu('text'));
  const menuBox = await menu.boundingBox();
  if (!menuBox) throw new Error('the palette has no layout');

  // The panel used to be given a width narrower than its own grid, so the
  // swatches overflowed their tracks and the last column sat outside the box.
  for (const color of TEXT_COLORS) {
    const box = await page.getByTestId(EDITOR_RIBBON_IDS.colorSwatch('text', color)).boundingBox();
    if (!box) throw new Error(`no layout for ${color}`);
    expect(box.x).toBeGreaterThanOrEqual(menuBox.x);
    expect(box.x + box.width).toBeLessThanOrEqual(menuBox.x + menuBox.width);
  }

  expect(await menu.evaluate((el) => el.scrollWidth - el.clientWidth)).toBe(0);
});

test('a palette does not outlive the field it formats', async ({ page }) => {
  await page.goto('/document/d1');
  await openSection(page);

  await page.getByTestId(EDITOR_RIBBON_IDS.colorChevron('text')).click();
  await expect(page.getByTestId(EDITOR_RIBBON_IDS.colorMenu('text'))).toBeVisible();

  await page.getByTestId(PAPER_CANVAS_IDS.root).click({ position: { x: 4, y: 200 } });

  await expect(page.getByTestId(EDITOR_RIBBON_IDS.toggle('bold'))).toBeDisabled();
  await expect(page.getByTestId(EDITOR_RIBBON_IDS.colorMenu('text'))).toHaveCount(0);
});

test('find and replace runs against the field, not against a mock', async ({ page }) => {
  await page.goto('/document/d1');
  const editable = await openSection(page);

  await page.keyboard.type('אלפא ביתא אלפא');

  await page.getByTestId(EDITOR_RIBBON_IDS.findReplaceTrigger).click();
  await page.getByTestId(EDITOR_RIBBON_IDS.findQuery).fill('אלפא');
  await page.getByTestId(EDITOR_RIBBON_IDS.replaceValue).fill('גמא');

  await page.getByRole('button', { name: 'חפש', exact: true }).click();
  await page.getByTestId(EDITOR_RIBBON_IDS.replaceAll).click();

  await expect(editable).toHaveText('גמא ביתא גמא');
});

test('the table bar appears with the caret, edits the table, and leaves with it', async ({
  page,
}) => {
  await page.goto('/document/d1');
  const editable = await openSection(page);

  await page.getByTestId(EDITOR_RIBBON_IDS.tableTrigger).click();
  await page.getByTestId(EDITOR_RIBBON_IDS.tableSizeCell(2, 2)).click();

  const bar = page.getByTestId(TABLE_EDIT_BAR_IDS.root);
  await expect(bar).toBeVisible();
  await expect(editable.locator('tr')).toHaveCount(2);

  await page.getByTestId(TABLE_EDIT_BAR_IDS.action('row-after')).click();
  await expect(editable.locator('tr')).toHaveCount(3);

  await page.getByTestId(TABLE_EDIT_BAR_IDS.action('col-after')).click();
  await expect(editable.locator('tr').first().locator('td')).toHaveCount(3);

  await page.getByTestId(TABLE_EDIT_BAR_IDS.action('table-delete')).click();
  await expect(editable.locator('table')).toHaveCount(0);

  await expect(bar).toHaveCount(0);
});
