import styled from 'styled-components';
import { colors, gray, radii } from '@/styles/theme';

export const BodyRoot = styled.div`
	display: flex;
	flex-direction: column;
	gap: 6px;
`;

export const HiddenNotice = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 10px 12px;
	border-radius: ${radii.lg};
	background-color: ${gray[50]};
	color: ${gray[400]};
	font-size: 13px;
	font-style: italic;
`;

export const ClassifiedBox = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 10px 12px;
	border-radius: ${radii.lg};
	background-color: ${colors.dangerLight};
	color: ${colors.danger};
	font-size: 13px;
	font-weight: 500;
`;
