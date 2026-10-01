import styled from 'styled-components';
import { colors, gray, radii } from '@/styles/theme';

export const SearchFieldWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const SearchFieldIcon = styled.span`
  position: absolute;
  right: 12px;
  display: flex;
  color: ${gray[400]};
  pointer-events: none;
`;

export const SearchFieldInput = styled.input`
  width: 100%;
  padding: 10px 40px 10px 12px;
  border: 1px solid ${gray[200]};
  border-radius: ${radii.xl};
  /* An explicit background rather than the browser's own field colour, which
     follows the page's colour scheme. */
  background: ${colors.surface};
  font-size: 14px;
  text-align: right;
  color: ${gray[800]};
  outline: none;

  &::placeholder {
    color: ${gray[400]};
  }

  &:focus {
    border-color: ${colors.primary};
  }
`;
