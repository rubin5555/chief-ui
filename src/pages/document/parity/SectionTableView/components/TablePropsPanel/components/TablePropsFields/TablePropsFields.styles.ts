import styled from 'styled-components';
import { flexGap } from '@/styles/mixins';
import { gray } from '@/styles/theme';

export const ToggleRow = styled.div`
  ${flexGap(8)}
`;

export const ToggleState = styled.span`
  font-size: 12px;
  color: ${gray[500]};
`;
