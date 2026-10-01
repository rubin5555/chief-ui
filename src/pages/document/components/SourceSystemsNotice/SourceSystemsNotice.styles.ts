import styled from 'styled-components';
import { resetButton } from '@/styles/mixins';
import { docColors, transitions } from '@/styles/theme';

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
