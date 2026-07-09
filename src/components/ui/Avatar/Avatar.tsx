import type { ReactNode } from 'react';
import { AvatarRoot } from './Avatar.styles';
import { AVATAR_IDS } from './Avatar.testids';

interface AvatarProps {
  children?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  'data-testid'?: string;
}

export const Avatar = ({ children, size = 'md', 'data-testid': testId }: AvatarProps) => {
  return (
    <AvatarRoot $size={size} data-testid={testId ?? AVATAR_IDS.root}>
      {children}
    </AvatarRoot>
  );
};
