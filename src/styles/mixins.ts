import { css } from 'styled-components';
import { colors } from '@/styles/theme';

export const ellipsis = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const flexCenter = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const flexBetween = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const flexGap = (gap: number) => css`
  display: flex;
  align-items: center;
  gap: ${gap}px;
`;

export const resetButton = css`
  background: transparent;
  border: none;
  cursor: pointer;
`;

export const flexFill = css`
  flex: 1;
  min-width: 0;
`;

export const flexScroll = css`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`;

export const rtlTextInput = css`
  font-size: 14px;
  text-align: right;
  direction: rtl;
`;

export const focusPrimaryBorder = css`
  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
`;
