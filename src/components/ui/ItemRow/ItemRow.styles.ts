import styled from 'styled-components';
import { ellipsis } from '@/styles/mixins';
import { colors, gray } from '@/styles/theme';

export const RowRoot = styled.div<{ $clickable: boolean }>`
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  transition: background-color 0.15s;
  cursor: ${(p) => (p.$clickable ? 'pointer' : 'default')};
  &:hover { background-color: ${(p) => (p.$clickable ? gray[50] : 'transparent')}; }
`;

export const RowLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
`;

export const RowText = styled.span`
  font-size: 14px;
  color: ${gray[900]};
  ${ellipsis}
`;

export const RowActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

export const ActionButton = styled.button<{ $danger?: boolean; $accent?: boolean }>`
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.15s, color 0.15s;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(p) => (p.$danger ? colors.danger : p.$accent ? colors.accent : gray[400])};
  &:hover {
    background-color: ${(p) => (p.$danger ? colors.dangerLight : gray[200])};
    color: ${(p) => (p.$danger ? colors.danger : p.$accent ? colors.accent : gray[600])};
  }
`;
