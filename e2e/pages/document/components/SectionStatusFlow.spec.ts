import { expect, test } from '@playwright/test';
import { EDITOR_RIBBON_IDS } from '../../../../src/components/ui/ContentEditor/components/EditorRibbon/EditorRibbon.testids';
import { OUTLINE_SECTION_ROW_IDS } from '../../../../src/pages/document/components/DocumentOutlineTree/components/OutlineSectionRow/OutlineSectionRow.testids';
import { FOOTNOTE_LIST_IDS } from '../../../../src/pages/document/components/EditableSectionBody/components/FootnoteList/FootnoteList.testids';
import { EDITABLE_SECTION_BODY_IDS } from '../../../../src/pages/document/components/EditableSectionBody/EditableSectionBody.testids';
import { SECTION_INSTRUCTIONS_TIP_IDS } from '../../../../src/pages/document/components/SectionBlock/components/SectionInstructionsTip/SectionInstructionsTip.testids';
import { SECTION_STATUS_ACTIONS_IDS } from '../../../../src/pages/document/components/SectionBlock/components/SectionStatusActions/SectionStatusActions.testids';
import { SECTION_CHAT_IDS } from '../../../../src/pages/document/components/SectionChat/SectionChat.testids';
import { SECTION_INSTRUCTIONS_MODAL_IDS } from '../../../../src/pages/document/components/SectionMenu/components/SectionInstructionsModal/SectionInstructionsModal.testids';
import { SECTION_MENU_IDS } from '../../../../src/pages/document/components/SectionMenu/SectionMenu.testids';
import { SECTION_STATUS_LABEL_IDS } from '../../../../src/pages/document/components/SectionStatusLabel/SectionStatusLabel.testids';
import { clickCentred, revealOutlineRow } from '../../../support/interactions';

const APPROVED = 's1-2';

const PENDING = 's4-1';

test('a section walks from editing to approved, and the outline dot follows', async ({ page }) => {
  await page.goto('/document/d1');

  await clickCentred(page.getByTestId(SECTION_STATUS_ACTIONS_IDS.reopenBtn(APPROVED)));
  await expect(page.getByTestId(SECTION_STATUS_LABEL_IDS.root(APPROVED))).toHaveCount(0);

  await clickCentred(page.getByTestId(SECTION_STATUS_ACTIONS_IDS.submitBtn(APPROVED)));
  await expect(page.getByTestId(SECTION_STATUS_LABEL_IDS.root(APPROVED))).toHaveText(
    'ממתין לאישור',
  );

  await clickCentred(page.getByTestId(SECTION_STATUS_ACTIONS_IDS.approveBtn(APPROVED)));
  await expect(page.getByTestId(SECTION_STATUS_LABEL_IDS.root(APPROVED))).toHaveText('מאושר');

  await expect(page.getByTestId(OUTLINE_SECTION_ROW_IDS.statusDot(APPROVED))).toHaveCSS(
    'background-color',
    'rgb(22, 163, 74)',
  );
});

test('sending a section back moves it only once the reason is written', async ({ page }) => {
  await page.goto('/document/d1');

  await clickCentred(page.getByTestId(SECTION_STATUS_ACTIONS_IDS.fixBtn(PENDING)));

  await expect(page.getByTestId(SECTION_STATUS_LABEL_IDS.root(PENDING))).toHaveText('ממתין לאישור');

  await expect(page.getByTestId(SECTION_CHAT_IDS.panel(PENDING))).toBeVisible();
  await page.getByTestId(SECTION_CHAT_IDS.input).fill('חסר פירוט בסעיף');
  await page.getByTestId(SECTION_CHAT_IDS.sendBtn).click();

  await expect(page.getByTestId(SECTION_STATUS_LABEL_IDS.root(PENDING))).toHaveText('דרוש תיקון');

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

  await list.getByRole('textbox').nth(1).fill('הערה שנייה');
  await page.locator('[data-testid^="footnote-remove-"]').first().click();

  await expect(list.getByRole('textbox')).toHaveCount(1);
  await expect(list.getByRole('textbox')).toHaveValue('הערה שנייה');
  await expect(list).not.toContainText('²');
});

test('the toolbar footnote lands under the section and is marked in the text', async ({ page }) => {
  await page.goto('/document/d1');

  const footnote = page.getByTestId(EDITOR_RIBBON_IDS.footnote);
  await expect(footnote).toBeDisabled();

  const body = page.getByTestId(EDITABLE_SECTION_BODY_IDS.content('s1-1'));
  await body.click();
  await expect(footnote).toBeEnabled();
  await footnote.click();

  // The note itself is the section's, the same one the menu adds…
  const list = page.getByTestId(FOOTNOTE_LIST_IDS.root('s1-1'));
  await expect(list).toBeVisible();
  await expect(list).toContainText('¹');
  await expect(list.getByRole('textbox')).toHaveCount(1);

  // …and the text carries its marker, which is what the button used to write
  // on its own without any note behind it.
  await expect(body.locator('[contenteditable="true"] sup')).toHaveText('¹');

  // A second one numbers on from the first, in the list and in the text alike.
  await footnote.click();
  await expect(list.getByRole('textbox')).toHaveCount(2);
  await expect(body.locator('[contenteditable="true"] sup').nth(1)).toHaveText('²');
});

test('the toolbar footnote goes to the section being edited', async ({ page }) => {
  await page.goto('/document/d1');
  const footnote = page.getByTestId(EDITOR_RIBBON_IDS.footnote);

  await page.getByTestId(EDITABLE_SECTION_BODY_IDS.content('s1-1')).click();
  await footnote.click();

  await page.getByTestId(EDITABLE_SECTION_BODY_IDS.content('s1-2')).click();
  await footnote.click();

  // Not to whichever section happened to be first: the toolbar is shared, so
  // it has to follow the field it is serving.
  await expect(page.getByTestId(FOOTNOTE_LIST_IDS.root('s1-2')).getByRole('textbox')).toHaveCount(
    1,
  );
  await expect(page.getByTestId(FOOTNOTE_LIST_IDS.root('s1-1')).getByRole('textbox')).toHaveCount(
    1,
  );
});
