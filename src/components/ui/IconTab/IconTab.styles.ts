import styled from 'styled-components';
import { ellipsis, flexCenter, flexFill, flexGap } from '@/styles/mixins';
import { colors, gray, radii, shadows, transitions } from '@/styles/theme';

// main writes the active state as 8-digit hex — `#1B3A6B07`, `#1B3A6B35`,
// `#1B3A6B18` — where the last byte is an alpha out of 255, not a percentage.
// The percentages below are those bytes converted (7/255, 53/255, 24/255). Read
// as literal percentages they land three to eight times stronger, which is a
// navy-outlined chip where main has a barely-there tint.

export const IconTabButton = styled.button<{ $isActive: boolean; $compact: boolean }>`
  ${(p) => flexGap(p.$compact ? 4 : 6)}
  ${(p) => (p.$compact ? 'flex-shrink: 0;' : flexFill)}
  padding: 8px;
  border-radius: ${radii.xl};
  border: 1px solid
    ${(p) => (p.$isActive ? `color-mix(in srgb, ${colors.primary} 20.8%, transparent)` : gray[100])};
  background: ${(p) =>
    p.$isActive
      ? `color-mix(in srgb, ${colors.primary} 2.75%, transparent)`
      : `color-mix(in srgb, ${gray[50]} 60%, transparent)`};
  box-shadow: ${(p) =>
    p.$isActive ? `0 1px 3px color-mix(in srgb, ${colors.primary} 8%, transparent)` : 'none'};
  transition: background ${transitions.normal}, border-color ${transitions.normal}, box-shadow ${transitions.normal};
  cursor: pointer;
  text-align: right;

  &:hover:not([data-active='true']) {
    background: ${colors.surface};
    border-color: ${gray[200]};
    box-shadow: ${shadows.sm};
  }
`;

export const IconTabIconWrap = styled.span<{ $isActive: boolean; $idleIconColor?: string }>`
  width: 20px;
  height: 20px;
  border-radius: ${radii.lg};
  ${flexCenter}
  flex-shrink: 0;
  background: ${(p) =>
    p.$isActive ? `color-mix(in srgb, ${colors.primary} 9.4%, transparent)` : colors.surface};
  border: ${(p) => (p.$isActive ? 'none' : `1px solid ${gray[100]}`)};

  svg {
    width: 10px;
    height: 10px;
    color: ${(p) => (p.$isActive ? colors.primary : (p.$idleIconColor ?? gray[400]))};
  }
`;

export const IconTabLabel = styled.span<{ $isActive: boolean }>`
  font-size: 11px;
  font-weight: 600;
  color: ${(p) => (p.$isActive ? colors.primary : gray[700])};
  ${ellipsis}
`;
