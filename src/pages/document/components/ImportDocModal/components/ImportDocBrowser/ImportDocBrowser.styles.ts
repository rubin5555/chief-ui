import styled from 'styled-components';
import { flexCenter } from '@/styles/mixins';
import { colors, gray, radii, shadows } from '@/styles/theme';

export const BrowserRoot = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
	overflow: hidden;
`;

export const TabsRow = styled.div`
	flex-shrink: 0;
	padding: 8px 24px 0;
	border-bottom: 1px solid ${gray[100]};
`;

export const SearchRow = styled.div`
	display: flex;
	flex-shrink: 0;
	padding: 12px 24px;
	border-bottom: 1px solid ${gray[100]};
`;

export const TableWrap = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
	overflow: hidden;
	padding: 16px 24px;
`;

export const TableCard = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
	overflow: hidden;
	border-radius: ${radii['2xl']};
	background: ${colors.surface};
	box-shadow: ${shadows.card};
`;

export const HeadCell = styled.span<{ $center?: boolean }>`
	display: block;
	text-align: ${({ $center }) => ($center ? 'center' : 'right')};
`;

export const NameCell = styled.span`
	font-size: 14px;
	font-weight: 500;
	color: ${gray[800]};
	text-align: right;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

export const MetaCell = styled.span`
	font-size: 12px;
	color: ${gray[500]};
	text-align: center;
`;

export const StatusCell = styled.span`
	display: flex;
	align-items: center;
	gap: 6px;
	font-size: 14px;
	color: ${gray[700]};
`;

export const StatusDot = styled.span<{ $color: string }>`
	flex-shrink: 0;
	width: 8px;
	height: 8px;
	border-radius: ${radii.full};
	background: ${({ $color }) => $color};
`;

export const NoDocs = styled.div`
	${flexCenter}
	flex-direction: column;
	gap: 8px;
	height: 128px;
	font-size: 14px;
	color: ${gray[400]};
`;

export const NoDocsIcon = styled.span`
	display: flex;
	opacity: 0.4;
`;
