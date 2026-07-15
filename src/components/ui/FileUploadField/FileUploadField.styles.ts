import styled from 'styled-components';
import { ellipsis, flexCenter, flexGap } from '@/styles/mixins';
import { colors, gray, radii, shadows, transitions } from '@/styles/theme';

export const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 6px;
`;

export const UploadRow = styled.div`
	${flexGap(16)}
`;

export const UploadArea = styled.label<{ $isDragging?: boolean }>`
	flex: 1;
	cursor: pointer;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 6px;
	padding: 16px;
	border: 1px dashed ${({ $isDragging }) => ($isDragging ? colors.primary : gray[300])};
	border-radius: ${radii.xl};
	background: ${({ $isDragging }) => ($isDragging ? colors.primaryLight : 'transparent')};
	transition: all ${transitions.normal};
	&:hover {
		border-color: color-mix(in srgb, ${colors.primary} 40%, transparent);
		background: ${colors.primaryLight};
	}
`;

export const UploadIconCircle = styled.div`
	width: 28px;
	height: 28px;
	border-radius: ${radii.full};
	background: ${gray[100]};
	color: ${gray[400]};
	${flexCenter}
`;

export const PreviewWrapper = styled.div`
	position: relative;
	flex-shrink: 0;
`;

export const PreviewThumb = styled.img`
	width: 96px;
	height: 96px;
	border-radius: ${radii.lg};
	object-fit: cover;
	flex-shrink: 0;
`;

export const PreviewRemoveBtn = styled.button`
	position: absolute;
	top: -8px;
	right: -8px;
	width: 24px;
	height: 24px;
	padding: 0;
	${flexCenter}
	border-radius: ${radii.full};
	border: none;
	background: ${colors.surface};
	color: ${gray[600]};
	box-shadow: ${shadows.md};
	cursor: pointer;
	transition: all ${transitions.normal};
	&:hover {
		color: ${colors.danger};
		background: ${colors.dangerLight};
	}
`;

export const UploadText = styled.span`
	font-size: 12px;
	font-weight: 500;
	color: ${gray[500]};
`;

export const UploadHint = styled.span`
	font-size: 10px;
	color: ${gray[400]};
`;

export const HiddenFileInput = styled.input`
	display: none;
`;

export const UploadRemoveBtn = styled.button`
	flex-shrink: 0;
	padding: 6px;
	border-radius: ${radii.xl};
	border: none;
	background: transparent;
	color: ${gray[300]};
	cursor: pointer;
	transition: all ${transitions.normal};
	&:hover {
		color: ${colors.primary};
		background: ${colors.primaryLight};
	}
`;

export const FileNameHint = styled.span`
	font-size: 12px;
	color: ${gray[500]};
	text-align: right;
	${ellipsis}
`;
