import styled from 'styled-components';
import { flexGap } from '@/styles/mixins';
import { colors, gray } from '@/styles/theme';

// Layout shared by the two halves of a people picker. Anything belonging to one
// half alone lives in that component's own `.styles.ts`; anything a consumer
// arranges for itself — the dialog body, the column widths — belongs to the
// consumer, since the point of splitting the halves is that a mailing-list form
// and a permissions dialog arrange them differently.

// Scrolls sideways rather than wrapping, so the row stays one row however
// narrow the column gets — with the scrollbar hidden, since the chips run off
// the edge visibly enough to say there is more (main's TopNavbar.tsx:447).
export const TabBar = styled.div`
	flex-shrink: 0;
	display: flex;
	gap: 6px;
	padding: 4px 16px 12px;
	overflow-x: auto;
	scrollbar-width: none;

	&::-webkit-scrollbar {
		display: none;
	}
`;

// Hidden rather than unmounted when the open tab has nothing to search: it is
// the portal target every other tab's search box renders into, and a target
// that comes and going means the next tab paints once against a slot that isn't
// there yet, then again once the ref catches up.
export const SearchRow = styled.div<{ $hidden: boolean }>`
	${flexGap(8)}
	padding: 12px 16px;
	border-bottom: 1px solid ${colors.border};
	flex-shrink: 0;
	${(p) => (p.$hidden ? 'display: none;' : '')}
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
