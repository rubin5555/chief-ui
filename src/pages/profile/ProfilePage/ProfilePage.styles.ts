import styled from 'styled-components';
import { colors } from '@/styles/theme';

export const PageScroll = styled.div`
	display: flex;
	flex: 1;
	overflow: auto;
	padding: 24px 32px;
`;

export const PageInner = styled.div`
	display: flex;
	gap: 24px;
	width: 100%;
	max-width: 1280px;
	margin: 0 auto;
`;

export const SidebarColumn = styled.div`
	width: 320px;
	flex-shrink: 0;
	position: relative;
`;

export const SidebarDivider = styled.div`
	position: absolute;
	left: 0;
	top: 16px;
	bottom: 16px;
	width: 1px;
	background-color: ${colors.border};
`;

export const BrandSpan = styled.span`
	color: ${colors.primary};
`;
