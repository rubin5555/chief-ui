import styled from 'styled-components';
import { gray } from '@/styles/theme';

export const SplitBody = styled.div`
	display: flex;
	flex: 1;
	overflow: hidden;
`;

export const BackNav = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
`;

export const BackButton = styled.button`
	display: flex;
	align-items: center;
	gap: 6px;
	font-size: 14px;
	color: ${gray[500]};
	transition: color 0.15s;

	&:hover {
		color: ${gray[800]};
	}
`;

export const BackDivider = styled.span`
	color: ${gray[300]};
`;

export const OpenDocName = styled.span`
	font-size: 14px;
	font-weight: 600;
	color: ${gray[800]};
`;

export const OpenDocMeta = styled.span`
	font-size: 12px;
	color: ${gray[400]};
`;
