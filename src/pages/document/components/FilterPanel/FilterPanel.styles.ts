import styled from 'styled-components';
import { colors, gray, radii } from '@/styles/theme';

export const PanelBody = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
	padding: 8px;
`;

export const OptionRow = styled.label`
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 6px 8px;
	border-radius: ${radii.lg};
	font-size: 13px;
	color: ${gray[700]};
	cursor: pointer;

	&:hover {
		background-color: ${gray[50]};
	}
`;

export const ClearRow = styled.div`
	border-top: 1px solid ${colors.border};
	padding-top: 6px;
	margin-top: 2px;
`;

export const ClearBtn = styled.button`
	width: 100%;
	padding: 6px 8px;
	border: none;
	background: none;
	border-radius: ${radii.lg};
	font-size: 12px;
	color: ${gray[500]};
	cursor: pointer;
	text-align: right;

	&:hover {
		color: ${colors.primary};
	}
`;
