import styled from 'styled-components';
import { colors, radii } from '@/styles/theme';

export const CanvasRoot = styled.div<{ $hueColor: string }>`
  position: relative;
  width: 100%;
  height: 180px;
  margin-bottom: 10px;
  border-radius: ${radii.lg};
  cursor: crosshair;
  user-select: none;
  touch-action: none;
  background: linear-gradient(to right, ${colors.surface}, ${({ $hueColor }) => $hueColor});
`;

export const ValueOverlay = styled.span`
  position: absolute;
  inset: 0;
  border-radius: ${radii.lg};
  background: linear-gradient(to bottom, transparent, #000);
`;

export const CanvasThumb = styled.span<{ $x: number; $y: number; $color: string }>`
  position: absolute;
  left: ${({ $x }) => $x}%;
  top: ${({ $y }) => $y}%;
  transform: translate(-50%, -50%);
  width: 14px;
  height: 14px;
  border-radius: ${radii.full};
  border: 2.5px solid ${colors.surface};
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3);
  pointer-events: none;
  background: ${({ $color }) => $color};
`;
