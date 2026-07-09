import styled from 'styled-components';
import { colors, gray, radii, shadows, transitions } from '@/styles/theme';

export const Overlay = styled.div`
	position: fixed;
	inset: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 9998;
	background: rgba(0, 0, 0, 0.5);
`;

export const ModalCard = styled.div`
	position: relative;
	background: ${colors.surface};
	border-radius: ${radii['3xl']};
	box-shadow: ${shadows.xxl};
	display: flex;
	flex-direction: column;
	overflow: hidden;
	width: 700px;
	max-width: 95vw;
	max-height: 90vh;
`;

export const ModalHeader = styled.div`
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 16px 32px;
	background: ${colors.surface};
	border-bottom: 1px solid ${colors.border};
`;

export const ModalTitle = styled.h2`
	font-size: 20px;
	font-weight: 700;
	color: ${gray[900]};
	margin: 0;
`;

export const CloseBtn = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 8px;
	border-radius: ${radii.xl};
	border: none;
	background: transparent;
	cursor: pointer;
	color: ${gray[500]};
	transition: background ${transitions.fast};
	&:hover {
		background: ${gray[100]};
	}
`;

export const ModalBody = styled.div`
	flex: 1;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	gap: 20px;
	padding: 24px 32px 32px;
`;

export const TypeSection = styled.div``;

export const EditorSection = styled.div``;

export const UploadSection = styled.div``;

export const ModalFooter = styled.div`
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: 12px;
	padding: 16px 32px;
	border-top: 1px solid ${colors.border};
`;
