import styled from 'styled-components';
import { colors, docColors, gray, radii } from '@/styles/theme';

export const MessageBubble = styled.div<{ $mine: boolean }>`
	align-self: ${(props) => (props.$mine ? 'flex-start' : 'flex-end')};

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

export const QuoteCard = styled.button<{ $mine: boolean }>`
	display: block;
	width: auto;
	margin: 5px 5px 0;
	padding: 4px 7px;
	border: none;

	border-right: 3px solid ${(props) => (props.$mine ? docColors.chatOwnAccent : colors.primary)};
	border-radius: ${radii.md};
	overflow: hidden;
	background-color: ${colors.surface};
	font: inherit;
	text-align: right;
	cursor: pointer;

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
