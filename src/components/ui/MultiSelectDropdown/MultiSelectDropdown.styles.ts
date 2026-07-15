import styled from 'styled-components';
import { FloatingPanel } from '@/components/ui/FloatingPanel';
import { flexBetween, flexCenter, flexGap } from '@/styles/mixins';

import { colors, gray, radii } from '@/styles/theme';

export const Trigger = styled.button<{ $isPlaceholder?: boolean }>`
	width: 100%;
	${flexBetween}
	gap: 8px;
	padding: 8px 12px;
	border: 1px solid ${gray[300]};
	border-radius: ${radii.xl};
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
		border-color: ${colors.primary};
	}
	&:hover {
		border-color: ${gray[400]};
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
	padding: 6px 0;
	overflow-y: auto;
	direction: rtl;
`;

export const OptionBtn = styled.button`
	width: 100%;
	${flexGap(8)}
	text-align: right;
	padding: 10px 16px;
	font-size: 14px;
	border: none;
	background: transparent;
	cursor: pointer;
	transition: background 0.1s;
	&:hover {
		background: ${gray[50]};
	}
`;

export const OptionLabel = styled.span<{ $selected?: boolean }>`
	flex: 1;
	text-align: right;
	color: ${({ $selected }) => ($selected ? colors.primary : gray[700])};
	font-weight: ${({ $selected }) => ($selected ? 500 : 400)};
`;

export const Checkbox = styled.span<{ $checked?: boolean }>`
	width: 16px;
	height: 16px;
	flex-shrink: 0;
	border-radius: 4px;
	border: 2px solid ${({ $checked }) => ($checked ? colors.primary : gray[300])};
	background: ${({ $checked }) => ($checked ? colors.primary : 'transparent')};
	${flexCenter}
	color: ${colors.surface};
`;
