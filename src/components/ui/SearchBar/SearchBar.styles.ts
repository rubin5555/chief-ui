import styled from 'styled-components';
import { flexBetween } from '@/styles/mixins';
import { colors, gray, radii, shadows } from '@/styles/theme';

export const SearchRoot = styled.div`
	position: relative;
	flex: 1;
`;

export const SearchInput = styled.input`
	width: 100%;
	padding: 8px 40px;
	background-color: color-mix(in srgb, ${colors.surface} 70%, transparent);
	backdrop-filter: blur(12px);
	border-radius: ${radii.xl};
	font-size: 14px;
	border: 1px solid ${gray[200]};
	outline: none;
	text-align: right;
	color: ${gray[800]};
	&::placeholder {
		color: ${gray[400]};
	}
	&:focus {
		box-shadow: 0 0 0 2px color-mix(in srgb, ${colors.primary} 50%, transparent);
	}
`;

export const SearchIcon = styled.span`
	position: absolute;
	right: 12px;
	top: 50%;
	transform: translateY(-50%);
	color: ${gray[400]};
	pointer-events: none;
	display: flex;
`;

export const FilterButton = styled.button<{ $active: boolean }>`
	position: absolute;
	left: 12px;
	top: 50%;
	transform: translateY(-50%);
	padding: 2px;
	border-radius: 4px;
	transition: color 0.15s;
	cursor: pointer;
	display: flex;
	align-items: center;
	color: ${(p) => (p.$active ? colors.primary : gray[400])};
	&:hover {
		color: ${(p) => (p.$active ? colors.primary : gray[600])};
	}
`;

export const FilterMenu = styled.div`
	position: absolute;
	top: calc(100% + 4px);
	left: 0;
	min-width: 200px;
	background: ${colors.surface};
	border-radius: ${radii['2xl']};
	border: 1px solid ${gray[100]};
	box-shadow: ${shadows.xl};
	padding: 6px 0;
	z-index: 20;
	direction: rtl;
`;

export const FilterMenuTitle = styled.p`
	padding: 6px 16px;
	margin: 0;
	font-size: 12px;
	font-weight: 500;
	color: ${gray[400]};
`;

export const FilterOptionBtn = styled.button<{ $selected?: boolean }>`
	width: 100%;
	${flexBetween}
	gap: 8px;
	padding: 8px 16px;
	font-size: 14px;
	text-align: right;
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

export const FilterClearBtn = styled.button`
	width: 100%;
	margin-top: 4px;
	padding: 8px 16px;
	font-size: 12px;
	text-align: right;
	color: ${colors.danger};
	background: transparent;
	border: none;
	border-top: 1px solid ${gray[100]};
	cursor: pointer;
	transition: background 0.1s;
	&:hover {
		background: ${colors.dangerLight};
	}
`;
