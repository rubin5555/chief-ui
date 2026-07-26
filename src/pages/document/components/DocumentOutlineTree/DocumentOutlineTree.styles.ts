import styled from 'styled-components';
import { colors, gray, radii, transitions } from '@/styles/theme';

export const TreeRoot = styled.nav`
	display: flex;
	flex-direction: column;
	gap: 2px;
`;

export const SubjectRow = styled.button`
	display: flex;
	align-items: center;
	gap: 6px;
	width: 100%;
	padding: 8px 10px;
	border: none;
	background: none;
	border-radius: ${radii.lg};
	cursor: pointer;
	text-align: right;
	font-size: 13px;
	font-weight: 600;
	color: ${gray[800]};
	transition: background-color ${transitions.fast};

	&:hover {
		background-color: ${gray[50]};
	}
`;

export const ChevronSlot = styled.span<{ $expanded: boolean }>`
	display: flex;
	flex-shrink: 0;
	color: ${gray[400]};
	transform: rotate(${(props) => (props.$expanded ? '0deg' : '90deg')});
	transition: transform ${transitions.normal};
`;

export const SubjectLabel = styled.span`
	flex: 1;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

export const StatusDot = styled.span<{ $color: string }>`
	flex-shrink: 0;
	width: 6px;
	height: 6px;
	border-radius: ${radii.full};
	background-color: ${(props) => props.$color};
`;

export const SectionList = styled.ul`
	display: flex;
	flex-direction: column;
	gap: 1px;
	margin: 0;
	padding: 0 8px 4px 0;
	list-style: none;
`;

export const SectionRow = styled.li`
	display: flex;
	align-items: center;
	gap: 6px;
	padding: 6px 10px 6px 0;
	margin-right: 18px;
	border-right: 1px solid ${colors.border};
	font-size: 12px;
	color: ${gray[600]};
`;
