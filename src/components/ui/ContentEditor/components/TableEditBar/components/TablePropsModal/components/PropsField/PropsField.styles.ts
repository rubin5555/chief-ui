import styled from 'styled-components';
import { gray } from '@/styles/theme';

const LABEL_WIDTH = 120;

export const FieldRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const FieldLabel = styled.span`
  flex-shrink: 0;
  min-width: ${LABEL_WIDTH}px;
  font-size: 12px;
  text-align: right;
  color: ${gray[500]};
`;

export const FieldControl = styled.div`
  flex: 1;
  min-width: 0;
`;
