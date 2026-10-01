import styled from 'styled-components';
import { colors, gray, radii, transitions } from '@/styles/theme';

export const ActionList = styled.div`
	display: flex;
	flex-direction: column;
	padding: 6px;
`;

export const ActionBtn = styled.button<{ $danger?: boolean }>`
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 8px 10px;
	border: none;
	background: none;
	border-radius: ${radii.lg};
	font-size: 13px;
	text-align: right;
	color: ${(props) => (props.$danger ? colors.danger : gray[700])};
	cursor: pointer;
	transition: background-color ${transitions.fast};

	&:hover {
		background-color: ${(props) => (props.$danger ? colors.dangerLight : gray[50])};
	}
`;

export const Separator = styled.div`
	margin: 4px 6px;
	border-top: 1px solid ${colors.border};
`;
