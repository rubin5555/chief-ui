import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { DOC_TOOLBAR_IDS } from '../../../../src/pages/document/parity/DocToolbar/DocToolbar.testids';
import { DOCUMENT_HISTORY_IDS } from '../../../../src/pages/document/parity/DocumentHistory/DocumentHistory.testids';
import { OUTLINE_SECTION_ITEM_IDS } from '../../../../src/pages/document/parity/OutlineSectionItem/OutlineSectionItem.testids';
import { PARITY_GALLERY_IDS } from '../../../../src/pages/document/parity/ParityGallery/ParityGallery.testids';
import { SECTION_TABLE_VIEW_IDS } from '../../../../src/pages/document/parity/SectionTableView/SectionTableView.testids';
import { VIDUY_KABALAH_MODAL_IDS } from '../../../../src/pages/document/parity/ViduyKabalahModal/ViduyKabalahModal.testids';

// The inspection route for src/pages/document/parity/. These components are not in
// the live page, so this spec proves only that they still render and still work —
// enough that "ported, not shipped" stays an honest claim.

const SPECIMENS = [
  'doc-toolbar',
  'section-table',
  'viduy-kabalah',
  'document-history',
  'outline-item',
  'page-breaks',
];

/** Waits out anything queued for the next two animation frames. */
const settleLayout = (page: Page) =>
  page.evaluate(
    () =>
      new Promise((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve(null)));
      }),
  );

const openGallery = async (page: Page) => {
  await page.goto('/document/parity');
  // The page-breaks specimen reflows its sheet on the first frame after mount.
  await settleLayout(page);
};

/**
 * Scrolls a control into view and lets the scroll land *before* pressing it.
 *
 * Every popover here uses `useFloatingPanel`, which closes on scroll — because a
 * fixed panel whose trigger has scrolled away is left floating detached. Browsers
 * dispatch scroll events asynchronously, so Playwright's own scroll-into-view can
 * arrive one frame *after* the click it was preparing for, opening a panel and
 * shutting it again. A real user never scrolls the page by pressing a button, so
 * this is a harness artifact rather than something to fix in the component.
 */
const pressAfterScroll = async (page: Page, testId: string) => {
  const control = page.getByTestId(testId);
  await control.scrollIntoViewIfNeeded();
  await settleLayout(page);
  await control.click();
};

test('the gallery renders every parked component', async ({ page }) => {
  await openGallery(page);

  await expect(page.getByTestId(PARITY_GALLERY_IDS.root)).toBeVisible();
  for (const id of SPECIMENS) {
    await expect(page.getByTestId(PARITY_GALLERY_IDS.specimen(id))).toBeVisible();
  }
});

test('the ribbon toggles a format, and alignment options cancel each other', async ({ page }) => {
  await openGallery(page);

  const bold = page.getByTestId(DOC_TOOLBAR_IDS.toggle('bold'));
  await bold.click();
  await expect(bold).toHaveAttribute('aria-pressed', 'true');

  // A paragraph has one alignment, so picking a second drops the first.
  const alignRight = page.getByTestId(DOC_TOOLBAR_IDS.toggle('align-right'));
  const alignCenter = page.getByTestId(DOC_TOOLBAR_IDS.toggle('align-center'));
  await alignRight.click();
  await expect(alignRight).toHaveAttribute('aria-pressed', 'true');
  await alignCenter.click();
  await expect(alignCenter).toHaveAttribute('aria-pressed', 'true');
  await expect(alignRight).toHaveAttribute('aria-pressed', 'false');

  // Bold is in no exclusive group and is untouched by either.
  await expect(bold).toHaveAttribute('aria-pressed', 'true');
});

test('the colour menu picks a swatch, and the table picker reports a size', async ({ page }) => {
  await openGallery(page);

  await pressAfterScroll(page, DOC_TOOLBAR_IDS.colorChevron('text'));
  await expect(page.getByTestId(DOC_TOOLBAR_IDS.colorMenu('text'))).toBeVisible();
  await page.getByTestId(DOC_TOOLBAR_IDS.colorSwatch('text', '#dc2626')).click();
  await expect(page.getByTestId(DOC_TOOLBAR_IDS.colorMenu('text'))).toBeHidden();

  await pressAfterScroll(page, DOC_TOOLBAR_IDS.tableTrigger);
  await page.getByTestId(DOC_TOOLBAR_IDS.tableSizeCell(3, 4)).click();
  await expect(page.getByTestId(PARITY_GALLERY_IDS.lastAction('doc-toolbar'))).toHaveText(
    'הוספת טבלה 3 × 4',
  );
});

test('the custom colour picker opens from the palette and writes back a typed hex', async ({
  page,
}) => {
  await openGallery(page);

  await pressAfterScroll(page, DOC_TOOLBAR_IDS.colorChevron('highlight'));
  await page.getByTestId(DOC_TOOLBAR_IDS.customColorTrigger('highlight')).click();

  const picker = page.getByTestId(DOC_TOOLBAR_IDS.customColorPicker);
  await expect(picker).toBeVisible();

  // Six digits is what turns a draft into a colour, so the preview only follows
  // once the whole value is in.
  await picker.getByLabel('ערך הקסדצימלי').fill('00ff00');
  await expect(picker.getByLabel('א')).toHaveValue('0');
  await expect(picker.getByLabel('B')).toHaveValue('0');

  await picker.getByRole('button', { name: 'אישור' }).click();
  await expect(picker).toBeHidden();
});

test('the table adds a row from the floating toolbar and refuses to empty itself', async ({
  page,
}) => {
  await openGallery(page);

  await page.getByTestId(SECTION_TABLE_VIEW_IDS.cell(0, 0)).click();
  await expect(page.getByTestId(SECTION_TABLE_VIEW_IDS.toolbar)).toBeVisible();

  // A 3×3 grid gains a fourth row.
  await page.getByTestId(SECTION_TABLE_VIEW_IDS.toolbarAction('row-after')).click();
  await expect(page.getByTestId(SECTION_TABLE_VIEW_IDS.cell(3, 0))).toBeVisible();

  const deleteRow = page.getByTestId(SECTION_TABLE_VIEW_IDS.toolbarAction('row-delete'));
  await deleteRow.click();
  await deleteRow.click();
  await deleteRow.click();
  await deleteRow.click();

  // The last row stays: a table with nothing to type into has no way back.
  await expect(page.getByTestId(SECTION_TABLE_VIEW_IDS.cell(0, 0))).toBeVisible();
});

test('the table properties dialog opens on the half the toolbar asked for', async ({ page }) => {
  await openGallery(page);

  await page.getByTestId(SECTION_TABLE_VIEW_IDS.cell(1, 1)).click();
  await page.getByTestId(SECTION_TABLE_VIEW_IDS.toolbarAction('table-props')).click();

  const dialog = page.getByTestId(SECTION_TABLE_VIEW_IDS.propsPanel);
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText('מאפייני טבלה')).toBeVisible();
  await expect(page.getByTestId(SECTION_TABLE_VIEW_IDS.propsField('table-width'))).toBeVisible();

  await dialog.getByRole('button', { name: 'ביטול' }).click();
  await expect(dialog).toBeHidden();
});

test('the acceptance dialog reports which fields were filled, never their contents', async ({
  page,
}) => {
  await openGallery(page);

  await page
    .getByTestId(PARITY_GALLERY_IDS.specimen('viduy-kabalah'))
    .getByRole('button', { name: 'פתיחת החלון' })
    .click();

  const modal = page.getByTestId(VIDUY_KABALAH_MODAL_IDS.root);
  await expect(modal).toBeVisible();
  await page.getByTestId(VIDUY_KABALAH_MODAL_IDS.approvedBy).fill('רס״ן פלוני');
  await page.getByTestId(VIDUY_KABALAH_MODAL_IDS.send).click();

  await expect(page.getByTestId(PARITY_GALLERY_IDS.lastAction('viduy-kabalah'))).toHaveText(
    'נשלח עם: מאשר',
  );
});

test('undo walks back through committed versions and redo walks forward again', async ({
  page,
}) => {
  await openGallery(page);

  const draft = page
    .getByTestId(PARITY_GALLERY_IDS.specimen('document-history'))
    .getByLabel('תוכן לדוגמה');

  // Blur is what commits a version — otherwise every keystroke would be one.
  await draft.fill('גרסה ראשונה');
  await draft.blur();
  await draft.fill('גרסה שנייה');
  await draft.blur();

  await page.getByTestId(DOCUMENT_HISTORY_IDS.undo).click();
  await expect(draft).toHaveValue('גרסה ראשונה');
  await expect(page.getByTestId(DOCUMENT_HISTORY_IDS.pastNotice)).toBeVisible();

  await page.getByTestId(DOCUMENT_HISTORY_IDS.redo).click();
  await expect(draft).toHaveValue('גרסה שנייה');
  await expect(page.getByTestId(DOCUMENT_HISTORY_IDS.pastNotice)).toBeHidden();
});

test('the recursive outline row expands its own children and commits a rename', async ({
  page,
}) => {
  await openGallery(page);

  const child = page.getByTestId(OUTLINE_SECTION_ITEM_IDS.row('demo-section-1'));
  await expect(child).toBeHidden();

  await page.getByTestId(OUTLINE_SECTION_ITEM_IDS.row('demo-topic')).click();
  await expect(child).toBeVisible();

  const rename = page.getByTestId(OUTLINE_SECTION_ITEM_IDS.renameInput('demo-renaming'));
  await rename.fill('נושא ששמו שונה');
  await rename.press('Enter');
  await expect(page.getByTestId(PARITY_GALLERY_IDS.lastAction('outline-item'))).toHaveText(
    'שם חדש: נושא ששמו שונה',
  );
});
