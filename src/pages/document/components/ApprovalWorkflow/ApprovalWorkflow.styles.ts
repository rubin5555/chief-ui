import styled from 'styled-components';
import { colors, gray, radii } from '@/styles/theme';

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

export const PrimaryBtn = styled.button`
	padding: 8px 16px;
	border: none;
	border-radius: ${radii.xl};
	font-size: 12px;
	font-weight: 600;
	cursor: pointer;
	background-color: ${colors.primary};
	color: ${colors.surface};
`;

export const SecondaryBtn = styled.button`
	padding: 8px 16px;
	border: 1px solid ${colors.border};
	border-radius: ${radii.xl};
	font-size: 12px;
	font-weight: 500;
	cursor: pointer;
	background: none;
	color: ${gray[600]};
`;
