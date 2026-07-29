const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * The focusable elements inside `container`, in tab order.
 *
 * One definition rather than one per component: a focus trap and a "focus the
 * first thing" both have to agree on what counts, or Tab lands somewhere the
 * trap doesn't know about. Hidden elements are dropped — a menu item behind a
 * collapsed section is in the DOM but not on anyone's tab route.
 */
export const getFocusable = (container: HTMLElement): HTMLElement[] =>
  Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => element.offsetParent !== null || element === document.activeElement,
  );
