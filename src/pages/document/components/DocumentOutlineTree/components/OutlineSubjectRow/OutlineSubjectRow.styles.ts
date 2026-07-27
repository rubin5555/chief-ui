import styled from 'styled-components';
import { colors, gray, radii, transitions } from '@/styles/theme';
import { SECTION_LIST_INDENT } from '../../DocumentOutlineTree.constants';
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

  // A topic hides its menu button as well as its grip, which the two rows below
  // it don't — at this level the row itself is a control (it expands), so the
  // fewer competing targets it shows at rest, the better.
  &:hover ${DragHandle}, &:hover ${RowMenuBtn} {
    opacity: 1;
  }

  ${RowMenuBtn} {
    opacity: 0;
    transition: opacity ${transitions.normal};
  }
`;

// Rotates rather than swapping icons, so the arrow turns as the topic opens.
// -90deg from a leftward chevron points it down, in RTL as in LTR.
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

export const SectionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 4px;
  padding-inline-start: ${SECTION_LIST_INDENT}px;
`;
