import { expect, test } from '@playwright/test';
import { TAB_CARD_IDS } from '../../../../../src/components/ui/TabCard/TabCard.testids';
import { SIGNATURES_PANEL_IDS } from '../../../../../src/pages/profile/components/tabs/SignaturesPanel/SignaturesPanel.testids';

test.beforeEach(async ({ page }) => {
  await page.goto('/profile');
  await page.getByTestId(TAB_CARD_IDS.card('חתימות')).click();
  await page.waitForSelector(`[data-testid="${SIGNATURES_PANEL_IDS.root}"]`);
});

test('panel screenshot', async ({ page }) => {
  await expect(page.getByTestId(SIGNATURES_PANEL_IDS.root)).toHaveScreenshot(
    'signatures-panel.png',
  );
});

test('toolbar screenshot', async ({ page }) => {
  await expect(page.getByTestId(SIGNATURES_PANEL_IDS.toolbar)).toHaveScreenshot('toolbar.png');
});
