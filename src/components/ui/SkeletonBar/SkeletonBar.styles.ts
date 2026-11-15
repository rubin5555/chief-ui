import styled from 'styled-components';
import { gray, radii } from '@/styles/theme';

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
  animation: skeleton-shimmer 1.4s ease infinite;

  @keyframes skeleton-shimmer {
    from {
      background-position: 200px 0;
    }
    to {
      background-position: -200px 0;
    }
  }
`;
