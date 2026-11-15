import styled from 'styled-components';
import { flexColumn, rtlTextInput } from '@/styles/mixins';
import { colors, docColors, gray, radii, transitions } from '@/styles/theme';

export const WarningText = styled.p`
  font-size: 12px;
  line-height: 1.7;
  color: ${docColors.warningStrong};

  strong {
    font-weight: 600;
  }
`;

export const FieldStack = styled.div`
  ${flexColumn(16)}
  margin-top: 16px;
`;

export const Field = styled.div`
  ${flexColumn(4)}
`;

export const FieldLabel = styled.label`
  font-size: 12px;
  color: ${gray[500]};
`;

const fieldBox = `
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  border-radius: ${radii.lg};
  outline: none;
  transition: border-color ${transitions.normal};
`;

export const TextField = styled.input`
  ${rtlTextInput}
  ${fieldBox}
  color: ${gray[800]};
  background: ${docColors.surfaceSubtle};
  border: 1px solid ${gray[200]};

  &::placeholder {
    color: ${gray[300]};
  }

  &:focus {
    border-color: ${colors.primary};
  }
`;

export const NotesField = styled.textarea`
  ${rtlTextInput}
  ${fieldBox}
  resize: none;
  font-family: inherit;
  color: ${gray[800]};
  background: ${docColors.surfaceSubtle};
  border: 1px solid ${gray[200]};

  &::placeholder {
    color: ${gray[300]};
  }

  &:focus {
    border-color: ${colors.primary};
  }
`;
