import styled from 'styled-components';
import { colors, docColors } from '@/styles/theme';

const appGradient = `linear-gradient(
    135deg,
    ${colors.surface} 0%,
    ${colors.muted} 50%,
    ${colors.primaryLight} 100%
  )`;

export const Shell = styled.div<{ $onDocumentCanvas: boolean }>`
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: ${({ $onDocumentCanvas }) =>
    $onDocumentCanvas ? docColors.canvasGradient : appGradient};
  background-attachment: fixed;
`;
