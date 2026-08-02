import styled from 'styled-components';
import { flexCenter } from '@/styles/mixins';
import { gray } from '@/styles/theme';
import { LOGO_COLUMN_WIDTH, MESSAGE_MIN_HEIGHT, MESSAGE_PADDING } from './distributeDoc.constants';

export const MessageRow = styled.div`
	display: flex;
	flex: 1;
	min-height: ${MESSAGE_MIN_HEIGHT}px;
	overflow: hidden;
`;

export const LogoColumn = styled.div`
	${flexCenter}
	flex-shrink: 0;
	width: ${LOGO_COLUMN_WIDTH}px;
	padding: ${MESSAGE_PADDING}px 20px;
`;

export const Logo = styled.img`
	width: 72px;
	height: 72px;
	object-fit: contain;
`;

export const Divider = styled.div`
	flex-shrink: 0;
	width: 1px;
	align-self: stretch;
	background-color: ${gray[200]};
`;

export const MessageColumn = styled.div`
	flex: 1;
	min-width: 0;
	padding: ${MESSAGE_PADDING}px 20px;
`;
