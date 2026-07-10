import styled from 'styled-components';
import { colors } from '@/styles/theme';

const sizeMap = {
  sm: '32px',
  md: '48px',
  lg: '96px',
} as const;

export const AvatarRoot = styled.div<{ $size: 'sm' | 'md' | 'lg' }>`
  width: ${(p) => sizeMap[p.$size]};
  height: ${(p) => sizeMap[p.$size]};
  border-radius: 9999px;
  background-color: ${colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.surface};
  flex-shrink: 0;
`;
