import styled from 'styled-components';
import { colors, gray, radii, shadows } from '@/styles/theme';

export const ItemListCard = styled.div`
	background-color: ${colors.surface};
	border: 1px solid ${gray[100]};
	box-shadow: ${shadows.sm};
	border-radius: ${radii['2xl']};
	overflow: hidden;
`;

export const ItemListScroll = styled.div`
	max-height: 384px;
	overflow-y: auto;
	& > * + * {
		border-top: 1px solid ${gray[200]};
	}
`;

export const ItemListEmptyLabel = styled.div`
	padding: 40px 0;
	text-align: center;
	font-size: 14px;
	color: ${gray[400]};
`;
