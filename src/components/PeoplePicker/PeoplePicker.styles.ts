import styled from 'styled-components';
import { flexGap } from '@/styles/mixins';
import { colors, gray } from '@/styles/theme';

// Layout shared by the two halves of a people picker. Anything belonging to one
// half alone lives in that component's own `.styles.ts`; anything a consumer
// arranges for itself — the dialog body, the column widths — belongs to the
// consumer, since the point of splitting the halves is that a mailing-list form
// and a permissions dialog arrange them differently.

export const TabBar = styled.div`
	flex-shrink: 0;
	display: flex;
	gap: 6px;
	padding: 12px 16px;
`;

export const SearchRow = styled.div`
	${flexGap(8)}
	padding: 12px 16px;
	border-bottom: 1px solid ${colors.border};
	flex-shrink: 0;
`;

export const TabContent = styled.div`
	display: flex;
	overflow: hidden;
	flex: 1;
`;

export const PlaceholderText = styled.p`
	margin: auto;
	color: ${gray[400]};
	font-size: 12px;
`;
