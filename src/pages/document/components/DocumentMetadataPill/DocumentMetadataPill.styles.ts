import styled from 'styled-components';
import { docColors, gray, radii } from '@/styles/theme';
import { BAR_WIDTH } from '../../document.measurements';

// main's pill is a flat grey bar of pipe-separated facts (Edit.tsx:3689) — no
// card, no border, no shadow, and no edit affordance. Editing document details
// is reached from the navbar's document-actions toolbar instead.
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

/** The `|` between cells. Rendered per cell after the first, as main does. */
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

/** The organisation, shown in normal weight inside the bold document name. */
export const OrgName = styled.span`
  font-weight: 400;
  color: ${gray[500]};
`;

export const Fact = styled.span`
  font-size: 12px;
  color: ${gray[600]};
  white-space: nowrap;
`;
