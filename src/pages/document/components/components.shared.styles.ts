import styled from 'styled-components';
import { docColors, gray, radii } from '@/styles/theme';
import { SIDEBAR_WIDTH } from '../document.measurements';

export const BarRow = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  flex-shrink: 0;
  padding-right: ${SIDEBAR_WIDTH}px;
`;

export const BodyRow = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

export const SubjectRoot = styled.section<{ $highlighted: boolean }>`
  margin-bottom: 10mm;
  border-radius: ${radii.lg};
  outline: ${({ $highlighted }) => ($highlighted ? `2px solid ${docColors.searchHit}` : 'none')};
  outline-offset: 4px;
`;

export const SubjectHeaderRow = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 1.5mm;
  margin-bottom: 4mm;
  border-bottom: 1px solid ${gray[200]};
  direction: rtl;
`;
