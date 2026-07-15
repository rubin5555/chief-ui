import styled, { css } from 'styled-components';
import { ellipsis, flexBetween, flexFill, flexGap } from '@/styles/mixins';
import { colors, gray, radii, transitions } from '@/styles/theme';

export const Bar = styled.div<{ $edge: 'top' | 'bottom' }>`
  flex-shrink: 0;
  background: ${gray[50]};
  ${({ $edge }) =>
    $edge === 'top'
      ? css`border-bottom: 2px solid color-mix(in srgb, ${colors.primary} 10%, transparent);`
      : css`border-top: 2px solid color-mix(in srgb, ${colors.primary} 10%, transparent);`}
`;

export const BarRow = styled.div`
  padding: 10px 12px;
  ${flexBetween}
`;

export const BarTitleWrap = styled.div`
  ${flexGap(6)}
  color: ${colors.primary};
`;

export const BarTitle = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: ${colors.primary};
`;

export const BarActions = styled.div`
  ${flexGap(4)}
`;

export const BarActionBtn = styled.button`
  padding: 2px;
  display: inline-flex;
  color: color-mix(in srgb, ${colors.primary} 50%, transparent);
  transition: color ${transitions.fast};

  &:hover {
    color: ${colors.primary};
  }
`;

export const ToggleChevron = styled.span<{ $isRotated: boolean }>`
  display: inline-flex;
  transition: transform ${transitions.normal};
  transform: rotate(${({ $isRotated }) => ($isRotated ? '180deg' : '0deg')});
`;

export const BankList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const DragHint = styled.p`
  font-size: 9px;
  color: color-mix(in srgb, ${colors.primary} 40%, transparent);
  padding: 0 4px;
`;

export const ChipRow = styled.div`
  ${flexGap(8)}
  padding: 8px 10px;
  background: ${colors.primaryLight};
  border: 1px solid color-mix(in srgb, ${colors.primary} 15%, transparent);
  border-radius: ${radii.xl};
  cursor: grab;
  user-select: none;
  transition:
    background ${transitions.fast},
    border-color ${transitions.fast};

  &:hover {
    background: color-mix(in srgb, ${colors.primary} 10%, ${colors.primaryLight});
    border-color: color-mix(in srgb, ${colors.primary} 30%, transparent);
  }

  &:active {
    opacity: 0.6;
  }
`;

export const ChipGrip = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  color: color-mix(in srgb, ${colors.primary} 30%, transparent);
  transition: color ${transitions.fast};

  ${ChipRow}:hover & {
    color: color-mix(in srgb, ${colors.primary} 60%, transparent);
  }
`;

export const ChipInfo = styled.div`
  ${flexFill}
`;

export const ChipName = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: ${colors.primary};
  ${ellipsis}
`;

export const ChipMeta = styled.div`
  font-size: 9px;
  color: color-mix(in srgb, ${colors.primary} 50%, transparent);
  ${ellipsis}
  line-height: 1.3;
`;

export const ChipRemoveBtn = styled.button`
  opacity: 0;
  padding: 2px;
  border-radius: 4px;
  color: ${gray[300]};
  transition:
    opacity ${transitions.fast},
    color ${transitions.fast};
  flex-shrink: 0;
  display: inline-flex;

  ${ChipRow}:hover & {
    opacity: 1;
  }

  &:hover {
    color: ${colors.primary};
  }
`;

export const AddMoreBtn = styled.button`
  ${flexGap(6)}
  width: 100%;
  padding: 6px 12px;
  margin-top: 4px;
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
