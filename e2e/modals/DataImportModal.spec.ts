import { expect, test } from '@playwright/test';
import { CONTENT_EDITOR_IDS } from '../../src/components/ui/ContentEditor/ContentEditor.testids';
import { DATA_IMPORT_IDS } from '../../src/modals/DataImportModal/DataImportModal.testids';
import { FIELD_BANK_IDS } from '../../src/modals/TemplateModal/components/FieldBank/FieldBank.testids';
import { TEMPLATE_MODAL_IDS } from '../../src/modals/TemplateModal/TemplateModal.testids';

test.beforeEach(async ({ page }) => {
  await page.goto('/profile');
  await page.getByRole('button', { name: '+ תבנית חדשה' }).click();
  await page.waitForSelector(`[data-testid="${TEMPLATE_MODAL_IDS.root}"]`);
});

const linkFirstField = async (page: import('@playwright/test').Page) => {
  await page.getByTestId(FIELD_BANK_IDS.openPickerBtn).click();
  await page.getByTestId(DATA_IMPORT_IDS.systemRow('sys1')).click();
  await page.getByTestId(DATA_IMPORT_IDS.operationRow('op1')).click();
  await page.getByTestId(DATA_IMPORT_IDS.instanceRow('יחידה 101')).click();
  await page.getByTestId(DATA_IMPORT_IDS.instanceConfirmBtn).click();
  await page.getByTestId(DATA_IMPORT_IDS.fieldRow('מספר יחידה')).click();
};

test('sidebar shows the import bar and opens the picker', async ({ page }) => {
  await expect(page.getByTestId(FIELD_BANK_IDS.bar('bottom'))).toContainText(
    'ייבוא מידע ממערכת מקור',
  );

  await page.getByTestId(FIELD_BANK_IDS.openPickerBtn).click();
  await expect(page.getByTestId(DATA_IMPORT_IDS.root)).toBeVisible();
  await expect(page.getByTestId(DATA_IMPORT_IDS.systemRow('sys1'))).toContainText('UniTree');
});

test('closes the picker from the header close button', async ({ page }) => {
  await page.getByTestId(FIELD_BANK_IDS.openPickerBtn).click();
  await page.getByTestId(DATA_IMPORT_IDS.closeBtn).click();
  await expect(page.getByTestId(DATA_IMPORT_IDS.root)).not.toBeVisible();
});

test('links a field through system → operation → instance → field', async ({ page }) => {
  await linkFirstField(page);

  await expect(page.getByTestId(DATA_IMPORT_IDS.footerHint)).toContainText('1 שדות נבחרו');

  await page.getByTestId(DATA_IMPORT_IDS.submitBtn).click();
  await expect(page.getByTestId(DATA_IMPORT_IDS.root)).not.toBeVisible();

  await expect(page.getByTestId(FIELD_BANK_IDS.bar('top'))).toBeVisible();
  await expect(page.getByTestId(FIELD_BANK_IDS.list)).toContainText('מספר יחידה');
});

test('field bank collapses back to the subject tree', async ({ page }) => {
  await linkFirstField(page);
  await page.getByTestId(DATA_IMPORT_IDS.submitBtn).click();

  await page.getByTestId(FIELD_BANK_IDS.toggleBtn).click();
  await expect(page.getByTestId(TEMPLATE_MODAL_IDS.addSubjectBtn)).toBeVisible();
  await expect(page.getByTestId(FIELD_BANK_IDS.bar('bottom'))).toBeVisible();
});

test('dragging a chip into a section editor inserts it into TinyMCE', async ({ page }) => {
  await page.getByTestId(TEMPLATE_MODAL_IDS.addSubjectBtn).click();
  await page.getByRole('button', { name: 'הוספת סעיף' }).click();

  await linkFirstField(page);
  await page.getByTestId(DATA_IMPORT_IDS.submitBtn).click();
  await expect(page.getByTestId(FIELD_BANK_IDS.list)).toBeVisible();

  await page.evaluate(
    ({ chipSelector, previewSelector }) => {
      const chip = document.querySelector(chipSelector);
      const preview = document.querySelector(previewSelector);
      if (!chip || !preview) throw new Error('drag source or target missing');
      const dataTransfer = new DataTransfer();
      chip.dispatchEvent(
        new DragEvent('dragstart', { bubbles: true, cancelable: true, dataTransfer }),
      );
      const rect = preview.getBoundingClientRect();
      const options = {
        bubbles: true,
        cancelable: true,
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + 12,
        dataTransfer,
      };
      preview.dispatchEvent(new DragEvent('dragover', options));
      preview.dispatchEvent(new DragEvent('drop', options));
    },
    {
      chipSelector: '[data-testid^="field-bank-chip-"]:not([data-testid*="remove"])',
      previewSelector: `[data-testid="${TEMPLATE_MODAL_IDS.preview}"] [data-testid="${CONTENT_EDITOR_IDS.content}"]`,
    },
  );

  await expect(page.locator('.mce-content-body [data-chip-id]')).toContainText('מספר יחידה');

  await page.locator('.mce-content-body [data-chip-remove]').click();
  await expect(page.locator('.mce-content-body [data-chip-id]')).toHaveCount(0);
});
