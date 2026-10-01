import styled from 'styled-components';
import { flexFill, flexGap, rtlTextInput } from '@/styles/mixins';
import { colors, gray, radii, transitions } from '@/styles/theme';

export const FieldRow = styled.div`
  ${flexGap(12)}
`;

export const FieldLabel = styled.label`
  flex-shrink: 0;
  min-width: 120px;
  font-size: 12px;
  text-align: right;
  color: ${gray[500]};
`;

export const FieldControl = styled.div`
  ${flexFill}
`;

export const FieldInput = styled.input`
  ${rtlTextInput}
  width: 100%;
  padding: 6px 12px;
  font-size: 12px;
  color: ${gray[700]};
  background: ${colors.surface};
  border: 1px solid ${gray[300]};
  border-radius: ${radii.xl};
  outline: none;
  transition: border-color ${transitions.normal};

  &:hover {
    border-color: ${gray[400]};
  }

  &:focus {
    border-color: ${colors.primary};
  }
`;
