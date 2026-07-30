import styled from 'styled-components';
import { ellipsis, flexCenter, resetButton, rtlTextInput } from '@/styles/mixins';
import { colors, docColors, gray, radii, transitions } from '@/styles/theme';
import type { DropEdge } from './DocumentOutlineTree.types';

export const DropZone = styled.div<{ $edge: DropEdge; $dragging: boolean; $radius: number }>`
  border-top: 2px solid
    ${(props) => (props.$edge === 'top' ? colors.primary : 'transparent')};
  border-bottom: 2px solid
    ${(props) => (props.$edge === 'bottom' ? colors.primary : 'transparent')};
  border-radius: ${(props) => props.$radius}px;
  opacity: ${(props) => (props.$dragging ? 0.4 : 1)};
  transition: border-color 0.12s;
`;

export const DragHandle = styled.span`
  display: flex;
  flex-shrink: 0;
  color: ${gray[300]};
  opacity: 0;
  transition: opacity ${transitions.normal};
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

export const RowMenuBtn = styled.button`
  ${resetButton}
  ${flexCenter}
  flex-shrink: 0;
  padding: 4px;
  border-radius: ${radii.full};
  color: ${colors.primary};
  transition: background-color ${transitions.normal};

  &:hover {
    background-color: ${docColors.iconHover};
  }
`;

export const InlineRenameInput = styled.input`
  ${rtlTextInput}
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  border-bottom: 1px solid ${colors.primary};
  border-radius: 0;
  padding: 0;
  outline: none;
`;

export const RowIndex = styled.span<{ $width: number }>`
  flex-shrink: 0;
  width: ${(props) => props.$width}px;
  text-align: right;
`;

export const RowTitle = styled.span`
  flex: 1;
  ${ellipsis}
`;

export const StatusDot = styled.span<{ $color: string }>`
  flex-shrink: 0;
  width: 7px;
  height: 7px;
  border-radius: ${radii.full};
  background-color: ${(props) => props.$color};
`;
