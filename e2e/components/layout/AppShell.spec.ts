import { expect, test } from '@playwright/test';
import { APP_SHELL_IDS } from '../../../src/components/layout/AppShell/AppShell.testids';

test('shell renders', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId(APP_SHELL_IDS.root)).toBeVisible();
});
