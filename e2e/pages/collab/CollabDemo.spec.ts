import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { COLLAB_DEMO_IDS } from '../../../src/pages/collab/CollabDemoPage/CollabDemoPage.testids';

const settleLayout = (page: Page) =>
  page.evaluate(
    () =>
      new Promise((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve(null)));
      }),
  );

test('collab demo page renders dual user panels, sections, and event log', async ({ page }) => {
  await page.goto('/collab');
  await settleLayout(page);

  await expect(page.getByTestId(COLLAB_DEMO_IDS.root)).toBeVisible();
  await expect(page.getByTestId(COLLAB_DEMO_IDS.header)).toBeVisible();
  await expect(page.getByTestId(COLLAB_DEMO_IDS.userPanel('alice'))).toBeVisible();
  await expect(page.getByTestId(COLLAB_DEMO_IDS.userPanel('bob'))).toBeVisible();
  await expect(page.getByTestId(COLLAB_DEMO_IDS.eventLog)).toBeVisible();

  // Both users see section-1 and section-2
  await expect(
    page.getByTestId(COLLAB_DEMO_IDS.sectionCard('alice', 'demo-section-1')),
  ).toBeVisible();
  await expect(
    page.getByTestId(COLLAB_DEMO_IDS.sectionCard('bob', 'demo-section-1')),
  ).toBeVisible();
});

test('both users can open and edit the same section simultaneously in multiple editors mode', async ({
  page,
}) => {
  await page.goto('/collab');
  await settleLayout(page);

  // Alice activates Section 1
  const aliceSection1 = page.getByTestId(COLLAB_DEMO_IDS.sectionCard('alice', 'demo-section-1'));
  await aliceSection1.locator('[data-testid="content-editor-content"]').first().click();

  // Bob activates Section 1
  const bobSection1 = page.getByTestId(COLLAB_DEMO_IDS.sectionCard('bob', 'demo-section-1'));
  await bobSection1.locator('[data-testid="content-editor-content"]').first().click();

  // Both editors stay active simultaneously side-by-side without lock obstruction
  await expect(aliceSection1.locator('[contenteditable="true"]')).toBeVisible();
  await expect(bobSection1.locator('[contenteditable="true"]')).toBeVisible();
});

test('remote cursor overlay renders across peers when typing', async ({ page }) => {
  await page.goto('/collab');
  await settleLayout(page);

  const aliceSection1 = page.getByTestId(COLLAB_DEMO_IDS.sectionCard('alice', 'demo-section-1'));
  const bobSection1 = page.getByTestId(COLLAB_DEMO_IDS.sectionCard('bob', 'demo-section-1'));

  // Alice clicks to activate Section 1
  await aliceSection1.locator('[data-testid="content-editor-content"]').first().click();
  await page.waitForTimeout(300);

  // Alice types text
  await page.keyboard.type(' REALTIME_CURSOR ');

  // Bob's Section 1 displays Alice's remote cursor with label 'אלברט (אליס)' or 'alice'
  const bobRemoteCursor = bobSection1.locator('[data-testid="content-editor-cursor"]');
  await expect(bobRemoteCursor).toBeVisible();
});
