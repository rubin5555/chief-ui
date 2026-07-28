import styled from 'styled-components';
import { docColors, gray, radii, transitions } from '@/styles/theme';

// The red border goes on the field itself, with no outer box around the section —
// main moved it here deliberately (commit c39c266), because the thing that needs
// filling in is the field.
export const SignatureField = styled.textarea<{ $required: boolean }>`
  width: 100%;
  min-height: 80px;
  padding: 10px 14px;
  border-radius: ${radii.xl};
  background-color: ${gray[50]};
  border: 1px solid
    ${({ $required }) => ($required ? docColors.warningStrong : docColors.hairline)};
  outline: none;
  resize: none;
  overflow: hidden;
  font-family: inherit;
  font-size: 11px;
  // 1.9 rather than the 1.6 used elsewhere: a signature block is a short stack of
  // lines that has to read as one, and the air is what does that.
  line-height: 1.9;
  color: ${gray[700]};
  text-align: right;
  transition: border-color ${transitions.normal};

  &::placeholder {
    color: ${gray[300]};
  }

  // Only when it isn't the field being asked for — a focus ring that overrode the
  // warning would hide it the moment you clicked in.
  &:focus:not([data-required='true']) {
    border-color: ${gray[300]};
  }
`;
