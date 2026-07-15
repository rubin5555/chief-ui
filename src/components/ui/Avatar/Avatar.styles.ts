import styled from 'styled-components';
import { flexCenter } from '@/styles/mixins';
import { colors, radii } from '@/styles/theme';

const sizeMap = {
  sm: '32px',
  md: '48px',
  lg: '96px',
} as const;

export const AvatarRoot = styled.div<{ $size: 'sm' | 'md' | 'lg' }>`
  width: ${(p) => sizeMap[p.$size]};
  height: ${(p) => sizeMap[p.$size]};
  border-radius: ${radii.full};
  background-color: ${colors.primary};
  ${flexCenter}
  color: ${colors.surface};
  flex-shrink: 0;
`;
