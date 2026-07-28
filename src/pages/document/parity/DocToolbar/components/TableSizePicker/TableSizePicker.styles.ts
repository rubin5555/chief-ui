import styled from 'styled-components';
import { flexCenter, resetButton } from '@/styles/mixins';
import { docColors, gray, radii, transitions } from '@/styles/theme';
import { CELL_SIZE, GRID_GAP, GRID_SIDE } from './TableSizePicker.constants';

export const TableTrigger = styled.button<{ $active: boolean }>`
  ${resetButton}
  ${flexCenter}
  gap: 2px;
  height: 26px;
  padding: 0 3px;
  flex-shrink: 0;
  border-radius: ${radii.sm};
  transition: background ${transitions.normal}, color ${transitions.normal};
  color: ${({ $active }) => ($active ? gray[900] : gray[600])};
  background: ${({ $active }) => ($active ? gray[200] : 'transparent')};

  &:hover {
    background: ${({ $active }) => ($active ? gray[200] : gray[100])};
  }
`;

export const PickerBody = styled.div`
  padding: 8px;
`;

export const SizeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${GRID_SIDE}, ${CELL_SIZE}px);
  gap: ${GRID_GAP}px;
  margin-bottom: 6px;
`;

export const SizeCell = styled.button<{ $lit: boolean }>`
  ${resetButton}
  width: ${CELL_SIZE}px;
  height: ${CELL_SIZE}px;
  border-radius: 3px;
  transition: background ${transitions.fast}, border-color ${transitions.fast};
  background: ${({ $lit }) => ($lit ? docColors.selectionBg : gray[100])};
  border: 1px solid ${({ $lit }) => ($lit ? docColors.selectionBorder : gray[200])};
`;

export const SizeLabel = styled.p`
  text-align: center;
  font-size: 11px;
  font-weight: 500;
  color: ${gray[500]};
`;
