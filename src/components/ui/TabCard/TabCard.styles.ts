import styled from 'styled-components';
import { colors, gray, radii, shadows } from '@/styles/theme';

export const TabCardButton = styled.button<{ $isActive: boolean }>`
  height: 96px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: ${radii['2xl']};
  padding: 16px;
  transition: background-color 0.15s, box-shadow 0.15s;
  cursor: pointer;
  border: 1px solid ${colors.border};
  background-color: ${(p) => (p.$isActive ? colors.surface : 'transparent')};
  box-shadow: ${(p) => (p.$isActive ? shadows.lg : 'none')};
`;

export const TabCardIcon = styled.span`
  color: ${gray[600]};
  display: flex;
`;

export const TabCardLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${gray[700]};
`;
