import { expect, test } from '@playwright/test';
import { SPELL_CHECK_MODAL_IDS } from '../../src/modals/SpellCheckModal/SpellCheckModal.testids';
import { SPELL_CHECK_BANNER_IDS } from '../../src/pages/profile/components/SpellCheckBanner/SpellCheckBanner.testids';

test.beforeEach(async ({ page }) => {
  await page.goto('/profile');
  await page.waitForSelector(`[data-testid="${SPELL_CHECK_BANNER_IDS.root}"]`);
  await page.getByTestId(SPELL_CHECK_BANNER_IDS.install).click();
  await page.waitForSelector(`[data-testid="${SPELL_CHECK_MODAL_IDS.root}"]`);
});

test('modal screenshot', async ({ page }) => {
  await expect(page.getByTestId(SPELL_CHECK_MODAL_IDS.root)).toHaveScreenshot('modal.png');
});

test('closes on overlay click', async ({ page }) => {
  await page.getByTestId(SPELL_CHECK_MODAL_IDS.overlay).click({ position: { x: 5, y: 5 } });
  await expect(page.getByTestId(SPELL_CHECK_MODAL_IDS.root)).not.toBeVisible();
});

test('closes on close button', async ({ page }) => {
  await page.getByTestId(SPELL_CHECK_MODAL_IDS.close).click();
  await expect(page.getByTestId(SPELL_CHECK_MODAL_IDS.root)).not.toBeVisible();
});
