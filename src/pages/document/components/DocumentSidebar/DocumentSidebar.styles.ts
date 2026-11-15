import styled from 'styled-components';
import { colors, gray } from '@/styles/theme';
import { SIDEBAR_WIDTH } from '../../document.measurements';

export const SidebarRoot = styled.aside`
  display: flex;
  flex-direction: column;
  width: ${SIDEBAR_WIDTH}px;
  flex-shrink: 0;
  padding: 20px 16px;
  position: relative;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 24px;
    bottom: 24px;
    width: 1px;
    background: ${colors.border};
  }
`;

export const StatusBlock = styled.div`
  margin-bottom: 16px;
`;

export const SidebarDivider = styled.div`
  height: 1px;
  margin-bottom: 16px;
  background-color: ${gray[200]};
`;
