import styled from 'styled-components';
import { colors, gray, transitions } from '@/styles/theme';

export const FolderViewBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  width: fit-content;
  font-size: 12px;
  color: ${gray[400]};
  transition: color ${transitions.normal};

  &:hover {
    color: ${colors.primary};
  }
`;

export const DeptHeading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const EnvLabel = styled.span`
  font-size: 11px;
  color: ${gray[400]};
`;

export const DeptLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${gray[800]};
`;

export const Divider = styled.div`
  height: 1px;
  background: ${gray[100]};
`;

export const FolderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const NoFolders = styled.p`
  padding: 16px 0;
  font-size: 12px;
  color: ${gray[400]};
  text-align: center;
`;
