import styled from 'styled-components';
import { flexBetween, flexColumn } from '@/styles/mixins';
import { gray } from '@/styles/theme';

export const PanelRule = styled.div`
  margin: 0 12px;
  border-top: 1px solid ${gray[100]};
`;

export const TimeSection = styled.div`
  ${flexColumn(8)}
  align-items: center;
  padding: 12px 16px;
`;

export const TimeCaption = styled.span`
  font-size: 12px;
  color: ${gray[400]};
`;

export const PanelFooter = styled.div`
  ${flexBetween}
  gap: 8px;
  padding: 10px 12px;
`;

export const FooterValue = styled.span`
  font-size: 11px;
  user-select: all;
  direction: ltr;
  color: ${gray[500]};
`;
