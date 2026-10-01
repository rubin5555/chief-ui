import styled from 'styled-components';
import { docColors, radii, shadows } from '@/styles/theme';

export const TipRoot = styled.span`
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
  margin-inline-end: 3px;
  color: ${docColors.amberBorder};
  cursor: default;
`;

export const Tip = styled.span`
  position: absolute;
  bottom: 120%;
  right: 50%;
  transform: translateX(50%);
  z-index: 99999;
  display: none;
  width: max-content;
  max-width: 220px;
  padding: 6px 10px;
  border-radius: ${radii.lg};
  background-color: ${docColors.ink};
  color: ${docColors.inkInverse};
  font-size: 11px;
  font-weight: 400;
  line-height: 1.5;
  text-align: right;
  white-space: pre-wrap;
  box-shadow: ${shadows.lg};
  pointer-events: none;

  ${TipRoot}:hover &,
  ${TipRoot}:focus-within & {
    display: block;
  }
`;

export const TipArrow = styled.span`
  position: absolute;
  top: 100%;
  right: 50%;
  transform: translateX(50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid ${docColors.ink};
`;
