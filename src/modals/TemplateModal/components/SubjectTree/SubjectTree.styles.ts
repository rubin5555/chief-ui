import styled from 'styled-components';
import { colors, gray, radii, shadows, transitions } from '@/styles/theme';

export const SectionsList = styled.div`
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const SubjectCard = styled.div<{ $isDragging?: boolean; $isDragOver?: boolean }>`
  background: ${colors.surface};
  border-radius: ${radii.xl};
  border: 1px solid ${({ $isDragOver }) => ($isDragOver ? colors.primary : gray[100])};
  overflow: hidden;
  box-shadow: ${shadows.sm};
  opacity: ${({ $isDragging }) => ($isDragging ? 0.4 : 1)};
  transition:
    border-color ${transitions.fast},
    opacity ${transitions.fast};
`;

export const SubjectHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  background: ${colors.primaryLight};
  border-bottom: 1px solid ${gray[100]};
`;

export const SubjectDot = styled.span`
  width: 8px;
  height: 8px;
  flex-shrink: 0;
  border-radius: ${radii.full};
  background: ${colors.primary};
`;
