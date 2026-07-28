import { expect, test } from '@playwright/test';
import { DOC_ACTION_TOOLBAR_IDS } from '../../../../src/components/layout/TopNavbar/components/DocActionToolbar/DocActionToolbar.testids';
import { COMPARISON_BAR_IDS } from '../../../../src/pages/document/components/ComparisonBar/ComparisonBar.testids';
import { VERSION_PICKER_MODAL_IDS } from '../../../../src/pages/document/components/ComparisonBar/components/VersionPickerModal/VersionPickerModal.testids';
import { DOC_PERMISSIONS_MODAL_IDS } from '../../../../src/pages/document/components/DocumentActionsSlot/components/DocPermissionsModal/DocPermissionsModal.testids';

// Comparing the document against an earlier version, and the document-level
// permissions dialog.

const VERSION = 'עדכון מס׳ 1';

test('picking a version opens the comparison bar, and closing it clears the URL', async ({
  page,
}) => {
  await page.goto('/document/d1');

  // No version picked, so no bar — the button in its place is how you start.
  await expect(page.getByTestId(COMPARISON_BAR_IDS.root)).toHaveCount(0);
  await page.getByTestId(COMPARISON_BAR_IDS.triggerBtn).click();

  const picker = page.getByTestId(VERSION_PICKER_MODAL_IDS.root);
  await expect(picker).toBeVisible();
  // The live version is tagged rather than hidden — picking it is a legitimate
  // way to say there is nothing to compare.
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

  // Toggles are view state, not document state — they stay out of the URL.
  await expect(page).not.toHaveURL(/hideDeleted/);

  // Nothing computes a diff, so the counter reads 0/0 and both chevrons are dead.
  // main hardcodes 1/3 here; this shows the truth until there is a diff engine.
  await expect(page.getByTestId(COMPARISON_BAR_IDS.navCounter)).toHaveText('0/0');
  await expect(page.getByTestId(COMPARISON_BAR_IDS.prevBtn)).toBeDisabled();
  await expect(page.getByTestId(COMPARISON_BAR_IDS.nextBtn)).toBeDisabled();
});

test('the permissions dialog explains each level and keeps its members apart', async ({ page }) => {
  await page.goto('/document/d1');

  await page.getByTestId(DOC_ACTION_TOOLBAR_IDS.permissions).click();
  const modal = page.getByTestId(DOC_PERMISSIONS_MODAL_IDS.root);
  await expect(modal).toBeVisible();

  // Opens on the first level, with main's wording for it.
  await expect(page.getByTestId(DOC_PERMISSIONS_MODAL_IDS.description)).toContainText(
    'יוכלו לצפות בתוכן הפקודה לאחר הפצתה',
  );
  await expect(page.getByTestId(DOC_PERMISSIONS_MODAL_IDS.memberCount)).toHaveText('0');

  await page.getByTestId(DOC_PERMISSIONS_MODAL_IDS.membersSelect).click();
  await page.getByText('אבי כהן', { exact: true }).click();
  await expect(page.getByTestId(DOC_PERMISSIONS_MODAL_IDS.memberCount)).toHaveText('1');

  // The dropdown stays open after a pick — more than one person can hold a
  // permission — and this far down a dialog it opens upward, over the tabs.
  // Escape dismisses the dropdown and leaves the dialog standing.
  await page.keyboard.press('Escape');
  await expect(modal).toBeVisible();

  // A different level is a different list — switching tabs must not carry members
  // across.
  await page.getByText('ניהול פקודה', { exact: true }).click();
  await expect(page.getByTestId(DOC_PERMISSIONS_MODAL_IDS.description)).toContainText(
    'לנהל את הפקודה כמו ״בעל פקודה״',
  );
  await expect(page.getByTestId(DOC_PERMISSIONS_MODAL_IDS.memberCount)).toHaveText('0');
});
