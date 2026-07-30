import styled from 'styled-components';
import { flexGap } from '@/styles/mixins';
import { colors, gray } from '@/styles/theme';

export const TabBar = styled.div`
	flex-shrink: 0;
	display: flex;
	gap: 6px;
	padding: 4px 16px 12px;
	overflow-x: auto;
	scrollbar-width: none;

	&::-webkit-scrollbar {
		display: none;
	}
`;

export const SearchRow = styled.div<{ $hidden: boolean }>`
	${flexGap(8)}
	padding: 12px 16px;
	border-bottom: 1px solid ${colors.border};
	flex-shrink: 0;
	${(p) => (p.$hidden ? 'display: none;' : '')}
`;

export const TabContent = styled.div`
	display: flex;
	overflow: hidden;
	flex: 1;
`;

export const PlaceholderText = styled.p`
	margin: auto;
	color: ${gray[400]};
	font-size: 12px;
`;
