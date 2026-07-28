import { expect, test } from '@playwright/test';
import { ITEM_ROW_IDS } from '../../../../../src/components/ui/ItemRow/ItemRow.testids';
import { TEMPLATES_PANEL_IDS } from '../../../../../src/pages/profile/components/tabs/TemplatesPanel/TemplatesPanel.testids';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector(`[data-testid="${TEMPLATES_PANEL_IDS.root}"]`);
  // The panel is on screen before its rows are — see ProfilePage.spec.ts.
  await expect(page.getByTestId(ITEM_ROW_IDS.root).first()).toBeVisible();
});

test('panel screenshot', async ({ page }) => {
  await expect(page.getByTestId(TEMPLATES_PANEL_IDS.root)).toHaveScreenshot('templates-panel.png');
});

test('toolbar screenshot', async ({ page }) => {
  await expect(page.getByTestId(TEMPLATES_PANEL_IDS.toolbar)).toHaveScreenshot('toolbar.png');
});

test('item rows are visible', async ({ page }) => {
  await expect(page.getByTestId(ITEM_ROW_IDS.root).first()).toBeVisible();
});
