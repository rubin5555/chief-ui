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

export const BodyTextarea = styled.textarea`
	width: 100%;
	min-height: 140px;
	padding: 12px 14px;
	border-radius: ${radii.lg};
	border: 1px solid ${colors.border};
	font-size: 13px;
	line-height: 1.6;
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
