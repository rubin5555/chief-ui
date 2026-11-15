import styled from 'styled-components';
import { ellipsis } from '@/styles/mixins';
import { gray } from '@/styles/theme';

export const RowName = styled.span`
	font-size: 12px;
	font-weight: 500;
	color: ${gray[800]};
	text-align: right;
	${ellipsis}
`;

export const RowCell = styled.span<{ $tabular?: boolean }>`
	font-size: 12px;
	text-align: center;
	color: ${gray[600]};
	${(p) => (p.$tabular ? 'font-variant-numeric: tabular-nums;' : '')}
`;
