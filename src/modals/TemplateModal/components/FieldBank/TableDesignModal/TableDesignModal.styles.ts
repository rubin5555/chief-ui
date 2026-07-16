import styled from 'styled-components';
import { ellipsis, flexBetween, flexColumn, flexGap } from '@/styles/mixins';
import { colors, gray, radii, transitions } from '@/styles/theme';

export const Body = styled.div`
  ${flexColumn(14)}
`;

export const FieldRow = styled.div`
  ${flexColumn(6)}
`;

export const ToggleRow = styled.div`
  ${flexBetween}
`;

export const FieldLabel = styled.p`
  font-size: 11px;
  font-weight: 700;
  color: ${gray[600]};
`;

export const TextInput = styled.input`
  width: 100%;
  padding: 6px 10px;
  font-size: 12px;
  border-radius: ${radii.lg};
  border: 1px solid ${gray[200]};
  background: ${colors.surface};
  color: ${gray[700]};

  &:focus {
    outline: none;
    border-color: color-mix(in srgb, ${colors.primary} 50%, transparent);
    box-shadow: 0 0 0 1px color-mix(in srgb, ${colors.primary} 15%, transparent);
  }

  &::placeholder {
    color: ${gray[300]};
  }
`;

export const LabelsList = styled.div`
  ${flexColumn(6)}
`;

export const LabelRow = styled.div`
  ${flexGap(8)}
`;

export const LabelColumnName = styled.span`
  flex: 0 0 90px;
  font-size: 11px;
  color: ${gray[500]};
  ${ellipsis}
`;

export const SwatchRow = styled.div`
  ${flexGap(8)}
  flex-wrap: wrap;
`;

export const SwatchBtn = styled.button<{ $color: string; $active: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: ${radii.full};
  background: ${({ $color }) => $color || gray[50]};
  border: 2px solid
    ${({ $active, $color }) => ($active ? colors.primary : $color ? 'transparent' : gray[200])};
  box-shadow: ${({ $active }) =>
    $active ? `0 0 0 2px color-mix(in srgb, ${colors.primary} 20%, transparent)` : 'none'};
  transition: border-color ${transitions.fast};
  flex-shrink: 0;
`;

export const SectionDivider = styled.hr`
  border: none;
  border-top: 1px solid ${gray[100]};
  margin: 0;
`;

export const HintText = styled.p`
  font-size: 10px;
  color: ${gray[400]};
`;

// Shared "list of editable design blocks" shell — reused by ColumnStyleList and
// StyleRuleList so per-column overrides and conditional rules render identically.
export const DesignListWrap = styled.div`
  ${flexColumn(10)}
`;

export const DesignBlock = styled.div`
  ${flexColumn(8)}
  padding: 8px 10px;
  border: 1px solid ${gray[100]};
  border-radius: ${radii.lg};
`;

export const DesignBlockHeader = styled.div`
  ${flexBetween}
`;

export const DesignBlockName = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: ${colors.primary};
`;

export const DesignRemoveBtn = styled.button`
  display: inline-flex;
  flex-shrink: 0;
  padding: 2px;
  color: ${gray[300]};
  border-radius: 4px;
  transition: color ${transitions.fast};

  &:hover {
    color: ${colors.danger};
  }
`;
