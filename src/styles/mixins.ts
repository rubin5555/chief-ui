import { css } from 'styled-components';
import { colors, radii, transitions } from '@/styles/theme';

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

export const flexColumn = (gap: number) => css`
  display: flex;
  flex-direction: column;
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

export const dashedActionButton = css`
  ${flexGap(6)}
  color: color-mix(in srgb, ${colors.primary} 50%, transparent);
  border: 1px dashed color-mix(in srgb, ${colors.primary} 20%, transparent);
  border-radius: ${radii.xl};
  font-size: 12px;
  transition:
    color ${transitions.fast},
    border-color ${transitions.fast};

  &:hover {
    color: ${colors.primary};
    border-color: color-mix(in srgb, ${colors.primary} 40%, transparent);
  }
`;
