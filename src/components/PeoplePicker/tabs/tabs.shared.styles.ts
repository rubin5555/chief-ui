import { ChevronDown } from 'lucide-react';
import styled from 'styled-components';
import { ellipsis, flexBetween, flexCenter, resetButton } from '@/styles/mixins';
import { colors, gray, radii } from '@/styles/theme';

export const ExpandChevron = styled(ChevronDown)<{ $isExpanded: boolean }>`
	transition: transform 0.15s;
	transform: ${(props) => (props.$isExpanded ? 'rotate(180deg)' : 'none')};
`;

export const SubTabBar = styled.div`
	display: flex;
	align-items: center;
	padding: 0 16px;
	border-bottom: 1px solid ${colors.border};
	background: ${colors.muted};
	flex-shrink: 0;
`;

export const SubTabBtn = styled.button<{ $active: boolean }>`
	position: relative;
	padding: 12px 16px;
	font-size: 12px;
	border: none;
	background: transparent;
	cursor: pointer;
	transition: color 0.15s;
	color: ${(props) => (props.$active ? gray[900] : gray[400])};
	font-weight: ${(props) => (props.$active ? '600' : '400')};
`;

export const SubTabIndicator = styled.span`
	position: absolute;
	bottom: 0;
	right: 16px;
	left: 16px;
	height: 2px;
	border-radius: ${radii.full};
	background: ${gray[900]};
`;

export const TabRoot = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
`;

export const ImportBar = styled.div`
	flex-shrink: 0;
	padding: 12px 16px;
	border-top: 1px solid ${colors.border};
	background: ${colors.surface};
	${flexBetween}
`;

export const ImportBarLabel = styled.span`
	font-size: 12px;
	color: ${gray[500]};
`;

export const EmptyState = styled.div`
	padding: 32px 12px;
	text-align: center;
	font-size: 14px;
	color: ${gray[400]};
`;

export const ExpandBtn = styled.button`
	${flexCenter}
	width: 20px;
	height: 20px;
	${resetButton}
	padding: 0;
`;

export const ClearBtn = styled.button`
	position: absolute;
	left: 10px;
	top: 50%;
	transform: translateY(-50%);
	${resetButton}
	color: ${gray[300]};
	display: flex;
	align-items: center;
	padding: 0;
	&:hover {
		color: ${gray[500]};
	}
`;

export const CheckboxCell = styled.div`
	${flexCenter}
`;

export const NameCell = styled.span`
	text-align: right;
	font-size: 12px;
	font-weight: 500;
	color: ${gray[800]};
	${ellipsis}
`;

export const CountLabel = styled.span`
	font-weight: 400;
	color: ${gray[400]};
	margin-right: 4px;
`;
