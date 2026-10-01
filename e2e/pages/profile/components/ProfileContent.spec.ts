import { expect, test } from '@playwright/test';
import { TAB_CARD_IDS } from '../../../../src/components/ui/TabCard/TabCard.testids';
import { PROFILE_CONTENT_IDS } from '../../../../src/pages/profile/components/ProfileContent/ProfileContent.testids';
import { SIGNATURES_PANEL_IDS } from '../../../../src/pages/profile/components/tabs/SignaturesPanel/SignaturesPanel.testids';
import { TEMPLATES_PANEL_IDS } from '../../../../src/pages/profile/components/tabs/TemplatesPanel/TemplatesPanel.testids';

test.beforeEach(async ({ page }) => {
  await page.goto('/profile');
  await page.waitForSelector(`[data-testid="${PROFILE_CONTENT_IDS.root}"]`);
});

test('renders the tab grid', async ({ page }) => {
  await expect(page.getByTestId(PROFILE_CONTENT_IDS.tabs)).toBeVisible();
});

test('default tab panel is shown', async ({ page }) => {
  await expect(page.getByTestId(TEMPLATES_PANEL_IDS.root)).toBeVisible();
});

test('switching tabs swaps the rendered panel', async ({ page }) => {
  await page.getByTestId(TAB_CARD_IDS.card('חתימות')).click();
  await expect(page.getByTestId(SIGNATURES_PANEL_IDS.root)).toBeVisible();
  await expect(page.getByTestId(TEMPLATES_PANEL_IDS.root)).not.toBeVisible();
});
