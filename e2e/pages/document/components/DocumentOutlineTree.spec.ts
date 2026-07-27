import { expect, test } from '@playwright/test';
import { ADD_NODE_LINK_IDS } from '../../../../src/pages/document/components/DocumentOutlineTree/components/AddNodeLink/AddNodeLink.testids';
import { CONFIRM_DELETE_MODAL_IDS } from '../../../../src/pages/document/components/DocumentOutlineTree/components/ConfirmDeleteModal/ConfirmDeleteModal.testids';
import { OUTLINE_ROW_MENU_IDS } from '../../../../src/pages/document/components/DocumentOutlineTree/components/OutlineRowMenu/OutlineRowMenu.testids';
import { OUTLINE_SECTION_ROW_IDS } from '../../../../src/pages/document/components/DocumentOutlineTree/components/OutlineSectionRow/OutlineSectionRow.testids';
import { OUTLINE_SUBJECT_ROW_IDS } from '../../../../src/pages/document/components/DocumentOutlineTree/components/OutlineSubjectRow/OutlineSubjectRow.testids';
import { ADD_MENU_IDS } from '../../../../src/pages/document/components/DocumentSidebar/components/SidebarFabRow/components/AddMenu/AddMenu.testids';
import { SUBJECT_BLOCK_IDS } from '../../../../src/pages/document/components/SubjectBlock/SubjectBlock.testids';
import { dragOnto } from '../../../support/interactions';

// The sidebar outline is editable in its own right — rename, add, delete and
// reorder at three levels — and everything it changes shows up in the paper,
// which reads the same tree.

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
  // The in-paper title is an input, so its value is what changed there.
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

  // s1 is seeded with two sections, so the next one is `סעיף 3`.
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

  // The seeded sections have no sub-sections, so the first one is `תת סעיף א`.
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
  // Counting is a one-shot read with no retry, so wait for the seeded tree to be
  // on screen before taking it — otherwise the count is taken as 0 mid-load.
  await expect(page.getByTestId(OUTLINE_SUBJECT_ROW_IDS.toggle('s1'))).toBeVisible();
  const seededCount = await topicRows.count();

  await page.getByTestId(ADD_MENU_IDS.trigger).click();
  await page.getByTestId(ADD_MENU_IDS.action('subject')).click();

  const nameInput = page.locator('[data-testid^="outline-subject-rename-"]');
  await expect(nameInput).toBeFocused();
  await expect(topicRows).toHaveCount(seededCount + 1);

  // Blurring an unnamed topic takes it away again, so an accidental press costs
  // nothing (main's saveNewSection, Edit.tsx:3590).
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
  // `נספחים` is already in the seed tree and its title starts with `נספח`, so it
  // counts — main matches appendices by prefix, which makes the first added one ב׳.
  await expect(topicRows.last()).toContainText('נספח ב׳');

  await page.getByTestId(ADD_MENU_IDS.trigger).click();
  await page.getByTestId(ADD_MENU_IDS.action('appendix')).click();
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

  // s1-2 was below s1-1 and is now above it, in the sheet and in the sidebar —
  // where the row indices are positional, so they swap with the rows.
  await expect(s1SectionTitles.first()).toHaveValue('היסטוריית גרסאות');
  await expect(page.getByTestId(OUTLINE_SECTION_ROW_IDS.root('s1-2'))).toContainText('1.');
  await expect(page.getByTestId(OUTLINE_SECTION_ROW_IDS.root('s1-1'))).toContainText('2.');
});

test('each section row carries the status dot its seeded status calls for', async ({ page }) => {
  await page.goto('/document/d1');

  // Seeded in src/api/docs.ts: everything under s1 is approved, everything under
  // s3 needs fixing — main paints these from the topic's status, and the seed
  // mirrors that node by node.
  await expect(page.getByTestId(OUTLINE_SECTION_ROW_IDS.statusDot('s1-1'))).toHaveCSS(
    'background-color',
    'rgb(22, 163, 74)',
  );
  await expect(page.getByTestId(OUTLINE_SECTION_ROW_IDS.statusDot('s3-1'))).toHaveCSS(
    'background-color',
    'rgb(220, 38, 38)',
  );
});
