import styled from 'styled-components';
import { gray } from '@/styles/theme';

export const Label = styled.span<{ $color: string }>`
  flex-shrink: 0;
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
  color: ${({ $color }) => $color};
`;

export const HiddenLabel = styled(Label).attrs({ $color: gray[400] })``;
