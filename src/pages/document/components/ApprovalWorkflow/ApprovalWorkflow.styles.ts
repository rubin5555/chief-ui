import styled from 'styled-components';
import { gray, radii } from '@/styles/theme';

export const ActionsRow = styled.div`
	display: flex;
	align-items: center;
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
