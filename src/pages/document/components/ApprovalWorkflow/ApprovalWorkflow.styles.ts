import styled from 'styled-components';
import { gray, radii } from '@/styles/theme';

// Wraps because this now sits in the 256px sidebar — where main keeps the
// document's status controls (its StatusFlowNav, Edit.tsx:3844) — rather than
// spanning the canvas.
export const ActionsRow = styled.div`
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 10px;
`;

export const StatusChip = styled.span`
	padding: 4px 12px;
	border-radius: ${radii.full};
	background-color: ${gray[100]};
	color: ${gray[700]};
	font-size: 12px;
	font-weight: 600;
`;
