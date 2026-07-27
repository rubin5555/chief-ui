import type { Locator } from '@playwright/test';

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
