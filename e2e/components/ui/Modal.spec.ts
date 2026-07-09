import { expect, test } from '@playwright/test';
import { SUPPORT_MENU_IDS } from '../../../src/components/layout/TopNavbar/components/SupportMenu/SupportMenu.testids';
import { MODAL_IDS } from '../../../src/components/ui/Modal/Modal.testids';
import { CONTACT_PERMISSIONS_MODAL_IDS } from '../../../src/modals/ContactPermissionsModal/ContactPermissionsModal.testids';

// The generic `Modal` primitive (src/components/ui/Modal) always derives its sub-element
// testids by suffixing whatever root testid it's given with the same suffixes documented on
// `MODAL_IDS` (`-overlay`, `-header`, `-body`, `-close`). Every real caller overrides the root
// id, so we exercise the primitive here through `ContactPermissionsModal` - opened via the
// support menu, a real UI path - and rebuild its derived ids from that same suffix shape.
const modalSuffix = (key: 'overlay' | 'header' | 'body' | 'close') =>
  MODAL_IDS[key].slice(MODAL_IDS.root.length);

const overlayId = `${CONTACT_PERMISSIONS_MODAL_IDS.root}${modalSuffix('overlay')}`;
const headerId = `${CONTACT_PERMISSIONS_MODAL_IDS.root}${modalSuffix('header')}`;
const bodyId = `${CONTACT_PERMISSIONS_MODAL_IDS.root}${modalSuffix('body')}`;
const closeId = `${CONTACT_PERMISSIONS_MODAL_IDS.root}${modalSuffix('close')}`;

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByTestId(SUPPORT_MENU_IDS.trigger).click();
  await page.getByTestId(SUPPORT_MENU_IDS.permissionsOption).click();
  await page.waitForSelector(`[data-testid="${CONTACT_PERMISSIONS_MODAL_IDS.root}"]`);
});

test('modal opens with a header and body', async ({ page }) => {
  await expect(page.getByTestId(CONTACT_PERMISSIONS_MODAL_IDS.root)).toBeVisible();
  await expect(page.getByTestId(headerId)).toBeVisible();
  await expect(page.getByTestId(bodyId)).toBeVisible();
});

test('closes on the close (X) button', async ({ page }) => {
  await page.getByTestId(closeId).click();
  await expect(page.getByTestId(CONTACT_PERMISSIONS_MODAL_IDS.root)).not.toBeVisible();
});

test('closes on overlay click', async ({ page }) => {
  await page.getByTestId(overlayId).click({ position: { x: 5, y: 5 } });
  await expect(page.getByTestId(CONTACT_PERMISSIONS_MODAL_IDS.root)).not.toBeVisible();
});
