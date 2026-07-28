import styled from 'styled-components';
import { colors, docColors, gray, radii } from '@/styles/theme';
import {
  PAGE_BREAK_LINE_WIDTH,
  PAPER_MIN_HEIGHT,
  PAPER_PADDING,
  PAPER_SHADOW,
  PAPER_WIDTH,
} from '../../../../document.measurements';

// The specimen is taller than the viewport by design — a page break is only
// visible if there is a page to break.
export const PaperFrame = styled.div`
	max-height: 70vh;
	overflow-y: auto;
	/* The scrollbar is always reserved, so the sheet doesn't get narrower the
     moment the reflow pushes content past the bottom of this frame. */
	scrollbar-gutter: stable;
	padding: 16px;
	background: ${docColors.canvasGradient};
	border-radius: ${radii.xl};
`;

export const Paper = styled.div`
	width: ${PAPER_WIDTH};
	/* Three whole pages, fixed rather than \`min-height\`. The live sheet grows with
     its content, but here the reflow's whole job is to move boxes further down —
     so a growing sheet would make this specimen taller after mount and shift
     every other specimen in the gallery, which is not something a component
     being *looked at* should do to its neighbours. */
	height: calc(${PAPER_MIN_HEIGHT} * 3);
	margin: 0 auto;
	padding: ${PAPER_PADDING};
	background-color: ${colors.surface};
	box-shadow: ${PAPER_SHADOW};
	/* The line a reader actually sees: pure CSS, repeating every A4 page. The hook
     under test moves boxes *off* these lines; it doesn't draw them. */
	background-image: repeating-linear-gradient(
		to bottom,
		transparent 0,
		transparent calc(${PAPER_MIN_HEIGHT} - ${PAGE_BREAK_LINE_WIDTH}),
		${docColors.pageBreakLine}
			calc(${PAPER_MIN_HEIGHT} - ${PAGE_BREAK_LINE_WIDTH}),
		${docColors.pageBreakLine} ${PAPER_MIN_HEIGHT}
	);
`;

export const PageBox = styled.div<{ $height: number }>`
	height: ${({ $height }) => $height}px;
	margin-bottom: 12px;
	padding: 12px;
	font-size: 12px;
	color: ${gray[600]};
	background: ${docColors.surfaceSubtle};
	border: 1px solid ${gray[200]};
	border-radius: ${radii.lg};
`;
