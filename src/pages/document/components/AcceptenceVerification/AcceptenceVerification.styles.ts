import styled from 'styled-components';
import { colors, gray, radii } from '@/styles/theme';

export const Warning = styled.p`
	margin: 0 0 4px;
	font-size: 12px;
	line-height: 1.6;
	color: ${colors.danger};
`;

export const Field = styled.div`
	display: flex;
	flex-direction: column;
	gap: 6px;
`;

export const FieldLabel = styled.label`
	font-size: 12px;
	color: ${gray[500]};
`;

export const TextInput = styled.input`
	width: 100%;
	padding: 8px 12px;
	border-radius: ${radii.lg};
	border: 1px solid ${colors.border};
	background-color: ${gray[50]};
	font-size: 13px;
	color: ${gray[800]};

	&:focus {
		outline: none;
		border-color: ${colors.primary};
	}
`;

export const Notes = styled.textarea`
	width: 100%;
	min-height: 80px;
	padding: 8px 12px;
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
	gap: 14px;
`;
