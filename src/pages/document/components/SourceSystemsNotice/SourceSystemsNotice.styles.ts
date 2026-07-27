import styled from 'styled-components';
import { resetButton } from '@/styles/mixins';
import { docColors, transitions } from '@/styles/theme';

// Sits inside a BarRow, so it inherits the 230mm width and the sidebar offset
// that keep it centred over the paper.
export const NoticeRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 3px 0;
  font-size: 12px;
  line-height: 1.375;
  color: ${docColors.amberInk};
`;

export const NoticeLead = styled.span`
  font-weight: 600;
`;

// Underlined rather than styled as a button: the notice is a sentence, and this
// is the part of it you can follow.
export const NoticeLink = styled.button`
  ${resetButton}
  white-space: nowrap;
  font-size: 12px;
  font-weight: 600;
  color: ${docColors.amberInk};
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: opacity ${transitions.normal};

  &:hover {
    opacity: 0.7;
  }
`;
