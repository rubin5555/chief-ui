import { css, keyframes } from 'styled-components';

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

export const MODAL_EXIT_DURATION_MS = 140;

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
