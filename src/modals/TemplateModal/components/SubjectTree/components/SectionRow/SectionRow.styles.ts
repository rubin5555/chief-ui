import styled from 'styled-components';
import { colors, gray, transitions } from '@/styles/theme';

export const SectionBlock = styled.div`
  padding-right: 8px;
`;

export const SectionRowBox = styled.div<{ $isDragging?: boolean; $isDragOver?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 8px;
  background: ${gray[50]};
  border-radius: 8px;
  border: 1px solid ${({ $isDragOver }) => ($isDragOver ? colors.primary : gray[100])};
  opacity: ${({ $isDragging }) => ($isDragging ? 0.4 : 1)};
  transition:
    border-color ${transitions.fast},
    opacity ${transitions.fast};
`;

export const SubSectionRowBox = styled.div<{ $isDragging?: boolean; $isDragOver?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: ${colors.surface};
  border-radius: 8px;
  border: 1px solid ${({ $isDragOver }) => ($isDragOver ? colors.primary : gray[100])};
  opacity: ${({ $isDragging }) => ($isDragging ? 0.4 : 1)};
  transition:
    border-color ${transitions.fast},
    opacity ${transitions.fast};
`;

export const SubSectionsWrap = styled.div`
  padding-right: 16px;
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
