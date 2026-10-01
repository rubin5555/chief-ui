import { expect, type Locator, type Page, test } from '@playwright/test';
import { EDITABLE_SECTION_BODY_IDS } from '../../../../src/pages/document/components/EditableSectionBody/EditableSectionBody.testids';
import { SECTION_CHAT_IDS } from '../../../../src/pages/document/components/SectionChat/SectionChat.testids';
import { clickCentred } from '../../../support/interactions';

const SECTION = 's1-1';

const PASSAGE = 'הנחיות הבטיחות בפרק זה מחייבות את כלל העובדים באתר';

const MARKED_PREFIX = 'הנחיות הבטיחות';

const words = (text: string) => text.replace(/\s+/g, ' ').trim();

const writePassage = async (body: Locator) => {
  await body.click();
  const editable = body.locator('[contenteditable="true"]');
  await expect(editable).toBeVisible();
  await editable.pressSequentially(PASSAGE);
  await expect(editable).toContainText(PASSAGE);
};

const dragFromLineStart = async (page: Page, body: Locator, width: number) => {
  const box = await body.boundingBox();
  if (!box) throw new Error('section body is not visible');

  const y = box.y + 18;
  await page.mouse.move(box.x + box.width - 15, y);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width - 15 - width, y, { steps: 12 });
  await page.mouse.up();
};

test('marking a passage quotes it, and the quote jumps back to it', async ({ page }) => {
  await page.goto('/document/d1');

  const body = page.getByTestId(EDITABLE_SECTION_BODY_IDS.content(SECTION));
  await writePassage(body);

  await clickCentred(page.getByTestId(SECTION_CHAT_IDS.trigger(SECTION)));
  await expect(body.locator('[contenteditable="true"]')).toHaveCount(0);

  await page.getByTestId(SECTION_CHAT_IDS.markerToggle).click();
  await dragFromLineStart(page, body, 105);

  await expect(body.locator('[contenteditable="true"]')).toHaveCount(0);

  const draft = page.getByTestId(SECTION_CHAT_IDS.draftQuote);
  await expect(draft).toBeVisible();
  const marked = words(await draft.innerText());
  expect(marked).toContain(MARKED_PREFIX);

  await expect(page.getByTestId(SECTION_CHAT_IDS.panel(SECTION))).not.toContainText(
    'סמן טקסט במסמך...',
  );

  await page.getByTestId(SECTION_CHAT_IDS.input).fill('נא לחדד את הנקודה הזו');
  await page.getByTestId(SECTION_CHAT_IDS.sendBtn).click();

  const quoteCard = page.locator('[data-testid^="section-chat-quote-"]');
  await expect(quoteCard).toHaveCount(1);
  await expect(quoteCard).toContainText(marked);

  await quoteCard.click();

  const selected = await page.evaluate(() => window.getSelection()?.toString() ?? '');
  expect(selected.replace(/\s/g, '')).toBe(marked.replace(/\s/g, ''));
});

test('text selected outside the sheet is not mistaken for a marked passage', async ({ page }) => {
  await page.goto('/document/d1');

  await clickCentred(page.getByTestId(SECTION_CHAT_IDS.trigger(SECTION)));
  await page.getByTestId(SECTION_CHAT_IDS.markerToggle).click();

  const firstMessage = page.locator('[data-testid^="section-chat-message-"]').first();
  await firstMessage.dblclick();

  await expect(page.getByTestId(SECTION_CHAT_IDS.draftQuote)).toHaveCount(0);

  await expect(page.getByTestId(SECTION_CHAT_IDS.panel(SECTION))).toContainText(
    'סמן טקסט במסמך...',
  );
});
