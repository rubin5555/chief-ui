import styled from 'styled-components';
import { colors, gray, radii } from '@/styles/theme';

export const Layout = styled.div`
	display: flex;
	gap: 16px;
	height: 360px;
`;

export const DocListColumn = styled.div`
	width: 240px;
	flex-shrink: 0;
	display: flex;
	flex-direction: column;
	gap: 8px;
	border-left: 1px solid ${colors.border};
	padding-left: 16px;
`;

export const DocRow = styled.button<{ $active: boolean }>`
	display: flex;
	flex-direction: column;
	gap: 2px;
	padding: 8px 10px;
	border: none;
	border-radius: ${radii.lg};
	text-align: right;
	cursor: pointer;
	background-color: ${(props) => (props.$active ? gray[100] : 'transparent')};

	&:hover {
		background-color: ${gray[50]};
	}
`;

export const DocName = styled.span`
	font-size: 13px;
	font-weight: 600;
	color: ${gray[800]};
`;

export const DocMeta = styled.span`
	font-size: 11px;
	color: ${gray[500]};
`;

export const PreviewColumn = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 8px;
	overflow-y: auto;
`;

export const SectionRow = styled.label`
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 8px 10px;
	border-radius: ${radii.lg};
	font-size: 13px;
	color: ${gray[700]};
	cursor: pointer;

	&:hover {
		background-color: ${gray[50]};
	}
`;

export const EmptyState = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	color: ${gray[400]};
	font-size: 13px;
`;

export const ImportBtn = styled.button`
	padding: 8px 20px;
	border: none;
	border-radius: ${radii.xl};
	font-size: 13px;
	font-weight: 600;
	cursor: pointer;
	background-color: ${colors.primary};
	color: ${colors.surface};

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
`;

export const CancelBtn = styled.button`
	padding: 8px 20px;
	border: none;
	border-radius: ${radii.xl};
	font-size: 13px;
	font-weight: 500;
	cursor: pointer;
	background-color: transparent;
	color: ${gray[500]};
`;
