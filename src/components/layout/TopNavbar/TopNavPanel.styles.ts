import styled from 'styled-components';
import { gray } from '@/styles/theme';

export const PanelBody = styled.div`
  padding: 8px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`;

export const PanelOption = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  text-align: right;
  transition: background-color 0.15s;
  &:hover { background-color: ${gray[50]}; }
`;

export const PanelOptionLabel = styled.span`
  flex: 1;
  font-size: 14px;
  color: ${gray[700]};
`;
