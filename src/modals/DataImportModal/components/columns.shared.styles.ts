import styled, { css } from 'styled-components';
import { colors, gray, transitions } from '@/styles/theme';

// Scrollable vertical pane — one per picker column.
export const ColumnPane = styled.div<{ $width?: number }>`
  ${({ $width }) =>
    $width
      ? css`
          width: ${$width}px;
          flex-shrink: 0;
        `
      : css`
          flex: 1;
          min-width: 0;
        `}
  overflow-y: auto;
  border-left: 1px solid ${gray[100]};
  background: ${colors.surface};
`;

export const ColumnHeading = styled.p<{ $raised?: boolean }>`
  font-size: 9px;
  font-weight: 600;
  color: ${gray[400]};
  letter-spacing: 0.1em;
  padding: 12px 16px 8px;
  position: sticky;
  top: 0;
  background: color-mix(in srgb, ${colors.surface} 95%, transparent);
  backdrop-filter: blur(4px);
  border-bottom: 1px solid ${gray[50]};
  ${({ $raised }) => $raised && css`z-index: 10;`}
`;

// Row wrapper — draws a hairline between consecutive rows.
export const RowGroup = styled.div`
  &:not(:first-child) {
    border-top: 1px solid ${gray[50]};
  }
`;

// Selectable list row with a right accent bar + gradient when active.
export const NavRow = styled.button<{ $isActive: boolean }>`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  text-align: right;
  transition: background ${transitions.fast};
  background: ${({ $isActive }) =>
    $isActive
      ? css`linear-gradient(to left, ${colors.primaryLight}, color-mix(in srgb, ${colors.primaryLight} 45%, ${colors.surface}))`
      : 'transparent'};

  &:hover {
    ${({ $isActive }) =>
      !$isActive &&
      css`
        background: color-mix(in srgb, ${gray[50]} 70%, transparent);
      `}
  }

  ${({ $isActive }) =>
    $isActive &&
    css`
      &::before {
        content: '';
        position: absolute;
        right: 0;
        top: 8px;
        bottom: 8px;
        width: 3px;
        border-radius: 9999px;
        background: ${colors.primary};
      }
    `}
`;

export const ColumnEmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 6px;
  padding-bottom: 32px;

  p {
    font-size: 11px;
    color: ${gray[300]};
  }
`;
