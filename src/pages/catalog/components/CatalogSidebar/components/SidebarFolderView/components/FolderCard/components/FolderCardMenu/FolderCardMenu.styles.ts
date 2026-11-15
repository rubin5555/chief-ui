import styled from 'styled-components';
import { catColors, colors, gray, radii, shadows, transitions } from '@/styles/theme';

export const MenuAnchor = styled.div`
  position: relative;
  flex-shrink: 0;
`;

// main renders the trigger as a literal '···' rather than an icon, sized so the
// glyph sits on the row's centre line.
export const MenuTrigger = styled.button<{ $onSelectedRow: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding-bottom: 4px;
  border-radius: ${radii.full};
  font-size: 16px;
  line-height: 1;
  opacity: 0;
  color: ${({ $onSelectedRow }) => ($onSelectedRow ? catColors.hoverVeilStrong : gray[400])};
  transition: all ${transitions.slow};

  &:hover {
    background: ${({ $onSelectedRow }) => ($onSelectedRow ? catColors.hoverVeil : gray[100])};
  }
`;

export const MenuPanel = styled.div`
  position: absolute;
  left: 0;
  top: 32px;
  z-index: 50;
  width: 176px;
  padding: 4px 0;
  border: 1px solid ${gray[100]};
  border-radius: ${radii.xl};
  background: ${colors.surface};
  box-shadow: ${shadows.lg};
`;

export const MenuItem = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  text-align: right;
  color: ${({ $danger }) => ($danger ? catColors.dangerSoft : gray[700])};
  transition: background ${transitions.normal};

  &:hover {
    background: ${({ $danger }) => ($danger ? catColors.dangerSoftBg : gray[50])};
  }
`;

export const MenuItemIcon = styled.span<{ $danger?: boolean }>`
  display: flex;
  flex-shrink: 0;
  color: ${({ $danger }) => ($danger ? 'currentColor' : gray[400])};
`;

export const MenuSeparator = styled.div`
  height: 1px;
  margin: 4px 12px;
  background: ${gray[100]};
`;
