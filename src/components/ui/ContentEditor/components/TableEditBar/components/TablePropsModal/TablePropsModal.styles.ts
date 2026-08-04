import styled from 'styled-components';
import { gray } from '@/styles/theme';

export const FieldList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const CaptionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const CaptionState = styled.span`
  font-size: 12px;
  color: ${gray[500]};
`;
