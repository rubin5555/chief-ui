import styled from 'styled-components';
import { flexCenter, resetButton } from '@/styles/mixins';
import { colors, radii, shadows, transitions } from '@/styles/theme';

export const FabButton = styled.button`
  ${resetButton}
  ${flexCenter}
  padding: 8px;
  border-radius: ${radii.full};
  background-color: ${colors.primary};
  color: ${colors.surface};
  box-shadow: ${shadows.primary};
  transition: opacity ${transitions.normal};

  &:hover {
    opacity: 0.9;
  }
`;
