import styled from 'styled-components';
import { FloatingPanel } from '@/components/ui/FloatingPanel';
import { resetButton, subtleScrollbar } from '@/styles/mixins';
import { colors, gray, radii, transitions } from '@/styles/theme';

// main's inline approver search (Edit.tsx:2982): a search box over a short
// bordered list, opened from the `+ גורם מאשר` link under a rank.

export const AddLink = styled.button`
	${resetButton}
	display: flex;
	align-items: center;
	gap: 2px;
	margin-top: 2px;
	white-space: nowrap;
	font-size: 10px;
	font-weight: 600;
	color: ${colors.primary};

	&:hover {
		text-decoration: underline;
	}
`;

export const Panel = styled(FloatingPanel)`
	display: flex;
	flex-direction: column;
	gap: 8px;
	padding: 12px;
	border-radius: ${radii.xl};
	direction: rtl;
`;

export const SearchInput = styled.input`
	width: 100%;
	padding: 6px 12px;
	border: 1px solid ${gray[200]};
	border-radius: ${radii.lg};
	font-size: 14px;
	color: ${gray[700]};
	direction: rtl;
	text-align: right;

	&::placeholder {
		color: ${gray[300]};
	}

	&:focus {
		outline: none;
		border-color: ${gray[300]};
	}
`;

export const ResultList = styled.div`
	${subtleScrollbar}
	max-height: 160px;
	overflow-y: auto;
	border: 1px solid ${gray[200]};
	border-radius: ${radii.lg};
	overflow-x: hidden;
`;

export const ResultBtn = styled.button`
	${resetButton}
	width: 100%;
	padding: 8px 12px;
	border-bottom: 1px solid ${gray[100]};
	text-align: right;
	font-size: 14px;
	color: ${gray[700]};
	transition: background-color ${transitions.normal};

	&:last-child {
		border-bottom: none;
	}

	&:hover {
		background-color: ${colors.primaryLight};
	}
`;

export const EmptyResult = styled.div`
	padding: 8px 12px;
	font-size: 12px;
	color: ${gray[400]};
`;
