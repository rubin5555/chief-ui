import styled, { css } from 'styled-components';
import { colors, gray, radii, transitions } from '@/styles/theme';
import {
  DragHandle,
  InlineRenameInput,
  RowIndex,
  RowTitle,
} from '../../DocumentOutlineTree.shared.styles';

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
