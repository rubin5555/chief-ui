import styled from 'styled-components';
import { flexCenter, resetButton } from '@/styles/mixins';
import { docColors, gray, radii, shadows } from '@/styles/theme';

export const TipBadge = styled.button`
  ${resetButton}
  ${flexCenter}
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  border: 1px solid ${gray[400]};
  border-radius: ${radii.full};
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
  color: ${gray[500]};
  cursor: default;
`;

export const Tip = styled.div<{ $top: number; $right: number }>`
  position: fixed;
  z-index: 9999;
  top: ${(props) => props.$top}px;
  right: ${(props) => props.$right}px;
  width: 220px;
  padding: 5px 9px;
  border-radius: ${radii.md};
  background-color: ${docColors.neutralBar};
  color: ${gray[800]};
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
  text-align: right;
  box-shadow: ${shadows.tooltip};
  pointer-events: none;
`;
