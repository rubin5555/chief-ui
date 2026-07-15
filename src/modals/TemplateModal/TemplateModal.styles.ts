import styled from 'styled-components';
import { colors, gray } from '@/styles/theme';

export const DetailsSection = styled.form`
  flex-shrink: 0;
  padding: 10px 32px;
  border-bottom: 1px solid ${colors.border};
  background: ${gray[50]};
`;
