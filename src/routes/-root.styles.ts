import styled from 'styled-components';
import { colors, gray, radii } from '@/styles/theme';

export const StatusRoot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 100vh;
  padding: 24px;
  text-align: center;
  direction: rtl;
`;

export const StatusTitle = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: ${gray[900]};
  margin: 0;
`;

export const StatusMessage = styled.p`
  font-size: 14px;
  color: ${gray[600]};
  margin: 0;
  max-width: 480px;
`;

export const StatusDetails = styled.pre`
  font-size: 12px;
  color: ${colors.danger};
  background-color: ${colors.dangerLight};
  border-radius: ${radii.lg};
  padding: 12px 16px;
  max-width: 480px;
  overflow-x: auto;
  text-align: left;
  direction: ltr;
`;
