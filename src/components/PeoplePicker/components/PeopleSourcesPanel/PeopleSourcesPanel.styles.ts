import styled from 'styled-components';
import { colors } from '@/styles/theme';

/**
 * A fixed width when the consumer states one, otherwise whatever is left over.
 * The mailing-list form wants a 700px column with the members list filling the
 * rest; the permissions dialog wants the reverse, since its two flanking columns
 * are the fixed ones.
 */
export const SourcesRoot = styled.div<{ $width?: number }>`
	${({ $width }) => ($width ? `width: ${$width}px; flex-shrink: 0;` : 'flex: 1; min-width: 0;')}
	display: flex;
	flex-direction: column;
	border-left: 1px solid ${colors.border};
	overflow: hidden;
`;
