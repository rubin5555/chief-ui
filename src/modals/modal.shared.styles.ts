import styled from 'styled-components';
import { dialogEnter, overlayFadeIn } from '@/styles/animations';
import { colors, gray, radii, shadows, transitions } from '@/styles/theme';

// Shared full-page modal chrome (overlay + card + header/title/close/footer).
// Each modal extends the *Base pieces with only its own dimensions/paddings.
// DataImportModal's picker card is intentionally not based on these — it overlays
// a hosting modal without dimming, with its own tinted header and radii.

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9998;
  background: rgba(0, 0, 0, 0.5);
  animation: ${overlayFadeIn} 150ms ease-out;
`;

export const ModalCardBase = styled.div`
  position: relative;
  background: ${colors.surface};
  border-radius: ${radii['3xl']};
  box-shadow: ${shadows.xxl};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: ${dialogEnter} 180ms cubic-bezier(0.16, 1, 0.3, 1);
`;

export const ModalHeaderBase = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  background: ${colors.surface};
  border-bottom: 1px solid ${colors.border};
`;

export const ModalTitleBase = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${gray[900]};
  margin: 0;
`;

export const CloseBtnBase = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: ${radii.xl};
  border: none;
  background: transparent;
  cursor: pointer;
  color: ${gray[500]};
  transition: background ${transitions.normal};
  &:hover {
    background: ${gray[100]};
  }
`;

export const ModalFooterBase = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 32px;
  border-top: 1px solid ${colors.border};
`;
