import styled from 'styled-components';
import { flexGap, flexScroll } from '@/styles/mixins';
import { gray, radii } from '@/styles/theme';

export const PanelBody = styled.div`
  padding: 8px;
  ${flexScroll}
`;

export const PanelOption = styled.button`
  width: 100%;
  ${flexGap(12)}
  padding: 12px 16px;
  border-radius: ${radii.xl};
  text-align: right;
  transition: background-color 0.15s;
  &:hover { background-color: ${gray[50]}; }
`;

export const PanelOptionLabel = styled.span`
  flex: 1;
  font-size: 14px;
  color: ${gray[700]};
`;
