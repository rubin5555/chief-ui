import styled from 'styled-components';
import { colors, radii } from '@/styles/theme';

// The six-stop wheel, written out because it *is* the hue axis rather than a
// themed surface — see EditorRibbon.constants.ts on why palettes stay literal.
export const HueTrack = styled.div`
  position: relative;
  flex: 1;
  height: 14px;
  border-radius: ${radii.lg};
  cursor: pointer;
  user-select: none;
  touch-action: none;
  background: linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00);
`;

export const HueThumb = styled.span<{ $x: number; $color: string }>`
  position: absolute;
  left: ${({ $x }) => $x}%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 18px;
  height: 18px;
  border-radius: ${radii.full};
  border: 2.5px solid ${colors.surface};
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.25);
  pointer-events: none;
  background: ${({ $color }) => $color};
`;
