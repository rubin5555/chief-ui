import styled from 'styled-components';
import { colors, gray, radii } from '@/styles/theme';

export const List = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
	min-height: 120px;
	max-height: 320px;
	overflow-y: auto;
`;

export const Row = styled.label`
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 8px 10px;
	border-radius: ${radii.lg};
	font-size: 13px;
	color: ${gray[700]};
	cursor: pointer;

	&:hover {
		background-color: ${gray[50]};
	}
`;

export const EmptyState = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 120px;
	color: ${gray[400]};
	font-size: 13px;
`;

export const RestoreBtn = styled.button`
	padding: 8px 20px;
	border: none;
	border-radius: ${radii.xl};
	font-size: 13px;
	font-weight: 600;
	cursor: pointer;
	background-color: ${colors.primary};
	color: ${colors.surface};

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
`;

export const CancelBtn = styled.button`
	padding: 8px 20px;
	border: none;
	border-radius: ${radii.xl};
	font-size: 13px;
	font-weight: 500;
	cursor: pointer;
	background-color: transparent;
	color: ${gray[500]};
`;
