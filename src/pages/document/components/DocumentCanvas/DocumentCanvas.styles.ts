import styled from 'styled-components';
import { colors, gray, radii, shadows } from '@/styles/theme';

export const PageInner = styled.div`
	display: flex;
	gap: 24px;
	width: 100%;
	max-width: 1280px;
	margin: 0 auto;
	align-items: flex-start;
`;

export const SidebarColumn = styled.div`
	width: 280px;
	flex-shrink: 0;
	position: sticky;
	top: 0;
	padding: 16px 12px;
	border-radius: ${radii.xl};
	background-color: ${colors.surface};
	border: 1px solid ${colors.border};
`;

export const CanvasColumn = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

export const ToolbarRow = styled.div`
	display: flex;
	align-items: flex-start;
	gap: 8px;
`;

export const SidebarActionsRow = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
	margin-top: 12px;
	padding-top: 12px;
	border-top: 1px solid ${colors.border};
`;

export const SidebarActionBtn = styled.button`
	padding: 6px 10px;
	border: none;
	background: none;
	border-radius: ${radii.lg};
	font-size: 12px;
	color: ${gray[600]};
	text-align: right;
	cursor: pointer;

	&:hover {
		background-color: ${gray[50]};
	}
`;

// A4 pagination (Phase 7 hotspot): CSS page-break hints rather than main's
// imperative two-pass DOM-measurement hack. This is a declarative, correct
// solution for the thing pagination actually needs to guarantee — a subject
// section never gets sliced across a printed/exported page boundary — but
// it does not reproduce main's on-screen "paper page" visual (page-break
// lines behind a continuously-scrolling canvas). That purely cosmetic piece
// would need the same fragile imperative measurement main used and is a
// deliberate, stated follow-up, not silently dropped.
export const SubjectSection = styled.div`
	display: flex;
	flex-direction: column;
	gap: 10px;
	padding: 20px 24px;
	border-radius: ${radii.xl};
	background-color: ${colors.surface};
	border: 1px solid ${colors.border};
	box-shadow: ${shadows.sm};

	@media print {
		break-inside: avoid;
		box-shadow: none;
		border: none;
	}
`;

export const SubjectHeading = styled.h2`
	margin: 0;
	font-size: 16px;
	font-weight: 700;
	color: ${gray[900]};
`;
