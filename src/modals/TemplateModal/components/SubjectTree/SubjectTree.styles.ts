import styled from 'styled-components';
import { flexGap } from '@/styles/mixins';
import { colors, gray, radii, shadows } from '@/styles/theme';
import type { DragStateProps } from '../TemplateModal.shared.styles';
import { dragMotion } from '../TemplateModal.shared.styles';

export const SectionsList = styled.div`
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const SubjectCard = styled.div<DragStateProps>`
  background: ${colors.surface};
  border-radius: ${radii.xl};
  border: 1px solid ${({ $isDragOver }) => ($isDragOver ? colors.primary : gray[100])};
  overflow: hidden;
  box-shadow: ${shadows.sm};
  ${dragMotion}
`;

export const SubjectHeader = styled.div`
  ${flexGap(6)}
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
