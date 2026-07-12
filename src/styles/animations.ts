import { css, keyframes } from 'styled-components';

// Kept deliberately subtle and fast — enough to signal "this appeared",
// not enough to feel like a UI flourish. Used by dialog chrome only
// (modal.shared.styles, ui/Modal, DataImportModal's picker card).

export const overlayFadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const dialogEnter = keyframes`
  from {
    opacity: 0;
    transform: scale(0.97) translateY(4px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

export const overlayFadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

export const dialogExit = keyframes`
  from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scale(0.97) translateY(4px);
  }
`;

// Exit duration in one place so the CSS animation and the JS unmount delay
// (useDialogClose) can never drift apart. Exit is a touch faster than enter —
// an element on its way out should get out of the way, not linger.
export const MODAL_EXIT_DURATION_MS = 140;

// transform/opacity only — both run on the compositor thread, so this costs
// the browser nothing beyond the initial paint, no matter how heavy the
// dialog's own content (TinyMCE, forms, etc.) is. `prefers-reduced-motion`
// is handled in JS (useDialogClose skips the delay outright) rather than
// here, since the animation needs to actually finish before unmount either way.
export const overlayMotion = css<{ $closing?: boolean }>`
  animation: ${({ $closing }) => ($closing ? overlayFadeOut : overlayFadeIn)}
    ${({ $closing }) => ($closing ? MODAL_EXIT_DURATION_MS : 150)}ms ease-out
    ${({ $closing }) => ($closing ? 'forwards' : '')};
`;

export const dialogMotion = css<{ $closing?: boolean }>`
  animation: ${({ $closing }) => ($closing ? dialogExit : dialogEnter)}
    ${({ $closing }) => ($closing ? MODAL_EXIT_DURATION_MS : 180)}ms
    ${({ $closing }) => ($closing ? 'cubic-bezier(0.4, 0, 1, 1)' : 'cubic-bezier(0.16, 1, 0.3, 1)')}
    ${({ $closing }) => ($closing ? 'forwards' : '')};
`;
