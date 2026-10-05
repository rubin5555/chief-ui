import styled from 'styled-components';
import { colors, radii } from '@/styles/theme';

export const CursorBar = styled.div<{
  $top: number;
  $left: number;
  $height: number;
  $color?: string;
}>`
	position: absolute;
	top: ${({ $top }) => $top}px;
	left: ${({ $left }) => $left}px;
	height: ${({ $height }) => $height}px;
	width: 2px;
	background: ${({ $color }) => $color || colors.accent};
	pointer-events: none;
	z-index: 10;
	transition:
		top 0.08s ease-out,
		left 0.08s ease-out;
`;

export const CursorLabel = styled.span<{ $color?: string }>`
	position: absolute;
	top: -20px;
	right: -2px;
	background: ${({ $color }) => $color || colors.accent};
	color: ${colors.surface};
	font-size: 10.5px;
	font-weight: 600;
	padding: 1px 7px;
	border-radius: ${radii.lg};
	white-space: nowrap;
	pointer-events: none;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`;
