import { Link } from '@tanstack/react-router';
import styled from 'styled-components';
import { colors } from '@/styles/theme';

export const BrandLink = styled(Link)`
  color: ${colors.primary};
  text-decoration: none;
`;

export const NavToolbarHost = styled.div`
  display: contents;
`;

export const CollabDemoLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  color: ${colors.accent};
  background: color-mix(in srgb, var(--color-accent) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-accent) 25%, transparent);
  border-radius: 9999px;
  padding: 3px 10px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: color-mix(in srgb, var(--color-accent) 20%, transparent);
  }

  &[data-status='active'] {
    background: ${colors.accent};
    color: ${colors.surface};
  }
`;
