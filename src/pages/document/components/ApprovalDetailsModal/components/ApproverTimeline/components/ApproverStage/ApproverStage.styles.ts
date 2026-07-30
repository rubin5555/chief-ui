import styled from 'styled-components';
import { resetButton } from '@/styles/mixins';
import { colors, gray, radii } from '@/styles/theme';

export const StageRoot = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 4px;
	min-width: 72px;
`;

export const StageDot = styled.span`
	width: 12px;
	height: 12px;
	flex-shrink: 0;
	border-radius: ${radii.full};
	background-color: ${colors.primary};
`;

export const StageLabel = styled.span`
	white-space: nowrap;
	font-size: 10px;
	font-weight: 600;
	color: ${gray[600]};
`;

export const ApproverChip = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 4px;
	width: 100%;
	margin-top: 2px;
	padding: 2px 6px;
	border-radius: ${radii.sm};
	background-color: ${gray[100]};
	font-size: 10px;
	color: ${gray[700]};
`;

export const ChipName = styled.span`
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

export const ChipRemoveBtn = styled.button`
	${resetButton}
	flex-shrink: 0;
	line-height: 1;
	font-size: 12px;
	color: ${gray[400]};

	&:hover {
		color: ${gray[600]};
	}
`;
