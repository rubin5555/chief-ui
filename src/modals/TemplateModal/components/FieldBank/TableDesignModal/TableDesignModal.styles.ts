import styled from 'styled-components';
import { ellipsis, flexColumn, flexGap } from '@/styles/mixins';
import { gray } from '@/styles/theme';

export const Body = styled.div`
  ${flexColumn(14)}
`;

export const LabelsList = styled.div`
  ${flexColumn(6)}
`;

export const LabelRow = styled.div`
  ${flexGap(8)}
`;

export const LabelColumnName = styled.span`
  flex: 0 0 90px;
  font-size: 11px;
  color: ${gray[500]};
  ${ellipsis}
`;

export const SectionDivider = styled.hr`
  border: none;
  border-top: 1px solid ${gray[100]};
  margin: 0;
`;

export const HintText = styled.p`
  font-size: 10px;
  color: ${gray[400]};
`;
