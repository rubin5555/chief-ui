import styled from 'styled-components';
import { colors, gray } from '@/styles/theme';

export const ListSection = styled.section<{ $fill?: boolean }>`
	display: flex;
	flex-direction: column;
	min-height: 0;
	${(p) => (p.$fill ? 'flex: 1;' : 'flex-shrink: 0;')}
`;

export const ListHeader = styled.h4`
	flex-shrink: 0;
	margin: 0;
	padding: 8px 16px;
	font-size: 11px;
	font-weight: 600;
	color: ${gray[600]};
	background: ${gray[50]};
	border-bottom: 1px solid ${colors.border};
	text-align: right;
`;

export const ListCount = styled.span`
	margin-right: 4px;
	font-weight: 400;
	color: ${gray[400]};
`;
