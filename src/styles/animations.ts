import { keyframes } from 'styled-components';

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
