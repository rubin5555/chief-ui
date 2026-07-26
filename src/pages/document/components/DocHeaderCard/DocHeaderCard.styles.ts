import styled from 'styled-components';
import { colors, gray, radii, shadows } from '@/styles/theme';

export const Card = styled.div`
	display: flex;
	flex-direction: column;
	gap: 10px;
	padding: 16px 20px;
	border-radius: ${radii.xl};
	background-color: ${colors.surface};
	box-shadow: ${shadows.sm};
	border: 1px solid ${colors.border};
`;

export const TitleRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
`;

export const Title = styled.h1`
	margin: 0;
	font-size: 18px;
	font-weight: 700;
	color: ${gray[900]};
`;

export const ClassificationChip = styled.span`
	flex-shrink: 0;
	padding: 3px 12px;
	border-radius: ${radii.full};
	background-color: ${colors.dangerLight};
	color: ${colors.danger};
	font-size: 12px;
	font-weight: 700;
`;

export const ChipRow = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
`;

export const Chip = styled.span`
	display: flex;
	align-items: center;
	gap: 4px;
	padding: 4px 10px;
	border-radius: ${radii.lg};
	background-color: ${gray[50]};
	color: ${gray[700]};
	font-size: 12px;
`;

export const ChipLabel = styled.span`
	color: ${gray[500]};
`;
