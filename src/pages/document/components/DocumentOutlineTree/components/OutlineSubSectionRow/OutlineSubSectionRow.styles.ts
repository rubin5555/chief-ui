import styled, { css } from 'styled-components';
import { colors, gray, radii, transitions } from '@/styles/theme';
import { SUB_SECTION_INDENT } from '../../DocumentOutlineTree.constants';
import {
  DragHandle,
  InlineRenameInput,
  RowIndex,
  RowTitle,
} from '../../DocumentOutlineTree.shared.styles';

/** The same "you are here" tint a section row takes — see OutlineSectionRow.styles.ts. */
export const SubSectionRow = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  padding-inline-start: ${SUB_SECTION_INDENT}px;
  border-radius: ${radii.xl};
  cursor: pointer;
  transition:
    background-color ${transitions.normal},
    box-shadow ${transitions.normal};

  ${({ $active }) =>
    $active &&
    css`
      background-color: ${colors.primaryLight};
      box-shadow: inset -2px 0 0 0 ${colors.primary};
    `}

  &:hover {
    background-color: ${colors.surface};
  }

  &:hover ${DragHandle} {
    opacity: 1;
  }
`;

export const SubSectionIndex = styled(RowIndex)`
  font-size: 10px;
  color: ${gray[400]};
`;

// The lightest text in the tree: a sub-section is a detail of a detail.
export const SubSectionTitle = styled(RowTitle)`
  font-size: 12px;
  color: ${gray[500]};
`;

export const SubSectionRenameInput = styled(InlineRenameInput)`
  font-size: 12px;
  color: ${gray[700]};
`;
