import styled from 'styled-components';
import { dialogMotion } from '@/styles/animations';
import { colors, gray, radii, shadows, transitions } from '@/styles/theme';
import { NavRow } from './components/columns.shared.styles';

// Centers the card over the hosting modal without dimming or blocking clicks around it.
// No fade on the overlay itself (it's transparent/non-dimming already) — only
// the card animates in.
export const Overlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 10;
`;

export const Card = styled.div<{ $closing?: boolean }>`
  pointer-events: auto;
  background: ${colors.surface};
  border-radius: ${radii['2xl']};
  border: 1px solid ${gray[200]};
  width: 680px;
  max-width: 90%;
  box-shadow: ${shadows.xxl};
  ${dialogMotion}
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid ${gray[100]};
  background: ${colors.primaryLight};
  border-radius: ${radii['2xl']} ${radii['2xl']} 0 0;
`;

export const HeaderTitleWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${colors.primary};
`;

export const HeaderTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.primary};
`;

export const CloseBtn = styled.button`
  padding: 6px;
  border-radius: ${radii.lg};
  transition:
    background ${transitions.fast},
    color ${transitions.fast};
  color: color-mix(in srgb, ${colors.primary} 60%, transparent);
  display: inline-flex;

  &:hover {
    background: color-mix(in srgb, ${colors.primary} 10%, transparent);
    color: ${colors.primary};
  }
`;

export const PickerBody = styled.div`
  display: flex;
  overflow: hidden;
  height: 320px;
`;

export const SystemRow = styled(NavRow)`
  padding: 12px 16px;
`;

export const SystemChevron = styled.span<{ $isActive: boolean }>`
  display: inline-flex;
  flex-shrink: 0;
  transition: color ${transitions.fast};
  color: ${({ $isActive }) =>
    $isActive ? `color-mix(in srgb, ${colors.primary} 50%, transparent)` : 'transparent'};
`;

export const SystemName = styled.span<{ $isActive: boolean }>`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: right;
  font-size: 11px;
  font-weight: ${({ $isActive }) => ($isActive ? 700 : 500)};
  color: ${({ $isActive }) => ($isActive ? colors.primary : gray[600])};
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-top: 1px solid ${gray[100]};
  background: ${colors.surface};
  border-radius: 0 0 ${radii['2xl']} ${radii['2xl']};
`;

export const FooterHint = styled.span`
  font-size: 11px;
  color: ${gray[400]};
`;

export const SubmitBtn = styled.button`
  padding: 8px 20px;
  background: ${colors.primary};
  color: ${colors.surface};
  border-radius: ${radii.xl};
  font-size: 14px;
  font-weight: 600;
  transition: background ${transitions.fast};

  &:hover {
    background: color-mix(in srgb, ${colors.primary} 85%, black);
  }
`;
