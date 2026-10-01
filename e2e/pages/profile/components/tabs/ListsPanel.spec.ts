import { expect, test } from '@playwright/test';
import { TAB_CARD_IDS } from '../../../../../src/components/ui/TabCard/TabCard.testids';
import { LISTS_PANEL_IDS } from '../../../../../src/pages/profile/components/tabs/ListsPanel/ListsPanel.testids';

test.beforeEach(async ({ page }) => {
  await page.goto('/profile');
  await page.getByTestId(TAB_CARD_IDS.card('רשימות תפוצה')).click();
  await page.waitForSelector(`[data-testid="${LISTS_PANEL_IDS.root}"]`);
});

test('panel screenshot', async ({ page }) => {
  await expect(page.getByTestId(LISTS_PANEL_IDS.root)).toHaveScreenshot('lists-panel.png');
});

test('toolbar screenshot', async ({ page }) => {
  await expect(page.getByTestId(LISTS_PANEL_IDS.toolbar)).toHaveScreenshot('toolbar.png');
});
