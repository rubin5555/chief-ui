import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { ITEM_ROW_IDS } from '../../../src/components/ui/ItemRow/ItemRow.testids';
import { TAB_CARD_IDS } from '../../../src/components/ui/TabCard/TabCard.testids';
import { SPELL_CHECK_MODAL_IDS } from '../../../src/modals/SpellCheckModal/SpellCheckModal.testids';
import { PROFILE_CONTENT_IDS } from '../../../src/pages/profile/components/ProfileContent/ProfileContent.testids';
import { PROFILE_SIDEBAR_IDS } from '../../../src/pages/profile/components/ProfileSidebar/ProfileSidebar.testids';
import { SPELL_CHECK_BANNER_IDS } from '../../../src/pages/profile/components/SpellCheckBanner/SpellCheckBanner.testids';
import { LISTS_PANEL_IDS } from '../../../src/pages/profile/components/tabs/ListsPanel/ListsPanel.testids';
import { SIGNATURES_PANEL_IDS } from '../../../src/pages/profile/components/tabs/SignaturesPanel/SignaturesPanel.testids';
import { TEMPLATES_PANEL_IDS } from '../../../src/pages/profile/components/tabs/TemplatesPanel/TemplatesPanel.testids';

// Every screenshot below waits for a row, not just for the panel that will hold
// one. The stub link answers on a delay, so a panel is on screen well before its
// contents are: without this the shot catches the loading skeleton, and whether
// it does is a race with however busy the machine is — which is what made these
// two "flaky under parallel load" rather than simply wrong.
const waitForLoadedRows = (page: Page) =>
  expect(page.getByTestId(ITEM_ROW_IDS.root).first()).toBeVisible();

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector(`[data-testid="${PROFILE_SIDEBAR_IDS.root}"]`);
  await waitForLoadedRows(page);
});

test('full page screenshot', async ({ page }) => {
  await expect(page).toHaveScreenshot('full-page.png', { fullPage: true });
});

test('sidebar screenshot', async ({ page }) => {
  await expect(page.getByTestId(PROFILE_SIDEBAR_IDS.root)).toHaveScreenshot('sidebar.png');
});

test('content area screenshot', async ({ page }) => {
  await expect(page.getByTestId(PROFILE_CONTENT_IDS.root)).toHaveScreenshot('content.png');
});

test('templates panel is active by default', async ({ page }) => {
  const panel = page.getByTestId(TEMPLATES_PANEL_IDS.root);
  await expect(panel).toBeVisible();
  await expect(panel).toHaveScreenshot('templates-panel.png');
});

test('navigate to signatures panel', async ({ page }) => {
  await page.getByTestId(TAB_CARD_IDS.card('חתימות')).click();
  const panel = page.getByTestId(SIGNATURES_PANEL_IDS.root);
  await expect(panel).toBeVisible();
  await waitForLoadedRows(page);
  await expect(panel).toHaveScreenshot('signatures-panel.png');
});

test('navigate to lists panel', async ({ page }) => {
  await page.getByTestId(TAB_CARD_IDS.card('רשימות תפוצה')).click();
  const panel = page.getByTestId(LISTS_PANEL_IDS.root);
  await expect(panel).toBeVisible();
  await waitForLoadedRows(page);
  await expect(panel).toHaveScreenshot('lists-panel.png');
});

test('spellcheck modal opens and closes', async ({ page }) => {
  await page.getByTestId(SPELL_CHECK_BANNER_IDS.install).click();
  const modal = page.getByTestId(SPELL_CHECK_MODAL_IDS.root);
  await expect(modal).toBeVisible();
  await expect(modal).toHaveScreenshot('spellcheck-modal.png');
  await page.getByTestId(SPELL_CHECK_MODAL_IDS.close).click();
  await expect(modal).not.toBeVisible();
});
