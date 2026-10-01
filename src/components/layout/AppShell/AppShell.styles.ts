import styled from 'styled-components';
import { catColors, colors, docColors } from '@/styles/theme';

export type Canvas = 'app' | 'document' | 'catalog';

const APP_GRADIENT = `linear-gradient(
    135deg,
    ${colors.surface} 0%,
    ${colors.muted} 50%,
    ${colors.primaryLight} 100%
  )`;

const CANVAS_GRADIENT: Record<Canvas, string> = {
  app: APP_GRADIENT,
  document: docColors.canvasGradient,
  catalog: catColors.canvasGradient,
};

export const Shell = styled.div<{ $canvas: Canvas }>`
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: ${({ $canvas }) => CANVAS_GRADIENT[$canvas]};
  background-attachment: fixed;
`;
