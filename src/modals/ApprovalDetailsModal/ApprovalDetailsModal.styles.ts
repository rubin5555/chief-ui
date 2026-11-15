import styled from 'styled-components';
import { gray, radii, transitions } from '@/styles/theme';

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

export const Notes = styled.textarea`
	width: 100%;
	min-height: 80px;
	padding: 12px 16px;
	border-radius: ${radii.xl};
	border: 1px solid ${gray[200]};
	font-size: 14px;
	color: ${gray[700]};
	resize: none;
	transition: border-color ${transitions.normal};

	&::placeholder {
		color: ${gray[300]};
	}

	&:focus {
		outline: none;
		border-color: ${gray[300]};
	}
`;

export const Body = styled.form`
	display: flex;
	flex-direction: column;
	gap: 24px;
`;
