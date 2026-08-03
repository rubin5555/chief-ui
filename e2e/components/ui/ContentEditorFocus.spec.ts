import type { Locator, Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { CONTENT_EDITOR_IDS } from '../../../src/components/ui/ContentEditor/ContentEditor.testids';
import { EDITOR_RIBBON_IDS } from '../../../src/components/ui/ContentEditor/components/EditorRibbon/EditorRibbon.testids';
import { EDITABLE_SECTION_BODY_IDS } from '../../../src/pages/document/components/EditableSectionBody/EditableSectionBody.testids';
import { PAPER_CANVAS_IDS } from '../../../src/pages/document/components/PaperCanvas/PaperCanvas.testids';

const SECTION = 's1-1';

// main's `focus-within:border-gray-300` on the section body.
const FOCUS_BORDER = 'rgb(209, 213, 219)';

const sectionBody = (page: Page) => page.getByTestId(EDITABLE_SECTION_BODY_IDS.content(SECTION));
const borderOf = (wrapper: Locator) =>
  wrapper.evaluate((el) => getComputedStyle(el).borderTopColor);

test('the section body is a tab stop, and shows the focus border when it lands', async ({
  page,
}) => {
  await page.goto('/document/d1');

  const body = sectionBody(page);
  const wrapper = body.getByTestId(CONTENT_EDITOR_IDS.root);
  const preview = body.getByTestId(CONTENT_EDITOR_IDS.content);

  // An inactive editor is a plain div where main has a textarea, so without
  // this the document could not be walked without a mouse at all.
  await expect(preview).toHaveAttribute('tabindex', '0');

  const resting = await borderOf(wrapper);
  expect(resting).not.toBe(FOCUS_BORDER);

  await preview.focus();

  // Polled, not read straight back: the border transitions over 0.15s, so an
  // immediate read catches it partway between the two colours.
  await expect.poll(() => borderOf(wrapper)).toBe(FOCUS_BORDER);
});

test('focus alone does not start editing — Enter does', async ({ page }) => {
  await page.goto('/document/d1');

  const body = sectionBody(page);
  const bold = page.getByTestId(EDITOR_RIBBON_IDS.toggle('bold'));

  // Tabbing through a document must not take the lock on every section it
  // passes, so arriving is not the same as opening.
  await body.getByTestId(CONTENT_EDITOR_IDS.content).focus();
  await expect(body.locator('[contenteditable="true"]')).toHaveCount(0);
  await expect(bold).toBeDisabled();

  await page.keyboard.press('Enter');

  await expect(body.locator('[contenteditable="true"]')).toBeVisible();
  await expect(bold).toBeEnabled();
});

test('leaving the section takes the ribbon down with it', async ({ page }) => {
  await page.goto('/document/d1');

  const body = sectionBody(page);
  const bold = page.getByTestId(EDITOR_RIBBON_IDS.toggle('bold'));

  await body.click();
  await expect(body.locator('[contenteditable="true"]')).toBeVisible();
  await expect(bold).toBeEnabled();

  // The margin beside the paper: nothing there to take focus, so the editor
  // tears down. The ribbon has to go with it rather than keep pointing at an
  // editor that no longer exists.
  await page.getByTestId(PAPER_CANVAS_IDS.root).click({ position: { x: 4, y: 200 } });

  await expect(body.locator('[contenteditable="true"]')).toHaveCount(0);
  await expect(bold).toBeDisabled();
});
