import styled from 'styled-components';
import { gray, radii } from '@/styles/theme';

/**
 * One grey shape standing in for something not loaded yet.
 *
 * A single shimmer for the whole app: every skeleton is several of these, and
 * two implementations would mean two animations running at different phases on
 * the same screen — which reads as a fault rather than as loading.
 *
 * `$flex` is for a bar that should take the room left over rather than a stated
 * width; `$round` makes it a circle for an avatar or an icon button.
 */
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
