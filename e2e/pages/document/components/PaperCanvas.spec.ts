import { expect, test } from '@playwright/test';
import { DOC_ACTION_TOOLBAR_IDS } from '../../../../src/components/layout/TopNavbar/components/DocActionToolbar/DocActionToolbar.testids';
import { ADD_MENU_IDS } from '../../../../src/pages/document/components/DocumentSidebar/components/SidebarFabRow/components/AddMenu/AddMenu.testids';
import { EMPHASIS_BLOCK_IDS } from '../../../../src/pages/document/components/EmphasisBlock/EmphasisBlock.testids';
import { DOC_LETTERHEAD_FIELD_IDS } from '../../../../src/pages/document/components/PaperCanvas/components/DocLetterhead/components/DocLetterheadField/DocLetterheadField.testids';
import { DOC_LETTERHEAD_IDS } from '../../../../src/pages/document/components/PaperCanvas/components/DocLetterhead/DocLetterhead.testids';
import { PAPER_SUBJECT_LIST_IDS } from '../../../../src/pages/document/components/PaperCanvas/components/PaperSubjectList/PaperSubjectList.testids';
import { PAPER_CANVAS_IDS } from '../../../../src/pages/document/components/PaperCanvas/PaperCanvas.testids';
import { SECTION_BLOCK_IDS } from '../../../../src/pages/document/components/SectionBlock/SectionBlock.testids';
import { SOURCE_SYSTEMS_MODAL_IDS } from '../../../../src/pages/document/components/SourceSystemsModal/SourceSystemsModal.testids';
import { SOURCE_SYSTEMS_NOTICE_IDS } from '../../../../src/pages/document/components/SourceSystemsNotice/SourceSystemsNotice.testids';
import { SUBJECT_BLOCK_IDS } from '../../../../src/pages/document/components/SubjectBlock/SubjectBlock.testids';

// The sheet's own chrome: the letterhead at its top, the provenance notice above
// it, the emphasis card, and the outline the navbar's search field draws on
// whatever it matches.

test('the letterhead heads the sheet with the organisation emblem and its seeded fields', async ({
  page,
}) => {
  await page.goto('/document/d1');

  await expect(page.getByTestId(DOC_LETTERHEAD_IDS.root)).toBeVisible();
  await expect(page.getByTestId(DOC_LETTERHEAD_IDS.logo)).toBeVisible();

  // Two of main's five fields carry values; the rest open on their placeholders.
  await expect(page.getByTestId(DOC_LETTERHEAD_FIELD_IDS.input('tazach'))).toHaveValue(
    '2026(06)221047',
  );
  await expect(page.getByTestId(DOC_LETTERHEAD_FIELD_IDS.input('reference'))).toHaveValue(
    '123456789098',
  );

  const from = page.getByTestId(DOC_LETTERHEAD_FIELD_IDS.input('from'));
  await expect(from).toHaveAttribute('placeholder', 'לוח הפצה');
  await from.fill('אגף המבצעים');
  await expect(from).toHaveValue('אגף המבצעים');
});

test('the source-systems notice lists where the document’s content came from', async ({ page }) => {
  await page.goto('/document/d1');

  await expect(page.getByTestId(SOURCE_SYSTEMS_NOTICE_IDS.root)).toContainText(
    'מסמך זה נוצר ממערכת מקור',
  );

  await page.getByTestId(SOURCE_SYSTEMS_NOTICE_IDS.viewBtn).click();

  const modal = page.getByTestId(SOURCE_SYSTEMS_MODAL_IDS.root);
  await expect(modal).toBeVisible();
  // Document scope, so the wording is plural and all three seeded systems show.
  await expect(page.getByTestId(SOURCE_SYSTEMS_MODAL_IDS.intro)).toContainText(
    'המסמך מכיל מידע שנוצר ממערכות המקור הבאות',
  );
  await expect(page.getByTestId(SOURCE_SYSTEMS_MODAL_IDS.system('מערכת כוח אדם'))).toContainText(
    'נתוני כוח אדם ותפקידים',
  );

  await page.getByTestId(SOURCE_SYSTEMS_MODAL_IDS.closeBtn).click();
  await expect(modal).not.toBeVisible();
});

test('the emphasis card is added from the sidebar and grows with what is typed into it', async ({
  page,
}) => {
  await page.goto('/document/d1');

  // Off until asked for — main's showEmphasis starts false.
  await expect(page.getByTestId(EMPHASIS_BLOCK_IDS.root)).toHaveCount(0);

  await page.getByTestId(ADD_MENU_IDS.trigger).click();
  await page.getByTestId(ADD_MENU_IDS.action('emphasis')).click();

  const textarea = page.getByTestId(EMPHASIS_BLOCK_IDS.textarea);
  await expect(textarea).toBeVisible();
  await expect(textarea).toHaveAttribute('placeholder', 'הזן דגשים לכתיבת המסמך...');

  const before = await textarea.evaluate((el) => el.getBoundingClientRect().height);
  await textarea.fill('שורה\nשורה\nשורה\nשורה\nשורה\nשורה\nשורה\nשורה');
  const after = await textarea.evaluate((el) => el.getBoundingClientRect().height);

  // No scrollbar inside the sheet: the box takes the height its content needs.
  expect(after).toBeGreaterThan(before);
  await expect(textarea).toHaveJSProperty('scrollHeight', Math.round(after));
});

test('searching the document outlines the nodes that match', async ({ page }) => {
  await page.goto('/document/d1');

  const subject = page.getByTestId(SUBJECT_BLOCK_IDS.root('s1'));
  const section = page.getByTestId(SECTION_BLOCK_IDS.root('s1-2'));
  await expect(section).toHaveCSS('outline-style', 'none');

  await page.getByTestId(DOC_ACTION_TOOLBAR_IDS.searchToggle).click();
  await page.getByTestId(DOC_ACTION_TOOLBAR_IDS.searchInput).fill('היסטוריית');

  // s1-2 is "היסטוריית גרסאות"; its topic "מטרה ורקע" doesn't match, so the
  // outline lands on the section alone.
  await expect(section).toHaveCSS('outline-color', 'rgb(251, 191, 36)');
  await expect(subject).toHaveCSS('outline-style', 'none');

  await page.getByTestId(DOC_ACTION_TOOLBAR_IDS.searchClose).click();
  await expect(section).toHaveCSS('outline-style', 'none');
});

test('the sheet places its topics in order and stays as long as the whole document', async ({
  page,
}) => {
  await page.goto('/document/d1');
  await expect(page.getByTestId(PAPER_SUBJECT_LIST_IDS.root)).toBeVisible();

  const geometry = await page.getByTestId(PAPER_SUBJECT_LIST_IDS.root).evaluate((list) => {
    const rows = [...list.querySelectorAll('[data-index]')];
    return {
      listHeight: list.getBoundingClientRect().height,
      listTop: list.getBoundingClientRect().top,
      rows: rows.map((row) => ({
        index: Number(row.getAttribute('data-index')),
        top: row.getBoundingClientRect().top,
        bottom: row.getBoundingClientRect().bottom,
      })),
    };
  });

  expect(geometry.rows.length).toBeGreaterThan(0);

  // Rendered in document order, and no two topics on top of each other — the
  // failure mode of getting the two coordinate spaces (the scroll container's
  // and the zoomed sheet's) mixed up.
  const indexes = geometry.rows.map((row) => row.index);
  expect(indexes).toEqual([...indexes].sort((a, b) => a - b));
  for (let i = 1; i < geometry.rows.length; i++) {
    expect(geometry.rows[i].top).toBeGreaterThanOrEqual(geometry.rows[i - 1].bottom - 1);
  }

  // The spacer reserves every topic's height, rendered or not, so the sheet is
  // the document's length rather than the window's — which is what the page-break
  // lines and the scrollbar are drawn against.
  const lastBottom = Math.max(...geometry.rows.map((row) => row.bottom));
  expect(geometry.listHeight).toBeGreaterThanOrEqual(lastBottom - geometry.listTop - 1);
});

test('a topic being edited survives scrolling away from it', async ({ page }) => {
  await page.goto('/document/d1');

  // A section title in the first topic, focused and half-typed: exactly the
  // state that unmounting the topic would throw away.
  const title = page.getByTestId(SUBJECT_BLOCK_IDS.root('s1')).getByRole('textbox', {
    name: 'שם הסעיף',
  });
  await title.first().fill('מטרת המסמך המעודכנת');

  await page
    .getByTestId(PAPER_CANVAS_IDS.root)
    .evaluate((scroll) => scroll.scrollTo(0, scroll.scrollHeight));

  await expect(title.first()).toBeFocused();
  await expect(title.first()).toHaveValue('מטרת המסמך המעודכנת');
});

test('a bookmarked search arrives with the match already outlined', async ({ page }) => {
  // ?q=מטר — a prefix, so it catches both the topic "מטרה ורקע" and the section
  // "מטרת המסמך" beneath it, which no whole word does.
  await page.goto('/document/d1?q=%D7%9E%D7%98%D7%A8');

  await expect(page.getByTestId(SUBJECT_BLOCK_IDS.root('s1'))).toHaveCSS(
    'outline-color',
    'rgb(251, 191, 36)',
  );
  await expect(page.getByTestId(SECTION_BLOCK_IDS.root('s1-1'))).toHaveCSS(
    'outline-color',
    'rgb(251, 191, 36)',
  );
  await expect(page.getByTestId(SECTION_BLOCK_IDS.root('s1-2'))).toHaveCSS('outline-style', 'none');
});
