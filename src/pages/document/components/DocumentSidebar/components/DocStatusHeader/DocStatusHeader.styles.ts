import styled from 'styled-components';
import { colors, radii } from '@/styles/theme';

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 4px;
  margin-bottom: 8px;
`;

export const StatusDot = styled.span<{ $color: string }>`
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: ${radii.full};
  background-color: ${(props) => props.$color};
`;

export const StatusTitle = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: ${colors.primary};
`;
