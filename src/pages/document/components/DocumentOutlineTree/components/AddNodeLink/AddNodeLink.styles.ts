import styled, { css } from 'styled-components';
import { resetButton } from '@/styles/mixins';
import { colors, docColors, gray, radii, transitions } from '@/styles/theme';

export const LinkRow = styled.div<{ $indent: number; $dropActive: boolean }>`
  position: relative;
  padding-inline-start: ${(props) => props.$indent}px;

  /* The line sits above the row, where a node dropped here comes to rest: after
     everything the row closes off. */
  &::before {
    content: '';
    position: absolute;
    inset-inline: 4px;
    top: -3px;
    height: 2px;
    border-radius: ${radii.full};
    background-color: ${colors.primary};
    opacity: 0;
    transition: opacity ${transitions.fast};
    pointer-events: none;
  }

  ${(props) =>
    props.$dropActive &&
    css`
      &::before {
        opacity: 1;
      }
    `}
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
