import styled from 'styled-components';
import { colors, gray, radii } from '@/styles/theme';

export const Field = styled.div`
	display: flex;
	flex-direction: column;
	gap: 6px;
`;

export const FieldLabel = styled.label`
	font-size: 12px;
	font-weight: 600;
	color: ${gray[700]};
`;

export const RankBlock = styled.div`
	display: flex;
	flex-direction: column;
	gap: 6px;
	padding: 10px 12px;
	border-radius: ${radii.lg};
	background-color: ${gray[50]};
`;

export const RankBlockTitle = styled.span`
	font-size: 12px;
	font-weight: 700;
	color: ${colors.primary};
`;

export const Notes = styled.textarea`
	width: 100%;
	min-height: 80px;
	padding: 10px 12px;
	border-radius: ${radii.lg};
	border: 1px solid ${colors.border};
	background-color: ${gray[50]};
	font-size: 13px;
	color: ${gray[800]};
	resize: none;

	&:focus {
		outline: none;
		border-color: ${colors.primary};
	}
`;

export const Body = styled.form`
	display: flex;
	flex-direction: column;
	gap: 16px;
`;
