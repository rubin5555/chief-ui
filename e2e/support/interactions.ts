import type { Locator, Page } from '@playwright/test';

/**
 * Click a control after centring it in the viewport and letting the scroll settle.
 *
 * Two separate problems make a naive `.click()` unreliable on the document
 * canvas, which is far taller than the viewport:
 *
 * 1. A section's action buttons routinely land within a few pixels of the bottom
 *    edge. Playwright treats "partially visible" as actionable and computes the
 *    click point up front, but the browser delivers its auto-scroll on a later
 *    frame — so the synthesized mousedown can land where the button no longer is,
 *    and the click silently hits nothing.
 *
 * 2. Floating panels (useFloatingPanel) close on any scroll outside themselves,
 *    because a fixed-position panel whose trigger has scrolled away would
 *    otherwise sit detached. A scroll event still in flight when the click opens
 *    the panel therefore closes it again immediately.
 *
 * Waiting for the element's position to stop changing fixes both: the click point
 * is accurate, and no scroll event arrives after it. This is about test
 * determinism, not the app — a real user clicking one of these buttons gets the
 * panel every time.
 */
export const clickCentred = async (locator: Locator) => {
  await locator.evaluate((el) => el.scrollIntoView({ block: 'center' }));

  // Two consecutive frames at the same offset means scrolling has finished.
  // rAF rather than a fixed timeout so this costs one frame when the page was
  // already still, and waits as long as it genuinely takes when it wasn't.
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

/**
 * Drag one element onto another via native HTML5 drag-and-drop.
 *
 * Playwright's `dragTo` drives the mouse, which doesn't produce the
 * `dragstart`/`dragover`/`drop` sequence a `draggable` element listens for, so
 * the events are dispatched directly — the same approach DataImportModal.spec.ts
 * uses for its field chips.
 *
 * Split across two `page.evaluate` calls, unlike that one, because useDragReorder
 * records the dragged id in React state: its `onDragOver` reads that id from the
 * render that registered the handler, so dispatching every event in one tick would
 * have the drop handler still seeing `null`. Returning to Playwright between the
 * two lets React re-render first. Each call mints its own DataTransfer, which is
 * fine here — the hook carries the id in state rather than in the transfer.
 */
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
