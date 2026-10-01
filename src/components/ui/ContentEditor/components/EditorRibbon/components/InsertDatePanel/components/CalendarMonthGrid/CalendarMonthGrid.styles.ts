import styled from 'styled-components';
import { flexBetween, resetButton } from '@/styles/mixins';
import { colors, gray, radii, transitions } from '@/styles/theme';

export const MonthHeader = styled.div`
  ${flexBetween}
  padding: 16px 16px 8px;
`;

export const MonthLabel = styled.span`
  font-size: 14px;
  font-weight: 700;
  user-select: none;
  color: ${gray[900]};
`;

export const MonthNavButton = styled.button`
  ${resetButton}
  display: flex;
  padding: 6px;
  border-radius: ${radii.full};
  color: ${gray[500]};
  transition: background ${transitions.normal};

  &:hover {
    background: ${gray[100]};
  }
`;

export const WeekHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding: 0 12px;
  margin-bottom: 4px;
`;

export const WeekDay = styled.span`
  padding: 4px 0;
  text-align: center;
  font-size: 12px;
  user-select: none;
  color: ${gray[400]};
`;

export const DayGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  row-gap: 2px;
  padding: 0 12px 8px;
`;

export const DayCell = styled.button<{ $selected: boolean; $today: boolean }>`
  ${resetButton}
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  margin: 0 auto;
  font-size: 14px;
  border-radius: ${radii.full};
  transition: background ${transitions.normal};

  border: ${({ $selected, $today }) =>
    $selected || $today ? `2px solid ${colors.primary}` : '2px solid transparent'};
  font-weight: ${({ $selected, $today }) => ($selected ? 700 : $today ? 600 : 400)};
  color: ${({ $selected, $today }) => ($selected || $today ? colors.primary : gray[800])};

  &:hover {
    background: ${({ $selected }) => ($selected ? 'transparent' : gray[100])};
  }
`;

export const EmptyCell = styled.span``;
