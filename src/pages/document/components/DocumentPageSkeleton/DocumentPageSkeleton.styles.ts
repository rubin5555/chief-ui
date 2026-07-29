import styled from 'styled-components';
import { flexColumn, flexGap } from '@/styles/mixins';
import { colors, docColors, radii } from '@/styles/theme';
import {
  PAPER_MIN_HEIGHT,
  PAPER_PADDING,
  PAPER_SHADOW,
  PAPER_WIDTH,
  SIDEBAR_WIDTH,
} from '../../document.measurements';

// Deliberately restated from `document.measurements` rather than borrowed from
// PaperCanvas/DocumentSidebar: those own behaviour this has none of — zoom, page
// breaks, sticky positioning, scroll. What has to match is the geometry, and the
// geometry is the constants, which both read from.

export const SidebarColumn = styled.div`
	${flexColumn(0)}
	width: ${SIDEBAR_WIDTH}px;
	flex-shrink: 0;
	padding: 20px 16px;
	position: relative;

	/* The sidebar's own divider, on the physical left because that is the side
	   facing the paper in this RTL page. */
	&::before {
		content: '';
		position: absolute;
		left: 0;
		top: 24px;
		bottom: 24px;
		width: 1px;
		background: ${colors.border};
	}
`;

export const StatusBlock = styled.div`
	${flexColumn(10)}
	margin-bottom: 16px;
`;

export const ProgressRow = styled.div`
	${flexColumn(6)}
`;

export const SidebarDivider = styled.div`
	height: 1px;
	margin-bottom: 16px;
	background: ${docColors.rowDivider};
`;

export const TreeRows = styled.div`
	${flexColumn(10)}
	margin-top: 16px;
`;

export const TreeRow = styled.div<{ $indented?: boolean }>`
	${flexGap(8)}
	padding-right: ${({ $indented }) => ($indented ? 22 : 0)}px;
`;

export const EditorColumn = styled.div`
	flex: 1;
	min-width: 0;
	overflow: hidden;
`;

export const Centered = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 24px;
`;

export const PaperSheet = styled.div`
	width: ${PAPER_WIDTH};
	min-height: ${PAPER_MIN_HEIGHT};
	padding: ${PAPER_PADDING};
	background: ${colors.surface};
	box-shadow: ${PAPER_SHADOW};
	direction: rtl;
`;

/** main's letterhead: a square crest over its five identifying fields. */
export const Letterhead = styled.div`
	${flexColumn(10)}
	align-items: center;
	padding-bottom: 20px;
	margin-bottom: 24px;
	border-bottom: 1px solid ${docColors.rowDivider};
`;

export const Crest = styled.div`
	width: 130px;
	height: 130px;
	border-radius: ${radii.lg};
	background: ${docColors.letterheadBg};
`;

export const LetterheadFields = styled.div`
	${flexColumn(8)}
	align-items: center;
`;

export const SubjectBlock = styled.div`
	${flexColumn(10)}
	margin-bottom: 24px;
`;

export const SectionBlock = styled.div`
	${flexColumn(8)}
	padding-right: 16px;
`;

export const HeadingRow = styled.div`
	${flexGap(8)}
`;
