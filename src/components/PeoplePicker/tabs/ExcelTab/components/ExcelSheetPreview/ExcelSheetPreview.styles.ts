import styled from 'styled-components';
import { colors, excelColors, radii, shadows } from '@/styles/theme';
import { SHEET_WIDTH } from '../../ExcelTab.constants';

const GUTTER_WIDTH = 32;
const CELL_PADDING = '4px 8px';

export const PreviewArea = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 0 24px;
`;

export const PreviewCaption = styled.span`
	width: ${SHEET_WIDTH}px;
	margin-bottom: 6px;
	font-size: 12px;
	font-weight: 500;
	color: ${excelColors.gutterInk};
	text-align: right;
`;

export const SheetFrame = styled.div`
	width: ${SHEET_WIDTH}px;
	direction: ltr;
	font-size: 12px;
	user-select: none;
	border: 1px solid ${excelColors.gridLine};
	border-radius: ${radii.xl};
	box-shadow: ${shadows.sm};
	overflow: hidden;
`;

export const SheetRow = styled.div<{ $zebra?: boolean }>`
	display: flex;
	background: ${(p) => (p.$zebra ? excelColors.zebraBg : colors.surface)};
`;

const cellBorders = (isLast: boolean) => `
	border-bottom: 1px solid ${excelColors.gridLine};
	${isLast ? '' : `border-right: 1px solid ${excelColors.gridLine};`}
`;

export const GutterCell = styled.div`
	width: ${GUTTER_WIDTH}px;
	flex-shrink: 0;
	padding: 4px 0;
	text-align: center;
	font-size: 10px;
	color: ${excelColors.gutterInk};
	background: ${excelColors.chromeBg};
	${cellBorders(false)}
`;

export const ColumnHeaderCell = styled.div<{ $isTarget: boolean; $isLast: boolean }>`
	flex: 1;
	padding: ${CELL_PADDING};
	text-align: center;
	font-weight: 600;
	background: ${(p) => (p.$isTarget ? colors.primary : excelColors.chromeBg)};
	color: ${(p) => (p.$isTarget ? colors.surface : excelColors.headerInk)};
	${(p) => cellBorders(p.$isLast)}
`;

export const DataCell = styled.div<{ $isActive?: boolean; $isLast?: boolean }>`
	flex: 1;
	min-width: 0;
	padding: ${CELL_PADDING};
	text-align: right;
	color: ${excelColors.cellInk};
	${(p) => cellBorders(p.$isLast ?? false)}
	${(p) =>
    p.$isActive
      ? `
	background: ${excelColors.activeCellBg};
	outline: 2px solid ${colors.primary};
	outline-offset: -2px;
	`
      : ''}
`;
