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

// main's notes field (Edit.tsx:3057): plain white on a grey hairline, and the
// focus state only deepens the edge — this sits under three other controls that
// already carry the app's blue, and a fourth would make the form read as a
// warning.
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

// 24px between sections, main's `gap-6` (Edit.tsx:2937) — the rank field and the
// timeline it produces have to read as two things, not one control that grew.
export const Body = styled.form`
	display: flex;
	flex-direction: column;
	gap: 24px;
`;
