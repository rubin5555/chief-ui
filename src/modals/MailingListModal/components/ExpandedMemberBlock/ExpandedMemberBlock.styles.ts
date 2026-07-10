import styled from 'styled-components';
import { ellipsis } from '@/styles/mixins';
import { gray } from '@/styles/theme';
import { ExpandedBlock } from '../MembersPanel/MembersPanel.styles';

export const MemberExpandedBlock = styled(ExpandedBlock)``;

export const ColRight = styled.span`
	text-align: right;
`;

export const ColCenter = styled.span`
	text-align: center;
`;

export const MemberNameCell = styled.span`
	text-align: right;
	font-size: 11px;
	font-weight: 500;
	color: ${gray[700]};
	${ellipsis}
`;

export const MemberCell = styled.span<{ $tabular?: boolean }>`
	text-align: center;
	font-size: 11px;
	color: ${gray[500]};
	${({ $tabular }) => $tabular && 'font-variant-numeric: tabular-nums;'}
`;
