import styled from 'styled-components';
import { resetButton } from '@/styles/mixins';
import { gray, transitions } from '@/styles/theme';

export const Row = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-bottom: 3px;
`;

export const Marker = styled.span`
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
  color: ${gray[700]};
`;

export const NoteInput = styled.textarea`
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  overflow: hidden;
  padding: 0;
  font-family: inherit;
  font-size: 10px;
  line-height: 1.6;
  color: ${gray[700]};
  text-align: right;

  &::placeholder {
    color: ${gray[300]};
  }
`;

export const NoteText = styled.span`
  flex: 1;
  min-width: 0;
  font-size: 10px;
  line-height: 1.6;
  color: ${gray[700]};
`;

export const RemoveBtn = styled.button`
  ${resetButton}
  flex-shrink: 0;
  display: flex;
  margin-top: 2px;
  color: ${gray[400]};
  transition: color ${transitions.normal};

  &:hover {
    color: ${gray[600]};
  }
`;
