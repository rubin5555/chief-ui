import styled from 'styled-components';
import { gray } from '@/styles/theme';

export const DistributePromptBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
  padding: 10px 0;
`;

export const DistributePromptTitle = styled.p`
  font-size: 15px;
  font-weight: 700;
  color: ${gray[900]};
  margin: 0;
`;

export const DistributePromptBody = styled.p`
  font-size: 13px;
  color: ${gray[600]};
  margin: 0;
`;
