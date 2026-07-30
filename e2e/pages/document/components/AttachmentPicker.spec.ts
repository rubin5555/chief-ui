import { expect, test } from '@playwright/test';
import { ATTACHMENT_PICKER_IDS } from '../../../../src/pages/document/components/AttachmentPicker/AttachmentPicker.testids';
import { ATTACHMENT_CHIP_LIST_IDS } from '../../../../src/pages/document/components/AttachmentPicker/components/AttachmentChipList/AttachmentChipList.testids';
import { ATTACHMENTS_MODAL_IDS } from '../../../../src/pages/document/components/AttachmentPicker/components/AttachmentsModal/AttachmentsModal.testids';
import { SOURCE_REFRESH_BUTTON_IDS } from '../../../../src/pages/document/components/NodeActionRow/components/SourceRefreshButton/SourceRefreshButton.testids';
import { SOURCE_SYSTEMS_MODAL_IDS } from '../../../../src/pages/document/components/SourceSystemsModal/SourceSystemsModal.testids';

const SECTION = 's1-1';

const file = (name: string, size: number) => ({
  name,
  mimeType: 'application/pdf',
  buffer: Buffer.alloc(size),
});

test('attaching files lists them in the dialog and under the section', async ({ page }) => {
  await page.goto('/document/d1');

  await page
    .getByTestId(ATTACHMENT_PICKER_IDS.input(SECTION))
    .setInputFiles([file('נספח א.pdf', 2048), file('טבלת נתונים.pdf', 5120)]);

  const modal = page.getByTestId(ATTACHMENTS_MODAL_IDS.root);
  await expect(modal).toBeVisible();
  await expect(modal).toContainText('נספח א.pdf');
  await expect(modal).toContainText('2 KB');
  await expect(modal).toContainText('5 KB');

  await page.getByTestId(ATTACHMENTS_MODAL_IDS.doneBtn).click();
  await expect(modal).not.toBeVisible();

  const chips = page.getByTestId(ATTACHMENT_CHIP_LIST_IDS.root(SECTION)).getByRole('button');
  await expect(chips).toHaveCount(2);
  await expect(chips.first()).toContainText('נספח א.pdf');
});

test('emptying the list leaves the dialog saying so, still offering to add', async ({ page }) => {
  await page.goto('/document/d1');

  await page.getByTestId(ATTACHMENT_PICKER_IDS.input(SECTION)).setInputFiles([file('x.pdf', 1024)]);
  await expect(page.getByTestId(ATTACHMENTS_MODAL_IDS.emptyState)).toHaveCount(0);

  await page.locator('[data-testid^="attachments-modal-delete-"]').click();

  await expect(page.getByTestId(ATTACHMENTS_MODAL_IDS.emptyState)).toHaveText('אין קבצים מצורפים');
  await expect(page.getByTestId(ATTACHMENTS_MODAL_IDS.addMoreBtn)).toBeVisible();
});

test('removing an attachment drops its row and its chip', async ({ page }) => {
  await page.goto('/document/d1');

  await page
    .getByTestId(ATTACHMENT_PICKER_IDS.input(SECTION))
    .setInputFiles([file('ראשון.pdf', 1024), file('שני.pdf', 1024)]);

  const rows = page.locator('[data-testid^="attachments-modal-row-"]');
  await expect(rows).toHaveCount(2);

  await page.locator('[data-testid^="attachments-modal-delete-"]').first().click();
  await expect(rows).toHaveCount(1);

  await page.getByTestId(ATTACHMENTS_MODAL_IDS.doneBtn).click();
  await expect(
    page.getByTestId(ATTACHMENT_CHIP_LIST_IDS.root(SECTION)).getByRole('button'),
  ).toHaveCount(1);
});

test('a chip reopens the dialog it came from', async ({ page }) => {
  await page.goto('/document/d1');

  await page
    .getByTestId(ATTACHMENT_PICKER_IDS.input(SECTION))
    .setInputFiles([file('דוח.pdf', 1024)]);
  await page.getByTestId(ATTACHMENTS_MODAL_IDS.doneBtn).click();
  await expect(page.getByTestId(ATTACHMENTS_MODAL_IDS.root)).not.toBeVisible();

  await page.getByTestId(ATTACHMENT_CHIP_LIST_IDS.root(SECTION)).getByRole('button').click();
  await expect(page.getByTestId(ATTACHMENTS_MODAL_IDS.root)).toBeVisible();
});

test('the source button is live only on a node that came from one', async ({ page }) => {
  await page.goto('/document/d1');

  await expect(page.getByTestId(SOURCE_REFRESH_BUTTON_IDS.root('s1-2'))).toBeDisabled();

  const live = page.getByTestId(SOURCE_REFRESH_BUTTON_IDS.root('s1-1'));
  await expect(live).toBeEnabled();
  await live.click();

  await expect(page.getByTestId(SOURCE_SYSTEMS_MODAL_IDS.intro)).toContainText(
    'סעיף זה מכיל מידע שנוצר ממערכת המקור הבאה',
  );
  await expect(page.getByTestId(SOURCE_SYSTEMS_MODAL_IDS.system('מערכת כוח אדם'))).toBeVisible();
});
