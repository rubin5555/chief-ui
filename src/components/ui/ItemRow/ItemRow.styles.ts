import styled from 'styled-components';
import { ellipsis, flexBetween, flexCenter, flexGap } from '@/styles/mixins';
import { colors, gray } from '@/styles/theme';

export const RowRoot = styled.div<{ $clickable: boolean }>`
  padding: 16px;
  ${flexBetween}
  gap: 12px;
  transition: background-color 0.15s;
  cursor: ${(p) => (p.$clickable ? 'pointer' : 'default')};
  &:hover { background-color: ${(p) => (p.$clickable ? gray[50] : 'transparent')}; }
`;

export const RowLabel = styled.div`
  ${flexGap(12)}
  flex: 1;
  min-width: 0;
`;

export const RowText = styled.span`
  font-size: 14px;
  color: ${gray[900]};
  ${ellipsis}
`;

export const RowActions = styled.div`
  ${flexGap(8)}
  flex-shrink: 0;
`;

export const ActionButton = styled.button<{ $danger?: boolean; $accent?: boolean }>`
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.15s, color 0.15s;
  cursor: pointer;
  ${flexCenter}
  color: ${(p) => (p.$danger ? colors.danger : p.$accent ? colors.accent : gray[400])};
  &:hover {
    background-color: ${(p) => (p.$danger ? colors.dangerLight : gray[200])};
    color: ${(p) => (p.$danger ? colors.danger : p.$accent ? colors.accent : gray[600])};
  }
`;
