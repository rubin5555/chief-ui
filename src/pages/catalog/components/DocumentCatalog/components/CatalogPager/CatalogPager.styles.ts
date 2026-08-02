import styled from 'styled-components';
import { catColors, colors, gray, radii, transitions } from '@/styles/theme';

export const PagerRoot = styled.div`
  display: flex;
  flex-shrink: 0;
  justify-content: flex-start;
`;

// The controls read left-to-right even on an RTL page — a pager is a number
// line, and main flips it back for that reason.
export const PagerInner = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

export const ArrowButton = styled.button<{ $disabled: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: ${radii.full};
  border: 1px solid ${gray[300]};
  background: ${colors.surface};
  color: ${gray[700]};
  opacity: ${({ $disabled }) => ($disabled ? 0.35 : 1)};
  transition: background ${transitions.normal};
`;

export const PageButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 28px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  transition: background ${transitions.normal};
  background: ${({ $active }) => ($active ? colors.primary : 'transparent')};
  color: ${({ $active }) => ($active ? colors.surface : gray[500])};
  border: ${({ $active }) => ($active ? 'none' : `1px solid ${catColors.outlineBorder}`)};
`;
