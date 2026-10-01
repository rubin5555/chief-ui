import styled, { css, keyframes } from 'styled-components';
import { ellipsis, flexCenter, resetButton, rtlTextInput } from '@/styles/mixins';
import { colors, docColors, gray, radii, transitions } from '@/styles/theme';
import type { DropEdge } from './DocumentOutlineTree.types';

const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)';

const dropLineIn = keyframes`
  from {
    opacity: 0;
    transform: scaleX(0.4);
  }
  to {
    opacity: 1;
    transform: scaleX(1);
  }
`;

const settleIn = keyframes`
  from {
    background-color: ${colors.primaryLight};
    transform: scale(0.99);
  }
  to {
    background-color: transparent;
    transform: scale(1);
  }
`;

const adoptIn = keyframes`
  from {
    box-shadow: 0 0 0 0 ${colors.primary};
  }
  to {
    box-shadow: 0 0 0 2px ${colors.primary};
  }
`;

export interface DropZoneProps {
  $edge: DropEdge;
  $dragging: boolean;
  $settling: boolean;
  $radius: number;
}

export const DropZone = styled.div<DropZoneProps>`
  position: relative;
  border-radius: ${(props) => props.$radius}px;
  transition:
    opacity 160ms ${EASE_OUT},
    transform 160ms ${EASE_OUT};

  /* The row itself steps aside to open the gap, while the zone keeps its box —
     moving the drop target under the cursor makes the two rows fight. */
  > * {
    transition: transform 160ms ${EASE_OUT};
  }

  &::after {
    content: '';
    position: absolute;
    inset-inline: 4px;
    height: 2px;
    border-radius: ${radii.full};
    background-color: ${colors.primary};
    opacity: 0;
    pointer-events: none;
  }

  ${(props) =>
    props.$dragging &&
    css`
      opacity: 0.45;
      transform: scale(0.985);
    `}

  ${(props) =>
    props.$edge &&
    css`
      > * {
        transform: translateY(${props.$edge === 'top' ? 2 : -2}px);
      }

      &::after {
        opacity: 1;
        ${props.$edge === 'top' ? 'top: -1px;' : 'bottom: -1px;'}
        animation: ${dropLineIn} 140ms ${EASE_OUT};
      }
    `}

  ${(props) =>
    props.$settling &&
    css`
      animation: ${settleIn} 420ms ease-out;
    `}

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    animation: none;

    > * {
      transition: none;
      transform: none;
    }

    &::after {
      animation: none;
    }
  }
`;

/* Sits between a row and its drop zone so the level below can be dropped into
   it — a section onto a topic, a sub-section onto a section. */
export const AdoptZone = styled.div<{ $active: boolean; $radius: number }>`
  border-radius: ${(props) => props.$radius}px;

  ${(props) =>
    props.$active &&
    css`
      background-color: ${colors.primaryLight};
      box-shadow: 0 0 0 2px ${colors.primary};
      animation: ${adoptIn} 140ms ${EASE_OUT};

      @media (prefers-reduced-motion: reduce) {
        animation: none;
      }
    `}
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
