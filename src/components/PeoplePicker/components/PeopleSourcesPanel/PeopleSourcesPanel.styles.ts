import styled from 'styled-components';
import { colors } from '@/styles/theme';

export const SourcesRoot = styled.div<{ $width?: number }>`
	${({ $width }) => ($width ? `width: ${$width}px; flex-shrink: 0;` : 'flex: 1; min-width: 0;')}
	display: flex;
	flex-direction: column;
	border-left: 1px solid ${colors.border};
	overflow: hidden;
`;
