import styled from 'styled-components';
import { colors, docColors, radii, transitions } from '@/styles/theme';

export const SectionRoot = styled.div<{ $highlighted: boolean; $revealed: boolean }>`
  margin-bottom: 5mm;
  border-radius: ${radii.lg};
  outline: ${({ $highlighted }) => ($highlighted ? `2px solid ${docColors.searchHit}` : 'none')};
  outline-offset: 2px;

  background-color: ${({ $revealed }) => ($revealed ? colors.primaryLight : 'transparent')};
  box-shadow: ${({ $revealed }) =>
    $revealed ? `0 0 0 6px ${colors.primaryLight}` : '0 0 0 6px transparent'};
  transition:
    background-color ${transitions.slow},
    box-shadow ${transitions.slow};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;
