import { expect, test } from '@playwright/test';
import { OUTLINE_ROW_MENU_IDS } from '../../../../src/pages/document/components/DocumentOutlineTree/components/OutlineRowMenu/OutlineRowMenu.testids';
import { OUTLINE_SECTION_ROW_IDS } from '../../../../src/pages/document/components/DocumentOutlineTree/components/OutlineSectionRow/OutlineSectionRow.testids';
import { DOCUMENT_OUTLINE_TREE_IDS } from '../../../../src/pages/document/components/DocumentOutlineTree/DocumentOutlineTree.testids';
import { EDITABLE_SECTION_BODY_IDS } from '../../../../src/pages/document/components/EditableSectionBody/EditableSectionBody.testids';
import { PAPER_CANVAS_IDS } from '../../../../src/pages/document/components/PaperCanvas/PaperCanvas.testids';
import { SECTION_BLOCK_IDS } from '../../../../src/pages/document/components/SectionBlock/SectionBlock.testids';
import { REVEAL_SCROLL_PADDING } from '../../../../src/pages/document/components/SectionNavigation/SectionNavigation.constants';
import { clickCentred, revealOutlineRow } from '../../../support/interactions';

const FIRST_SECTION = 's1-1';
const FAR_SECTION = 's4-1';

test('clicking an outline row takes the sheet to that section', async ({ page }) => {
  await page.goto('/document/d1');

  await expect(page.getByTestId(SECTION_BLOCK_IDS.root(FAR_SECTION))).toHaveCount(0);

  await revealOutlineRow(page, OUTLINE_SECTION_ROW_IDS.root(FAR_SECTION));
  await page.getByTestId(OUTLINE_SECTION_ROW_IDS.root(FAR_SECTION)).click();

  const target = page.getByTestId(SECTION_BLOCK_IDS.root(FAR_SECTION));
  await expect(target).toBeVisible();
  await expect(target).toBeInViewport();

  await expect(page.getByTestId(EDITABLE_SECTION_BODY_IDS.content(FAR_SECTION))).toBeVisible();

  const offset = await page.evaluate(
    ([sectionTestId, paperTestId]) => {
      const section = document.querySelector(`[data-testid="${sectionTestId}"]`);
      const paper = document.querySelector(`[data-testid="${paperTestId}"]`);
      if (!section || !paper) return Number.NaN;
      return section.getBoundingClientRect().top - paper.getBoundingClientRect().top;
    },
    [SECTION_BLOCK_IDS.root(FAR_SECTION), PAPER_CANVAS_IDS.root],
  );

  expect(Math.abs(offset - REVEAL_SCROLL_PADDING)).toBeLessThan(32);
});

test('the outline marks the section the reader is on, and keeps up as it moves', async ({
  page,
}) => {
  await page.goto('/document/d1');

  const firstRow = page.getByTestId(OUTLINE_SECTION_ROW_IDS.root(FIRST_SECTION));
  const farRow = page.getByTestId(OUTLINE_SECTION_ROW_IDS.root(FAR_SECTION));

  await expect(firstRow).toHaveAttribute('aria-current', 'location');

  await revealOutlineRow(page, OUTLINE_SECTION_ROW_IDS.root(FAR_SECTION));
  await page.getByTestId(OUTLINE_SECTION_ROW_IDS.root(FAR_SECTION)).click();
  await expect(farRow).toHaveAttribute('aria-current', 'location');

  await page.getByTestId(PAPER_CANVAS_IDS.root).evaluate((el) => {
    el.scrollTop = 0;
  });
  await page.getByTestId(DOCUMENT_OUTLINE_TREE_IDS.root).evaluate((el) => {
    el.scrollTop = 0;
  });
  await expect(firstRow).toHaveAttribute('aria-current', 'location');
  await expect(farRow).toHaveCount(0);
});

test("the row's own controls do not navigate", async ({ page }) => {
  await page.goto('/document/d1');

  await revealOutlineRow(page, OUTLINE_SECTION_ROW_IDS.root(FAR_SECTION));

  const paper = page.getByTestId(PAPER_CANVAS_IDS.root);
  const before = await paper.evaluate((el) => el.scrollTop);

  await clickCentred(page.getByTestId(OUTLINE_ROW_MENU_IDS.trigger(FAR_SECTION)));
  await expect(page.getByTestId(OUTLINE_ROW_MENU_IDS.panel(FAR_SECTION))).toBeVisible();

  expect(await paper.evaluate((el) => el.scrollTop)).toBe(before);
});
