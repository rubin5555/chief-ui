import styled from 'styled-components';
import { flexGap } from '@/styles/mixins';
import { colors, gray, radii, shadows, transitions } from '@/styles/theme';

export const AppendixRow = styled.div<{ $isDragging?: boolean; $isDragOver?: boolean }>`
  ${flexGap(4)}
  padding: 6px 8px;
  background: ${colors.surface};
  border: 1px solid ${({ $isDragOver }) => ($isDragOver ? colors.primary : gray[100])};
  border-radius: ${radii.lg};
  box-shadow: ${shadows.sm};
  opacity: ${({ $isDragging }) => ($isDragging ? 0.4 : 1)};
  transition:
    border-color ${transitions.fast},
    opacity ${transitions.fast};
`;
