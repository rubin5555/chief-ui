import styled from 'styled-components';
import { flexGap } from '@/styles/mixins';
import { colors, gray, radii } from '@/styles/theme';
import type { DragStateProps } from '../../../TemplateModal.shared.styles';
import { dragMotion } from '../../../TemplateModal.shared.styles';

export const SectionBlock = styled.div`
  padding-right: 8px;
`;

export const SectionRowBox = styled.div<DragStateProps>`
  ${flexGap(4)}
  padding: 6px 8px;
  background: ${gray[50]};
  border-radius: ${radii.lg};
  border: 1px solid ${({ $isDragOver }) => ($isDragOver ? colors.primary : gray[100])};
  ${dragMotion}
`;

export const SubSectionRowBox = styled.div<DragStateProps>`
  ${flexGap(4)}
  padding: 4px 8px;
  background: ${colors.surface};
  border-radius: ${radii.lg};
  border: 1px solid ${({ $isDragOver }) => ($isDragOver ? colors.primary : gray[100])};
  ${dragMotion}
`;

export const SubSectionsWrap = styled.div`
  padding-right: 16px;
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
