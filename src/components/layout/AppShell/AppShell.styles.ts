import styled from 'styled-components';
import { colors } from '@/styles/theme';

export const Shell = styled.div`
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: linear-gradient(
    135deg,
    ${colors.surface} 0%,
    ${colors.muted} 50%,
    ${colors.primaryLight} 100%
  );
  background-attachment: fixed;
`;
