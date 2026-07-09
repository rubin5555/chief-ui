import styled from 'styled-components';
import { colors, gray, radii, shadows } from '@/styles/theme';

// A native <button> can't legally contain the nested remove-<button> rendered by each
// FilterChip, so the trigger is a div with an explicit combobox role/keyboard handler instead.
export const Trigger = styled.div<{ $noBorder?: boolean }>`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
	min-height: 38px;
	padding: 6px 12px;
	border: ${({ $noBorder }) => ($noBorder ? 'none' : `1px solid ${gray[300]}`)};
	border-radius: ${({ $noBorder }) => ($noBorder ? '0' : radii.xl)};
	text-align: right;
	direction: rtl;
	background: ${colors.surface};
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

// Stops a chip's remove-click from bubbling to the Trigger's open/close handler, without
// affecting layout (display: contents removes this wrapper from the flex box entirely).
export const ChipClickGuard = styled.span`
	display: contents;
`;

export const ChipsWrapper = styled.div`
	flex: 1;
	display: flex;
	flex-wrap: wrap;
	gap: 4px;
	justify-content: flex-start;
`;

export const Placeholder = styled.span`
	font-size: 14px;
	color: ${gray[400]};
`;

export const ChevronWrapper = styled.span<{ $open: boolean }>`
	display: flex;
	align-items: center;
	color: ${gray[400]};
	flex-shrink: 0;
	transition: transform 0.15s;
	transform: rotate(${({ $open }) => ($open ? '180deg' : '0deg')});
`;

export const Dropdown = styled.div`
	position: fixed;
	display: flex;
	flex-direction: column;
	background: ${colors.surface};
	border-radius: ${radii['2xl']};
	border: 1px solid ${gray[100]};
	box-shadow: ${shadows.xl};
	overflow: hidden;
	z-index: 99999;
	direction: rtl;
`;

export const SearchBox = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
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
	display: flex;
	align-items: center;
	justify-content: space-between;
	text-align: right;
	padding: 10px 16px;
	font-size: 14px;
	border: none;
	background: transparent;
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
