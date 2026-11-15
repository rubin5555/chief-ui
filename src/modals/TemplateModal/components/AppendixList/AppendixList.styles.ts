import styled from 'styled-components';
import { flexGap } from '@/styles/mixins';
import { colors, gray, radii, shadows } from '@/styles/theme';
import type { DragStateProps } from '../TemplateModal.shared.styles';
import { dragMotion } from '../TemplateModal.shared.styles';

export const AppendixRow = styled.div<DragStateProps>`
  ${flexGap(4)}
  padding: 6px 8px;
  background: ${colors.surface};
  border: 1px solid ${({ $isDragOver }) => ($isDragOver ? colors.primary : gray[100])};
  border-radius: ${radii.lg};
  box-shadow: ${shadows.sm};
  ${dragMotion}
`;
