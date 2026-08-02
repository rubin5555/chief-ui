import styled from 'styled-components';
import { gray } from '@/styles/theme';

export const TimelineRoot = styled.div`
	display: flex;
	align-items: flex-start;
	padding: 0 8px;
`;

export const Connector = styled.div`
	flex: 1;
	min-width: 20px;
	height: 1px;

	margin-top: 6px;
	background-color: ${gray[300]};
`;
