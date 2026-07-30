import styled, { css } from 'styled-components';
import { colors, gray, radii, transitions } from '@/styles/theme';
import {
  DragHandle,
  InlineRenameInput,
  RowIndex,
  RowTitle,
} from '../../DocumentOutlineTree.shared.styles';

/**
 * `$active` is the row for the section currently under the reader — the column's
 * answer to "where am I". A tint and a bar on the leading edge, both quiet: this
 * follows the scroll, so it is on screen constantly and must never compete with
 * the row you are about to click. The bar is `inset` so it takes no space and
 * the row doesn't shift as the reader moves between sections.
 */
export const SectionRow = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
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

// Bolder than the title beside it: the numbers are what you scan the column by.
export const SectionIndex = styled(RowIndex)`
  font-size: 12px;
  font-weight: 700;
  color: ${gray[500]};
`;

export const SectionTitle = styled(RowTitle)`
  font-size: 12px;
  color: ${gray[700]};
`;

export const SectionRenameInput = styled(InlineRenameInput)`
  font-size: 12px;
  color: ${gray[800]};
`;
