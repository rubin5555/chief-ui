import styled from 'styled-components';
import { colors, docColors, gray, radii, shadows, transitions } from '@/styles/theme';
import { BUBBLE_LEFT, BUBBLE_MAX_HEIGHT, BUBBLE_WIDTH } from './SectionChat.constants';

// Positioned by the `style` attr rather than CSS interpolation, so following a
// scrolling section doesn't mint a class per pixel.
export const BubbleRoot = styled.div.attrs<{ $top: number }>((props) => ({
  style: { top: props.$top },
}))<{ $top: number }>`
	position: fixed;
	left: ${BUBBLE_LEFT}px;
	width: ${BUBBLE_WIDTH}px;
	z-index: 99999;
`;

/**
 * The speech-bubble tail, drawn as main draws it (Edit.tsx:406-422): two CSS
 * triangles, a wider one in the border colour with a narrower fill sitting on top
 * of it, so the point keeps the same 1px outline as the rest of the bubble.
 *
 * They are siblings of the bubble body rather than children because the body
 * clips to its own rounded box — a tail inside it would be cut off at the very
 * edge it needs to stick out past.
 */
const Tail = styled.div`
	position: absolute;
	width: 0;
	height: 0;
	border-top: 10px solid transparent;
	border-bottom: 10px solid transparent;
`;

export const TailBorder = styled(Tail)`
	/* Physical \`right\`, not \`inline-end\`: the paper this points at is to the
	   bubble's physical right on this RTL page, the same side in either direction. */
	right: -11px;
	top: 9px;
	border-left: 11px solid ${docColors.chatArrowBorder};
	z-index: 1;
`;

export const TailFill = styled(Tail)`
	right: -9px;
	top: 10px;
	border-top-width: 9px;
	border-bottom-width: 9px;
	border-left: 10px solid ${docColors.surfaceSubtle};
	z-index: 2;
`;

export const BubbleBody = styled.div`
	position: relative;
	z-index: 3;
	display: flex;
	flex-direction: column;
	max-height: ${BUBBLE_MAX_HEIGHT}px;
	border: 1px solid ${gray[200]};
	border-radius: ${radii['2xl']};
	background-color: ${colors.surface};
	box-shadow: ${shadows.bubble};
	overflow: hidden;
`;

export const Header = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
	padding: 8px 10px;
	/* Shares the tail's fill colour — the tail reads as this strip pulled into a
	   point, so the two have to be the same tone. */
	background-color: ${docColors.surfaceSubtle};
	border-bottom: 1px solid ${gray[100]};
	flex-shrink: 0;
`;

export const HeaderTitle = styled.span`
	font-size: 12px;
	font-weight: 600;
	color: ${gray[700]};
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

export const CloseBtn = styled.button`
	display: flex;
	padding: 2px;
	border: none;
	background: none;
	border-radius: ${radii.lg};
	color: ${gray[400]};
	cursor: pointer;

	&:hover {
		background-color: ${gray[100]};
	}
`;

export const MessagesList = styled.div`
	flex: 1;
	overflow-y: auto;
	min-height: 80px;
	padding: 8px 10px;
	display: flex;
	flex-direction: column;
	gap: 6px;
`;

export const EmptyState = styled.div`
	font-size: 11px;
	color: ${gray[400]};
	text-align: center;
	padding: 12px 0;
`;

export const MarkerBanner = styled.div`
	display: flex;
	align-items: center;
	gap: 6px;
	padding: 6px 10px;
	border-top: 1px solid ${colors.warningLight};
	background-color: ${colors.warningLight};
	color: ${colors.warning};
	font-size: 10px;
	flex-shrink: 0;

	span {
		flex: 1;
	}

	button {
		display: flex;
		border: none;
		background: none;
		color: ${colors.warning};
		cursor: pointer;
	}
`;

export const QuoteStrip = styled.div`
	display: flex;
	align-items: flex-start;
	gap: 6px;
	padding: 6px 10px;
	border-top: 1px solid ${colors.border};
	background-color: ${gray[50]};
	font-size: 10px;
	color: ${gray[600]};
	flex-shrink: 0;

	span {
		flex: 1;
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	button {
		display: flex;
		flex-shrink: 0;
		border: none;
		background: none;
		color: ${gray[400]};
		cursor: pointer;
	}
`;

export const InputRow = styled.div`
	display: flex;
	align-items: center;
	gap: 6px;
	padding: 6px 8px;
	border-top: 1px solid ${colors.border};
	flex-shrink: 0;
`;

export const SendBtn = styled.button`
	display: flex;
	flex-shrink: 0;
	padding: 6px;
	border: none;
	border-radius: ${radii.lg};
	background-color: ${colors.primary};
	color: ${colors.surface};
	cursor: pointer;
	transition: opacity ${transitions.fast};

	&:hover {
		opacity: 0.9;
	}

	/* The arrow has to fly the way the text reads (main mirrors it the same way,
	   Edit.tsx:498) — lucide draws it pointing right, which is backwards here. */
	svg {
		transform: scaleX(-1);
	}
`;

export const MessageInput = styled.input`
	flex: 1;
	min-width: 0;
	border: none;
	background: none;
	font-size: 12px;
	color: ${gray[800]};

	&:focus {
		outline: none;
	}
`;

export const MarkerToggleBtn = styled.button<{ $active: boolean }>`
	display: flex;
	flex-shrink: 0;
	padding: 4px;
	border: none;
	background: none;
	border-radius: ${radii.lg};
	color: ${(props) => (props.$active ? colors.warning : gray[300])};
	background-color: ${(props) => (props.$active ? colors.warningLight : 'transparent')};
	cursor: pointer;

	&:hover {
		color: ${colors.warning};
	}
`;
