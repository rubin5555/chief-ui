import styled from 'styled-components';
import { gray } from '@/styles/theme';

export const PermissionsView = styled.div`
	display: flex;
	flex-direction: column;
	gap: 10px;
	padding: 8px;
`;

export const BackRow = styled.div`
	display: flex;
	align-items: center;
	gap: 6px;
	padding: 0 4px;
`;

export const BackBtn = styled.button`
	display: flex;
	border: none;
	background: none;
	color: ${gray[400]};
	cursor: pointer;
`;

export const BackLabel = styled.span`
	font-size: 13px;
	font-weight: 600;
	color: ${gray[700]};
`;
