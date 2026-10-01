import styled from 'styled-components';
import { flexCenter } from '@/styles/mixins';
import { colors, docStatusColors, gray, radii, transitions } from '@/styles/theme';

/* Covers the viewport so the card can be centred, but lets every click through
   except the card's own. */
export const ToastLayer = styled.div`
  ${flexCenter}
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
`;

export const ToastCard = styled.div`
  ${flexCenter}
  position: relative;
  flex-direction: column;
  gap: 12px;
  width: 340px;
  padding: 24px 32px;
  text-align: center;
  pointer-events: auto;
  border-radius: ${radii['2xl']};
  background: ${colors.surface};
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(0, 0, 0, 0.06);
`;

export const ToastCloseBtn = styled.button`
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  padding: 4px;
  border-radius: ${radii.full};
  color: ${gray[400]};
  transition: all ${transitions.normal};

  &:hover {
    color: ${gray[600]};
    background: ${gray[100]};
  }
`;

export const ToastIcon = styled.div`
  ${flexCenter}
  width: 48px;
  height: 48px;
  margin-bottom: 4px;
  border-radius: ${radii.full};
  background: var(--cat-status-active-bg);
  color: ${docStatusColors.approved};
`;

export const ToastTitle = styled.p`
  font-size: 16px;
  font-weight: 700;
  color: ${gray[900]};
`;

export const ToastText = styled.p`
  font-size: 14px;
  color: ${gray[500]};
`;
