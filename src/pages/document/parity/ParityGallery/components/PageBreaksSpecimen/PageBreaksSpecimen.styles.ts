import styled from 'styled-components';
import { colors, docColors, gray, radii } from '@/styles/theme';
import {
  PAGE_BREAK_LINE_WIDTH,
  PAPER_MIN_HEIGHT,
  PAPER_PADDING,
  PAPER_SHADOW,
  PAPER_WIDTH,
} from '../../../../document.measurements';

export const PaperFrame = styled.div`
	max-height: 70vh;
	overflow-y: auto;

	scrollbar-gutter: stable;
	padding: 16px;
	background: ${docColors.canvasGradient};
	border-radius: ${radii.xl};
`;

export const Paper = styled.div`
	width: ${PAPER_WIDTH};

	height: calc(${PAPER_MIN_HEIGHT} * 3);
	margin: 0 auto;
	padding: ${PAPER_PADDING};
	background-color: ${colors.surface};
	box-shadow: ${PAPER_SHADOW};

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
