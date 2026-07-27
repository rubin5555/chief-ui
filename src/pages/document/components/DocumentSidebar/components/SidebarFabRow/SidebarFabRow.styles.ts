import styled from 'styled-components';
import { gray } from '@/styles/theme';

// `flex-end` in an RTL column puts these on the *left* — the edge facing the
// paper, away from the window frame (main, Edit.tsx:4083).
export const FabRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid ${gray[200]};
`;
