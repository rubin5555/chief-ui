import styled from 'styled-components';
import { focusPrimaryBorder, rtlTextInput } from '@/styles/mixins';
import { colors, gray, radii, transitions } from '@/styles/theme';

export const FieldInput = styled.input`
  ${rtlTextInput}
  width: 100%;
  padding: 6px 12px;
  font-size: 12px;
  font-family: inherit;
  color: ${gray[700]};
  background-color: ${colors.surface};
  border: 1px solid ${gray[300]};
  border-radius: ${radii.xl};
  transition: border-color ${transitions.normal};

  &::placeholder {
    color: ${gray[400]};
  }

  &:hover {
    border-color: ${gray[400]};
  }

  ${focusPrimaryBorder}
`;
