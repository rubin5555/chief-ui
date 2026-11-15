import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { OUTLINE_ROW_MENU_IDS } from '../../../src/pages/document/components/DocumentOutlineTree/components/OutlineRowMenu/OutlineRowMenu.testids';
import { OUTLINE_SECTION_ROW_IDS } from '../../../src/pages/document/components/DocumentOutlineTree/components/OutlineSectionRow/OutlineSectionRow.testids';

const LONG_TITLE = 'סעיף שכותרתו ארוכה בהרבה מרוחב עמודת התוכן ולכן אין שום סיכוי שתיכנס בשלמותה';

const renameSection = async (page: Page, id: string, title: string) => {
  await page.getByTestId(OUTLINE_ROW_MENU_IDS.trigger(id)).click();
  await page.getByTestId(OUTLINE_ROW_MENU_IDS.renameAction).click();
  const input = page.getByTestId(OUTLINE_SECTION_ROW_IDS.renameInput(id));
  await input.fill(title);
  await input.press('Enter');
};

test('a title too long for its row answers with the whole of it on hover', async ({ page }) => {
  await page.goto('/document/d1');
  await renameSection(page, 's1-1', LONG_TITLE);

  const title = page.getByTestId(OUTLINE_SECTION_ROW_IDS.root('s1-1')).getByText(LONG_TITLE);
  await title.hover();

  await expect(title).toHaveAttribute('title', LONG_TITLE);
});

test('a title that fits gets no tooltip, and loses one it no longer needs', async ({ page }) => {
  await page.goto('/document/d1');

  const row = page.getByTestId(OUTLINE_SECTION_ROW_IDS.root('s1-1'));
  await row.getByText('מטרת המסמך').hover();
  await expect(row.getByText('מטרת המסמך')).not.toHaveAttribute('title', /./);

  await renameSection(page, 's1-1', LONG_TITLE);
  await row.getByText(LONG_TITLE).hover();
  await expect(row.getByText(LONG_TITLE)).toHaveAttribute('title', LONG_TITLE);

  await renameSection(page, 's1-1', 'קצר');
  await row.getByText('קצר').hover();
  await expect(row.getByText('קצר')).not.toHaveAttribute('title', /./);
});
