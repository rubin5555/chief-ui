import styled from 'styled-components';
import { catColors, colors, gray, radii, transitions } from '@/styles/theme';

export const AddFolderBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  border: 1px dashed ${gray[300]};
  border-radius: ${radii.xl};
  color: ${gray[500]};
  background: transparent;
  transition: all ${transitions.slow};

  &:hover {
    border-color: ${colors.primary};
    background: ${catColors.dashedHoverBg};
    color: ${colors.primary};
  }
`;

export const AddFolderLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
`;
