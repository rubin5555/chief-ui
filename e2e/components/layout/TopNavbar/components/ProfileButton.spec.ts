import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { PROFILE_BUTTON_IDS } from '../../../../../src/components/layout/TopNavbar/components/ProfileButton/ProfileButton.testids';
import { PROFILE_CONTENT_IDS } from '../../../../../src/pages/profile/components/ProfileContent/ProfileContent.testids';

const TRANSPARENT = 'rgba(0, 0, 0, 0)';

// The fill is what the reader actually sees, and it is what went stale: the
// React Compiler froze the derived active flag, so the icon kept its unselected
// class on every client-side navigation while `aria-current` — which TanStack's
// Link sets on its own — flipped correctly. Asserting the attribute alone
// passes straight through that bug, so these read the painted colour instead.
//
// Polled rather than sampled once: the fill is transitioned, so a single read
// taken the instant a route changes catches the fade rather than the result.
const fillOf = async (page: Page) => {
  // Park the pointer away from the navbar so :hover never colours the reading.
  await page.mouse.move(600, 600);
  return page
    .getByTestId(PROFILE_BUTTON_IDS.trigger)
    .evaluate((node) => getComputedStyle(node).backgroundColor);
};

const expectFill = (page: Page) => expect.poll(() => fillOf(page), { timeout: 5_000 });

test('the old index URL forwards to /profile', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL(/\/profile/);
  await expect(page.getByTestId(PROFILE_CONTENT_IDS.root)).toBeVisible();
});

test('the button is filled on /profile and bare on a document', async ({ page }) => {
  await page.goto('/profile');
  await expectFill(page).not.toBe(TRANSPARENT);
  await expect(page.getByTestId(PROFILE_BUTTON_IDS.trigger)).toHaveAttribute(
    'aria-current',
    'page',
  );

  await page.goto('/document/d1');
  await expectFill(page).toBe(TRANSPARENT);
});

test('the fill follows a client-side navigation, not just a reload', async ({ page }) => {
  await page.goto('/profile');
  const selectedOnReload = await fillOf(page);
  expect(selectedOnReload).not.toBe(TRANSPARENT);

  await page.goto('/document/d1');
  await expectFill(page).toBe(TRANSPARENT);

  await page.getByTestId(PROFILE_BUTTON_IDS.trigger).click();
  await expect(page).toHaveURL(/\/profile/);
  await expect(page.getByTestId(PROFILE_CONTENT_IDS.root)).toBeVisible();

  // Soft navigation has to land on exactly the colour a reload produces.
  await expectFill(page).toBe(selectedOnReload);

  await page.goBack();
  await expect(page).toHaveURL(/\/document\/d1/);
  await expectFill(page).toBe(TRANSPARENT);
});
