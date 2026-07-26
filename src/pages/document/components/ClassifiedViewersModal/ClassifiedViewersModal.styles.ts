import styled from 'styled-components';
import { colors, gray, radii } from '@/styles/theme';

export const Body = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
	height: 100%;
`;

export const TableWrap = styled.div`
	flex: 1;
	min-height: 240px;
`;

export const NameCell = styled.span`
	font-weight: 500;
	color: ${gray[800]};
`;

export const MutedCell = styled.span`
	color: ${gray[500]};
	font-size: 12px;
`;

export const EmptyState = styled.div`
	padding: 24px 0;
	text-align: center;
	color: ${gray[400]};
	font-size: 13px;
`;

export const FooterBtn = styled.button`
	padding: 8px 20px;
	border: none;
	border-radius: ${radii.xl};
	font-size: 13px;
	font-weight: 600;
	cursor: pointer;
	background-color: ${colors.primary};
	color: ${colors.surface};
`;
