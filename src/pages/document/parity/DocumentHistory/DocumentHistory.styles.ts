import styled from 'styled-components';
import { flexGap } from '@/styles/mixins';
import { docColors } from '@/styles/theme';

export const HistoryRow = styled.div`
  ${flexGap(6)}
`;

export const PastNotice = styled.span`
  font-size: 12px;
  color: ${docColors.amberInk};
`;
