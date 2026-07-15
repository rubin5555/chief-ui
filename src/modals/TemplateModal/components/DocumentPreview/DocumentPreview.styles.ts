import styled from 'styled-components';
import { colors, gray, radii } from '@/styles/theme';

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
