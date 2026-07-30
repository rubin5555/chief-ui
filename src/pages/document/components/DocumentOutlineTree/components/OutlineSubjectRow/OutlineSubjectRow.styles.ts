import styled from 'styled-components';
import { colors, gray, radii, transitions } from '@/styles/theme';
import {
  DragHandle,
  InlineRenameInput,
  RowMenuBtn,
  RowTitle,
} from '../../DocumentOutlineTree.shared.styles';

export const SubjectRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px;
  border-radius: ${radii.xl};
  cursor: pointer;
  transition: background-color ${transitions.normal};

  &:hover {
    background-color: ${colors.surface};
  }

  &:hover ${DragHandle}, &:hover ${RowMenuBtn} {
    opacity: 1;
  }

  ${RowMenuBtn} {
    opacity: 0;
    transition: opacity ${transitions.normal};
  }
`;

export const Chevron = styled.span<{ $expanded: boolean }>`
  display: flex;
  flex-shrink: 0;
  color: ${colors.primary};
  opacity: 0.5;
  transform: rotate(${(props) => (props.$expanded ? '-90deg' : '0deg')});
  transition: transform ${transitions.slow};
`;

export const SubjectTitle = styled(RowTitle)`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.primary};
`;

export const SubjectRenameInput = styled(InlineRenameInput)`
  font-size: 14px;
  font-weight: 600;
  color: ${gray[800]};
`;
