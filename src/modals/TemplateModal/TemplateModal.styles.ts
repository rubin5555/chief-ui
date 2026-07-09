import styled from 'styled-components';
import { colors, gray, radii, shadows, transitions } from '@/styles/theme';

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9998;
  background: rgba(0, 0, 0, 0.5);
`;

export const ModalCard = styled.div`
  position: relative;
  background: ${colors.surface};
  border-radius: ${radii['3xl']};
  box-shadow: ${shadows.xxl};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 1140px;
  max-width: 96vw;
  height: 90vh;
`;

export const ModalHeader = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 32px;
  background: ${colors.surface};
  border-bottom: 1px solid ${colors.border};
`;

export const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${gray[900]};
  margin: 0;
`;

export const CloseBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: ${radii.xl};
  border: none;
  background: transparent;
  cursor: pointer;
  color: ${gray[500]};
  transition: background ${transitions.fast};
  &:hover {
    background: ${gray[100]};
  }
`;

export const DetailsSection = styled.div`
  flex-shrink: 0;
  padding: 10px 32px;
  border-bottom: 1px solid ${colors.border};
  background: ${gray[50]};
`;

export const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 24px;
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FieldLabel = styled.label`
  font-size: 12px;
  font-weight: 500;
  color: ${gray[500]};
  margin-bottom: 3px;
  text-align: right;
`;

export const FieldRow = styled.div`
  display: flex;
  gap: 12px;
`;

export const NameInput = styled.input<{ $warn?: boolean }>`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${({ $warn }) => ($warn ? colors.dangerLight : gray[200])};
  background: ${({ $warn }) => ($warn ? colors.dangerLight : colors.surface)};
  border-radius: ${radii.xl};
  font-size: 14px;
  text-align: right;
  direction: rtl;
  box-sizing: border-box;
  transition: border-color ${transitions.fast};
  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
`;

export const WarnText = styled.p`
  font-size: 11px;
  color: ${colors.danger};
  margin: 4px 0 0;
  text-align: right;
`;

export const ApprovalRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0 12px;
  height: 34px;
  border: 1px solid ${gray[200]};
  border-radius: ${radii.xl};
  background: ${colors.surface};
`;

export const ApprovalLabel = styled.span`
  font-size: 12px;
  color: ${gray[600]};
`;

export const BodySection = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

export const Sidebar = styled.div`
  width: 256px;
  flex-shrink: 0;
  border-left: 1px solid ${colors.border};
  background: ${gray[50]};
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 12px;
  gap: 8px;
`;

export const AddNodeButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 8px 12px;
  background: ${colors.surface};
  border: 1px dashed ${colors.primary};
  color: ${colors.primary};
  border-radius: ${radii.xl};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background ${transitions.fast};
  &:hover {
    background: ${colors.primaryLight};
  }
`;

export const AddChildLink = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  padding: 4px 0;
  color: ${gray[400]};
  font-size: 11px;
  cursor: pointer;
  transition: color ${transitions.fast};
  &:hover {
    color: ${colors.primary};
  }
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

export const DragHandle = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${gray[300]};
  cursor: grab;
  transition: color ${transitions.fast};

  &:hover {
    color: ${gray[500]};
  }

  &:active {
    cursor: grabbing;
  }
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

export const TitleInput = styled.input`
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  font-size: 12px;
  color: ${gray[800]};
  text-align: right;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${gray[400]};
  }
`;

export const SmallIconBtn = styled.button<{ $active?: boolean; $muted?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 2px;
  border: none;
  background: ${({ $active }) => ($active ? colors.primaryLight : 'transparent')};
  color: ${({ $active, $muted }) => ($active || !$muted ? colors.primary : gray[300])};
  border-radius: 4px;
  cursor: pointer;
  transition: color ${transitions.fast};
  &:hover {
    color: ${colors.primary};
    background: ${colors.primaryLight};
  }
`;

export const SectionsList = styled.div`
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

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

export const NodeIndex = styled.span`
  font-size: 10px;
  font-weight: 700;
  color: ${colors.primary};
  flex-shrink: 0;
`;

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

export const SidebarFooter = styled.div`
  padding-top: 8px;
  border-top: 1px solid ${gray[100]};
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: auto;
`;

export const EmphasisBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  background: color-mix(in srgb, ${colors.accent} 12%, ${colors.surface});
  border: 1px solid ${colors.accent};
  border-radius: 8px;
`;

export const EmphasisLabel = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: ${gray[700]};
`;

export const PreviewPane = styled.div`
  flex: 1;
  overflow-y: auto;
  background: ${colors.surface};
`;

export const PreviewInner = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 32px 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const SubjectHeading = styled.input`
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 2px solid ${gray[800]};
  padding: 0 4px 6px;
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 700;
  color: ${gray[900]};
  text-align: right;
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: ${gray[300]};
  }
`;

export const SectionPreviewBlock = styled.div`
  margin-bottom: 20px;
  padding-right: 16px;
`;

export const SubSectionPreviewBlock = styled.div`
  margin-bottom: 12px;
  padding-right: 20px;
`;

export const HeadingRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 8px;
`;

export const HeadingIndex = styled.span<{ $muted?: boolean }>`
  color: ${({ $muted }) => ($muted ? gray[500] : colors.primary)};
  font-size: ${({ $muted }) => ($muted ? '12px' : '14px')};
  font-weight: 700;
  flex-shrink: 0;
`;

export const HeadingInput = styled.input<{ $muted?: boolean }>`
  flex: 1;
  background: transparent;
  border: none;
  font-size: ${({ $muted }) => ($muted ? '12px' : '14px')};
  font-weight: 600;
  color: ${({ $muted }) => ($muted ? gray[700] : gray[800])};
  text-align: right;
  border-radius: 4px;
  padding: 2px 4px;
  &:focus {
    outline: none;
    background: ${gray[50]};
  }
  &::placeholder {
    color: ${gray[300]};
  }
`;

export const AppendixPreviewBlock = styled.div`
  padding-top: 20px;
  border-top: 1px dashed ${gray[200]};
`;

export const EmphasisPreviewBox = styled.div`
  padding: 16px;
  background: color-mix(in srgb, ${colors.accent} 10%, ${colors.surface});
  border: 1px solid ${colors.accent};
  border-radius: ${radii.xl};
`;

export const EmphasisPreviewLabel = styled.p`
  font-size: 12px;
  font-weight: 700;
  color: ${gray[700]};
  margin: 0 0 8px;
  text-align: right;
`;

export const EmphasisTextarea = styled.textarea`
  width: 100%;
  border: none;
  background: transparent;
  font-size: 12px;
  color: ${gray[700]};
  resize: vertical;
  min-height: 60px;
  font-family: inherit;
  &:focus {
    outline: none;
  }
`;

export const PreviewEmpty = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${gray[400]};
  font-size: 14px;
`;

export const ModalFooter = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 32px;
  border-top: 1px solid ${colors.border};
`;
