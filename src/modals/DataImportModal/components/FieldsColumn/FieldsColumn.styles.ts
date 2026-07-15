import styled, { css } from 'styled-components';
import { ellipsis, flexBetween, flexGap } from '@/styles/mixins';
import { colors, gray, radii, transitions } from '@/styles/theme';

export const HideOnHover = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  color: color-mix(in srgb, ${colors.primary} 40%, transparent);
`;

export const ShowOnHover = styled.span`
  display: none;
  flex-shrink: 0;
  color: ${colors.primary};
`;

export const GhostIcon = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  color: transparent;
  transition: color ${transitions.fast};
`;

const fieldRowBase = css`
  ${flexBetween}
  gap: 6px;
  border-radius: ${radii.lg};
  font-size: 11px;
  text-align: right;
  transition: background ${transitions.fast};
  margin-bottom: 2px;

  &:hover {
    background: ${colors.primaryLight};
    color: ${colors.primary};

    ${HideOnHover} {
      display: none;
    }

    ${ShowOnHover} {
      display: inline-flex;
    }

    ${GhostIcon} {
      color: color-mix(in srgb, ${colors.primary} 50%, transparent);
    }
  }
`;

export const FieldRow = styled.button<{ $isExpanded: boolean }>`
  ${fieldRowBase}
  width: calc(100% - 8px);
  margin-inline: 4px;
  padding: 8px 12px;
  background: ${({ $isExpanded }) => ($isExpanded ? colors.primaryLight : 'transparent')};
  color: ${({ $isExpanded }) => ($isExpanded ? colors.primary : gray[600])};
`;

export const FieldLabel = styled.span<{ $weight: number }>`
  ${ellipsis}
  font-weight: ${({ $weight }) => $weight};

  ${FieldRow}:hover & {
    font-weight: ${({ $weight }) => Math.max($weight, 500)};
  }
`;

export const FieldChevron = styled.span<{ $isExpanded: boolean }>`
  display: inline-flex;
  flex-shrink: 0;
  transition:
    transform ${transitions.normal},
    color ${transitions.fast};
  transform: rotate(${({ $isExpanded }) => ($isExpanded ? '180deg' : '0deg')});
  color: ${({ $isExpanded }) => ($isExpanded ? colors.primary : gray[300])};

  ${FieldRow}:hover & {
    color: ${({ $isExpanded }) =>
      $isExpanded ? colors.primary : `color-mix(in srgb, ${colors.primary} 50%, transparent)`};
  }
`;

export const SubFieldsBlock = styled.div`
  margin-right: 12px;
  margin-bottom: 4px;
  border-right: 2px solid color-mix(in srgb, ${colors.primary} 10%, transparent);
  padding-left: 8px;
`;

export const SubFieldRow = styled.button<{ $isLinked: boolean }>`
  ${fieldRowBase}
  width: calc(100% - 4px);
  margin-inline: 2px;
  padding: 6px 10px;
  background: ${({ $isLinked }) =>
    $isLinked ? `color-mix(in srgb, ${colors.primaryLight} 60%, transparent)` : 'transparent'};
  color: ${({ $isLinked }) => ($isLinked ? colors.primary : gray[500])};
`;

export const SubFieldContent = styled.span`
  ${flexGap(6)}
  min-width: 0;
`;

export const SubFieldGlyph = styled.span`
  color: color-mix(in srgb, ${colors.primary} 20%, transparent);
  flex-shrink: 0;
  font-size: 10px;
`;

export const SubFieldLabel = styled.span<{ $isLinked: boolean }>`
  ${ellipsis}
  font-size: 10px;
  font-weight: ${({ $isLinked }) => ($isLinked ? 600 : 400)};

  ${SubFieldRow}:hover & {
    font-weight: ${({ $isLinked }) => ($isLinked ? 600 : 500)};
  }
`;

export const OptionalHint = styled.span`
  font-size: 9px;
  color: color-mix(in srgb, ${colors.primary} 50%, transparent);
  flex-shrink: 0;
`;
