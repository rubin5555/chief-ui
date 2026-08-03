import styled from 'styled-components';
import { resetButton } from '@/styles/mixins';
import { colors, gray, radii } from '@/styles/theme';
import {
  MENU_PADDING_X,
  SWATCH_COLUMNS,
  SWATCH_GAP,
  SWATCH_SIZE,
} from './ColorPaletteMenu.constants';

export const MenuBody = styled.div`
  padding: 10px ${MENU_PADDING_X}px;
  direction: rtl;
`;

export const MenuTitle = styled.p`
  margin-bottom: 8px;
  font-size: 10px;
  font-weight: 600;
  color: ${gray[400]};
`;

// Tracks the exact width of a swatch, not `1fr`: a fractional track that came
// out narrower than the swatch left every one of them spilling over its
// neighbour and the last column outside the panel.
export const SwatchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${SWATCH_COLUMNS}, ${SWATCH_SIZE}px);
  gap: ${SWATCH_GAP}px;
`;

export const Swatch = styled.button<{ $color: string; $selected: boolean }>`
  ${resetButton}
  width: ${SWATCH_SIZE}px;
  height: ${SWATCH_SIZE}px;
  border-radius: ${radii.md};
  background: ${({ $color }) => $color};
  border: ${({ $selected }) =>
    $selected ? `2px solid ${colors.primary}` : `1px solid ${gray[200]}`};

  &:hover {
    border-color: ${({ $selected }) => ($selected ? colors.primary : gray[400])};
  }
`;
