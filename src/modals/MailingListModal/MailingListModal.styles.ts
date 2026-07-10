import styled from 'styled-components';
import { colors, gray, radii } from '@/styles/theme';
import {
  CloseBtnBase,
  ModalCardBase,
  ModalFooterBase,
  ModalHeaderBase,
  ModalTitleBase,
} from '../modal.shared.styles';

export { Overlay } from '../modal.shared.styles';

export const ModalCard = styled(ModalCardBase)`
	width: 1140px;
	max-width: 96vw;
	height: 90vh;
`;

export const ModalHeader = ModalHeaderBase;

export const ModalTitle = ModalTitleBase;

export const CloseBtn = CloseBtnBase;

export const ModalBody = styled.div`
	flex: 1;
	display: flex;
	overflow: hidden;
`;

export const RightPanel = styled.div`
	width: 700px;
	flex-shrink: 0;
	display: flex;
	flex-direction: column;
	border-left: 1px solid ${colors.border};
	overflow: hidden;
`;

export const LeftPanel = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	overflow: hidden;
`;

export const FormSection = styled.div`
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

export const TabBar = styled.div`
	flex-shrink: 0;
	display: flex;
	gap: 6px;
	padding: 12px 16px;
`;

export const TabContent = styled.div`
	display: flex;
	overflow: hidden;
	flex: 1;
`;

export const PlaceholderText = styled.p`
	margin: auto;
	color: ${gray[400]};
	font-size: 12px;
`;

export const ModalFooter = styled(ModalFooterBase)`
	justify-content: space-between;
`;

export const CancelBtn = styled.button`
	font-size: 14px;
	color: ${gray[500]};
	background: transparent;
	border: none;
	cursor: pointer;
	transition: color 0.15s;
	&:hover {
		color: ${gray[700]};
	}
`;

export const SearchRow = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 12px 16px;
	border-bottom: 1px solid ${colors.border};
	flex-shrink: 0;
`;
