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
