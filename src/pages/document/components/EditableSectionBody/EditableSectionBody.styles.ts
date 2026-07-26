import styled from 'styled-components';
import { colors, gray, radii } from '@/styles/theme';
import type { SectionStatus } from '../../types';

export const SectionBlock = styled.div<{ $depth: 'section' | 'subSection' }>`
	display: flex;
	flex-direction: column;
	gap: 6px;
	padding-right: ${(props) => (props.$depth === 'subSection' ? '24px' : '0')};
	margin-bottom: 12px;
`;

export const HeadingRow = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
`;

export const HeadingIndex = styled.span<{ $muted?: boolean }>`
	flex-shrink: 0;
	font-weight: 600;
	font-size: ${(props) => (props.$muted ? '13px' : '14px')};
	color: ${(props) => (props.$muted ? gray[500] : colors.primary)};
`;

export const HeadingTitle = styled.h3<{ $muted?: boolean }>`
	flex: 1;
	margin: 0;
	font-size: ${(props) => (props.$muted ? '14px' : '16px')};
	font-weight: ${(props) => (props.$muted ? 500 : 600)};
	color: ${gray[900]};
`;

const STATUS_COLOR: Record<SectionStatus, string> = {
  editing: colors.primary,
  pending: colors.warning,
  approved: colors.accent,
  fix: colors.danger,
  idle: gray[400],
};

export const StatusBadge = styled.span<{ $status: SectionStatus }>`
	flex-shrink: 0;
	width: 8px;
	height: 8px;
	border-radius: ${radii.full};
	background-color: ${(props) => STATUS_COLOR[props.$status]};
`;

export const HiddenNotice = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 10px 12px;
	border-radius: ${radii.lg};
	background-color: ${gray[50]};
	color: ${gray[400]};
	font-size: 13px;
	font-style: italic;
`;

export const ClassifiedBox = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 10px 12px;
	border-radius: ${radii.lg};
	background-color: ${colors.dangerLight};
	color: ${colors.danger};
	font-size: 13px;
	font-weight: 500;
`;

export const FootnoteList = styled.ol`
	margin: 4px 0 0;
	padding-inline-start: 18px;
	font-size: 12px;
	color: ${gray[600]};
`;

export const AttachmentChips = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 6px;
	margin-top: 4px;
`;

export const AttachmentChip = styled.span`
	padding: 3px 10px;
	border-radius: ${radii.full};
	background-color: ${gray[100]};
	color: ${gray[700]};
	font-size: 12px;
`;
