import styled from 'styled-components';
import { flexCenter, resetButton } from '@/styles/mixins';
import { colors, gray, radii, transitions } from '@/styles/theme';

// One חמ״ל in the picker (main, Edit.tsx:3023-3042): a checkbox that selects it,
// and a chevron that shows who is in it without selecting anything.

export const GroupRow = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 8px 16px;

	&:hover {
		background-color: ${gray[50]};
	}
`;

export const Checkbox = styled.button<{ $checked: boolean }>`
	${resetButton}
	${flexCenter}
	flex-shrink: 0;
	width: 16px;
	height: 16px;
	border-radius: ${radii.sm};
	transition: background-color ${transitions.normal};
	color: ${colors.surface};

	${({ $checked }) =>
    $checked
      ? `background-color: ${colors.primary}; border: none;`
      : `background-color: ${colors.surface}; border: 2px solid ${gray[300]};`}
`;

export const GroupName = styled.span`
	flex: 1;
	font-size: 14px;
	color: ${gray[700]};
`;

export const ExpandBtn = styled.button<{ $open: boolean }>`
	${resetButton}
	${flexCenter}
	flex-shrink: 0;
	color: ${gray[400]};
	transition: transform ${transitions.normal};
	transform: rotate(${({ $open }) => ($open ? '180deg' : '0deg')});

	&:hover {
		color: ${gray[600]};
	}
`;

export const MemberList = styled.div`
	padding: 0 40px 4px 0;
`;

export const MemberName = styled.div`
	padding: 4px 16px;
	font-size: 12px;
	color: ${gray[500]};
`;
