import styled from 'styled-components';
import { flexBetween } from '@/styles/mixins';
import { colors, gray } from '@/styles/theme';

// Bounded rather than free to grow: however many rows a sheet fails on, the
// people it did find are what the dialog is for, and a long tail of bad cells
// must not push them off the screen.
export const FailedScroll = styled.div`
	max-height: 132px;
	overflow-y: auto;
`;

export const FailedRow = styled.div`
	${flexBetween}
	padding: 8px 16px;
	border-bottom: 1px solid ${gray[100]};
`;

export const FailedNumber = styled.span`
	font-size: 12px;
	color: ${gray[600]};
	font-variant-numeric: tabular-nums;
	direction: ltr;
`;

export const FailedReason = styled.span`
	font-size: 11px;
	color: ${colors.warning};
`;
