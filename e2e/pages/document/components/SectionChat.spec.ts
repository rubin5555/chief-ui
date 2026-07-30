import { expect, type Locator, type Page, test } from '@playwright/test';
import { EDITABLE_SECTION_BODY_IDS } from '../../../../src/pages/document/components/EditableSectionBody/EditableSectionBody.testids';
import { SECTION_CHAT_IDS } from '../../../../src/pages/document/components/SectionChat/SectionChat.testids';
import { clickCentred } from '../../../support/interactions';

// Quoting a passage into a section's comment thread, and getting back to it.

const SECTION = 's1-1';

/**
 * Sections are seeded empty (main's are too), so a passage has to be written
 * before one can be marked. Typed into the real editor rather than seeded through
 * the api, because what the editor leaves in the DOM is exactly what the marker
 * then has to find again.
 */
const PASSAGE = 'הנחיות הבטיחות בפרק זה מחייבות את כלל העובדים באתר';
/** The first few words, which is all the drag below covers. */
const MARKED_PREFIX = 'הנחיות הבטיחות';

/** Whitespace differs between a DOM read and a selection read; the words don't. */
const words = (text: string) => text.replace(/\s+/g, ' ').trim();

const writePassage = async (page: Page, body: Locator) => {
  await body.click();
  const editable = body.locator('[contenteditable="true"]');
  await expect(editable).toBeVisible();
  await editable.pressSequentially(PASSAGE);
  await expect(editable).toContainText(PASSAGE);
};

/**
 * Drags across the start of a section's body, the way a reader marks a passage.
 * A real drag rather than `page.evaluate` on the Selection API: the bug this
 * covers was that the click *ending* the drag opened the editor and took the
 * selection with it, which a scripted selection would never have noticed.
 */
const dragFromLineStart = async (page: Page, body: Locator, width: number) => {
  const box = await body.boundingBox();
  if (!box) throw new Error('section body is not visible');

  // Right to left: this is Hebrew, so a line starts at the right edge.
  const y = box.y + 18;
  await page.mouse.move(box.x + box.width - 15, y);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width - 15 - width, y, { steps: 12 });
  await page.mouse.up();
};

test('marking a passage quotes it, and the quote jumps back to it', async ({ page }) => {
  await page.goto('/document/d1');

  const body = page.getByTestId(EDITABLE_SECTION_BODY_IDS.content(SECTION));
  await writePassage(page, body);

  // Opening the chat takes focus off the editor, so the section is back to being
  // a preview — the state the marker has to work in.
  await clickCentred(page.getByTestId(SECTION_CHAT_IDS.trigger(SECTION)));
  await expect(body.locator('[contenteditable="true"]')).toHaveCount(0);

  await page.getByTestId(SECTION_CHAT_IDS.markerToggle).click();
  await dragFromLineStart(page, body, 105);

  // The section stayed a reading surface for the duration — had it become an
  // editor, the selection would have been gone before anything could read it.
  await expect(body.locator('[contenteditable="true"]')).toHaveCount(0);

  const draft = page.getByTestId(SECTION_CHAT_IDS.draftQuote);
  await expect(draft).toBeVisible();
  const marked = words(await draft.innerText());
  expect(marked).toContain(MARKED_PREFIX);

  // Marking is over once a passage is caught, so the banner asking for one goes.
  await expect(page.getByTestId(SECTION_CHAT_IDS.panel(SECTION))).not.toContainText(
    'סמן טקסט במסמך...',
  );

  await page.getByTestId(SECTION_CHAT_IDS.input).fill('נא לחדד את הנקודה הזו');
  await page.getByTestId(SECTION_CHAT_IDS.sendBtn).click();

  const quoteCard = page.locator('[data-testid^="section-chat-quote-"]');
  await expect(quoteCard).toHaveCount(1);
  await expect(quoteCard).toContainText(marked);

  await quoteCard.click();

  // The card found the passage again, and found exactly the one that was marked
  // — not merely something containing the same words.
  const selected = await page.evaluate(() => window.getSelection()?.toString() ?? '');
  expect(selected.replace(/\s/g, '')).toBe(marked.replace(/\s/g, ''));
});

test('text selected outside the sheet is not mistaken for a marked passage', async ({ page }) => {
  await page.goto('/document/d1');

  await clickCentred(page.getByTestId(SECTION_CHAT_IDS.trigger(SECTION)));
  await page.getByTestId(SECTION_CHAT_IDS.markerToggle).click();

  // The seeded opening message, inside the bubble itself. Selecting it is reading
  // the conversation, not marking the document.
  const firstMessage = page.locator('[data-testid^="section-chat-message-"]').first();
  await firstMessage.dblclick();

  await expect(page.getByTestId(SECTION_CHAT_IDS.draftQuote)).toHaveCount(0);
  // Still waiting for a passage from the document.
  await expect(page.getByTestId(SECTION_CHAT_IDS.panel(SECTION))).toContainText(
    'סמן טקסט במסמך...',
  );
});
