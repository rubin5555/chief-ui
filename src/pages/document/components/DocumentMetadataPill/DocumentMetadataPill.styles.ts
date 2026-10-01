import styled from 'styled-components';
import { docColors, gray, radii } from '@/styles/theme';
import { BAR_WIDTH } from '../../document.measurements';

export const PillBar = styled.div`
  display: flex;
  align-items: center;
  width: ${BAR_WIDTH};
  padding: 8px 16px;
  border-radius: ${radii['2xl']};
  background: ${docColors.neutralBar};
  direction: rtl;
`;

export const Cell = styled.div`
  display: flex;
  align-items: center;
`;

export const Separator = styled.span`
  margin: 0 10px;
  font-size: 12px;
  color: ${gray[400]};
`;

export const DocName = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: ${gray[800]};
  white-space: nowrap;
`;

export const OrgName = styled.span`
  font-weight: 400;
  color: ${gray[500]};
`;

export const Fact = styled.span`
  font-size: 12px;
  color: ${gray[600]};
  white-space: nowrap;
`;
