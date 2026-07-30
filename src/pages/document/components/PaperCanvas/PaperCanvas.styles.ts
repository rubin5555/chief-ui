import styled from 'styled-components';
import { colors, docColors } from '@/styles/theme';
import {
  PAGE_BREAK_LINE_WIDTH,
  PAPER_MIN_HEIGHT,
  PAPER_PADDING,
  PAPER_SHADOW,
  PAPER_WIDTH,
} from '../../document.measurements';
import { REVEAL_SCROLL_PADDING } from '../SectionNavigation/SectionNavigation.constants';

/** The scrolling editor area — main's `<main className="flex-1 overflow-y-auto">`. */
export const EditorScroll = styled.main<{ $zoom: number }>`
  flex: 1;
  min-width: 0;
  overflow-y: auto;

  /* Where a scrollIntoView with block start stops short, so a section the
     outline sent you to clears the sticky toolbar instead of hiding under it.
     Set on the scroll container rather than as a scroll-margin on the sections,
     because the sections are laid out inside the zoom and would scale this
     distance twice — and multiplied by the zoom here, because the toolbar it has
     to clear is zoomed and this container is not. */
  scroll-padding-top: ${({ $zoom }) => (REVEAL_SCROLL_PADDING * $zoom) / 100}px;
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
 *
 * Which is why it takes the sheet's zoom as well. main leaves the toolbar at 100%
 * (Edit.tsx:4105 puts `zoom` on the paper alone), and the two then disagree about
 * how wide the sheet is: at 150% the ribbon stops well short of the paper's edge,
 * at 50% it hangs over it. A bar that belongs to the page has to be as wide as
 * the page.
 */
export const StickyToolbar = styled.div<{ $zoom: number }>`
  position: sticky;
  top: 0;
  z-index: 2;
  width: ${PAPER_WIDTH};
  overflow: hidden;
  zoom: ${({ $zoom }) => $zoom / 100};

  @media print {
    zoom: 1;
  }
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
