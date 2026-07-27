import styled from 'styled-components';
import { rtlTextInput } from '@/styles/mixins';
import { colors, gray, radii, transitions } from '@/styles/theme';

// Filled rather than outlined-on-white: the field is the whole dialog, and a grey
// well reads as "write here" more plainly than a border around empty space.
export const InstructionsTextarea = styled.textarea`
  ${rtlTextInput}
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${gray[200]};
  border-radius: ${radii.xl};
  background-color: ${gray[50]};
  outline: none;
  resize: none;
  font-family: inherit;
  line-height: 1.6;
  color: ${gray[700]};
  transition: border-color ${transitions.normal};

  &::placeholder {
    color: ${gray[300]};
  }

  &:focus {
    border-color: ${colors.primary};
  }
`;
