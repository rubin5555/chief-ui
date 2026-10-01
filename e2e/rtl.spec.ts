import { expect, test } from '@playwright/test';

test('document renders right-to-left', async ({ page }) => {
  await page.goto('/profile');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
});
