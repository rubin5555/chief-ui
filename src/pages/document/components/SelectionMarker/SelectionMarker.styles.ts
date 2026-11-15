import styled from 'styled-components';
import { flexCenter } from '@/styles/mixins';
import { colors, gray, radii } from '@/styles/theme';

export const Marker = styled.span<{ $checked: boolean; $shape: 'circle' | 'square' }>`
	${flexCenter}
	flex-shrink: 0;
	width: 16px;
	height: 16px;
	border-radius: ${({ $shape }) => ($shape === 'circle' ? radii.full : radii.md)};
	transition: background-color 0.15s, border-color 0.15s, opacity 0.15s;
	background: ${({ $checked }) => ($checked ? colors.primary : colors.surface)};
	border: ${({ $checked }) => ($checked ? 'none' : `2px solid ${gray[300]}`)};
	color: ${colors.surface};
`;
