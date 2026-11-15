import styled from 'styled-components';
import { colors, radii } from '@/styles/theme';

export const Body = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const DirtyWarning = styled.p`
  margin: 0;
  padding: 10px 12px;
  border-radius: ${radii.lg};
  background-color: ${colors.warningLight};
  color: ${colors.warning};
  font-size: 12px;
  line-height: 1.6;
`;
