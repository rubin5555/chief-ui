import styled from 'styled-components';
import { colors, docColors, gray, radii } from '@/styles/theme';

export const EmphasisRoot = styled.div`
  padding: 14px 16px;
  margin-bottom: 8mm;
  border: 1px solid ${docColors.amberBorder};
  border-radius: ${radii.xl};
  background-color: ${colors.warningLight};
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35em;
  margin-bottom: 10px;
`;

export const HeaderIcon = styled.span`
  display: flex;
  flex-shrink: 0;
  color: ${docColors.amberIcon};
`;

export const HeaderTitle = styled.span`
  flex: 1;
  font-size: 12px;
  font-weight: 700;
  color: ${docColors.amberInk};
`;

export const EmphasisTextarea = styled.textarea`
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  overflow: hidden;
  font-family: inherit;
  font-size: 11px;
  line-height: 1.7;
  color: ${gray[700]};
  text-align: right;

  &::placeholder {
    color: ${docColors.amberBorder};
  }
`;
