import styled from 'styled-components';
import { colors, docColors, gray, radii } from '@/styles/theme';

export const MessageBubble = styled.div<{ $mine: boolean }>`
	align-self: ${(props) => (props.$mine ? 'flex-start' : 'flex-end')};
	/* \`overflow: hidden\` below zeroes this item's automatic minimum size, so
	   without this the thread squashes its messages to fit the bubble instead of
	   overflowing — and a list that never overflows never scrolls. main's messages
	   sit in a block container, where the question doesn't arise. */
	flex-shrink: 0;
	max-width: 88%;
	border-radius: ${radii.xl};
	overflow: hidden;
	background-color: ${(props) => (props.$mine ? colors.primary : gray[100])};
	color: ${(props) => (props.$mine ? colors.surface : gray[800])};
	font-size: 12px;
	white-space: pre-wrap;
`;

export const MessageText = styled.div<{ $quoted: boolean }>`
	padding: ${(props) => (props.$quoted ? '4px 10px 6px' : '6px 10px')};
`;

/**
 * A white card inset into the coloured bubble, so quoted text reads as the
 * document's words rather than the commenter's. Its accent bar is lighter on
 * one's own messages (main's #93afd4) because the navy it would otherwise use
 * is the bubble those sit on, and a bar the colour of its background is no bar.
 *
 * A button, where main uses a clickable div (Edit.tsx:451): it does something,
 * and it is the only way back to the passage being discussed — so it has to be
 * reachable by keyboard and announced as an action.
 */
export const QuoteCard = styled.button<{ $mine: boolean }>`
	display: block;
	width: auto;
	margin: 5px 5px 0;
	padding: 4px 7px;
	border: none;
	/* Physical \`right\`: the bar marks where the quote starts, and Hebrew starts
	   on the right — the same side main draws it on. */
	border-right: 3px solid ${(props) => (props.$mine ? docColors.chatOwnAccent : colors.primary)};
	border-radius: ${radii.md};
	overflow: hidden;
	background-color: ${colors.surface};
	font: inherit;
	text-align: right;
	cursor: pointer;

	/* The passage may have scrolled away, or been edited out from under the
	   comment — nothing to jump to, and the card says so by not offering. */
	&:disabled {
		cursor: default;
		opacity: 0.75;
	}
`;

export const QuoteAuthor = styled.div`
	font-size: 10px;
	font-weight: 700;
	margin-bottom: 1px;
	color: ${colors.primary};
`;

export const QuoteText = styled.div`
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	font-size: 10px;
	line-height: 1.4;
	color: ${gray[700]};
`;
