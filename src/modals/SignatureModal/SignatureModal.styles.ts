import styled from 'styled-components';
import {
  CloseBtnBase,
  ModalCardBase,
  ModalFooterBase,
  ModalHeaderBase,
  ModalTitleBase,
} from '../modal.shared.styles';

export { Overlay } from '../modal.shared.styles';

export const ModalCard = styled(ModalCardBase)`
	width: 700px;
	max-width: 95vw;
	max-height: 90vh;
`;

export const ModalHeader = ModalHeaderBase;

export const ModalTitle = ModalTitleBase;

export const CloseBtn = CloseBtnBase;

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

export const ModalFooter = ModalFooterBase;
