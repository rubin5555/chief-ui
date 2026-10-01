import styled from 'styled-components';
import { flexCenter } from '@/styles/mixins';
import { gray, radii } from '@/styles/theme';

export const PageRoot = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

export const EmptyState = styled.div`
  ${flexCenter}
  flex: 1;
  flex-direction: column;
  gap: 16px;
`;

export const EmptyStateIcon = styled.div`
  ${flexCenter}
  width: 64px;
  height: 64px;
  border-radius: ${radii['2xl']};
  background: ${gray[100]};
  color: ${gray[300]};
`;

export const EmptyStateText = styled.p`
  font-size: 14px;
  color: ${gray[400]};
`;
