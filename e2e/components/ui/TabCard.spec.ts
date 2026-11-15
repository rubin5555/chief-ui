import { expect, test } from '@playwright/test';
import { TAB_CARD_IDS } from '../../../src/components/ui/TabCard/TabCard.testids';
import { LISTS_PANEL_IDS } from '../../../src/pages/profile/components/tabs/ListsPanel/ListsPanel.testids';
import { TEMPLATES_PANEL_IDS } from '../../../src/pages/profile/components/tabs/TemplatesPanel/TemplatesPanel.testids';

const TAB_LABELS = ['תבניות', 'חתימות', 'רשימות תפוצה'];

test.beforeEach(async ({ page }) => {
  await page.goto('/profile');
  await page.waitForSelector(`[data-testid="${TEMPLATES_PANEL_IDS.root}"]`);
});

test('renders a card for every profile tab', async ({ page }) => {
  for (const label of TAB_LABELS) {
    await expect(page.getByTestId(TAB_CARD_IDS.card(label))).toBeVisible();
  }
});

test('clicking a tab card activates the matching panel', async ({ page }) => {
  await page.getByTestId(TAB_CARD_IDS.card('רשימות תפוצה')).click();
  await expect(page.getByTestId(LISTS_PANEL_IDS.root)).toBeVisible();
});
