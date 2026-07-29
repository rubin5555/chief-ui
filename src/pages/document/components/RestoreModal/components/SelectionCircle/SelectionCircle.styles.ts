import styled from 'styled-components';
import { flexCenter } from '@/styles/mixins';
import { colors, gray, radii } from '@/styles/theme';

export const Circle = styled.span<{ $checked: boolean }>`
	${flexCenter}
	flex-shrink: 0;
	width: 16px;
	height: 16px;
	border-radius: ${radii.full};
	transition: background-color 0.15s, border-color 0.15s, opacity 0.15s;
	background: ${({ $checked }) => ($checked ? colors.primary : colors.surface)};
	border: ${({ $checked }) => ($checked ? 'none' : `2px solid ${gray[300]}`)};
	color: ${colors.surface};
`;
