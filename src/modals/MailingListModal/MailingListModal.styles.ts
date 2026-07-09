import styled from 'styled-components';
import { colors, gray, radii, shadows } from '@/styles/theme';

// No semantic "warning" token exists in theme.ts yet — consolidated here as one named
// constant instead of 3 separate raw literals. Worth promoting to a theme token if more
// warning/amber UI shows up elsewhere.
const WARNING_AMBER = {
  border: '#f59e0b',
  background: '#fffbeb',
  text: '#d97706',
} as const;

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
	width: 1140px;
	max-width: 96vw;
	height: 90vh;
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
	transition: background 0.15s;
	&:hover {
		background: ${gray[100]};
	}
`;

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
	border: 1px solid ${(props) => (props.$warn ? WARNING_AMBER.border : gray[200])};
	border-radius: ${radii.xl};
	font-size: 14px;
	text-align: right;
	background: ${(props) => (props.$warn ? WARNING_AMBER.background : colors.surface)};
	outline: none;
	transition: border-color 0.15s;
	&:focus {
		border-color: ${colors.primary};
	}
	box-sizing: border-box;
`;

export const WarnText = styled.p`
	font-size: 11px;
	color: ${WARNING_AMBER.text};
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

export const ModalFooter = styled.div`
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 16px 32px;
	border-top: 1px solid ${colors.border};
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
