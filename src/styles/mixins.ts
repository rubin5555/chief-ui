import { css } from 'styled-components';

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
