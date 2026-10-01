import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { DOCUMENT_HISTORY_IDS } from '../../../../src/pages/document/parity/DocumentHistory/DocumentHistory.testids';
import { OUTLINE_SECTION_ITEM_IDS } from '../../../../src/pages/document/parity/OutlineSectionItem/OutlineSectionItem.testids';
import { PARITY_GALLERY_IDS } from '../../../../src/pages/document/parity/ParityGallery/ParityGallery.testids';
import { SECTION_TABLE_VIEW_IDS } from '../../../../src/pages/document/parity/SectionTableView/SectionTableView.testids';
import { VIDUY_KABALAH_MODAL_IDS } from '../../../../src/pages/document/parity/ViduyKabalahModal/ViduyKabalahModal.testids';

const SPECIMENS = [
  'section-table',
  'viduy-kabalah',
  'document-history',
  'outline-item',
  'page-breaks',
];

const settleLayout = (page: Page) =>
  page.evaluate(
    () =>
      new Promise((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve(null)));
      }),
  );

const openGallery = async (page: Page) => {
  await page.goto('/document/parity');

  await settleLayout(page);
};

test('the gallery renders every parked component', async ({ page }) => {
  await openGallery(page);

  await expect(page.getByTestId(PARITY_GALLERY_IDS.root)).toBeVisible();
  for (const id of SPECIMENS) {
    await expect(page.getByTestId(PARITY_GALLERY_IDS.specimen(id))).toBeVisible();
  }
});

test('the table adds a row from the floating toolbar and refuses to empty itself', async ({
  page,
}) => {
  await openGallery(page);

  await page.getByTestId(SECTION_TABLE_VIEW_IDS.cell(0, 0)).click();
  await expect(page.getByTestId(SECTION_TABLE_VIEW_IDS.toolbar)).toBeVisible();

  await page.getByTestId(SECTION_TABLE_VIEW_IDS.toolbarAction('row-after')).click();
  await expect(page.getByTestId(SECTION_TABLE_VIEW_IDS.cell(3, 0))).toBeVisible();

  const deleteRow = page.getByTestId(SECTION_TABLE_VIEW_IDS.toolbarAction('row-delete'));
  await deleteRow.click();
  await deleteRow.click();
  await deleteRow.click();
  await deleteRow.click();

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
