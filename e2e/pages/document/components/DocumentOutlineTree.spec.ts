import { expect, test } from '@playwright/test';
import { ADD_NODE_LINK_IDS } from '../../../../src/pages/document/components/DocumentOutlineTree/components/AddNodeLink/AddNodeLink.testids';
import { CONFIRM_DELETE_MODAL_IDS } from '../../../../src/pages/document/components/DocumentOutlineTree/components/ConfirmDeleteModal/ConfirmDeleteModal.testids';
import { OUTLINE_ROW_MENU_IDS } from '../../../../src/pages/document/components/DocumentOutlineTree/components/OutlineRowMenu/OutlineRowMenu.testids';
import { OUTLINE_SECTION_ROW_IDS } from '../../../../src/pages/document/components/DocumentOutlineTree/components/OutlineSectionRow/OutlineSectionRow.testids';
import { OUTLINE_SUBJECT_ROW_IDS } from '../../../../src/pages/document/components/DocumentOutlineTree/components/OutlineSubjectRow/OutlineSubjectRow.testids';
import { OUTLINE_SUB_SECTION_ROW_IDS } from '../../../../src/pages/document/components/DocumentOutlineTree/components/OutlineSubSectionRow/OutlineSubSectionRow.testids';
import { ADD_MENU_IDS } from '../../../../src/pages/document/components/DocumentSidebar/components/SidebarFabRow/components/AddMenu/AddMenu.testids';
import { SUBJECT_BLOCK_IDS } from '../../../../src/pages/document/components/SubjectBlock/SubjectBlock.testids';
import { dragOnto, revealOutlineRow, scrollOutlineToEnd } from '../../../support/interactions';

test('renaming a section from its row menu updates the paper too', async ({ page }) => {
  await page.goto('/document/d1');

  await page.getByTestId(OUTLINE_ROW_MENU_IDS.trigger('s1-1')).click();
  await page.getByTestId(OUTLINE_ROW_MENU_IDS.renameAction).click();

  const input = page.getByTestId(OUTLINE_SECTION_ROW_IDS.renameInput('s1-1'));
  await expect(input).toBeFocused();
  await input.fill('מטרת המסמך המעודכנת');
  await input.press('Enter');

  await expect(page.getByTestId(OUTLINE_SECTION_ROW_IDS.root('s1-1'))).toContainText(
    'מטרת המסמך המעודכנת',
  );

  await expect(
    page
      .getByTestId(SUBJECT_BLOCK_IDS.root('s1'))
      .getByRole('textbox', { name: 'שם הסעיף' })
      .first(),
  ).toHaveValue('מטרת המסמך המעודכנת');
});

test('an emptied rename keeps the original title rather than leaving a blank row', async ({
  page,
}) => {
  await page.goto('/document/d1');

  await page.getByTestId(OUTLINE_ROW_MENU_IDS.trigger('s1-1')).click();
  await page.getByTestId(OUTLINE_ROW_MENU_IDS.renameAction).click();

  const input = page.getByTestId(OUTLINE_SECTION_ROW_IDS.renameInput('s1-1'));
  await input.fill('');
  await input.press('Enter');

  await expect(page.getByTestId(OUTLINE_SECTION_ROW_IDS.root('s1-1'))).toContainText('מטרת המסמך');
});

test('adding a section names it for its position, as main does', async ({ page }) => {
  await page.goto('/document/d1');

  await page.getByTestId(ADD_NODE_LINK_IDS.addSection('s1')).click();

  const s1Sections = page
    .getByTestId(SUBJECT_BLOCK_IDS.root('s1'))
    .getByRole('textbox', { name: 'שם הסעיף' });
  await expect(s1Sections).toHaveCount(3);
  await expect(s1Sections.last()).toHaveValue('סעיף 3');
});

test('adding a sub-section names it for the Hebrew letter it renders under', async ({ page }) => {
  await page.goto('/document/d1');

  await page.getByTestId(ADD_NODE_LINK_IDS.addSubSection('s1-1')).click();

  await expect(
    page.getByTestId(SUBJECT_BLOCK_IDS.root('s1')).getByRole('textbox', { name: 'שם תת הסעיף' }),
  ).toHaveValue('תת סעיף א');
});

test('deleting a topic warns that its sections go with it, and can be called off', async ({
  page,
}) => {
  await page.goto('/document/d1');

  await page.getByTestId(OUTLINE_ROW_MENU_IDS.trigger('s1')).click();
  await page.getByTestId(OUTLINE_ROW_MENU_IDS.deleteAction).click();

  const dialog = page.getByTestId(CONFIRM_DELETE_MODAL_IDS.root);
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('בטוח שתרצה למחוק נושא זה?');
  await expect(page.getByTestId(CONFIRM_DELETE_MODAL_IDS.warning)).toContainText(
    'מחיקת הנושא תמחק את כל הסעיפים תחתיו',
  );

  await page.getByTestId(CONFIRM_DELETE_MODAL_IDS.cancelBtn).click();
  await expect(page.getByTestId(OUTLINE_SUBJECT_ROW_IDS.root('s1'))).toBeVisible();

  await page.getByTestId(OUTLINE_ROW_MENU_IDS.trigger('s1')).click();
  await page.getByTestId(OUTLINE_ROW_MENU_IDS.deleteAction).click();
  await page.getByTestId(CONFIRM_DELETE_MODAL_IDS.confirmBtn).click();

  await expect(page.getByTestId(OUTLINE_SUBJECT_ROW_IDS.root('s1'))).toHaveCount(0);
  await expect(page.getByTestId(SUBJECT_BLOCK_IDS.root('s1'))).toHaveCount(0);
});

test('a sub-section delete warns about nothing, having nothing beneath it', async ({ page }) => {
  await page.goto('/document/d1');

  await page.getByTestId(ADD_NODE_LINK_IDS.addSubSection('s1-1')).click();
  const subRow = page.locator('[data-testid^="outline-sub-section-"]').first();
  const subMenuTrigger = subRow.locator('[data-testid^="outline-row-menu-trigger-"]');

  await subMenuTrigger.click();
  await page.getByTestId(OUTLINE_ROW_MENU_IDS.deleteAction).click();

  await expect(page.getByTestId(CONFIRM_DELETE_MODAL_IDS.root)).toContainText(
    'בטוח שתרצה למחוק תת סעיף זה?',
  );
  await expect(page.getByTestId(CONFIRM_DELETE_MODAL_IDS.warning)).toHaveCount(0);
});

test('creating a topic from the + menu opens it for naming, and drops it if left unnamed', async ({
  page,
}) => {
  await page.goto('/document/d1');

  const topicRows = page.locator('[data-testid^="outline-subject-toggle-"]');

  await expect(page.getByTestId(OUTLINE_SUBJECT_ROW_IDS.toggle('s1'))).toBeVisible();
  const seededCount = await topicRows.count();

  await page.getByTestId(ADD_MENU_IDS.trigger).click();
  await page.getByTestId(ADD_MENU_IDS.action('subject')).click();

  const nameInput = page.locator('[data-testid^="outline-subject-rename-"]');
  await expect(nameInput).toBeFocused();
  await expect(topicRows).toHaveCount(seededCount + 1);

  await nameInput.press('Escape');
  await expect(topicRows).toHaveCount(seededCount);

  await page.getByTestId(ADD_MENU_IDS.trigger).click();
  await page.getByTestId(ADD_MENU_IDS.action('subject')).click();
  await page.locator('[data-testid^="outline-subject-rename-"]').fill('נושא חדש');
  await page.locator('[data-testid^="outline-subject-rename-"]').press('Enter');

  await expect(topicRows).toHaveCount(seededCount + 1);
  await expect(topicRows.last()).toContainText('נושא חדש');
});

test('appendices are named with successive Hebrew letters', async ({ page }) => {
  await page.goto('/document/d1');

  const topicRows = page.locator('[data-testid^="outline-subject-toggle-"]');

  await page.getByTestId(ADD_MENU_IDS.trigger).click();
  await page.getByTestId(ADD_MENU_IDS.action('appendix')).click();

  await scrollOutlineToEnd(page);

  await expect(topicRows.last()).toContainText('נספח ב׳');

  await page.getByTestId(ADD_MENU_IDS.trigger).click();
  await page.getByTestId(ADD_MENU_IDS.action('appendix')).click();
  await scrollOutlineToEnd(page);
  await expect(topicRows.last()).toContainText('נספח ג׳');
});

test('dragging a section onto its sibling reorders both the outline and the paper', async ({
  page,
}) => {
  await page.goto('/document/d1');

  const s1SectionTitles = page
    .getByTestId(SUBJECT_BLOCK_IDS.root('s1'))
    .getByRole('textbox', { name: 'שם הסעיף' });
  await expect(s1SectionTitles.first()).toHaveValue('מטרת המסמך');

  await dragOnto(page, OUTLINE_SECTION_ROW_IDS.root('s1-2'), OUTLINE_SECTION_ROW_IDS.root('s1-1'));

  await expect(s1SectionTitles.first()).toHaveValue('היסטוריית גרסאות');
  await expect(page.getByTestId(OUTLINE_SECTION_ROW_IDS.root('s1-2'))).toContainText('1.');
  await expect(page.getByTestId(OUTLINE_SECTION_ROW_IDS.root('s1-1'))).toContainText('2.');
});

test('dragging a section onto another topic hands it over to that topic', async ({ page }) => {
  await page.goto('/document/d1');

  const s1Sections = page
    .getByTestId(SUBJECT_BLOCK_IDS.root('s1'))
    .getByRole('textbox', { name: 'שם הסעיף' });
  const s2Sections = page
    .getByTestId(SUBJECT_BLOCK_IDS.root('s2'))
    .getByRole('textbox', { name: 'שם הסעיף' });
  await expect(page.getByTestId(OUTLINE_SECTION_ROW_IDS.root('s1-1'))).toBeVisible();

  await dragOnto(page, OUTLINE_SECTION_ROW_IDS.root('s1-1'), OUTLINE_SUBJECT_ROW_IDS.toggle('s2'));

  await expect(s1Sections).toHaveCount(1);
  await expect(s1Sections.first()).toHaveValue('היסטוריית גרסאות');
  await expect(s2Sections).toHaveCount(3);
  await expect(s2Sections.first()).toHaveValue('מטרת המסמך');
});

test("dropping a section on a topic's add link puts it last in that topic", async ({ page }) => {
  await page.goto('/document/d1');

  const s2Sections = page
    .getByTestId(SUBJECT_BLOCK_IDS.root('s2'))
    .getByRole('textbox', { name: 'שם הסעיף' });
  await expect(page.getByTestId(OUTLINE_SECTION_ROW_IDS.root('s1-1'))).toBeVisible();

  await dragOnto(page, OUTLINE_SECTION_ROW_IDS.root('s1-1'), ADD_NODE_LINK_IDS.addSection('s2'));

  await expect(s2Sections).toHaveCount(3);
  await expect(s2Sections.last()).toHaveValue('מטרת המסמך');
});

test('dragging a sub-section onto another section hands it over to that section', async ({
  page,
}) => {
  await page.goto('/document/d1');

  await page.getByTestId(ADD_NODE_LINK_IDS.addSubSection('s1-1')).click();

  const subSectionRow = page.locator('[data-testid^="outline-sub-section-"]').first();
  const subSectionId = await subSectionRow.evaluate((el) =>
    (el.getAttribute('data-testid') ?? '').replace('outline-sub-section-', ''),
  );

  await dragOnto(
    page,
    OUTLINE_SUB_SECTION_ROW_IDS.root(subSectionId),
    OUTLINE_SECTION_ROW_IDS.root('s2-2'),
  );

  await expect(
    page.getByTestId(SUBJECT_BLOCK_IDS.root('s1')).getByRole('textbox', { name: 'שם תת הסעיף' }),
  ).toHaveCount(0);
  await expect(
    page.getByTestId(SUBJECT_BLOCK_IDS.root('s2')).getByRole('textbox', { name: 'שם תת הסעיף' }),
  ).toHaveValue('תת סעיף א');
});

test('the outline holds the rows in the column and reaches the rest by scrolling', async ({
  page,
}) => {
  await page.goto('/document/d1');
  await expect(page.getByTestId(OUTLINE_SUBJECT_ROW_IDS.toggle('s1'))).toBeVisible();

  const lastTopic = page.getByTestId(OUTLINE_SUBJECT_ROW_IDS.root('s6'));
  await expect(lastTopic).toHaveCount(0);

  await scrollOutlineToEnd(page);
  await expect(lastTopic).toBeVisible();
});

test('outline section numbers run on across topics, and agree with the sheet', async ({ page }) => {
  await page.goto('/document/d1');

  await expect(page.getByTestId(OUTLINE_SECTION_ROW_IDS.index('s1-1'))).toHaveText('1.');
  await expect(page.getByTestId(OUTLINE_SECTION_ROW_IDS.index('s2-1'))).toHaveText('3.');

  await revealOutlineRow(page, OUTLINE_SECTION_ROW_IDS.root('s3-1'));
  await expect(page.getByTestId(OUTLINE_SECTION_ROW_IDS.index('s3-1'))).toHaveText('5.');

  await expect(page.getByTestId(SUBJECT_BLOCK_IDS.root('s3'))).toContainText('5.');
});

test('sub-section letters restart in every section, as they do on the sheet', async ({ page }) => {
  await page.goto('/document/d1');

  await page.getByTestId(ADD_NODE_LINK_IDS.addSubSection('s1-1')).click();
  await page.getByTestId(ADD_NODE_LINK_IDS.addSubSection('s1-2')).click();

  const letters = page.locator('[data-testid^="outline-sub-section-"]');
  await expect(letters.first()).toContainText('א.');
  await expect(letters.nth(1)).toContainText('א.');
});

test('each section row carries the status dot its seeded status calls for', async ({ page }) => {
  await page.goto('/document/d1');

  await expect(page.getByTestId(OUTLINE_SECTION_ROW_IDS.statusDot('s1-1'))).toHaveCSS(
    'background-color',
    'rgb(22, 163, 74)',
  );
  await expect(page.getByTestId(OUTLINE_SECTION_ROW_IDS.statusDot('s3-1'))).toHaveCSS(
    'background-color',
    'rgb(220, 38, 38)',
  );
});
