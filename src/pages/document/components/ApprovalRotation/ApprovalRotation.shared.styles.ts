import styled from 'styled-components';
import { colors, gray, radii } from '@/styles/theme';

export const Notes = styled.textarea`
  width: 100%;
  min-height: 70px;
  padding: 10px 12px;
  border-radius: ${radii.lg};
  border: 1px solid ${colors.border};
  font-size: 14px;
  color: ${gray[700]};
  resize: none;

  &::placeholder {
    color: ${gray[300]};
  }

  &:focus {
    outline: none;
  }
`;

export const FooterActions = styled.div`
  display: flex;
  gap: 10px;
`;
