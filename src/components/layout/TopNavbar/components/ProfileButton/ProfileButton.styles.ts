import { Link } from '@tanstack/react-router';
import styled from 'styled-components';
import { iconButtonBase } from '@/components/ui/IconButton';

export const ProfileLink = styled(Link)<{ $isActive: boolean }>`
  ${iconButtonBase}
  text-decoration: none;
`;
