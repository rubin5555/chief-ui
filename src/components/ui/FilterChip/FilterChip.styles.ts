import styled from 'styled-components';
import { colors } from '@/styles/theme';

export const FilterChipRoot = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background-color: ${colors.primaryLight};
  color: ${colors.primary};
  font-size: 12px;
  font-weight: 500;
  border-radius: 9999px;
  border: 1px solid color-mix(in srgb, ${colors.primary} 35%, transparent);
`;

export const FilterChipClear = styled.button`
  display: flex;
  align-items: center;
  color: ${colors.primary};
  transition: color 0.15s;
  cursor: pointer;
  &:hover { color: color-mix(in srgb, ${colors.primary} 85%, black); }
`;
