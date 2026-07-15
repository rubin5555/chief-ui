import styled from 'styled-components';
import { flexBetween, flexGap } from '@/styles/mixins';
import { gray, radii } from '@/styles/theme';

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
  flex: 1;
  min-width: 0;
`;

export const SkeletonRowActions = styled.div`
  ${flexGap(8)}
  flex-shrink: 0;
`;

export const SkeletonBar = styled.div<{
  $width: string;
  $height?: string;
  $round?: boolean;
  $flex?: boolean;
}>`
  width: ${(p) => (p.$flex ? 'auto' : p.$width)};
  height: ${(p) => p.$height ?? '14px'};
  border-radius: ${(p) => (p.$round ? radii.full : radii.lg)};
  ${(p) => (p.$flex ? 'flex: 1;' : 'flex-shrink: 0;')}
  background: linear-gradient(90deg, ${gray[100]} 25%, ${gray[200]} 37%, ${gray[100]} 63%);
  background-size: 400px 100%;
  animation: panel-loading-shimmer 1.4s ease infinite;

  @keyframes panel-loading-shimmer {
    from {
      background-position: 200px 0;
    }
    to {
      background-position: -200px 0;
    }
  }
`;
