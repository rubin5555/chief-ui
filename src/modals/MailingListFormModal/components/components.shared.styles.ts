import styled from 'styled-components';
import { colors } from '@/styles/theme';

export const ExpandedBlock = styled.div`
  background: color-mix(in srgb, ${colors.primaryLight} 40%, transparent);
  border-top: 1px solid color-mix(in srgb, ${colors.primary} 25%, transparent);
  padding: 4px 0;
`;
