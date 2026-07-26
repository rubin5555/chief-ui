import styled from 'styled-components';
import { colors, gray, radii } from '@/styles/theme';

export const Body = styled.form`
	display: flex;
	flex-direction: column;
	gap: 14px;
`;

export const Field = styled.div`
	display: flex;
	flex-direction: column;
	gap: 6px;
`;

export const FieldRow = styled.div`
	display: flex;
	gap: 12px;

	> * {
		flex: 1;
	}
`;

export const FieldLabel = styled.label`
	font-size: 12px;
	font-weight: 600;
	color: ${gray[700]};
`;

export const NameInput = styled.input`
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

export const DirtyWarning = styled.p`
	margin: 0;
	padding: 10px 12px;
	border-radius: ${radii.lg};
	background-color: ${colors.warningLight};
	color: ${colors.warning};
	font-size: 12px;
	line-height: 1.6;
`;
