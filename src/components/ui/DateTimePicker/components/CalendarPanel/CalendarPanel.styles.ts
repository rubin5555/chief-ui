import styled from 'styled-components';
import { flexBetween, flexCenter } from '@/styles/mixins';
import { colors, gray, radii, shadows, transitions } from '@/styles/theme';

export const Dropdown = styled.div`
	position: fixed;
	width: 280px;
	background: ${colors.surface};
	border-radius: ${radii.xl};
	border: 1px solid ${gray[100]};
	box-shadow: ${shadows.xl};
	padding: 12px;
	z-index: 99999;
	direction: rtl;
`;

export const MonthNavRow = styled.div`
	${flexBetween}
	margin-bottom: 10px;
`;

export const MonthNavBtn = styled.button`
	${flexCenter}
	width: 26px;
	height: 26px;
	border: none;
	border-radius: ${radii.lg};
	background: transparent;
	color: ${gray[500]};
	cursor: pointer;
	transition: background ${transitions.fast};
	&:hover {
		background: ${gray[100]};
		color: ${gray[800]};
	}
`;

export const MonthLabel = styled.span`
	font-size: 13px;
	font-weight: 600;
	color: ${gray[800]};
`;

export const WeekdayRow = styled.div`
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	margin-bottom: 2px;
`;

export const WeekdayLabel = styled.span`
	${flexCenter}
	height: 24px;
	font-size: 11px;
	font-weight: 500;
	color: ${gray[400]};
`;

export const DayGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	gap: 2px;
	margin-bottom: 10px;
`;

export const DayBtn = styled.button<{
  $inMonth: boolean;
  $isToday: boolean;
  $isSelected: boolean;
}>`
	${flexCenter}
	height: 28px;
	border: none;
	border-radius: ${radii.lg};
	font-size: 12px;
	cursor: pointer;
	transition: background ${transitions.fast};
	background: ${({ $isSelected }) => ($isSelected ? colors.primary : 'transparent')};
	color: ${({ $isSelected, $inMonth }) =>
    $isSelected ? colors.surface : $inMonth ? gray[700] : gray[300]};
	font-weight: ${({ $isSelected, $isToday }) => ($isSelected || $isToday ? 600 : 400)};
	box-shadow: ${({ $isToday, $isSelected }) =>
    $isToday && !$isSelected ? `inset 0 0 0 1px ${colors.primary}` : 'none'};

	&:hover {
		background: ${({ $isSelected }) => ($isSelected ? colors.primary : gray[100])};
	}
`;

export const TimeRow = styled.div`
	${flexCenter}
	gap: 6px;
	padding: 8px 0;
	border-top: 1px solid ${gray[100]};
`;

export const TimeInput = styled.input`
	width: 36px;
	padding: 4px 0;
	border: 1px solid ${gray[200]};
	border-radius: ${radii.lg};
	font-size: 13px;
	font-variant-numeric: tabular-nums;
	text-align: center;
	direction: ltr;
	background: ${colors.surface};
	color: ${gray[800]};
	transition: border-color ${transitions.normal};

	&:focus {
		outline: none;
		border-color: ${colors.primary};
	}
`;

export const TimeColon = styled.span`
	font-size: 13px;
	font-weight: 600;
	color: ${gray[400]};
`;

export const PanelFooter = styled.div`
	${flexBetween}
	gap: 4px;
	padding-top: 8px;
	border-top: 1px solid ${gray[100]};
`;

const FooterBtn = styled.button`
	padding: 6px 10px;
	border: none;
	border-radius: ${radii.lg};
	font-size: 12px;
	font-weight: 500;
	cursor: pointer;
	transition: background ${transitions.fast};
`;

export const ClearBtn = styled(FooterBtn)`
	background: transparent;
	color: ${gray[400]};
	&:hover {
		background: ${gray[100]};
		color: ${gray[700]};
	}
`;

export const NowBtn = styled(FooterBtn)`
	background: transparent;
	color: ${colors.primary};
	&:hover {
		background: ${colors.primaryLight};
	}
`;

export const ApplyBtn = styled(FooterBtn)`
	background: ${colors.primary};
	color: ${colors.surface};
	&:hover {
		opacity: 0.9;
	}
`;
