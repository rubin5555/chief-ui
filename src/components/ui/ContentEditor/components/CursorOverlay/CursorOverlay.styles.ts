import styled from 'styled-components';
import { colors, radii } from '@/styles/theme';

export const CursorBar = styled.div<{ $top: number; $left: number; $height: number }>`
	position: absolute;
	top: ${({ $top }) => $top}px;
	left: ${({ $left }) => $left}px;
	height: ${({ $height }) => $height}px;
	width: 2px;
	background: ${colors.accent};
	pointer-events: none;
	z-index: 2;
`;

export const CursorLabel = styled.span`
	position: absolute;
	top: -18px;
	right: -2px;
	background: ${colors.accent};
	color: ${colors.surface};
	font-size: 10px;
	font-weight: 600;
	padding: 1px 6px;
	border-radius: ${radii.lg};
	white-space: nowrap;
	pointer-events: none;
`;
