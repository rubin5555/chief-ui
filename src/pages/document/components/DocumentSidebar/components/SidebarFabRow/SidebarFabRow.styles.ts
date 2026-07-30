import styled from 'styled-components';
import { gray } from '@/styles/theme';

export const FabRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid ${gray[200]};
`;
