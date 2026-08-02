import styled from 'styled-components';
import { colors, gray, radii } from '@/styles/theme';

export const Segments = styled.div`
	display: flex;
	overflow: hidden;
	flex-shrink: 0;
	border: 1px solid ${gray[200]};
	border-radius: ${radii.lg};
`;

export const Segment = styled.button<{ $selected: boolean }>`
	padding: 6px 12px;
	font-size: 12px;
	font-weight: 500;
	transition: background-color 0.15s, color 0.15s;
	background: ${({ $selected }) => ($selected ? colors.primary : colors.surface)};
	color: ${({ $selected }) => ($selected ? colors.surface : gray[500])};

	&:not(:first-child) {
		border-inline-start: 1px solid ${gray[200]};
	}
`;
