import styled from 'styled-components';
import { colors, gray } from '@/styles/theme';

export const SidebarRoot = styled.div`
	padding: 0 24px;
	display: flex;
	flex-direction: column;
	height: 100%;
`;

export const AvatarWrap = styled.div`
	display: flex;
	justify-content: center;
	margin-bottom: 16px;
`;

export const AvatarCircle = styled.div`
	width: 96px;
	height: 96px;
	border-radius: 9999px;
	background-color: ${colors.primary};
	display: flex;
	align-items: center;
	justify-content: center;
	color: ${colors.surface};
`;

export const UserInfo = styled.div`
	text-align: center;
	margin-bottom: 24px;
`;

export const UserName = styled.h3`
	font-weight: 700;
	font-size: 18px;
	color: ${gray[900]};
	margin: 0 0 8px 0;
`;

export const UserMeta = styled.p<{ $noMargin?: boolean }>`
	font-size: 14px;
	color: ${gray[600]};
	margin: ${(p) => (p.$noMargin ? '0' : '0 0 4px 0')};
`;

export const Section = styled.div<{ $mt?: boolean; $scroll?: boolean }>`
	border-top: 1px solid ${gray[200]};
	padding-top: 16px;
	${(p) => p.$mt && 'margin-top: 16px;'}
	${(p) =>
		p.$scroll &&
		`
		display: flex;
		flex-direction: column;
		flex: 1;
		min-height: 140px;
		overflow: hidden;
	`}
`;

export const SectionTitle = styled.h4`
	font-size: 12px;
	font-weight: 500;
	color: ${gray[500]};
	margin: 0 0 12px 0;
	text-align: right;
	flex-shrink: 0;
`;

export const ScrollList = styled.div`
	flex: 1;
	min-height: 80px;
	overflow-y: auto;
	& > * + * {
		margin-top: 8px;
	}
	padding-right: 4px;
`;

export const EntryRow = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	text-align: right;
`;

export const ListEntryIcon = styled.div`
	color: ${colors.primary};
	display: flex;
	align-items: center;
`;

export const ListEntryText = styled.span`
	font-size: 14px;
	color: ${gray[700]};
	text-align: center;
	line-height: 20px;
`;

export const EnvRow = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
`;

export const EnvIcon = styled.div`
	width: 32px;
	height: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	color: ${colors.primary};
`;

export const EnvText = styled.div`
	flex: 1;
	text-align: right;
	min-width: 0;
`;

export const EnvTitle = styled.p`
	font-size: 12px;
	font-weight: 600;
	color: ${gray[900]};
	margin: 0;
`;

export const EnvSub = styled.p`
	font-size: 11px;
	color: ${gray[400]};
	margin: 2px 0 0 0;
`;
