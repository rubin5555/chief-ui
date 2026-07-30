import { expect, test } from '@playwright/test';
import { ITEM_ROW_IDS } from '../../../src/components/ui/ItemRow/ItemRow.testids';
import { TEMPLATES_PANEL_IDS } from '../../../src/pages/profile/components/tabs/TemplatesPanel/TemplatesPanel.testids';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector(`[data-testid="${TEMPLATES_PANEL_IDS.root}"]`);
});

test('renders a row per template with its actions', async ({ page }) => {
  const row = page.getByTestId(ITEM_ROW_IDS.root).first();
  await expect(row).toBeVisible();
  await expect(row.getByTestId(ITEM_ROW_IDS.action('שכפול'))).toBeVisible();
  await expect(row.getByTestId(ITEM_ROW_IDS.action('מחיקה'))).toBeVisible();
});

test('clicking an action does not trigger the row click handler', async ({ page }) => {
  const row = page.getByTestId(ITEM_ROW_IDS.root).first();
  await row.getByTestId(ITEM_ROW_IDS.action('שכפול')).click();

  await expect(row).toBeVisible();
});
