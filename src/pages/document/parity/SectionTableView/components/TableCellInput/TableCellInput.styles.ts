import styled from 'styled-components';
import { gray } from '@/styles/theme';

export const CellField = styled.textarea`
  display: block;
  width: 100%;
  min-width: 60px;
  padding: 4px 6px;
  font-family: inherit;
  font-size: 11px;
  line-height: 1.6;
  color: ${gray[800]};
  text-align: right;
  direction: rtl;
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  overflow: hidden;
`;
