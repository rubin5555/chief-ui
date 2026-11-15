import { expect, test } from '@playwright/test';
import { FAQ_ENTRIES } from '../../../../../src/components/layout/TopNavbar/components/TrainingMenu/TrainingMenu.constants';
import { TRAINING_MENU_IDS } from '../../../../../src/components/layout/TopNavbar/components/TrainingMenu/TrainingMenu.testids';

test.beforeEach(async ({ page }) => {
  await page.goto('/profile');
  await page.waitForSelector(`[data-testid="${TRAINING_MENU_IDS.trigger}"]`);
});

test('opens the panel with guide and course options', async ({ page }) => {
  await page.getByTestId(TRAINING_MENU_IDS.trigger).click();
  await expect(page.getByTestId(TRAINING_MENU_IDS.panel)).toBeVisible();
  await expect(page.getByTestId(TRAINING_MENU_IDS.guideOption)).toBeVisible();
  await expect(page.getByTestId(TRAINING_MENU_IDS.courseOption)).toBeVisible();
});

test('guide option opens the FAQ panel and back button returns', async ({ page }) => {
  await page.getByTestId(TRAINING_MENU_IDS.trigger).click();
  await page.getByTestId(TRAINING_MENU_IDS.guideOption).click();

  const faqPanel = page.getByTestId(TRAINING_MENU_IDS.faqPanel);
  await expect(faqPanel).toBeVisible();
  for (const faq of FAQ_ENTRIES) {
    await expect(page.getByTestId(TRAINING_MENU_IDS.faqItem(faq.id))).toBeVisible();
  }

  await page.getByTestId(TRAINING_MENU_IDS.faqBack).click();
  await expect(faqPanel).not.toBeVisible();
  await expect(page.getByTestId(TRAINING_MENU_IDS.panel)).toBeVisible();
});
