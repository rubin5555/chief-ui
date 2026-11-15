import styled, { css, keyframes } from 'styled-components';
import { flexCenter, flexFill, flexGap } from '@/styles/mixins';
import { colors, gray, radii, transitions } from '@/styles/theme';

const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)';

const settleRing = keyframes`
  from {
    box-shadow: 0 0 0 2px ${colors.primary};
    transform: scale(0.99);
  }
  to {
    box-shadow: 0 0 0 2px transparent;
    transform: scale(1);
  }
`;

export interface DragStateProps {
  $isDragging?: boolean;
  $isDragOver?: boolean;
  $isSettling?: boolean;
}

/* The look every draggable node in the tree shares: it thins out while it is
   being carried, and flashes a ring where it lands. */
export const dragMotion = css<DragStateProps>`
  transition:
    border-color ${transitions.fast},
    opacity ${transitions.fast},
    transform 160ms ${EASE_OUT};

  ${({ $isDragging }) =>
    $isDragging &&
    css`
      opacity: 0.45;
      transform: scale(0.985);
    `}

  ${({ $isSettling }) =>
    $isSettling &&
    css`
      animation: ${settleRing} 420ms ease-out;
    `}

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    animation: none;
    transform: none;
  }
`;

/* Wraps a node so the level below it can be dropped in — a section onto a
   topic, a sub-section onto a section. */
export const AdoptZone = styled.div<{ $active: boolean; $radius: string }>`
  border-radius: ${({ $radius }) => $radius};
  transition: background ${transitions.fast};

  ${({ $active }) =>
    $active &&
    css`
      background: ${colors.primaryLight};
      box-shadow: inset 0 0 0 2px ${colors.primary};
    `}
`;

export const TitleInput = styled.input`
  ${flexFill}
  background: transparent;
  border: none;
  font-size: 12px;
  color: ${gray[800]};
  text-align: right;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${gray[400]};
  }
`;

export const DragHandle = styled.span`
  ${flexCenter}
  flex-shrink: 0;
  color: ${gray[300]};
  cursor: grab;
  transition: color ${transitions.fast};

  &:hover {
    color: ${gray[500]};
  }

  &:active {
    cursor: grabbing;
  }
`;

export const SmallIconBtn = styled.button<{ $active?: boolean; $muted?: boolean }>`
  ${flexCenter}
  flex-shrink: 0;
  padding: 2px;
  border: none;
  background: ${({ $active }) => ($active ? colors.primaryLight : 'transparent')};
  color: ${({ $active, $muted }) => ($active || !$muted ? colors.primary : gray[300])};
  border-radius: 4px;
  cursor: pointer;
  transition: color ${transitions.fast};
  &:hover {
    color: ${colors.primary};
    background: ${colors.primaryLight};
  }
`;

export const AddNodeButton = styled.button`
  ${flexGap(6)}
  width: 100%;
  padding: 8px 12px;
  background: ${colors.surface};
  border: 1px dashed ${colors.primary};
  color: ${colors.primary};
  border-radius: ${radii.xl};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background ${transitions.fast};
  &:hover {
    background: ${colors.primaryLight};
  }
`;

/* Also the drop target standing for the end of the list it closes, which is why
   it carries the line above itself rather than a colour of its own. */
export const AddChildLink = styled.button<{ $dropActive?: boolean }>`
  ${flexGap(4)}
  position: relative;
  background: none;
  border: none;
  padding: 4px 0;
  color: ${({ $dropActive }) => ($dropActive ? colors.primary : gray[400])};
  font-size: 11px;
  cursor: pointer;
  transition: color ${transitions.fast};

  &::before {
    content: '';
    position: absolute;
    inset-inline: 0;
    top: 0;
    height: 2px;
    border-radius: ${radii.full};
    background: ${colors.primary};
    opacity: ${({ $dropActive }) => ($dropActive ? 1 : 0)};
    transition: opacity ${transitions.fast};
    pointer-events: none;
  }

  &:hover {
    color: ${colors.primary};
  }
`;

export const NodeIndex = styled.span`
  font-size: 10px;
  font-weight: 700;
  color: ${colors.primary};
  flex-shrink: 0;
`;
