import styled from 'styled-components';
import { catColors, gray, radii, transitions } from '@/styles/theme';

export const OrgRow = styled.div<{ $expanded: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: ${radii.full};
  font-size: 14px;
  font-weight: ${({ $expanded }) => ($expanded ? 500 : 400)};
  color: ${({ $expanded }) => ($expanded ? gray[700] : gray[600])};
  cursor: pointer;
  text-align: right;
  transition: all ${transitions.slow};

  &:hover {
    background: ${({ $expanded }) => ($expanded ? 'transparent' : catColors.hoverVeil)};
  }
`;

export const OrgChevron = styled.span<{ $expanded: boolean }>`
  display: flex;
  flex-shrink: 0;
  color: ${gray[400]};
  transform: rotate(${({ $expanded }) => ($expanded ? '-90deg' : '0deg')});
  transition: transform ${transitions.normal};
`;

export const OrgIcon = styled.span`
  display: flex;
  flex-shrink: 0;
  color: ${gray[400]};
`;

export const OrgLabel = styled.span`
  flex: 1;
`;

export const OrgDepts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-right: 16px;
`;
