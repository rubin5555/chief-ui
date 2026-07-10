import styled from 'styled-components';
import { colors, gray, radii, shadows, transitions } from '@/styles/theme';

export const IconTabButton = styled.button<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  padding: 8px 10px;
  border-radius: ${radii.xl};
  border: 1px solid
    ${(p) => (p.$isActive ? `color-mix(in srgb, ${colors.primary} 35%, transparent)` : gray[100])};
  background: ${(p) =>
    p.$isActive ? `color-mix(in srgb, ${colors.primary} 7%, transparent)` : gray[50]};
  box-shadow: ${(p) =>
    p.$isActive ? `0 1px 3px color-mix(in srgb, ${colors.primary} 14%, transparent)` : 'none'};
  transition: background ${transitions.normal}, border-color ${transitions.normal}, box-shadow ${transitions.normal};
  cursor: pointer;
  text-align: right;

  &:hover:not([data-active='true']) {
    background: ${colors.surface};
    border-color: ${gray[200]};
    box-shadow: ${shadows.sm};
  }
`;

export const IconTabIconWrap = styled.span<{ $isActive: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: ${radii.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${(p) =>
    p.$isActive ? `color-mix(in srgb, ${colors.primary} 18%, transparent)` : colors.surface};
  border: ${(p) => (p.$isActive ? 'none' : `1px solid ${gray[100]}`)};

  svg {
    width: 10px;
    height: 10px;
    color: ${(p) => (p.$isActive ? colors.primary : gray[400])};
  }
`;

export const IconTabLabel = styled.span<{ $isActive: boolean }>`
  font-size: 11px;
  font-weight: 600;
  color: ${(p) => (p.$isActive ? colors.primary : gray[700])};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
