import styled from 'styled-components';
import { colors, docColors } from '@/styles/theme';
import {
  PAGE_BREAK_LINE_WIDTH,
  PAPER_MIN_HEIGHT,
  PAPER_PADDING,
  PAPER_SHADOW,
  PAPER_WIDTH,
} from '../../document.measurements';

/** The scrolling editor area — main's `<main className="flex-1 overflow-y-auto">`. */
export const EditorScroll = styled.main`
  flex: 1;
  min-width: 0;
  overflow-y: auto;
`;

export const Centered = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 24px;
`;

/**
 * Sticks to the top of the scroll area so the editor toolbar and the active
 * filter chips stay reachable while the paper scrolls under them. Matches the
 * paper's width exactly (not the wider chrome bars) — it belongs to the sheet.
 */
export const StickyToolbar = styled.div`
  position: sticky;
  top: 0;
  z-index: 2;
  width: ${PAPER_WIDTH};
  overflow: hidden;
`;

/**
 * The A4 sheet.
 *
 * The repeating gradient draws a hairline at every 297mm boundary, which is what
 * makes page breaks visible on a continuously-scrolling canvas. main computed
 * these positions imperatively by measuring a probe element on mount; as pure
 * CSS they stay correct while the content grows.
 *
 * `zoom` (rather than `transform: scale`) is main's choice and the right one
 * here: it reflows the surrounding layout, so the scroll container's height
 * tracks the scaled paper instead of the sheet overflowing a box sized for 100%.
 */
export const Paper = styled.div<{ $zoom: number }>`
  position: relative;
  width: ${PAPER_WIDTH};
  min-height: ${PAPER_MIN_HEIGHT};
  background-color: ${colors.surface};
  box-shadow: ${PAPER_SHADOW};
  direction: rtl;
  zoom: ${({ $zoom }) => $zoom / 100};
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

/** The printable area inside the sheet's margins. */
export const PaperInner = styled.div`
  padding: ${PAPER_PADDING};
`;
