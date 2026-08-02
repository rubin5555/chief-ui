import { expect, test } from '@playwright/test';
import { PROFILE_BUTTON_IDS } from '../../../../../src/components/layout/TopNavbar/components/ProfileButton/ProfileButton.testids';
import { PROFILE_CONTENT_IDS } from '../../../../../src/pages/profile/components/ProfileContent/ProfileContent.testids';

test('the old index URL forwards to /profile', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL(/\/profile/);
  await expect(page.getByTestId(PROFILE_CONTENT_IDS.root)).toBeVisible();
});

test('the button is selected on /profile and not on a document', async ({ page }) => {
  await page.goto('/profile');
  const trigger = page.getByTestId(PROFILE_BUTTON_IDS.trigger);
  await expect(trigger).toHaveAttribute('aria-current', 'page');

  await page.goto('/document/d1');
  await expect(trigger).not.toHaveAttribute('aria-current', 'page');
});

test('the button navigates to /profile from a document', async ({ page }) => {
  await page.goto('/document/d1');

  await page.getByTestId(PROFILE_BUTTON_IDS.trigger).click();

  await expect(page).toHaveURL(/\/profile/);
  await expect(page.getByTestId(PROFILE_CONTENT_IDS.root)).toBeVisible();
  await expect(page.getByTestId(PROFILE_BUTTON_IDS.trigger)).toHaveAttribute(
    'aria-current',
    'page',
  );
});
