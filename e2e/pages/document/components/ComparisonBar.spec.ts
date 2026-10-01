import { expect, test } from '@playwright/test';
import { DOC_ACTION_TOOLBAR_IDS } from '../../../../src/components/layout/TopNavbar/components/DocActionToolbar/DocActionToolbar.testids';
import { COMPARISON_BAR_IDS } from '../../../../src/pages/document/components/ComparisonBar/ComparisonBar.testids';
import { VERSION_PICKER_MODAL_IDS } from '../../../../src/pages/document/components/DocumentActionsSlot/components/VersionPickerModal/VersionPickerModal.testids';

const VERSION = 'עדכון מס׳ 1';

test('picking a version opens the comparison bar, and closing it clears the URL', async ({
  page,
}) => {
  await page.goto('/document/d1');

  await expect(page.getByTestId(COMPARISON_BAR_IDS.root)).toHaveCount(0);
  await page.getByTestId(DOC_ACTION_TOOLBAR_IDS.compare).click();

  const picker = page.getByTestId(VERSION_PICKER_MODAL_IDS.root);
  await expect(picker).toBeVisible();

  await expect(picker).toContainText('נוכחית');
  await expect(picker).toContainText('א׳-2026-088');

  await page.getByTestId(VERSION_PICKER_MODAL_IDS.version(VERSION)).click();

  await expect(page.getByTestId(COMPARISON_BAR_IDS.versionLabel)).toHaveText(
    `השוואה ל${VERSION} בסטטוס מבצעית`,
  );
  await expect(page).toHaveURL(/compareVersion=/);

  await page.getByTestId(COMPARISON_BAR_IDS.closeBtn).click();
  await expect(page.getByTestId(COMPARISON_BAR_IDS.root)).toHaveCount(0);
  await expect(page).not.toHaveURL(/compareVersion=%D7/);
});

test('a bookmarked comparison comes back open', async ({ page }) => {
  await page.goto(`/document/d1?compareVersion=${encodeURIComponent(VERSION)}`);

  await expect(page.getByTestId(COMPARISON_BAR_IDS.versionLabel)).toContainText(VERSION);
});

test('the view toggles hold their state, and the difference nav has nothing to walk', async ({
  page,
}) => {
  await page.goto(`/document/d1?compareVersion=${encodeURIComponent(VERSION)}`);

  const hideDeleted = page.getByTestId(COMPARISON_BAR_IDS.hideDeletedToggle);
  await expect(hideDeleted).toHaveAttribute('aria-pressed', 'false');
  await hideDeleted.click();
  await expect(hideDeleted).toHaveAttribute('aria-pressed', 'true');

  await expect(page).not.toHaveURL(/hideDeleted/);

  await expect(page.getByTestId(COMPARISON_BAR_IDS.navCounter)).toHaveText('0/0');
  await expect(page.getByTestId(COMPARISON_BAR_IDS.prevBtn)).toBeDisabled();
  await expect(page.getByTestId(COMPARISON_BAR_IDS.nextBtn)).toBeDisabled();
});
