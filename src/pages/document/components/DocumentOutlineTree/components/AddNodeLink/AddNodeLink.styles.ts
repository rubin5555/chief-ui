import styled from 'styled-components';
import { resetButton } from '@/styles/mixins';
import { colors, docColors, gray, transitions } from '@/styles/theme';

export const LinkRow = styled.div<{ $indent: number }>`
  padding-inline-start: ${(props) => props.$indent}px;
`;

const Link = styled.button`
  ${resetButton}
  text-align: right;
  transition: color ${transitions.normal};
`;

export const SectionLink = styled(Link)`
  font-size: 12px;
  font-weight: 600;
  color: ${colors.primary};

  &:hover {
    color: ${docColors.primaryHover};
  }
`;

export const SubSectionLink = styled(Link)`
  font-size: 11px;
  color: ${gray[400]};

  &:hover {
    color: ${gray[600]};
  }
`;
