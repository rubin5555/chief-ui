import styled from 'styled-components';
import { colors, gray, radii, transitions } from '@/styles/theme';

export const TrackButton = styled.button<{ $checked: boolean }>`
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  width: 36px;
  height: 20px;
  border: none;
  border-radius: ${radii.full};
  background: ${({ $checked }) => ($checked ? colors.primary : gray[300])};
  cursor: pointer;
  transition: background ${transitions.fast};

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: 2px;
  }
`;

export const Thumb = styled.span<{ $checked: boolean }>`
  position: absolute;
  top: 2px;
  right: ${({ $checked }) => ($checked ? '18px' : '2px')};
  width: 16px;
  height: 16px;
  border-radius: ${radii.full};
  background: ${colors.surface};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  transition: right ${transitions.fast};
`;
