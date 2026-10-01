import styled from 'styled-components';
import { flexColumn } from '@/styles/mixins';
import { docColors, gray } from '@/styles/theme';

export const GalleryRoot = styled.main`
  ${flexColumn(20)}
  min-height: 100%;
  padding: 24px;
  background: ${docColors.canvasGradient};
  background-attachment: fixed;
`;

export const GalleryHeader = styled.header`
  ${flexColumn(8)}
  max-width: 900px;
`;

export const GalleryTitle = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: ${gray[900]};
`;

export const GalleryIntro = styled.p`
  font-size: 14px;
  line-height: 1.9;
  color: ${gray[600]};
`;
