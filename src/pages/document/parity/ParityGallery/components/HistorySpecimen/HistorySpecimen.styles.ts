import styled from 'styled-components';
import { rtlTextInput } from '@/styles/mixins';
import { colors, gray, radii } from '@/styles/theme';

export const DraftField = styled.textarea`
  ${rtlTextInput}
  width: 100%;
  padding: 10px 12px;
  font-family: inherit;
  line-height: 1.8;
  resize: vertical;
  color: ${gray[800]};
  background: ${colors.surface};
  border: 1px solid ${gray[200]};
  border-radius: ${radii.xl};
  outline: none;

  &:focus {
    border-color: ${colors.primary};
  }
`;
