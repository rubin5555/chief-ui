import styled from 'styled-components';
import { colors, gray, radii, transitions } from '@/styles/theme';

export const SubSectionRoot = styled.div<{ $revealed: boolean }>`
  margin-bottom: 5px;
  padding-inline-end: 14px;
  border-radius: ${radii.lg};

  background-color: ${({ $revealed }) => ($revealed ? colors.primaryLight : 'transparent')};
  box-shadow: ${({ $revealed }) =>
    $revealed ? `0 0 0 4px ${colors.primaryLight}` : '0 0 0 4px transparent'};
  transition:
    background-color ${transitions.slow},
    box-shadow ${transitions.slow};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const SubSectionHeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3em;
  margin-bottom: 4px;
  direction: rtl;
`;

export const SubSectionMarker = styled.span`
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 700;
  line-height: 1.5;
  color: ${gray[500]};
`;
