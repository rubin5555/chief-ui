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

export const SubjectSection = styled.div`
	display: flex;
	flex-direction: column;
	gap: 10px;
	padding: 20px 24px;
	border-radius: ${radii.xl};
	background-color: ${colors.surface};
	border: 1px solid ${colors.border};
	box-shadow: ${shadows.sm};
`;

export const SubjectHeading = styled.h2`
	margin: 0;
	font-size: 16px;
	font-weight: 700;
	color: ${gray[900]};
`;
