import { expect, test } from '@playwright/test';
import { SPELL_CHECK_MODAL_IDS } from '../../../../src/modals/SpellCheckModal/SpellCheckModal.testids';
import { SPELL_CHECK_BANNER_IDS } from '../../../../src/pages/profile/components/SpellCheckBanner/SpellCheckBanner.testids';

test.beforeEach(async ({ page }) => {
  await page.goto('/profile');
  await page.waitForSelector(`[data-testid="${SPELL_CHECK_BANNER_IDS.root}"]`);
});

test('banner screenshot', async ({ page }) => {
  await expect(page.getByTestId(SPELL_CHECK_BANNER_IDS.root)).toHaveScreenshot('banner.png');
});

test('install button opens modal', async ({ page }) => {
  await page.getByTestId(SPELL_CHECK_BANNER_IDS.install).click();
  await expect(page.getByTestId(SPELL_CHECK_MODAL_IDS.root)).toBeVisible();
});
