import styled from 'styled-components';
import { gray } from '@/styles/theme';

export const RangeFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 12px;
`;

export const RangeField = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  /* The picker's trigger has to take the rest of the row. */
  & > *:last-child {
    flex: 1;
  }
`;

export const RangeLabel = styled.span`
  flex-shrink: 0;
  width: 20px;
  text-align: right;
  font-size: 12px;
  color: ${gray[400]};
`;
