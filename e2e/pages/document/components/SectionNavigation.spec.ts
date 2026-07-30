import { expect, test } from '@playwright/test';
import { OUTLINE_ROW_MENU_IDS } from '../../../../src/pages/document/components/DocumentOutlineTree/components/OutlineRowMenu/OutlineRowMenu.testids';
import { OUTLINE_SECTION_ROW_IDS } from '../../../../src/pages/document/components/DocumentOutlineTree/components/OutlineSectionRow/OutlineSectionRow.testids';
import { DOCUMENT_OUTLINE_TREE_IDS } from '../../../../src/pages/document/components/DocumentOutlineTree/DocumentOutlineTree.testids';
import { EDITABLE_SECTION_BODY_IDS } from '../../../../src/pages/document/components/EditableSectionBody/EditableSectionBody.testids';
import { PAPER_CANVAS_IDS } from '../../../../src/pages/document/components/PaperCanvas/PaperCanvas.testids';
import { SECTION_BLOCK_IDS } from '../../../../src/pages/document/components/SectionBlock/SectionBlock.testids';
import { REVEAL_SCROLL_PADDING } from '../../../../src/pages/document/components/SectionNavigation/SectionNavigation.constants';
import { clickCentred, revealOutlineRow } from '../../../support/interactions';

// Moving between the outline and the sheet: the column sends you to a section,
// and the sheet says which section you are in.

// src/api/docs.ts: `s1-1` is the document's first section, `s4-1` is in its
// fourth topic — far enough down that the paper's virtualizer hasn't mounted it.
const FIRST_SECTION = 's1-1';
const FAR_SECTION = 's4-1';

test('clicking an outline row takes the sheet to that section', async ({ page }) => {
  await page.goto('/document/d1');

  // Not mounted at all to begin with — the topics are virtualized, and nobody
  // has scrolled that far.
  await expect(page.getByTestId(SECTION_BLOCK_IDS.root(FAR_SECTION))).toHaveCount(0);

  // The outline is virtualized too, so the row has to be scrolled to before it
  // can be clicked.
  await revealOutlineRow(page, OUTLINE_SECTION_ROW_IDS.root(FAR_SECTION));
  await page.getByTestId(OUTLINE_SECTION_ROW_IDS.root(FAR_SECTION)).click();

  const target = page.getByTestId(SECTION_BLOCK_IDS.root(FAR_SECTION));
  await expect(target).toBeVisible();
  await expect(target).toBeInViewport();

  // Its body came with it. A topic mounted but not yet measured used to land the
  // reader on a sliver of the section, or on blank sheet above it.
  await expect(page.getByTestId(EDITABLE_SECTION_BODY_IDS.content(FAR_SECTION))).toBeVisible();

  // And it landed where it was aimed: the section's top sits at the column's
  // scroll padding, give or take. The virtualizer measures the topic only once
  // it has been mounted, which moves everything below it — so this is the
  // assertion that the scroll re-aimed after that landed.
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

  // At the top of the document, the first section is the one being read.
  await expect(firstRow).toHaveAttribute('aria-current', 'location');

  await revealOutlineRow(page, OUTLINE_SECTION_ROW_IDS.root(FAR_SECTION));
  await page.getByTestId(OUTLINE_SECTION_ROW_IDS.root(FAR_SECTION)).click();
  await expect(farRow).toHaveAttribute('aria-current', 'location');

  // And back again, driving the sheet's own scroll rather than the outline —
  // the mark follows the reader, not only the clicks. The column has to be
  // scrolled back too: it is virtualized, and the first row left the DOM when it
  // scrolled down to reach the far one.
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

  // The whole row is a click target now, so everything inside it that does
  // something else has to opt out — reaching for a row's menu is not a request
  // to be taken to that section.
  await revealOutlineRow(page, OUTLINE_SECTION_ROW_IDS.root(FAR_SECTION));

  const paper = page.getByTestId(PAPER_CANVAS_IDS.root);
  const before = await paper.evaluate((el) => el.scrollTop);

  await clickCentred(page.getByTestId(OUTLINE_ROW_MENU_IDS.trigger(FAR_SECTION)));
  await expect(page.getByTestId(OUTLINE_ROW_MENU_IDS.panel(FAR_SECTION))).toBeVisible();

  // The sheet did not move. Asserted on the scroll offset rather than on which
  // row is marked: the paper mounts and measures topics on its own for a moment
  // after load, which moves the mark without anyone having asked to go anywhere.
  expect(await paper.evaluate((el) => el.scrollTop)).toBe(before);
});
