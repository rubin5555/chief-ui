import styled from 'styled-components';
import { colors } from '@/styles/theme';

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9998;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const SpinIcon = styled.span`
  display: inline-flex;
  color: ${colors.surface};
  animation: spin 1s linear infinite;
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
