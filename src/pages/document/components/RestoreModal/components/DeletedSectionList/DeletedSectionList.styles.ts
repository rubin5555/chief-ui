import styled from 'styled-components';
import { ellipsis, subtleScrollbar } from '@/styles/mixins';
import { colors, docColors, gray, radii } from '@/styles/theme';

export const ListRoot = styled.div`
	display: flex;
	flex-direction: column;
	flex-shrink: 0;
	width: 260px;
	overflow: hidden;
	border-left: 1px solid ${gray[100]};
`;

export const ListHeader = styled.div`
	flex-shrink: 0;
	padding: 16px 16px 8px;
	border-bottom: 1px solid ${gray[100]};
`;

export const ListTitle = styled.p`
	margin: 0;
	font-size: 14px;
	font-weight: 600;
	color: ${gray[800]};
`;

export const ListSubtitle = styled.p`
	margin: 2px 0 0;
	font-size: 12px;
	color: ${gray[400]};
`;

export const ListScroll = styled.div`
	flex: 1;
	overflow-y: auto;
	padding: 4px 0;
	${subtleScrollbar}
`;

export const SectionRow = styled.button<{ $checked: boolean }>`
	display: flex;
	align-items: center;
	gap: 10px;
	width: 100%;
	padding: 10px 16px;
	text-align: right;
	transition: background-color 0.15s;
	background: ${({ $checked }) => ($checked ? docColors.cellActiveBg : 'transparent')};

	&:hover {
		background: ${({ $checked }) => ($checked ? docColors.cellActiveBg : gray[50])};
	}
`;

export const SubSectionRow = styled.div<{ $checked: boolean }>`
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 8px 32px 8px 16px;
	background: ${({ $checked }) =>
    $checked ? `color-mix(in srgb, ${docColors.cellActiveBg} 40%, transparent)` : 'transparent'};
`;

export const RowLabel = styled.div`
	display: flex;
	align-items: baseline;
	gap: 6px;
	flex: 1;
	min-width: 0;
	font-size: 14px;
`;

export const RowIndex = styled.span<{ $strong?: boolean }>`
	flex-shrink: 0;
	font-size: 12px;
	font-weight: ${({ $strong }) => ($strong ? 700 : 600)};
	color: ${gray[400]};
`;

export const RowTitle = styled.span<{ $checked: boolean; $muted?: boolean }>`
	${ellipsis}
	color: ${({ $checked, $muted }) => ($checked ? colors.primary : $muted ? gray[500] : gray[700])};
	font-weight: ${({ $checked }) => ($checked ? 500 : 400)};
`;

export const ListFooter = styled.div`
	flex-shrink: 0;
	padding: 12px 16px;
	border-top: 1px solid ${gray[100]};
`;

export const RestoreButton = styled.button`
	width: 100%;
	padding: 8px;
	border-radius: ${radii.full};
	font-size: 14px;
	font-weight: 600;
	background: ${colors.primary};
	color: ${colors.surface};
	transition: background-color 0.15s, color 0.15s;

	&:disabled {
		background: ${gray[200]};
		color: ${gray[400]};
		cursor: default;
	}
`;
