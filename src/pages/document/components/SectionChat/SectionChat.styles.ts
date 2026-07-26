import styled from 'styled-components';
import { colors, gray, radii, transitions } from '@/styles/theme';

export const Header = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
	padding: 8px 10px;
	border-bottom: 1px solid ${colors.border};
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
	max-height: 220px;
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

export const MessageBubble = styled.div<{ $mine: boolean }>`
	align-self: ${(props) => (props.$mine ? 'flex-start' : 'flex-end')};
	max-width: 88%;
	border-radius: ${radii.xl};
	overflow: hidden;
	background-color: ${(props) => (props.$mine ? colors.primary : gray[100])};
	color: ${(props) => (props.$mine ? colors.surface : gray[800])};
	font-size: 12px;
	padding: 6px 10px;
	white-space: pre-wrap;
`;

export const QuoteBlock = styled.div`
	margin: -2px -6px 4px;
	padding: 4px 8px;
	border-radius: ${radii.lg};
	background-color: ${colors.surface};
	color: ${gray[600]};
	font-size: 10px;
	border-right: 3px solid ${colors.accent};
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
