import styled from 'styled-components';
import { colors, gray, radii } from '@/styles/theme';

// The heading row that used to live here now belongs to SectionBlock /
// SubSectionBlock. main's header row differs per level (border, index format,
// title typography) and carries the node's action cluster, so it is the parent
// block's markup, not the body's — and the block is what knows the node's
// position, which is what the index shows.
export const BodyRoot = styled.div`
	display: flex;
	flex-direction: column;
	gap: 6px;
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
