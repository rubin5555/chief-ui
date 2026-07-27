import styled from 'styled-components';
import { ellipsis, flexCenter, resetButton, rtlTextInput } from '@/styles/mixins';
import { colors, docColors, gray, radii, transitions } from '@/styles/theme';
import type { DropEdge } from './DocumentOutlineTree.types';

// The primitives all three outline levels share. Each level's own row — its
// padding, type scale and indent — lives in that level's `.styles.ts`, because
// those are exactly what distinguishes a topic from a sub-section.

/**
 * Wraps a draggable row and shows where a drop would land: a 2px navy rule on the
 * edge the dragged node would come to rest against, and 40% opacity on the node
 * being dragged.
 *
 * The border is always there, just transparent when idle — a border that appears
 * would shift the row by 2px as you drag over it.
 */
export const DropZone = styled.div<{ $edge: DropEdge; $dragging: boolean; $radius: number }>`
  border-top: 2px solid
    ${(props) => (props.$edge === 'top' ? colors.primary : 'transparent')};
  border-bottom: 2px solid
    ${(props) => (props.$edge === 'bottom' ? colors.primary : 'transparent')};
  border-radius: ${(props) => props.$radius}px;
  opacity: ${(props) => (props.$dragging ? 0.4 : 1)};
  transition: border-color 0.12s;
`;

/**
 * The grip that starts a drag. Hidden until the row is hovered — six dots on every
 * row at rest would read as decoration, and there are up to three levels of them.
 *
 * Each level's row style is what reveals it (`&:hover ${DragHandle}`), so this
 * carries only the resting state.
 */
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

/** The 3-dots trigger. Visible at rest on section and sub-section rows; a topic's is revealed on hover, like its grip. */
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

/**
 * Renaming is a separate mode from the always-editable titles inside the paper
 * (NodeTitleField): this input is uncontrolled, seeded once with `defaultValue`,
 * and commits on blur or Enter — so Escape can abandon the edit and leave the
 * original title untouched. A controlled input would have already overwritten it
 * on the first keystroke.
 */
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

/** A row's number or Hebrew letter. Fixed width so titles line up down the column regardless of index. */
export const RowIndex = styled.span<{ $width: number }>`
  flex-shrink: 0;
  width: ${(props) => props.$width}px;
  text-align: right;
`;

export const RowTitle = styled.span`
  flex: 1;
  ${ellipsis}
`;

/** 7px rather than the 8px of the document-level dot — a section's status is secondary to the document's. */
export const StatusDot = styled.span<{ $color: string }>`
  flex-shrink: 0;
  width: 7px;
  height: 7px;
  border-radius: ${radii.full};
  background-color: ${(props) => props.$color};
`;
