import styled from 'styled-components';
import { gray } from '@/styles/theme';

// main's round timeline (Edit.tsx:2963): the chosen ranks in order, joined by a
// rule. `align-items: flex-start` so a rank carrying two approvers grows
// downwards instead of dragging its neighbours' dots down with it.
export const TimelineRoot = styled.div`
	display: flex;
	align-items: flex-start;
	padding: 0 8px;
`;

export const Connector = styled.div`
	flex: 1;
	min-width: 20px;
	height: 1px;
	/* Half the 12px dot, so the rule meets the dots' centre line. */
	margin-top: 6px;
	background-color: ${gray[300]};
`;
