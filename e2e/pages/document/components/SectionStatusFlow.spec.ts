import { expect, test } from '@playwright/test';
import { OUTLINE_SECTION_ROW_IDS } from '../../../../src/pages/document/components/DocumentOutlineTree/components/OutlineSectionRow/OutlineSectionRow.testids';
import { FOOTNOTE_LIST_IDS } from '../../../../src/pages/document/components/EditableSectionBody/components/FootnoteList/FootnoteList.testids';
import { SECTION_INSTRUCTIONS_TIP_IDS } from '../../../../src/pages/document/components/SectionBlock/components/SectionInstructionsTip/SectionInstructionsTip.testids';
import { SECTION_STATUS_ACTIONS_IDS } from '../../../../src/pages/document/components/SectionBlock/components/SectionStatusActions/SectionStatusActions.testids';
import { SECTION_CHAT_IDS } from '../../../../src/pages/document/components/SectionChat/SectionChat.testids';
import { SECTION_INSTRUCTIONS_MODAL_IDS } from '../../../../src/pages/document/components/SectionMenu/components/SectionInstructionsModal/SectionInstructionsModal.testids';
import { SECTION_MENU_IDS } from '../../../../src/pages/document/components/SectionMenu/SectionMenu.testids';
import { SECTION_STATUS_LABEL_IDS } from '../../../../src/pages/document/components/SectionStatusLabel/SectionStatusLabel.testids';
import { clickCentred, revealOutlineRow } from '../../../support/interactions';

// A section's own lifecycle: submitting it, approving it, sending it back with a
// reason, and the notes and instructions that hang off it.

// s1-2 is seeded 'approved', so it opens on "reopen" rather than "submit".
const APPROVED = 's1-2';
// s4-1 is seeded 'pending' — the one stage that offers both answers.
const PENDING = 's4-1';

test('a section walks from editing to approved, and the outline dot follows', async ({ page }) => {
  await page.goto('/document/d1');

  // Reopening drops it to 'editing', which is where the flow starts.
  await clickCentred(page.getByTestId(SECTION_STATUS_ACTIONS_IDS.reopenBtn(APPROVED)));
  await expect(page.getByTestId(SECTION_STATUS_LABEL_IDS.root(APPROVED))).toHaveCount(0);

  await clickCentred(page.getByTestId(SECTION_STATUS_ACTIONS_IDS.submitBtn(APPROVED)));
  await expect(page.getByTestId(SECTION_STATUS_LABEL_IDS.root(APPROVED))).toHaveText(
    'ממתין לאישור',
  );

  await clickCentred(page.getByTestId(SECTION_STATUS_ACTIONS_IDS.approveBtn(APPROVED)));
  await expect(page.getByTestId(SECTION_STATUS_LABEL_IDS.root(APPROVED))).toHaveText('מאושר');

  // The sidebar reads the same status, so its dot turns green with it.
  await expect(page.getByTestId(OUTLINE_SECTION_ROW_IDS.statusDot(APPROVED))).toHaveCSS(
    'background-color',
    'rgb(22, 163, 74)',
  );
});

test('sending a section back moves it only once the reason is written', async ({ page }) => {
  await page.goto('/document/d1');

  await clickCentred(page.getByTestId(SECTION_STATUS_ACTIONS_IDS.fixBtn(PENDING)));

  // Asking is not the change: the section stays where it was until someone says
  // what needs fixing.
  await expect(page.getByTestId(SECTION_STATUS_LABEL_IDS.root(PENDING))).toHaveText('ממתין לאישור');

  // The button opens the thread itself — the place to say what needs fixing.
  await expect(page.getByTestId(SECTION_CHAT_IDS.panel(PENDING))).toBeVisible();
  await page.getByTestId(SECTION_CHAT_IDS.input).fill('חסר פירוט בסעיף');
  await page.getByTestId(SECTION_CHAT_IDS.sendBtn).click();

  await expect(page.getByTestId(SECTION_STATUS_LABEL_IDS.root(PENDING))).toHaveText('דרוש תיקון');

  // s4-1 sits below the fold of the virtualized outline, so its row has to be
  // scrolled to before it exists to be asserted on.
  await revealOutlineRow(page, OUTLINE_SECTION_ROW_IDS.statusDot(PENDING));
  await expect(page.getByTestId(OUTLINE_SECTION_ROW_IDS.statusDot(PENDING))).toHaveCSS(
    'background-color',
    'rgb(220, 38, 38)',
  );
});

test('a message sent without asking for a fix leaves the status alone', async ({ page }) => {
  await page.goto('/document/d1');

  await clickCentred(page.getByTestId(SECTION_CHAT_IDS.trigger(PENDING)));
  await page.getByTestId(SECTION_CHAT_IDS.input).fill('שאלה כללית');
  await page.getByTestId(SECTION_CHAT_IDS.sendBtn).click();

  await expect(page.getByTestId(SECTION_STATUS_LABEL_IDS.root(PENDING))).toHaveText('ממתין לאישור');
});

test('instructions saved from the section menu show as a tip beside the title', async ({
  page,
}) => {
  await page.goto('/document/d1');

  await expect(page.getByTestId(SECTION_INSTRUCTIONS_TIP_IDS.root('s1-1'))).toHaveCount(0);

  await clickCentred(page.getByTestId(SECTION_MENU_IDS.trigger('s1-1')));
  await page.getByTestId(SECTION_MENU_IDS.instructionsAction).click();

  const modal = page.getByTestId(SECTION_INSTRUCTIONS_MODAL_IDS.root);
  await expect(modal).toContainText('יצירת הנחיות לסעיף ״מטרת המסמך״');

  await page.getByTestId(SECTION_INSTRUCTIONS_MODAL_IDS.textarea).fill('נא לכתוב בלשון פעילה');
  await page.getByTestId(SECTION_INSTRUCTIONS_MODAL_IDS.saveBtn).click();
  await expect(modal).not.toBeVisible();

  await expect(page.getByTestId(SECTION_INSTRUCTIONS_TIP_IDS.tip('s1-1'))).toContainText(
    'נא לכתוב בלשון פעילה',
  );
});

test('cancelling the instructions dialog keeps what was there before', async ({ page }) => {
  await page.goto('/document/d1');

  await clickCentred(page.getByTestId(SECTION_MENU_IDS.trigger('s1-1')));
  await page.getByTestId(SECTION_MENU_IDS.instructionsAction).click();
  await page.getByTestId(SECTION_INSTRUCTIONS_MODAL_IDS.textarea).fill('טיוטה שלא נשמרה');
  await page.getByTestId(SECTION_INSTRUCTIONS_MODAL_IDS.cancelBtn).click();

  await expect(page.getByTestId(SECTION_INSTRUCTIONS_TIP_IDS.root('s1-1'))).toHaveCount(0);
});

test('footnotes are added from the menu and numbered by position', async ({ page }) => {
  await page.goto('/document/d1');

  await clickCentred(page.getByTestId(SECTION_MENU_IDS.trigger('s1-1')));
  await page.getByTestId(SECTION_MENU_IDS.addFootnoteAction).click();

  const list = page.getByTestId(FOOTNOTE_LIST_IDS.root('s1-1'));
  await expect(list).toBeVisible();
  await expect(list).toContainText('¹');

  const firstNote = list.getByRole('textbox').first();
  await firstNote.fill('לפי פקודת המטה מיום 12.3');
  await expect(firstNote).toHaveValue('לפי פקודת המטה מיום 12.3');

  await clickCentred(page.getByTestId(SECTION_MENU_IDS.trigger('s1-1')));
  await page.getByTestId(SECTION_MENU_IDS.addFootnoteAction).click();
  await expect(list).toContainText('²');

  // Markers are positional, so dropping the first one renumbers what follows —
  // the second note keeps its text and becomes ¹.
  await list.getByRole('textbox').nth(1).fill('הערה שנייה');
  await page.locator('[data-testid^="footnote-remove-"]').first().click();

  await expect(list.getByRole('textbox')).toHaveCount(1);
  await expect(list.getByRole('textbox')).toHaveValue('הערה שנייה');
  await expect(list).not.toContainText('²');
});
