import styled from 'styled-components';
import { colors, gray, radii, transitions } from '@/styles/theme';
import {
  CloseBtnBase,
  ModalCardBase,
  ModalFooterBase,
  ModalHeaderBase,
  ModalTitleBase,
} from '../modal.shared.styles';

export { Overlay } from '../modal.shared.styles';

export const ModalCard = styled(ModalCardBase)`
	width: 620px;
	max-width: 90vw;
	max-height: 90vh;
`;

export const ModalHeader = ModalHeaderBase;

export const HeaderTitleGroup = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
`;

export const HeaderIconBadge = styled.div`
	width: 32px;
	height: 32px;
	border-radius: ${radii.xl};
	background: ${gray[100]};
	color: ${colors.primary};
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
`;

export const ModalTitle = styled(ModalTitleBase)`
	font-size: 18px;
`;

export const CloseBtn = styled(CloseBtnBase)`
	padding: 6px;
	color: ${gray[400]};
	&:hover {
		color: ${gray[600]};
	}
`;

export const ModalBody = styled.form`
	flex: 1;
	overflow-y: auto;
	padding: 24px 32px;
	display: flex;
	flex-direction: column;
	gap: 20px;
`;

export const FieldGroup = styled.div``;

export const FieldLabel = styled.label`
	display: block;
	font-size: 14px;
	font-weight: 500;
	color: ${gray[700]};
	margin-bottom: 6px;
	text-align: right;
`;

export const FieldSubLabel = styled.span`
	font-size: 12px;
	font-weight: 400;
	color: ${gray[400]};
	margin-right: 4px;
`;

export const FieldInput = styled.input`
	width: 100%;
	padding: 10px 16px;
	border: 1px solid ${gray[300]};
	border-radius: ${radii.xl};
	font-size: 14px;
	background: ${colors.surface};
	outline: none;
	transition: border-color ${transitions.normal};
	box-sizing: border-box;
	&:focus {
		border-color: ${colors.primary};
	}
	&:hover {
		border-color: ${gray[400]};
	}
`;

export const FieldGrid = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 16px;
`;

export const CreatorsStack = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

export const RanksList = styled.div`
	border: 1px solid ${gray[300]};
	border-radius: ${radii.xl};
	overflow: hidden;
`;

export const RankRow = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 8px 12px;
	background: ${colors.surface};
	& + & {
		border-top: 1px solid ${gray[100]};
	}
`;

export const RankLabel = styled.span`
	flex-shrink: 0;
	width: 40px;
	text-align: right;
	font-size: 14px;
	font-weight: 700;
	color: ${colors.primary};
	border-left: 1px solid ${gray[100]};
	padding-left: 12px;
`;

export const RankField = styled.div`
	flex: 1;
	min-width: 0;
`;

export const ModalFooter = ModalFooterBase;
