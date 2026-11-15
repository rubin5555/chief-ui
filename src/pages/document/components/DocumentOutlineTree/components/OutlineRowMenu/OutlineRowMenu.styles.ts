import styled from 'styled-components';
import { resetButton } from '@/styles/mixins';
import { colors, gray, transitions } from '@/styles/theme';

export const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 4px 0;
`;

const MenuItem = styled.button`
  ${resetButton}
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  text-align: right;
  transition: background-color ${transitions.normal};
`;

export const RenameItem = styled(MenuItem)`
  color: ${gray[700]};

  &:hover {
    background-color: ${gray[50]};
  }
`;

export const DeleteItem = styled(MenuItem)`
  color: ${colors.primary};

  &:hover {
    background-color: ${colors.primaryLight};
  }
`;

const Icon = styled.span`
  display: flex;
  flex-shrink: 0;
`;

export const RenameIcon = styled(Icon)`
  color: ${gray[400]};
`;

export const DeleteIcon = styled(Icon)`
  color: inherit;
`;
