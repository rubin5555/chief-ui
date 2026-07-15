import styled from 'styled-components';
import { FloatingPanel } from '@/components/ui/FloatingPanel';
import { flexBetween, flexGap } from '@/styles/mixins';

import { colors, gray, radii } from '@/styles/theme';

export const Trigger = styled.button<{ $isPlaceholder?: boolean; $noBorder?: boolean }>`
	width: 100%;
	${flexBetween}
	gap: 8px;
	padding: 8px 12px;
	border: ${({ $noBorder }) => ($noBorder ? 'none' : `1px solid ${gray[300]}`)};
	border-radius: ${({ $noBorder }) => ($noBorder ? '0' : radii.xl)};
	font-size: 14px;
	text-align: right;
	direction: rtl;
	background: ${colors.surface};
	color: ${({ $isPlaceholder }) => ($isPlaceholder ? gray[400] : gray[800])};
	cursor: pointer;
	transition: border-color 0.15s;
	box-sizing: border-box;
	&:focus {
		outline: none;
		border-color: ${({ $noBorder }) => ($noBorder ? 'transparent' : colors.primary)};
	}
	&:hover {
		border-color: ${({ $noBorder }) => ($noBorder ? 'transparent' : gray[400])};
	}
`;

export const ChevronWrapper = styled.span<{ $open: boolean }>`
	display: flex;
	align-items: center;
	color: ${gray[400]};
	flex-shrink: 0;
	transition: transform 0.15s;
	transform: rotate(${({ $open }) => ($open ? '180deg' : '0deg')});
`;

export const Dropdown = styled(FloatingPanel)`
	direction: rtl;
`;

export const SearchBox = styled.div`
	${flexGap(8)}
	margin: 8px;
	padding: 6px 12px;
	background: ${gray[50]};
	border-radius: ${radii.xl};
	color: ${gray[400]};
	flex-shrink: 0;
`;

export const SearchInput = styled.input`
	flex: 1;
	border: none;
	outline: none;
	background: transparent;
	font-size: 14px;
	text-align: right;
	color: ${gray[800]};
	&::placeholder {
		color: ${gray[400]};
	}
`;

export const OptionsList = styled.div`
	flex: 1;
	min-height: 0;
	overflow-y: auto;
`;

export const OptionBtn = styled.button<{ $selected?: boolean }>`
	width: 100%;
	text-align: right;
	padding: 10px 16px;
	font-size: 14px;
	border: none;
	background: ${({ $selected }) => ($selected ? colors.primaryLight : 'transparent')};
	color: ${({ $selected }) => ($selected ? colors.primary : gray[700])};
	font-weight: ${({ $selected }) => ($selected ? 500 : 400)};
	cursor: pointer;
	transition: background 0.1s;
	&:hover {
		background: ${gray[50]};
	}
`;

export const EmptyText = styled.p`
	text-align: center;
	font-size: 12px;
	color: ${gray[400]};
	padding: 16px 0;
	margin: 0;
`;
