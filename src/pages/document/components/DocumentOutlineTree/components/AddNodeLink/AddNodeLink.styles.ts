import styled from 'styled-components';
import { resetButton } from '@/styles/mixins';
import { colors, docColors, gray, transitions } from '@/styles/theme';

export const LinkRow = styled.div<{ $indent: number }>`
  padding-inline-start: ${(props) => props.$indent}px;
  padding-bottom: 4px;
`;

const Link = styled.button`
  ${resetButton}
  text-align: right;
  transition: color ${transitions.normal};
`;

// Navy and semibold: adding a section is the tree's primary action.
export const SectionLink = styled(Link)`
  font-size: 12px;
  font-weight: 600;
  color: ${colors.primary};

  &:hover {
    color: ${docColors.primaryHover};
  }
`;

// Deliberately quieter than the section link — a sub-section is a refinement, and
// main sets it two steps down the grey scale rather than one (Edit.tsx:4047).
export const SubSectionLink = styled(Link)`
  font-size: 11px;
  color: ${gray[400]};

  &:hover {
    color: ${gray[600]};
  }
`;
