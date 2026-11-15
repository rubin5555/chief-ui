import styled from 'styled-components';
import { resetButton } from '@/styles/mixins';
import { gray, transitions } from '@/styles/theme';

export const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 6px 0;
`;

export const MenuItem = styled.button`
  ${resetButton}
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 16px;
  font-size: 14px;
  text-align: right;
  color: ${gray[700]};
  transition: background-color ${transitions.normal};

  &:hover {
    background-color: ${gray[50]};
  }
`;

export const MenuIcon = styled.span`
  display: flex;
  flex-shrink: 0;
  color: ${gray[400]};
`;
