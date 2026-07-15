import styled from 'styled-components';
import { flexBetween, flexCenter } from '@/styles/mixins';
import { colors, gray, radii, shadows, transitions } from '@/styles/theme';

export const PermCardOverlay = styled.div`
  position: absolute;
  inset: 0;
  ${flexCenter}
  z-index: 10;
  pointer-events: none;
`;

export const PermCardWrap = styled.div`
  pointer-events: auto;
  background: ${colors.surface};
  border-radius: ${radii['2xl']};
  border: 1px solid ${gray[200]};
  box-shadow: ${shadows.xl};
  width: 480px;
  max-width: 90%;
`;

export const PermCardHeader = styled.div`
  ${flexBetween}
  padding: 14px 20px;
  background: ${colors.primaryLight};
  border-bottom: 1px solid ${gray[100]};
  border-radius: ${radii['2xl']} ${radii['2xl']} 0 0;
`;

export const PermCardTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.primary};
`;

export const PermCardCloseBtn = styled.button`
  ${flexCenter}
  padding: 6px;
  border: none;
  border-radius: ${radii.lg};
  background: transparent;
  color: color-mix(in srgb, ${colors.primary} 60%, transparent);
  cursor: pointer;
  transition: background ${transitions.fast};
  &:hover {
    color: ${colors.primary};
    background: color-mix(in srgb, ${colors.primary} 10%, transparent);
  }
`;

export const PermCardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 20px 20px;
`;
