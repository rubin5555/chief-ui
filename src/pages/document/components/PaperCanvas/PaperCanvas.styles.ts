import styled from 'styled-components';
import { zoomMotion } from '@/styles/animations';
import { colors, docColors } from '@/styles/theme';
import {
  PAGE_BREAK_LINE_WIDTH,
  PAPER_MIN_HEIGHT,
  PAPER_PADDING,
  PAPER_SHADOW,
  PAPER_WIDTH,
} from '../../document.measurements';
import { REVEAL_SCROLL_PADDING } from '../SectionNavigation/SectionNavigation.constants';

export const EditorScroll = styled.main<{ $zoom: number }>`
  flex: 1;
  min-width: 0;
  overflow-y: auto;

  scroll-padding-top: ${({ $zoom }) => (REVEAL_SCROLL_PADDING * $zoom) / 100}px;
`;

export const Centered = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 24px;
`;

export const StickyToolbar = styled.div<{ $zoom: number }>`
  position: sticky;
  top: 0;
  z-index: 2;
  width: ${PAPER_WIDTH};
  overflow: hidden;
  zoom: ${({ $zoom }) => $zoom / 100};
  ${zoomMotion}

  @media print {
    zoom: 1;
  }
`;

export const Paper = styled.div<{ $zoom: number }>`
  position: relative;
  width: ${PAPER_WIDTH};
  min-height: ${PAPER_MIN_HEIGHT};
  background-color: ${colors.surface};
  box-shadow: ${PAPER_SHADOW};
  direction: rtl;
  zoom: ${({ $zoom }) => $zoom / 100};
  ${zoomMotion}
  background-image: repeating-linear-gradient(
    to bottom,
    transparent 0,
    transparent calc(${PAPER_MIN_HEIGHT} - ${PAGE_BREAK_LINE_WIDTH}),
    ${docColors.pageBreakLine} calc(${PAPER_MIN_HEIGHT} - ${PAGE_BREAK_LINE_WIDTH}),
    ${docColors.pageBreakLine} ${PAPER_MIN_HEIGHT}
  );

  @media print {
    box-shadow: none;
    background-image: none;
    zoom: 1;
  }
`;

export const PaperInner = styled.div`
  padding: ${PAPER_PADDING};
`;
