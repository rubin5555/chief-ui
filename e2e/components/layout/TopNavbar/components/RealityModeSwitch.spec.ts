import { expect, test } from '@playwright/test';
import { REALITY_MODE_OPTIONS } from '../../../../../src/components/layout/TopNavbar/components/RealityModeSwitch/RealityModeSwitch.constants';
import { REALITY_MODE_SWITCH_IDS } from '../../../../../src/components/layout/TopNavbar/components/RealityModeSwitch/RealityModeSwitch.testids';

test.beforeEach(async ({ page }) => {
  await page.goto('/profile');
  await page.waitForSelector(`[data-testid="${REALITY_MODE_SWITCH_IDS.root}"]`);
});

test('opens the mode menu with every option', async ({ page }) => {
  await page.getByTestId(REALITY_MODE_SWITCH_IDS.trigger).click();
  await expect(page.getByTestId(REALITY_MODE_SWITCH_IDS.menu)).toBeVisible();

  for (const option of REALITY_MODE_OPTIONS) {
    await expect(page.getByTestId(REALITY_MODE_SWITCH_IDS.option(option))).toBeVisible();
  }
});

test('selecting an option updates the trigger label and closes the menu', async ({ page }) => {
  await page.getByTestId(REALITY_MODE_SWITCH_IDS.trigger).click();
  const [option] = REALITY_MODE_OPTIONS;
  await page.getByTestId(REALITY_MODE_SWITCH_IDS.option(option)).click();

  await expect(page.getByTestId(REALITY_MODE_SWITCH_IDS.menu)).not.toBeVisible();
  await expect(page.getByTestId(REALITY_MODE_SWITCH_IDS.trigger)).toContainText(option);
});
