import styled from 'styled-components';
import { flexBetween, flexColumn, flexGap } from '@/styles/mixins';
import { colors, gray, radii, transitions } from '@/styles/theme';

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

export const DesignBlockHeader = styled.div`
  ${flexBetween}
`;

export const DesignListWrap = styled.div`
  ${flexColumn(10)}
`;

export const DesignBlock = styled.div`
  ${flexColumn(8)}
  padding: 8px 10px;
  border: 1px solid ${gray[100]};
  border-radius: ${radii.lg};
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
