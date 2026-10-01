import styled from 'styled-components';
import { docColors, gray, radii, transitions } from '@/styles/theme';

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
  line-height: 1.9;
  color: ${gray[700]};
  text-align: right;
  transition: border-color ${transitions.normal};

  &::placeholder {
    color: ${gray[300]};
  }

  &:focus:not([data-required='true']) {
    border-color: ${gray[300]};
  }
`;
