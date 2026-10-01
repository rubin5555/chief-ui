import styled from 'styled-components';
import { flexBetween, flexFill, flexGap } from '@/styles/mixins';

export const LoadingRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const SkeletonToolbar = styled.div`
  ${flexGap(12)}
`;

export const SkeletonTabsRow = styled.div`
  ${flexGap(16)}
  padding-bottom: 8px;
`;

export const SkeletonRow = styled.div`
  padding: 16px;
  ${flexBetween}
  gap: 12px;
`;

export const SkeletonRowLeft = styled.div`
  ${flexGap(12)}
  ${flexFill}
`;

export const SkeletonRowActions = styled.div`
  ${flexGap(8)}
  flex-shrink: 0;
`;
