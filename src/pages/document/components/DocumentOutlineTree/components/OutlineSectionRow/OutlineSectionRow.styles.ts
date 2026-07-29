import styled from 'styled-components';
import { colors, gray, radii, transitions } from '@/styles/theme';
import {
  DragHandle,
  InlineRenameInput,
  RowIndex,
  RowTitle,
} from '../../DocumentOutlineTree.shared.styles';

export const SectionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: ${radii.xl};
  cursor: pointer;
  transition: background-color ${transitions.normal};

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
