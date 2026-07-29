import styled from 'styled-components';
import { ellipsis, flexGap } from '@/styles/mixins';
import { colors, excelColors, gray, radii, transitions } from '@/styles/theme';

export const UploadBar = styled.div`
	${flexGap(8)}
	flex-shrink: 0;
	padding: 12px 16px;
	border-bottom: 1px solid ${gray[100]};
`;

export const HiddenFileInput = styled.input`
	display: none;
`;

export const UploadBtn = styled.button`
	${flexGap(8)}
	flex-shrink: 0;
	padding: 8px 16px;
	border: none;
	border-radius: ${radii.xl};
	background: ${excelColors.green};
	color: ${colors.surface};
	font-size: 12px;
	font-weight: 600;
	cursor: pointer;
	transition: opacity ${transitions.normal};

	&:hover {
		opacity: 0.9;
	}
`;

export const UploadHint = styled.span`
	font-size: 11px;
	color: ${gray[400]};
	text-align: right;
`;

/** The chosen file, once there is one — stated rather than hinted at. */
export const FileNameLabel = styled.span`
	font-size: 11px;
	font-weight: 600;
	color: ${gray[700]};
	text-align: right;
	${ellipsis}
`;
