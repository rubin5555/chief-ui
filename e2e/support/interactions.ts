import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { DOCUMENT_OUTLINE_TREE_IDS } from '../../src/pages/document/components/DocumentOutlineTree/DocumentOutlineTree.testids';

export const revealOutlineRow = async (page: Page, rowTestId: string) => {
  const tree = page.getByTestId(DOCUMENT_OUTLINE_TREE_IDS.root);
  const row = page.getByTestId(rowTestId);

  await expect
    .poll(async () => {
      if (await row.count()) return true;
      await tree.evaluate((el) => {
        el.scrollTop = Math.min(el.scrollTop + el.clientHeight / 2, el.scrollHeight);
      });
      return false;
    })
    .toBe(true);
};

export const scrollOutlineToEnd = async (page: Page) => {
  const tree = page.getByTestId(DOCUMENT_OUTLINE_TREE_IDS.root);

  await expect
    .poll(async () =>
      tree.evaluate((el) => {
        const before = el.scrollTop;
        el.scrollTop = el.scrollHeight;
        return el.scrollTop === before;
      }),
    )
    .toBe(true);
};

export const clickCentred = async (locator: Locator) => {
  await locator.evaluate((el) => el.scrollIntoView({ block: 'center' }));

  await locator.evaluate(
    (el) =>
      new Promise<void>((resolve) => {
        let previousTop = Number.NaN;
        const check = () => {
          const { top } = el.getBoundingClientRect();
          if (top === previousTop) {
            resolve();
            return;
          }
          previousTop = top;
          requestAnimationFrame(check);
        };
        requestAnimationFrame(check);
      }),
  );

  await locator.click();
};

export const dragOnto = async (page: Page, sourceTestId: string, targetTestId: string) => {
  await page.evaluate((source) => {
    const from = document.querySelector(`[data-testid="${source}"]`);
    if (!from) throw new Error(`drag source missing: ${source}`);
    from.dispatchEvent(
      new DragEvent('dragstart', {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer(),
      }),
    );
  }, sourceTestId);

  await page.evaluate((target) => {
    const to = document.querySelector(`[data-testid="${target}"]`);
    if (!to) throw new Error(`drop target missing: ${target}`);

    const rect = to.getBoundingClientRect();
    const options = {
      bubbles: true,
      cancelable: true,
      clientX: rect.left + rect.width / 2,
      clientY: rect.top + rect.height / 2,
      dataTransfer: new DataTransfer(),
    };
    to.dispatchEvent(new DragEvent('dragover', options));
    to.dispatchEvent(new DragEvent('drop', options));
  }, targetTestId);
};
