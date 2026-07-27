import type { Locator } from '@playwright/test';

/**
 * Click a control after centring it in the viewport.
 *
 * The A4 document canvas is far taller than the viewport, so a section's action
 * buttons routinely land within a few pixels of the bottom edge. Playwright's
 * auto-scroll treats "partially visible" as actionable and computes the click
 * point up front, but the browser delivers the resulting scroll on a later
 * frame — so the synthesized mousedown can land on coordinates the button has
 * already moved away from, and the click silently hits nothing. The symptom is
 * a 30s timeout on the panel the click should have opened, or a locator stuck
 * "waiting for element to be visible, enabled and stable".
 *
 * Centring first settles the position before the click. This is about test
 * determinism, not the app: nothing overlays these buttons, and a real user
 * clicking one gets the panel every time.
 */
export const clickCentred = async (locator: Locator) => {
  await locator.evaluate((el) => el.scrollIntoView({ block: 'center' }));
  await locator.click();
};
