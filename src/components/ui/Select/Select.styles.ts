import styled from 'styled-components';
import { colors, gray, radii, shadows } from '@/styles/theme';

export const Trigger = styled.button<{ $isPlaceholder?: boolean }>`
	width: 100%;
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 8px 12px;
	border: 1px solid ${gray[200]};
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
		border-color: ${gray[300]};
	}
`;

export const Dropdown = styled.div`
	position: fixed;
	background: ${colors.surface};
	border-radius: ${radii.xl};
	border: 1px solid ${gray[100]};
	box-shadow: ${shadows.xl};
	padding: 6px 0;
	overflow-y: auto;
	z-index: 99999;
	direction: rtl;
`;

export const OptionBtn = styled.button<{ $selected?: boolean; $highlighted?: boolean }>`
	width: 100%;
	text-align: right;
	padding: 10px 12px;
	font-size: 14px;
	border: none;
	background: ${({ $selected, $highlighted }) =>
    $selected ? gray[100] : $highlighted ? gray[50] : 'transparent'};
	color: ${({ $selected }) => ($selected ? colors.primary : gray[700])};
	font-weight: ${({ $selected }) => ($selected ? 500 : 400)};
	cursor: pointer;
	transition: background 0.1s;
	outline: ${({ $highlighted }) => ($highlighted ? `2px solid ${colors.primary}` : 'none')};
	outline-offset: -2px;
	&:hover {
		background: ${gray[50]};
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
