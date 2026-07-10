import styled, { css } from 'styled-components';
import { colors, gray, radii, transitions } from '@/styles/theme';
import { NavRow } from '../columns.shared.styles';

export const OperationRow = styled(NavRow)<{ $hasBadge: boolean }>`
  padding: 12px 16px;
  ${({ $hasBadge }) => $hasBadge && css`padding-left: 36px;`}
`;

export const InstanceCountBadge = styled.span`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  font-size: 9px;
  font-weight: 700;
  background: ${colors.primary};
  color: ${colors.surface};
  border-radius: ${radii.full};
  line-height: 1;
  flex-shrink: 0;
`;

export const OperationChevron = styled.span<{ $isRotated: boolean; $isActive: boolean }>`
  display: inline-flex;
  flex-shrink: 0;
  transition:
    transform ${transitions.normal},
    color ${transitions.fast};
  transform: rotate(${({ $isRotated }) => ($isRotated ? '180deg' : '0deg')});
  color: ${({ $isRotated, $isActive }) =>
    $isRotated
      ? colors.primary
      : $isActive
        ? `color-mix(in srgb, ${colors.primary} 40%, transparent)`
        : gray[300]};
`;

export const OperationName = styled.span<{ $isActive: boolean }>`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: right;
  font-size: 12px;
  font-weight: 700;
  color: ${({ $isActive }) => ($isActive ? colors.primary : gray[700])};
`;
