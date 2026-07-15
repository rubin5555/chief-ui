import styled, { keyframes } from 'styled-components';
import { flexCenter } from '@/styles/mixins';
import { gray } from '@/styles/theme';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const SpinnerRoot = styled.div`
  ${flexCenter}
  flex: 1;
  min-height: 120px;
  color: ${gray[400]};
`;

export const SpinIcon = styled.span`
  display: inline-flex;
  animation: ${spin} 1s linear infinite;
`;
