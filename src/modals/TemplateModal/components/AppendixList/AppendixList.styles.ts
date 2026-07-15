import styled from 'styled-components';
import { colors, gray, shadows, transitions } from '@/styles/theme';

export const AppendixRow = styled.div<{ $isDragging?: boolean; $isDragOver?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 8px;
  background: ${colors.surface};
  border: 1px solid ${({ $isDragOver }) => ($isDragOver ? colors.primary : gray[100])};
  border-radius: 8px;
  box-shadow: ${shadows.sm};
  opacity: ${({ $isDragging }) => ($isDragging ? 0.4 : 1)};
  transition:
    border-color ${transitions.fast},
    opacity ${transitions.fast};
`;
