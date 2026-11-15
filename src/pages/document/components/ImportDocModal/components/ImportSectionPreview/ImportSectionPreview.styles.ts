import styled from 'styled-components';
import { flexCenter, subtleScrollbar } from '@/styles/mixins';
import { colors, docColors, gray, radii } from '@/styles/theme';

export const PreviewRoot = styled.div`
	flex: 1;
	overflow-y: auto;
	padding: 32px 40px;
	font-size: 13px;
	line-height: 1.7;
	color: ${docColors.ink};
	${subtleScrollbar}
`;

export const DocTitle = styled.h1`
	margin: 0 0 20px;
	padding-bottom: 10px;
	font-size: 16px;
	font-weight: 700;
	color: ${colors.primary};
	border-bottom: 2px solid ${gray[200]};
`;

export const PreviewEntry = styled.button<{ $checked: boolean }>`
	display: block;
	width: 100%;
	margin: 0 -12px 24px;
	padding: 8px 12px;
	border-radius: ${radii.xl};
	text-align: right;
	transition: background-color 0.15s;
	background: ${({ $checked }) => ($checked ? docColors.cellActiveBg : 'transparent')};

	&:hover {
		background: ${({ $checked }) => ($checked ? docColors.cellActiveBg : gray[50])};
	}
`;

export const HeadingRow = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	margin-bottom: 6px;
`;

export const HeadingIndex = styled.span`
	font-weight: 700;
	color: ${colors.primary};
`;

export const HeadingTitle = styled.span`
	font-weight: 600;
	color: ${gray[700]};
`;

export const HeadingRule = styled.span`
	flex: 1;
	height: 1px;
	background: ${gray[200]};
`;

export const HeadingMarker = styled.span<{ $checked: boolean }>`
	display: flex;
	flex-shrink: 0;
	opacity: ${({ $checked }) => ($checked ? 1 : 0)};
	transition: opacity 0.15s;

	${PreviewEntry}:hover &,
	${PreviewEntry}:focus-visible & {
		opacity: 1;
	}
`;

export const BodyLine = styled.p`
	margin: 0 0 4px;
	padding-right: 16px;
	color: ${gray[500]};
`;

export const PreviewLoading = styled.div`
	${flexCenter}
	height: 100%;
	color: ${gray[400]};
`;
