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

// Footnotes moved to components/FootnoteList, which renders them as main does:
// editable rows under a short rule, marked with superscripts rather than as an
// ordered list's own numbering.
//
// The attachment chips moved to AttachmentPicker/components/AttachmentChipList,
// where they sit next to the dialog they open. They were grey pills here; main's
// are navy text links, one per line (Edit.tsx:4586).
