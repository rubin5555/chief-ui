import styled from 'styled-components';
import { flexGap } from '@/styles/mixins';
import { gray } from '@/styles/theme';

export const ToolbarRoot = styled.div`
  ${flexGap(4)}
  margin-right: 4px;
`;

export const Divider = styled.span`
  width: 1px;
  height: 16px;
  background: ${gray[200]};
  margin: 0 2px;
`;
