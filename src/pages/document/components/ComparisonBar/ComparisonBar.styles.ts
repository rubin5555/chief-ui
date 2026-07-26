import styled from 'styled-components';
import { colors, gray, radii } from '@/styles/theme';

export const Bar = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 8px 14px;
	border-radius: ${radii.lg};
	background-color: ${colors.warningLight};
	color: ${colors.warning};
	font-size: 12px;
`;

export const Label = styled.span`
	flex: 1;
`;

export const NavBtn = styled.button`
	display: flex;
	padding: 4px;
	border: none;
	background: none;
	color: ${colors.warning};
	cursor: not-allowed;
	opacity: 0.5;
`;

export const ToggleBtn = styled.button`
	padding: 4px 12px;
	border: 1px solid ${gray[300]};
	border-radius: ${radii.full};
	background: none;
	font-size: 11px;
	font-weight: 600;
	color: ${gray[700]};
	cursor: pointer;
`;
