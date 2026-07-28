import styled from 'styled-components';
import { resetButton } from '@/styles/mixins';
import { colors, gray, radii } from '@/styles/theme';

export const BodyLayout = styled.div`
	flex: 1;
	display: flex;
	overflow: hidden;
`;

/** Holds the members half, which fills whatever the sources half leaves. */
export const MembersColumn = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	overflow: hidden;
`;

export const FormSection = styled.form`
	flex-shrink: 0;
	padding: 16px 20px;
	border-bottom: 1px solid ${colors.border};
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

export const FieldLabel = styled.label`
	display: block;
	font-size: 12px;
	font-weight: 500;
	color: ${gray[500]};
	margin-bottom: 4px;
	text-align: right;
`;

export const FieldInput = styled.input<{ $warn?: boolean }>`
	width: 100%;
	padding: 8px 12px;
	border: 1px solid ${(props) => (props.$warn ? colors.warning : gray[200])};
	border-radius: ${radii.xl};
	font-size: 14px;
	text-align: right;
	background: ${(props) => (props.$warn ? colors.warningLight : colors.surface)};
	outline: none;
	transition: border-color 0.15s;
	&:focus {
		border-color: ${colors.primary};
	}
	box-sizing: border-box;
`;

export const WarnText = styled.p`
	font-size: 11px;
	color: ${colors.warning};
	margin: 4px 0 0;
	text-align: right;
`;

export const CancelBtn = styled.button`
	font-size: 14px;
	color: ${gray[500]};
	${resetButton}
	transition: color 0.15s;
	&:hover {
		color: ${gray[700]};
	}
`;
