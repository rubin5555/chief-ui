import styled from 'styled-components';
import { colors, gray, radii, shadows } from '@/styles/theme';
import { squareToolButton } from '../components.shared.styles';

export const BarRoot = styled.div<{ $top: number; $left: number; $width: number }>`
  position: fixed;
  top: ${({ $top }) => $top}px;
  left: ${({ $left }) => $left}px;
  width: ${({ $width }) => $width}px;
  z-index: 9990;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1px;
  padding: 2px 6px;
  direction: rtl;
  background: ${colors.surface};
  border: 1px solid ${gray[200]};
  border-radius: ${radii.lg};
  box-shadow: ${shadows.bubble};
`;

export const BarArrow = styled.span`
  position: absolute;
  top: -6px;
  right: 16px;
  width: 10px;
  height: 6px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    margin-top: 3px;
    background: ${colors.surface};
    border: 1px solid ${gray[200]};
    transform: rotate(45deg);
    transform-origin: bottom left;
  }
`;

export const BarAction = styled.button<{ $danger?: boolean }>`
  ${squareToolButton}
  color: ${({ $danger }) => ($danger ? colors.danger : gray[600])};

  &:hover:not(:disabled) {
    background: ${({ $danger }) => ($danger ? colors.dangerLight : gray[100])};
  }
`;

export const BarDivider = styled.span`
  width: 1px;
  height: 16px;
  margin: 0 2px;
  flex-shrink: 0;
  background: ${gray[200]};
`;
