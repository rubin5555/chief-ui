import styled from 'styled-components';
import { colors, gray, transitions } from '@/styles/theme';

export const FieldRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
`;

export const FieldLabel = styled.span`
  flex-shrink: 0;
  white-space: nowrap;
  font-size: 10px;
  font-weight: 700;
  color: ${colors.primary};
`;

const fieldValue = `
  flex: 1;
  min-width: 0;
  padding: 1px 2px;
  font-size: 10px;
`;

export const FieldValue = styled.span`
  ${fieldValue}
  color: ${gray[700]};
`;

export const FieldInput = styled.input`
  ${fieldValue}
  background: transparent;
  border: none;
  border-bottom: 1px solid ${gray[200]};
  outline: none;
  color: ${gray[700]};
  text-align: right;
  transition: border-color ${transitions.normal};

  &::placeholder {
    color: ${gray[300]};
  }

  &:hover {
    border-bottom-color: ${gray[400]};
  }

  &:focus {
    border-bottom-color: ${colors.primary};
  }
`;
