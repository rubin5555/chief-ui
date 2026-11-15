import styled from 'styled-components';
import { flexBetween, flexCenter, navIconAction } from '@/styles/mixins';
import { gray, radii, transitions } from '@/styles/theme';

export const FilterTrigger = styled.button`
  ${navIconAction}
`;

export const PanelHeader = styled.div`
  ${flexBetween}
  padding: 16px 16px 12px;
  border-bottom: 1px solid ${gray[100]};
`;

export const PanelTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${gray[800]};
`;

export const CloseButton = styled.button`
  ${flexCenter}
  padding: 4px;
  border-radius: ${radii.lg};
  color: ${gray[400]};
  transition: background-color ${transitions.normal};

  &:hover {
    background-color: ${gray[100]};
  }
`;
